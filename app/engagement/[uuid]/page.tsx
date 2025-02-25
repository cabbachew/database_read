"use client";

import { useState, useEffect } from "react";
import React from "react";
import { Card } from "@/components/ui/card";
import CopyButton from "@/app/components/CopyButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type StructuredGoal = {
  title: string;
  description: string;
  status?: "pending" | "in_progress" | "completed";
};

type SuccessMetric = {
  metric: string;
  target: string;
  status?: "pending" | "in_progress" | "completed";
};

type EngagementData = {
  engagementTitle: string;
  engagementCreatedAt: string;
  engagementDescription: string;
  offering: string;
  status: string;
  discipline: string;
  topic: string | null;
  addOns: string | null;
  structuredGoals: StructuredGoal[] | null;
  pitchDescription: string | null;
  proposalOffering: string | null;
  studentArchetypes: string | null;
  pitchSuccessMetrics: string | null;
  studentGender: string | null;
  studentGrade: string | null;
  studentProfileText: string | null;
  successMetrics: SuccessMetric[];
  firstSessionDate: string;
  sessionCount: number;
  sessionDates: string[];
  sessionNotes: string[];
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateShort(dateString: string): string {
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
  } catch {
    return "Invalid date";
  }
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "Not specified";
  if (typeof value === "string") {
    // Check if it's a date string
    if (value.match(/^\d{4}-\d{2}-\d{2}T/)) {
      try {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          return value;
        }
        return formatDate(value);
      } catch {
        return value;
      }
    }
    return value;
  }
  if (
    Array.isArray(value) &&
    value.length > 0 &&
    typeof value[0] === "string" &&
    value[0].match(/^\d{4}-\d{2}-\d{2}T/)
  ) {
    // Special handling for array of dates
    return value
      .map((date) => {
        try {
          return formatDateShort(date);
        } catch {
          return date;
        }
      })
      .filter((date) => date !== "Invalid date")
      .join("; ");
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "Invalid data";
    }
  }
  return String(value);
}

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
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Engagement Info
            </h2>
            <CopyButton
              textToCopy={JSON.stringify(
                {
                  uuid: resolvedParams.uuid,
                  engagementTitle: data.engagementTitle,
                  engagementDescription: data.engagementDescription,
                  created: data.engagementCreatedAt,
                  firstSessionDate: data.firstSessionDate,
                  offering: data.offering,
                  status: data.status,
                  discipline: data.discipline,
                  topic: data.topic,
                  addOns: data.addOns,
                  structuredGoals: data.structuredGoals,
                  pitchDescription: data.pitchDescription,
                  proposalOffering: data.proposalOffering,
                  studentArchetypes: data.studentArchetypes,
                  pitchSuccessMetrics: data.pitchSuccessMetrics,
                  studentGender: data.studentGender,
                  studentGrade: data.studentGrade,
                  studentProfileText: data.studentProfileText,
                  successMetrics: data.successMetrics,
                  sessionCount: data.sessionCount,
                  sessionDates: data.sessionDates.map(formatDateShort),
                  sessionNotes: data.sessionNotes,
                },
                null,
                2
              )}
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
            <div className="grid grid-cols-1 gap-2">
              <div>
                <strong>UUID:</strong> {resolvedParams.uuid}
              </div>
              <div>
                <strong>Engagement Title:</strong>{" "}
                {formatValue(data.engagementTitle)}
              </div>
              <div>
                <strong>Description:</strong>{" "}
                {formatValue(data.engagementDescription)}
              </div>
              <div>
                <strong>Created:</strong>{" "}
                {formatValue(data.engagementCreatedAt)}
              </div>
              {data.firstSessionDate && (
                <div>
                  <strong>First Session:</strong>{" "}
                  {formatValue(data.firstSessionDate)}
                </div>
              )}
              <div>
                <strong>Offering:</strong> {formatValue(data.offering)}
              </div>
              <div>
                <strong>Status:</strong> {formatValue(data.status)}
              </div>
              <div>
                <strong>Discipline:</strong> {formatValue(data.discipline)}
              </div>
              <div>
                <strong>Topic:</strong> {formatValue(data.topic)}
              </div>
              <div>
                <strong>Add Ons:</strong> {formatValue(data.addOns)}
              </div>
              <div>
                <strong>Structured Goals:</strong>{" "}
                {formatValue(data.structuredGoals)}
              </div>
              <div>
                <strong>Pitch Description:</strong>{" "}
                {formatValue(data.pitchDescription)}
              </div>
              <div>
                <strong>Proposal Offering:</strong>{" "}
                {formatValue(data.proposalOffering)}
              </div>
              <div>
                <strong>Student Archetypes:</strong>{" "}
                {formatValue(data.studentArchetypes)}
              </div>
              <div>
                <strong>Pitch Success Metrics:</strong>{" "}
                {formatValue(data.pitchSuccessMetrics)}
              </div>
              <div>
                <strong>Student Gender:</strong>{" "}
                {formatValue(data.studentGender)}
              </div>
              <div>
                <strong>Student Grade:</strong> {formatValue(data.studentGrade)}
              </div>
              <div>
                <strong>Student Profile Text:</strong>{" "}
                {formatValue(data.studentProfileText)}
              </div>
              <div>
                <strong>Success Metrics:</strong>{" "}
                {formatValue(data.successMetrics)}
              </div>
              <div>
                <strong>Session Count:</strong> {formatValue(data.sessionCount)}
              </div>
              {data.sessionDates.length > 0 && (
                <div>
                  <strong>Session Dates:</strong>{" "}
                  {data.sessionDates.map(formatDateShort).join("; ")}
                </div>
              )}
              {data.sessionNotes.length > 0 && (
                <div>
                  <strong>Session Notes:</strong>
                  <div className="ml-4 mt-2">
                    {data.sessionNotes.map((note, index) => (
                      <div key={index} className="text-gray-600">
                        • {note}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <Accordion type="single" collapsible>
            <AccordionItem value="raw-json" className="border-none">
              <AccordionTrigger className="hover:no-underline">
                View Raw JSON
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex justify-end mb-2">
                  <CopyButton
                    textToCopy={JSON.stringify(
                      { uuid: resolvedParams.uuid, ...data },
                      null,
                      2
                    )}
                  />
                </div>
                <pre className="whitespace-pre-wrap text-gray-700 font-mono text-sm bg-gray-50 p-4 rounded-lg">
                  {JSON.stringify(
                    { uuid: resolvedParams.uuid, ...data },
                    null,
                    2
                  )}
                </pre>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>
    </div>
  );
}
