"use client";

import React from "react";
import RoadmapView from "./RoadmapView";

const LearningPlanPage = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-8">
        Personalized Learning Plan: Creative Writing Mentorship
      </h1>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column */}
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-2">Student Profile</h3>
                <ul className="space-y-2">
                  <li>
                    <span className="font-medium">Name:</span> Mason Tennant
                  </li>
                  <li>
                    <span className="font-medium">Grade:</span> 3rd Grade
                  </li>
                  <li>
                    <span className="font-medium">School:</span> Woodland,
                    Portola Valley
                  </li>
                  <li>
                    <span className="font-medium">Primary Interest:</span>{" "}
                    Creative writing, particularly scary stories
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">Archetypes</h3>
                <ul className="space-y-2">
                  <li>Has a project in mind (Creative writing goals)</li>
                  <li>
                    Needs neurodivergent learning support (ADHD considerations)
                  </li>
                  <li>Looking for an inspiring role model (Writing mentor)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">Core Engagement</h3>
                <ul className="space-y-2">
                  <li>
                    <span className="font-medium">Type:</span> Passion Project
                    (Content Creation Track)
                  </li>
                  <li>
                    <span className="font-medium">Focus Area:</span> Creative
                    Writing & Storytelling
                  </li>
                  <li>
                    <span className="font-medium">Documentation:</span> CC
                    Notetaker (Required for all sessions)
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Documentation Requirements
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2">CC Platform Usage</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Session recordings via CC Notetaker</li>
                  <li>Project artifacts and drafts</li>
                  <li>Progress tracking</li>
                  <li>Milestone achievements</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">Project Materials</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Story drafts and revisions</li>
                  <li>Character profiles</li>
                  <li>Plot outlines</li>
                  <li>Visual elements (AI-generated images)</li>
                  <li>Editing checklists</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Session Structure</h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div>
                <h3 className="font-medium">Opening (10 min)</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Check-in</li>
                  <li>Review progress</li>
                  <li>Set session goals</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium">Core work period (40 min)</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Writing technique instruction</li>
                  <li>Guided practice</li>
                  <li>Project development</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium">Wrap-up (10 min)</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Review accomplishments</li>
                  <li>Set next session goals</li>
                  <li>Document progress in CC Notetaker</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Roadmap Toggle Component */}
          <RoadmapView />
        </div>
      </div>
    </div>
  );
};

export default LearningPlanPage;
