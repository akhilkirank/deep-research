import { NextResponse, type NextRequest } from "next/server";
import { ResearchStartSchema, generateSearchQueries } from "@/utils/api-research";

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
    const result = ResearchStartSchema.safeParse(body);
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
    
    // Generate search queries
    const queries = await generateSearchQueries(topic, language, provider, model);
    
    return NextResponse.json(queries);
  } catch (error) {
    console.error("Error in research/start API:", error);
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
