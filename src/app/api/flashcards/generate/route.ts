import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

// Input validation
const requestSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
});

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = requestSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validatedData.error },
        { status: 400 }
      );
    }

    const { topic } = validatedData.data;

    const prompt = `You are a flashcard creator that generates exactly 20 flashcards from a given topic.
    Each flashcard must have a one-sentence question (front) and a one-sentence answer with a brief explanation (back).
    Questions should vary in difficulty and depth.
    Return the result as a valid JSON object and nothing else—no additional text, comments, exclamations, or explanations outside the JSON.
    Use this exact format:
    {
      "flashcards":[
        {
          "front": "What is the capital of France?",
          "back": "The capital of France is Paris, a major cultural and economic center."
        }
      ]
    }
      Topic: ${topic}`;

    const responseAI = await openai.chat.completions.create({
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: topic },
      ],
      temperature: 0.5,
      max_tokens: 2000,
    });

    const rawContent = responseAI.choices[0].message.content;
    if (!rawContent) {
      throw new Error(
        "Failed to generate flashcards: No content received from AI"
      );
    }
    const flashcards = JSON.parse(rawContent);

    const { error: insertError } = await supabase.from("flashcards").insert(
      flashcards.flashcards.map((card: { front: string; back: string }) => ({
        // user_id: user.id, // Use user  ID from token
        session_id: body.sessionId || null,
        front: card.front,
        back: card.back,
        completed: false,
      }))
    );

    if (insertError) {
      console.error("Database insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save flashcards" },
        { status: 500 }
      );
    }

    return NextResponse.json(flashcards.flashcards);
  } catch (error) {
    console.error("Error generating flashcards:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
