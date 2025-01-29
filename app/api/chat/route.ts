import { Message } from "ai";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    console.log("Chat route started");

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const { messages, engagementData } = await req.json();
    console.log("Received messages count:", messages.length);

    try {
      const result = await streamText({
        model: openai("gpt-3.5-turbo"), // Changed from gpt-4 to ensure availability
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI assistant analyzing engagement data for a mentorship program. Use the provided engagement data context to answer questions accurately.",
          },
          {
            role: "user",
            content: `Here is the engagement data for context: ${JSON.stringify(
              engagementData
            )}`,
          },
          ...messages.map((m: Message) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content,
          })),
        ],
      });

      return result.toDataStreamResponse();
    } catch (streamError) {
      console.error("Streaming error:", streamError);
      return NextResponse.json(
        { error: "Failed to stream response" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
