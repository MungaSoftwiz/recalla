import { NextResponse } from "next/server";
import pdf from "pdf-parse";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req) {
  try {
    console.log("Starting request processing...");
    const formData = await req.formData();
    let topic = "";

    // Check if we received a PDF file or text input
    const pdfFile = formData.get("file");
    if (pdfFile) {
      // Handle PDF file
      const buffer = Buffer.from(await pdfFile.arrayBuffer());
      const pdfData = await pdf(buffer);
      topic = pdfData.text;
      console.log("Extracted text from PDF:", topic);
    } else {
      // Handle text input
      const textData = formData.get("topic");
      topic = textData || "Machine Learning";
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

    console.log("Prompt created for topic:", topic);

    const response = await openai.chat.completions.create({
      model: "google/gemma-2-9b-it:free",
      messages: [
        { role: "user", content: topic },
        { role: "system", content: prompt },
      ],
    });

    console.log("API response received:", response);

    const rawContent = response.choices[0].message.content;
    console.log("Raw content received:", rawContent);

    // Extract the JSON part using regex
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in the response content.");
    }

    const cleanedContent = jsonMatch[0];
    console.log("Cleaned content:", cleanedContent);

    const flashcards = JSON.parse(cleanedContent);
    console.log("Parsed flashcards:", flashcards);

    return NextResponse.json(flashcards.flashcards);
  } catch (error) {
    console.error("Error encountered:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
