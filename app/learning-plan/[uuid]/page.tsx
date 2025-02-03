"use client";

import { useState, useEffect } from "react";
import React from "react";
import StudentOverview from "@/app/test4/components/StudentOverview";
import EngagementOverview from "@/app/test4/components/EngagementOverview";
import MentorFitOverview from "@/app/test4/components/MentorFitOverview";
import Requirements from "@/app/test4/components/Requirements";
import GoalsSection from "@/app/test4/components/GoalsSection";
import SessionStructure from "@/app/test4/components/SessionStructure";
import ProjectRoadmap from "@/app/test4/components/ProjectRoadmap";
import { LearningPlan } from "@/app/test4/types";

export default function LearningPlanPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const [data, setData] = useState<LearningPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resolvedParams = React.use(params);

  useEffect(() => {
    const fetchLearningPlan = async () => {
      try {
        const response = await fetch(
          `/api/learning-plan/${resolvedParams.uuid}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch learning plan");
        }
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLearningPlan();
  }, [resolvedParams.uuid]);

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!data) return <div className="p-8">No data available</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{data.title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          <StudentOverview overview={data.overview} />
          <EngagementOverview overview={data.overview} />
          <MentorFitOverview overview={data.overview} />
          <Requirements requirements={data.requirements} />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <GoalsSection goals={data.synthesizedGoal} />
          <ProjectRoadmap roadmap={data.roadmap} />
          <SessionStructure structure={data.sessionStructure} />
        </div>
      </div>
    </div>
  );
}
