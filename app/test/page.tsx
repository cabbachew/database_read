"use client";

import { useState, FormEvent } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EngagementDataSkeleton, AnalysisSkeleton } from "./loading-states";
import { useChat } from "ai/react";

type Analysis = {
  overview: string;
  progressAnalysis: string;
  relationshipDynamic: string;
  recommendations: string[];
};

export default function TestPage() {
  const [uuid, setUuid] = useState("");
  const [data, setData] = useState(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // AI Chat setup
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: handleChatSubmit,
    error: chatError,
    isLoading: chatIsLoading,
  } = useChat({
    api: "/api/chat",
    body: {
      engagementData: data,
    },
    onError: (error) => {
      console.error("Chat error:", error);
      setError(error.message || "Failed to send message");
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setData(null);
    setAnalysis(null);

    try {
      // Fetch engagement data
      const response = await fetch(`/api/basic-engagement?uuid=${uuid}`);
      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setData(result.data);

      // Get AI analysis
      const analysisResponse = await fetch("/api/basic-analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: result.data }),
      });

      const analysisResult = await analysisResponse.json();

      if (analysisResult.error) {
        throw new Error(analysisResult.error);
      }

      setAnalysis(analysisResult.result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Engagement Analysis</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={uuid}
          onChange={(e) => setUuid(e.target.value)}
          placeholder="Enter engagement UUID"
          className="px-4 py-2 border rounded-lg mr-4"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Analyze"}
        </button>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {isLoading ? (
        <>
          <EngagementDataSkeleton />
          <AnalysisSkeleton />
        </>
      ) : (
        <>
          {data && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Raw Engagement Data</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {analysis && (
            <div className="grid gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent>{analysis.overview}</CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progress Analysis</CardTitle>
                </CardHeader>
                <CardContent>{analysis.progressAnalysis}</CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Relationship Dynamic</CardTitle>
                </CardHeader>
                <CardContent>{analysis.relationshipDynamic}</CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-4 space-y-2">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {data && (
            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold mb-4">Ask Questions</h2>
              <div className="space-y-4">
                <div className="space-y-4">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-4 rounded-lg ${
                        m.role === "user"
                          ? "bg-blue-100 ml-12"
                          : "bg-gray-100 mr-12"
                      }`}
                    >
                      {m.content}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask a question about this engagement..."
                    className="flex-1 px-4 py-2 border rounded-lg"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    disabled={!input.trim()}
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
