"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DynamicRoadmapView from "@/app/components/DynamicRoadmapView";

type TopicOption = {
  uuid: string;
  name: string;
  discipline: string;
  disciplines: { name: string };
};

type EngagementOption = {
  uuid: string;
  title: string;
  sessionCount: number;
  mentorName: string | null;
  studentName: string | null;
};

export default function EngagementsRoadmap() {
  const [topics, setTopics] = useState<TopicOption[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<TopicOption | null>(null);
  const [engagements, setEngagements] = useState<EngagementOption[]>([]);
  const [selectedEngagements, setSelectedEngagements] = useState<string[]>([]);
  const [roadmapData, setRoadmapData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch("/api/topics");
        const result = await response.json();
        if (result.error) throw new Error(result.error);
        setTopics(result.data);
      } catch (error) {
        console.error("Failed to fetch topics:", error);
      }
    };

    fetchTopics();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Generate Engagement Roadmap</h1>

      {/* Topics Dropdown */}
      <div className="mb-8">
        <Select
          value={selectedTopic?.uuid}
          onValueChange={(value) => {
            const topic = topics.find((t) => t.uuid === value);
            setSelectedTopic(topic || null);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a topic..." />
          </SelectTrigger>
          <SelectContent>
            {topics.map((topic) => (
              <SelectItem key={topic.uuid} value={topic.uuid}>
                <div>
                  <div className="text-sm text-gray-500">
                    {topic.disciplines.name}
                  </div>
                  <div>{topic.name}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Engagements Checklist */}
      {selectedTopic && engagements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Engagements</h2>
          <div className="space-y-2">
            {engagements.map((engagement) => (
              <label
                key={engagement.uuid}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
              >
                <Checkbox
                  checked={selectedEngagements.includes(engagement.uuid)}
                  onCheckedChange={(checked) => {
                    setSelectedEngagements((prev) =>
                      checked
                        ? [...prev, engagement.uuid]
                        : prev.filter((id) => id !== engagement.uuid)
                    );
                  }}
                />
                <div>
                  <div className="font-medium">{engagement.title}</div>
                  <div className="text-sm text-gray-500">
                    {engagement.sessionCount} sessions • {engagement.mentorName}{" "}
                    • {engagement.studentName}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Generate Button */}
      {selectedEngagements.length > 0 && (
        <Button
          className="mb-8"
          onClick={() => {
            /* Generate Roadmap */
          }}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Roadmap"}
        </Button>
      )}

      {/* Roadmap Display */}
      {roadmapData && <DynamicRoadmapView data={roadmapData} />}
    </div>
  );
}
