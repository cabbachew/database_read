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

type ProcessedData = {
  title?: string;
  createdAt?: Date;
  engagementDescription?: string;
  status?: string;
  discipline?: string;
  topic?: string;
  addOns?: string[];
  structuredGoals?: string[];
  pitchDescription?: string;
  offering?: string;
  studentArchetypes?: string[];
  pitchSuccessMetrics?: string[];
  mentorName?: string;
  mentorEmail?: string;
  studentName?: string;
  acceptMessage?: string;
  mentorProposalDescription?: string;
  studentGender?: string;
  grade?: string;
  studentProfileText?: string;
  successMetrics?: string[];
  firstSessionDate?: Date;
  sessionCount?: number;
  sessionDates?: string;
  sessionNotes?: string;
  sessionSummaries?: string;
  publishedDates?: string;
  personalNotes?: string;
  demonstratedStrengths?: string;
  opportunitiesForGrowth?: string;
  recommendations?: string;
};

const analyzeWithRetry = async (
  processedData: ProcessedData,
  prompt: string,
  maxRetries = 3
) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-latest",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `Given this engagement data: ${JSON.stringify(
              processedData
            )}\n\nQuestion: ${prompt}`,
          },
        ],
      });
      return message;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

export async function POST(request: Request) {
  let response: AnalyzeResponse;
  try {
    const { prompt, data } = await request.json();

    if (!prompt || prompt.trim() === "") {
      return NextResponse.json(
        { result: "", error: "No prompt provided" },
        { status: 400 }
      );
    }

    // Ensure data is an object before processing
    const processedData = data ? toJsonWithBigInt(data) : {};

    // Calculate approximate token size
    const dataString = JSON.stringify(processedData);
    if (dataString.length > 100000) {
      // Define text fields that might need truncation
      const longTextFields = [
        "sessionNotes",
        "sessionSummaries",
        "pitchDescription",
        "mentorProposalDescription",
        "studentProfileText",
        "personalNotes",
        "demonstratedStrengths",
        "opportunitiesForGrowth",
        "recommendations",
      ];

      // Calculate available length per field (rough estimation)
      const maxLengthPerField = Math.floor(80000 / longTextFields.length);

      const truncatedData = {
        ...processedData,
        ...Object.fromEntries(
          longTextFields.map((field) => {
            const value = processedData[field as keyof ProcessedData];
            return [
              field,
              typeof value === "string" && value.length > maxLengthPerField
                ? value.slice(0, maxLengthPerField) + "..."
                : value,
            ];
          })
        ),
      };

      const message = await analyzeWithRetry(truncatedData, prompt);

      if (!message || !message.content?.[0]?.type) {
        throw new Error("Invalid response from Claude");
      }

      if (message.content[0].type !== "text") {
        throw new Error("Expected text response from Claude");
      }

      return NextResponse.json({
        result: message.content[0].text,
        error: undefined,
      });
    }

    const message = await analyzeWithRetry(processedData, prompt);

    if (!message || !message.content?.[0]?.type) {
      throw new Error("Invalid response from Claude");
    }

    if (message.content[0].type !== "text") {
      throw new Error("Expected text response from Claude");
    }

    response = {
      result: message.content[0].text,
      error: undefined,
    };
  } catch (error) {
    console.error("Analysis error details:", {
      error,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        result: "",
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(response);
}
