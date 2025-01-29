import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";

const RoadmapView = () => {
  const [showTenSessions, setShowTenSessions] = useState(false);

  const monthlyView = [
    {
      title: "First Month",
      items: [
        "Establish engaging writing routine",
        "Develop basic story structure",
        "Build mentor-mentee rapport",
        "Create organization system",
      ],
    },
    {
      title: "Second Month",
      items: [
        "Expand narrative techniques",
        "Introduce revision strategies",
        "Deepen character development",
        "Strengthen project management",
      ],
    },
    {
      title: "Third Month",
      items: [
        "Enhance editing practices",
        "Develop feedback skills",
        "Begin publication preparation",
        "Solidify sustainable habits",
      ],
    },
  ];

  const tenSessionView = [
    {
      title: "Sessions 1-3: Foundation",
      items: [
        "Establish rapport and writing routine",
        "Explore favorite scary stories and identify elements",
        "Create story outline and character profiles",
        "Begin first draft with focus on creative flow",
      ],
    },
    {
      title: "Sessions 4-6: Development",
      items: [
        "Complete first draft",
        "Introduction to revision strategies",
        "Character and plot development workshops",
        "Begin implementing feedback",
      ],
    },
    {
      title: "Sessions 7-8: Refinement",
      items: [
        "Focus on editing and revision",
        "Polish narrative elements",
        "Enhance scary/suspense elements",
        "Prepare for publication",
      ],
    },
    {
      title: "Sessions 9-10: Initial Milestone",
      items: [
        "Complete first story arc",
        "Initial round of revisions",
        "Plan next story/project phase",
        "Reflect on progress and adjust goals",
      ],
    },
  ];

  const currentView = showTenSessions ? tenSessionView : monthlyView;

  return (
    <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Project Roadmap</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Monthly</span>
          <Switch
            checked={showTenSessions}
            onCheckedChange={setShowTenSessions}
          />
          <span className="text-sm text-gray-600">10 Sessions</span>
        </div>
      </div>

      <div className="space-y-6">
        {currentView.map((phase, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-lg mb-2">{phase.title}</h3>
            <ul className="space-y-2">
              {phase.items.map((item, itemIndex) => (
                <li key={itemIndex} className="text-gray-700">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapView;
