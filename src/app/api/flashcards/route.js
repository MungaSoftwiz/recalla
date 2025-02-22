import { NextResponse } from "next/server";
import pdf from "pdf-parse";
import { PDFDocument } from "pdf-lib";
import { createWorker } from "tesseract.js";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

async function extractImagesFromPDF(buffer) {
  const pdfDoc = await PDFDocument.load(buffer);
  const images = [];

  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    const page = pdfDoc.getPage(i);
    const embeddedImages = page.getEmbeddedImages();
    for (const image of embeddedImages) {
      const imageBytes = await image.embed();
      images.push(imageBytes);
    }
  }

  return images;
}

async function performOCR(imageBuffer) {
  const worker = await createWorker("eng");
  try {
    const {
      data: { text },
    } = await worker.recognize(imageBuffer);
    return text;
  } catch (error) {
    console.error("OCR Error:", error);
    return "";
  } finally {
    await worker.terminate();
  }
}

async function extractTextFromPDF(buffer) {
  try {
    const pdfData = await pdf(buffer);
    const extractedText = pdfData.text;

    if (!extractedText || extractedText.trim().length === 0) {
      console.log("No text extracted. Attempting OCR...");
      const images = await extractImagesFromPDF(buffer);

      const ocrResults = await Promise.all(
        images.map(async (image) => {
          try {
            return await performOCR(image);
          } catch (error) {
            console.error("Error performing OCR on image:", error);
            return "";
          }
        })
      );

      const ocrText = ocrResults.join("\n");
      return ocrText;
    }
    return extractedText;
  } catch (error) {
    console.error("Error extracting text:", error);
    throw error;
  }
}

export async function POST(req) {
  try {
    console.log("Starting request processing...");

    const { fileUrl, sessionId } = await req.json();
    console.log("Received fileUrl:", fileUrl);
    console.log("Received sessionId:", sessionId);

    if (!fileUrl || !sessionId) {
      return NextResponse.json(
        { error: "Missing required fields: fileUrl or sessionId" },
        { status: 400 }
      );
    }

    console.log("Fetching file from:", fileUrl);

    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch file from URL: ${response.status} ${response.statusText}`
      );
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    console.log("File fetched successfully. Buffer length:", buffer.length);

    const extractedData = await extractTextFromPDF(buffer);
    console.log("Extracting text length:", extractedData.length);

    if (!extractedData || extractedData.trim().length === 0) {
      return NextResponse.json(
        { error: "No text could be extracted from the PDF" },
        { status: 400 }
      );
    }

    const prompt = `You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
    Both front and back should be one sentence long. Front one should be a question and back one with answer with a bit explanation and question should be of different difficulty and knowledge depth
    You should return in the following JSON format:
    {
      "flashcards":[
        {
          "front": "Question",
          "back": "Answer with a bit explanation"
        }
      ]
    }`;

    console.log("Prompt created for extracted text:", extractedData);

    const responseAI = await openai.chat.completions.create({
      model: "google/gemma-2-9b-it:free",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: extractedData },
      ],
      temperature: 0.5,
      max_tokens: 2000,
    });

    console.log("API response received:", responseAI);

    const rawContent = responseAI.choices[0].message.content;
    const flashcards = JSON.parse(rawContent);
    if (!flashcards.flashcards || !Array.isArray(flashcards.flashcards)) {
      throw new Error("Invalid flashcards format received from AI.");
    }

    const { error: insertError } = await supabase.from("flashcards").insert(
      flashcards.flashcards.map((card) => ({
        session_id: sessionId,
        front: card.front,
        back: card.back,
        completed: false,
      }))
    );

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save flashcards" },
        { status: 500 }
      );
    }

    return NextResponse.json(flashcards.flashcards);
  } catch (error) {
    console.error("Error processing request", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
