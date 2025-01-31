"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";

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
  const router = useRouter();
  const [data, setData] = useState<ProposalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resolvedParams = React.use(params);

  const handleGeneratePlan = () => {
    router.push(`/learning-plan/${resolvedParams.uuid}`);
  };

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const response = await fetch(`/api/proposal/${resolvedParams.uuid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch proposal");
        }
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
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
        <button
          onClick={handleGeneratePlan}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Generate Learning Plan
        </button>
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
