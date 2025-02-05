"use client";

import { useState, useEffect } from "react";
import React from "react";
import { Card } from "@/components/ui/card";
import CopyButton from "@/app/components/CopyButton";

type EngagementData = {
  title: string;
  status: string;
  topic: string | null;
  studentName: string | null;
  mentorName: string | null;
};

export default function EngagementPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const [data, setData] = useState<EngagementData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Unwrap params using React.use()
  const resolvedParams = React.use(params);

  useEffect(() => {
    const fetchEngagement = async () => {
      try {
        const response = await fetch(`/api/engagements/${resolvedParams.uuid}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch engagement");
        }
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchEngagement();
  }, [resolvedParams.uuid]);

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!data) return <div className="p-8">No data available</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Engagement Data</h1>
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Engagement Info
          </h2>
          <CopyButton textToCopy={JSON.stringify(data, null, 2)} />
        </div>
        <pre className="whitespace-pre-wrap text-gray-700 font-mono text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      </Card>
    </div>
  );
}
