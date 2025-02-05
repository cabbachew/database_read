"use client";

import { useState, useEffect } from "react";
import React from "react";
import { Component, ErrorInfo, ReactNode } from "react";

type ProposalData = {
  offeringType: string | null;
  pitchDescription: string | null;
  topic: string | null;
  addOnSelections: string[];
  engagementGoals: string[];
  studentArchetypes: string[];
  availabilityNotes: string | null;
  successMetrics: string[];
  acceptanceMessage: string | null;
  profileText: string | null;
  meetingTranscript: string | null;
};

export default function ProposalPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const [data, setData] = useState<ProposalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resolvedParams = React.use(params);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        console.log(`Fetching proposal with UUID: ${resolvedParams.uuid}`);
        const response = await fetch(`/api/proposals/${resolvedParams.uuid}`);
        console.log("Response status:", response.status);

        const contentType = response.headers.get("content-type");
        console.log("Response content type:", contentType);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
          });
          throw new Error(
            `Failed to fetch proposal: ${response.status} ${response.statusText}`
          );
        }

        const result = await response.json();
        console.log("Received data:", result);
        setData(result.data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        console.error("Fetch error:", {
          error: err,
          message: errorMessage,
          uuid: resolvedParams.uuid,
        });
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposal();
  }, [resolvedParams.uuid]);

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!data) return <div className="p-8">No data available</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Engagement Proposal</h1>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <DataCard title="Offering Type" value={data.offeringType} />
          <DataCard title="Topic" value={data.topic} />
        </div>
        <DataCard title="Pitch Description" value={data.pitchDescription} />
        <DataCard title="Availability Notes" value={data.availabilityNotes} />
        <ListCard title="Add-On Selections" items={data.addOnSelections} />
        <ListCard title="Engagement Goals" items={data.engagementGoals} />
        <ListCard title="Student Archetypes" items={data.studentArchetypes} />
        <ListCard title="Success Metrics" items={data.successMetrics} />
        {data.acceptanceMessage && (
          <DataCard
            title="Mentor Acceptance Message"
            value={data.acceptanceMessage}
          />
        )}
        {data.profileText && (
          <DataCard title="Student Profile" value={data.profileText} />
        )}
        {data.meetingTranscript && (
          <DataCard title="Meeting Transcript" value={data.meetingTranscript} />
        )}
      </div>
    </div>
  );
}

type DataCardProps = {
  title: string;
  value: string | null;
};

function DataCard({ title, value }: DataCardProps) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <p className="text-gray-600 mb-2">{title}:</p>
      <p className="text-gray-900">{value || "Not specified"}</p>
    </div>
  );
}

type ListCardProps = {
  title: string;
  items: string[];
};

function ListCard({ title, items }: ListCardProps) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <p className="text-gray-600 mb-2">{title}:</p>
      {items.length > 0 ? (
        <ul className="list-disc pl-5">
          {items.map((item, i) => (
            <li key={i} className="text-gray-900">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-900">None specified</p>
      )}
    </div>
  );
}

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 border border-red-500 rounded bg-red-50">
            <h2 className="text-red-700 font-semibold">Something went wrong</h2>
            <p className="text-red-600">{this.state.error?.message}</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
