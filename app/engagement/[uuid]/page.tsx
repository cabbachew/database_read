"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
      <h1 className="text-2xl font-bold mb-6">Engagement Details</h1>

      <Accordion type="single" collapsible className="mb-6">
        <AccordionItem value="raw-data">
          <AccordionTrigger>Raw Engagement Data</AccordionTrigger>
          <AccordionContent>
            <pre className="whitespace-pre-wrap text-sm">
              {JSON.stringify(data, null, 2)}
            </pre>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <dt className="font-semibold">Title</dt>
              <dd>{data.title}</dd>
              <dt className="font-semibold">Status</dt>
              <dd>{data.status}</dd>
              <dt className="font-semibold">Topic</dt>
              <dd>{data.topic || "Not specified"}</dd>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <dt className="font-semibold">Student</dt>
              <dd>{data.studentName || "Not specified"}</dd>
              <dt className="font-semibold">Mentor</dt>
              <dd>{data.mentorName || "Not specified"}</dd>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
