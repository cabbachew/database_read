"use client";

import { useState } from "react";
import { LearningPlan } from "./types";
import StudentOverview from "./components/StudentOverview";
import EngagementOverview from "./components/EngagementOverview";
import MentorFitOverview from "./components/MentorFitOverview";
import Requirements from "./components/Requirements";
import GoalsSection from "./components/GoalsSection";
import SessionStructure from "./components/SessionStructure";
import ProjectRoadmap from "./components/ProjectRoadmap";
import learningPlan from "./data/learningPlan";

const LearningPlanPage = () => {
  const [_data] = useState<LearningPlan>(learningPlan);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{_data.title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          <StudentOverview overview={_data.overview} />
          <EngagementOverview overview={_data.overview} />
          <MentorFitOverview overview={_data.overview} />
          <Requirements requirements={_data.requirements} />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <GoalsSection goals={_data.synthesizedGoal} />
          <ProjectRoadmap roadmap={_data.roadmap} />
          <SessionStructure structure={_data.sessionStructure} />
        </div>
      </div>
    </div>
  );
};

export default LearningPlanPage;
