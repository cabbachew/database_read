import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";

type RoadmapPhase = {
  title: string;
  items: string[];
};

type RoadmapData = {
  monthlyView: RoadmapPhase[];
  tenSessionView: RoadmapPhase[];
};

interface DynamicRoadmapViewProps {
  data: RoadmapData;
  isLoading?: boolean;
}

const DynamicRoadmapView: React.FC<DynamicRoadmapViewProps> = ({
  data,
  isLoading = false,
}) => {
  const [showTenSessions, setShowTenSessions] = useState(false);
  const currentView = showTenSessions ? data.tenSessionView : data.monthlyView;

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-sm animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-l-4 border-gray-200 pl-4">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded w-3/4"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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

export default DynamicRoadmapView;
