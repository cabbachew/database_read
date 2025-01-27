import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
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
            data
          )}\n\nQuestion: ${prompt}`,
        },
      ],
    });

    return NextResponse.json({ response: message.content[0].text });
  } catch (err: any) {
    console.error("Anthropic API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to analyze data" },
      { status: 500 }
    );
  }
}
