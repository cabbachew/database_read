"use client";

import { useState } from "react";
import { LearningPlan } from "./types";
import { AnalysisSkeleton } from "@/app/test/loading-states";
import StudentOverview from "./components/StudentOverview";
import EngagementOverview from "./components/EngagementOverview";
import Requirements from "./components/Requirements";
import GoalsSection from "./components/GoalsSection";
import SessionStructure from "./components/SessionStructure";
import ProjectRoadmap from "./components/ProjectRoadmap";
import learningPlan from "./data/learningPlan";

const LearningPlanPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<LearningPlan>(learningPlan);

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <AnalysisSkeleton />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{data.title}</h1>

      <div className="space-y-8">
        <div className="grid gap-8">
          <StudentOverview overview={data.overview} />
          <EngagementOverview overview={data.overview} />
        </div>

        <Requirements requirements={data.requirements} />
        <GoalsSection goals={data.synthesizedGoal} />
        <ProjectRoadmap roadmap={data.roadmap} />
        <SessionStructure structure={data.sessionStructure} />
      </div>
    </div>
  );
};

export default LearningPlanPage;
