import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { toJsonWithBigInt } from "@/lib/bigIntToString";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

type AnalyzeResponse = {
  result: string;
  error?: string;
};

export async function POST(request: Request) {
  let response: AnalyzeResponse;
  try {
    const { prompt, data } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "No prompt provided" },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Given this engagement data: ${JSON.stringify(
            toJsonWithBigInt(data)
          )}\n\nQuestion: ${prompt}`,
        },
      ],
    });

    if (message.content[0].type !== "text") {
      throw new Error("Expected text response from Claude");
    }

    response = {
      result: message.content[0].text,
      error: undefined,
    };
  } catch (error) {
    console.error("Anthropic API error:", error);
    response = {
      result: "",
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
  return NextResponse.json(response);
}
