// import { NextResponse } from "next/server";
// import pdf from "pdf-parse";
// import { PDFDocument, PDFName, PDFDict } from "pdf-lib";
// import { createWorker } from "tesseract.js";
// import OpenAI from "openai";
// import { supabase } from "@/lib/supabase";
// import { z } from "zod";

// // Input validation
// const requestSchema = z.object({
//   fileUrl: z.string().url(),
//   // sessionId: z.string().uuid(),
// });

// const openai = new OpenAI({
//   apiKey: process.env.OPENROUTER_API_KEY,
//   baseURL: "https://openrouter.ai/api/v1",
// });

// async function extractImagesFromPDF(buffer: Buffer): Promise<Uint8Array[]> {
//   try {
//     const pdfDoc = await PDFDocument.load(new Uint8Array(buffer));
//     const images: Uint8Array[] = [];

//     for (let i = 0; i < pdfDoc.getPageCount(); i++) {
//       const page = pdfDoc.getPage(i);
//       const resources = page.node.Resources();
//       if (!resources) continue;

//       const xObject = resources.lookup(PDFName.of("XObject"), PDFDict);
//       if (!xObject) continue;

//       // Get all keys in the XObject dictionary
//       const xObjectKeys = xObject.keys();

//       for (const key of xObjectKeys) {
//         const obj = xObject.lookup(key, PDFDict);
//         // Check if the object is an image by looking at its subtype
//         const subtype = obj.lookup(PDFName.of("Subtype"), PDFName);
//         if (subtype?.toString() === "/Image") {
//           const image = obj as any; // Cast to any to access asBytes method
//           const imageData = await image.asBytes(); // Get raw image data
//           images.push(imageData);
//         }
//       }
//     }

//     return images;
//   } catch (error) {
//     console.error("Error extracting images from PDF:", error);
//     throw new Error("Failed to extract images from PDF");
//   }
// }

// async function performOCR(imageBuffer: Uint8Array): Promise<string> {
//   const worker = await createWorker("eng");
//   try {
//     const {
//       data: { text },
//     } = await worker.recognize(Buffer.from(imageBuffer));
//     return text;
//   } catch (error) {
//     console.error("OCR Error:", error);
//     return "";
//   } finally {
//     await worker.terminate();
//   }
// }

// async function extractTextFromPDF(buffer: Buffer): Promise<string> {
//   try {
//     const pdfData = await pdf(buffer);
//     let extractedText = pdfData.text;

//     if (!extractedText || extractedText.trim().length === 0) {
//       console.log("No text extracted. Attempting OCR...");
//       const images = await extractImagesFromPDF(buffer);
//       const ocrResults = await Promise.all(
//         images.map((img) => performOCR(img))
//       );
//       extractedText = ocrResults.join("\n").trim();
//     }

//     return extractedText;
//   } catch (error) {
//     console.error("Error extracting text:", error);
//     throw new Error("Failed to extract text from PDF");
//   }
// }

// // Type definition for flashcard
// interface Flashcard {
//   front: string;
//   back: string;
// }

// export async function POST(request: Request) {
//   try {
//     const authHeader = request.headers.get("Authorization");
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return NextResponse.json(
//         { error: "Missing or invalid authorization header" },
//         { status: 401 }
//       );
//     }

//     const token = authHeader.split(" ")[1];

//     const {
//       data: { user },
//       error,
//     } = await supabase.auth.getUser(token);
//     if (error || !user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await request.json();
//     const validatedData = requestSchema.safeParse(body);

//     if (!validatedData.success) {
//       return NextResponse.json(
//         { error: "Invalid request data", details: validatedData.error },
//         { status: 400 }
//       );
//     }

//     const { fileUrl } = validatedData.data; // sessionId

//     const response = await fetch(fileUrl);
//     if (!response.ok) {
//       return NextResponse.json(
//         { error: `Failed to fetch PDF: ${response.statusText}` },
//         { status: 400 }
//       );
//     }

//     const buffer = Buffer.from(await response.arrayBuffer());
//     const extractedText = await extractTextFromPDF(buffer);

//     if (!extractedText) {
//       return NextResponse.json(
//         { error: "No text could be extracted from the PDF" },
//         { status: 400 }
//       );
//     }

//     const prompt = `You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
//     Both front and back should be one sentence long. Front one should be a question and back one with answer with a bit explanation and question should be of different difficulty and knowledge depth
//     You should return in the following JSON format:
//     {
//       "flashcards":[
//         {
//           "front": "Question",
//           "back": "Answer with a bit explanation"
//         }
//       ]
//     }
//       Extracted Text: ${extractedText}`;

//     const responseAI = await openai.chat.completions.create({
//       model: "meta-llama/llama-3.3-70b-instruct:free",
//       messages: [
//         { role: "system", content: prompt },
//         { role: "user", content: extractedText },
//       ],
//       temperature: 0.5,
//       max_tokens: 2000,
//     });

//     const rawContent = responseAI.choices[0].message.content;
//     if (!rawContent) {
//       throw new Error("Failed to generate flashcards");
//     }

//     const flashcardsData = JSON.parse(rawContent) as {
//       flashcards: Flashcard[];
//     };

//     const { error: insertError } = await supabase.from("flashcards").insert(
//       flashcardsData.flashcards.map((card: { front: string; back: string }) => ({
//         // user_id: session.user.id,
//         session_id: body.sessionId,
//         front: card.front,
//         back: card.back,
//         completed: false,
//       }))
//     );

//     if (insertError) {
//       console.error("Database insert error:", insertError);
//       return NextResponse.json(
//         { error: "Failed to save flashcards" },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json(flashcardsData.flashcards);
//   } catch (error) {
//     console.error("Error processing request:", error);
//     const errorMessage =
//       error instanceof Error ? error.message : "Internal server error";
//     return NextResponse.json({ error: errorMessage }, { status: 500 });
//   }
// }
