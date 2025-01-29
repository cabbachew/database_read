import { Message } from "ai";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, engagementData } = await req.json();

  const result = await streamText({
    model: openai("gpt-4"),
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
}
