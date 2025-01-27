"use client";

import { useState, FormEvent } from "react";

// Define types for your state variables
type AnalysisResult = {
  result: string;
  error: string | null;
};

type EngagementData = {
  data: {
    likes: number;
    comments: number;
    shares: number;
  } | null;
  error: string | null;
};

export default function Home() {
  const [uuid, setUuid] = useState("");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [analysis, setAnalysis] = useState<string>("");
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [result, setResult] = useState<EngagementData | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setAnalyzing(true);
    const formData = new FormData(event.currentTarget);

    return Promise.all([handleAnalyze(formData), handleEngagement(formData)])
      .catch((error: unknown) => {
        console.error(
          "Form submission failed:",
          error instanceof Error ? error.message : "Unknown error"
        );
      })
      .finally(() => {
        setAnalyzing(false);
      });
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

  const handleEngagement = async (formData: FormData): Promise<void> => {
    try {
      const response = await fetch("/api/engagement", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (error: unknown) {
      console.error(
        "Engagement check failed:",
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
          placeholder="Enter engagement UUID"
          value={uuid}
          onChange={(e) => setUuid(e.target.value)}
          className="w-80 mr-3 px-4 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
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
            disabled={analyzing}
          />
          <button
            type="submit"
            disabled={analyzing}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {analyzing ? "Analyzing..." : "Analyze"}
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

      {result && <div>{/* Display engagement data */}</div>}
    </main>
  );
}
