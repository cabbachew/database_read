import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { data } = await request.json();

    const staticContext = `You are an AI assistant analyzing engagement data for a mentorship program. 
    Consider the following aspects when analyzing the data:
    - The engagement status and what that means for the mentorship
    - The relationship between mentor and student
    - Any potential recommendations based on the available information
    
    Format your response as valid JSON with this structure:
    {
      "overview": "string",
      "progressAnalysis": "string",
      "relationshipDynamic": "string",
      "recommendations": ["string"]
    }`;

    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1024,
      system: "You are a helpful AI assistant that always returns valid JSON.",
      messages: [
        {
          role: "user",
          content: `${staticContext}\n\nAnalyze this engagement data and return ONLY the JSON object matching the specified structure, with no additional text or formatting: ${JSON.stringify(
            data,
            null,
            2
          )}`,
        },
      ],
    });

    if (!("text" in message.content[0])) {
      throw new Error("Invalid response from Claude");
    }

    // Parse the response text, removing any potential markdown formatting
    const cleanedResponse = message.content[0].text
      .replace(/```json\n?|\n?```/g, "")
      .trim();
    const analysisJson = JSON.parse(cleanedResponse);

    return NextResponse.json({
      result: analysisJson,
      error: null,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      {
        result: null,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
