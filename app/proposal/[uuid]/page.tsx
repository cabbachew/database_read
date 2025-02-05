"use client";

import { useState, useEffect } from "react";
import React from "react";
import CopyButton from "@/app/components/CopyButton";

type EngagementGoal = {
  title: string;
  description: string;
  status?: "pending" | "in_progress" | "completed";
};

type SuccessMetric = {
  metric: string;
  target?: string | number;
  currentValue?: string | number;
  notes?: string;
};

type ProposalData = {
  // Basic proposal info
  offeringType: string | null;
  pitchDescription: string | null;
  topic: string | null;

  // Selections and preferences
  addOnSelections: string[];
  engagementGoals: EngagementGoal[];
  studentArchetypes: string[];
  availabilityNotes: string | null;
  successMetrics: SuccessMetric[];

  // Mentor information
  acceptanceMessage: string | null;
  mentorBio: string | null;

  // Student information
  studentProfile: string | null;
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

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error ||
              `HTTP error! status: ${response.status} ${response.statusText}`
          );
        }

        const result = await response.json();
        if (!result.data) {
          throw new Error("No data received from server");
        }

        setData(result.data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
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
        <CopyButton textToCopy={JSON.stringify(data, null, 2)} />
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <DataCard title="Offering Type" value={data.offeringType} />
          <DataCard title="Topic" value={data.topic} />
        </div>
        <DataCard title="Pitch Description" value={data.pitchDescription} />
        <DataCard title="Availability Notes" value={data.availabilityNotes} />
        <ListCard title="Add-On Selections" items={data.addOnSelections} />
        <GoalCard title="Engagement Goals" goals={data.engagementGoals} />
        <ListCard title="Student Archetypes" items={data.studentArchetypes} />
        <MetricsCard title="Success Metrics" metrics={data.successMetrics} />
        {data.acceptanceMessage && (
          <DataCard
            title="Mentor Acceptance Message"
            value={data.acceptanceMessage}
          />
        )}
        {data.mentorBio && (
          <DataCard title="Mentor Biography" value={data.mentorBio} />
        )}
        {data.studentProfile && (
          <DataCard title="Student Profile" value={data.studentProfile} />
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

type GoalCardProps = {
  title: string;
  goals: EngagementGoal[];
};

function GoalCard({ title, goals }: GoalCardProps) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <p className="text-gray-600 mb-2">{title}:</p>
      {goals.length > 0 ? (
        <ul className="list-disc pl-5">
          {goals.map((goal, i) => (
            <li key={i} className="text-gray-900">
              {goal.title}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-900">None specified</p>
      )}
    </div>
  );
}

type MetricsCardProps = {
  title: string;
  metrics: SuccessMetric[];
};

function MetricsCard({ title, metrics }: MetricsCardProps) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <p className="text-gray-600 mb-2">{title}:</p>
      {metrics.length > 0 ? (
        <ul className="list-disc pl-5">
          {metrics.map((metric, i) => (
            <li key={i} className="text-gray-900">
              {metric.metric}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-900">None specified</p>
      )}
    </div>
  );
}
