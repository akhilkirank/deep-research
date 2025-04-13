import { NextResponse, type NextRequest } from "next/server";
import { ResearchQuestionsSchema, generateQuestions } from "@/utils/api-research";

export const runtime = "edge";
export const preferredRegion = [
  "cle1",
  "iad1",
  "pdx1",
  "sfo1",
  "sin1",
  "syd1",
  "hnd1",
  "kix1",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const result = ResearchQuestionsSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { 
          code: 400, 
          message: "Invalid request body", 
          errors: result.error.errors 
        },
        { status: 400 }
      );
    }
    
    const { topic, language, provider, model } = result.data;
    
    // Generate questions
    const questions = await generateQuestions(topic, language, provider, model);
    
    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error in research/questions API:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { code: 500, message: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { code: 500, message: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
