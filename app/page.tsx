"use client";

import { useState, FormEvent } from "react";

// Define types for your state variables
type AnalysisResult = {
  result: string;
  error: string | null;
};

type EngagementResult = {
  data: {
    likes: number;
    comments: number;
    shares: number;
  } | null;
  error: string | null;
};

export default function Home() {
  const [uuid, setUuid] = useState("");
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  const [prompt, setPrompt] = useState("");
  const [analysis, setAnalysis] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(""); // Clear any previous errors

    try {
      const formData = new FormData(event.currentTarget);
      const uuid = formData.get("uuid") || "";

      // Validate UUID format
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(uuid.toString())) {
        setError("Invalid UUID format");
        return;
      }

      const response = await fetch(`/api/engagement?uuids=${uuid}`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      setData(result.data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch engagement data";
      console.error("Failed:", errorMessage);
      setError(errorMessage);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async (formData: FormData): Promise<void> => {
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
      const result: AnalysisResult = await response.json();
      setAnalysisResult(result);
      setAnalysis(result.result);
    } catch (error: unknown) {
      console.error(
        "Analysis failed:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  };

  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        Lookup Engagement by UUID
      </h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          name="uuid"
          placeholder="Enter engagement UUID"
          value={uuid}
          onChange={(e) => setUuid(e.target.value)}
          className="w-80 mr-3 px-4 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          Search
        </button>
      </form>

      {data && (
        <form onSubmit={handleAnalyze} className="mb-6">
          <input
            type="text"
            placeholder="Ask a question about this engagement..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full mb-3 px-4 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            Analyze
          </button>
        </form>
      )}

      {analysis && (
        <div className="mb-6 p-6 border border-gray-200 rounded-lg bg-white">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Analysis</h2>
          <p className="whitespace-pre-wrap text-gray-700">{analysis}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <strong className="text-red-700">Error:</strong>{" "}
          <span className="text-red-600">{error}</span>
        </div>
      )}

      {data && (
        <div className="p-6 border border-gray-200 rounded-lg bg-white">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Engagement Info
          </h2>
          <pre className="whitespace-pre-wrap text-gray-700 font-mono text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      {analysisResult && <div>{/* Display analysis result */}</div>}

      {isLoading && <p>Loading...</p>}
    </main>
  );
}
