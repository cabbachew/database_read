"use client";

import React, { useState, useEffect, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SessionTimeline = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  const sessions = [
    {
      id: 1,
      date: "2023-03-12",
      title: "Blog Analysis & Planning",
      notes: [
        "Analyzed top blogs and components",
        "Discussed blog purpose and target audience",
        "Created plan for About Section",
        "Core audience: parents, students, teachers",
        "Topics: tennis, mindset, video games, Covid impact on school",
      ],
      highlights: ["Writing", "Planning"],
    },
    {
      id: 2,
      date: "2023-03-19",
      title: "About Me Development",
      notes: [
        "Worked on About Me section",
        "Discussed different schooling experiences",
        "Explored personal values: empathy, kindness, hard work",
        "Tennis and focus discussion",
        "Core values identification",
      ],
      highlights: ["Personal Development", "Writing"],
    },
    {
      id: 3,
      date: "2023-04-02",
      title: "Goal Setting & Platform Setup",
      notes: [
        "Refined About Me section",
        "Created mission statement",
        "Set up Substack for content",
        "SMART goal setting",
        "Content strategy planning",
      ],
      highlights: ["Strategy", "Technical Setup"],
    },
    {
      id: 4,
      date: "2023-05-07",
      title: "Research & Survey Analysis",
      notes: [
        "Analyzed survey results on goal-setting",
        "Discussed qualitative vs quantitative data",
        "Planned blog structure",
        "Migrated from Substack to Webflow",
        "Research on school goal-setting methods",
      ],
      highlights: ["Research", "Analysis"],
    },
    {
      id: 5,
      date: "2023-06-25",
      title: "First Blog Launch",
      notes: [
        "Published first blog post",
        "Created launch plan",
        "Set up Twitter account",
        "Developed AI goal setting bot",
        "Learned about APIs and integrations",
      ],
      highlights: ["Launch", "Technical Achievement"],
    },
    {
      id: 6,
      date: "2023-08-15",
      title: "Business Ideation",
      notes: [
        "Explored problem spaces in the world",
        "Created skills and passions Venn diagram",
        "Discussed Simon Sineks framework",
        "Focus on screen time addiction in youth",
        "Started research phase",
      ],
      highlights: ["Entrepreneurship", "Research"],
    },
    {
      id: 7,
      date: "2023-10-02",
      title: "App Development Start",
      notes: [
        "Began chore tracking app development",
        "Set up initial project structure",
        "Created data models for families and tasks",
        "Planned user interface flows",
        "Discussed technical architecture",
      ],
      highlights: ["Development", "Planning"],
    },
    {
      id: 8,
      date: "2024-01-09",
      title: "Technical Implementation",
      notes: [
        "Built user authentication system",
        "Created family group functionality",
        "Developed task assignment features",
        "Implemented progress tracking",
        "Added notification system",
      ],
      highlights: ["Development", "Technical Achievement"],
    },
    {
      id: 9,
      date: "2024-03-12",
      title: "MVP Testing & Refinement",
      notes: [
        "Conducted user testing sessions",
        "Gathered feedback on interface",
        "Improved notification system",
        "Enhanced family management features",
        "Planned launch strategy",
      ],
      highlights: ["Testing", "Refinement"],
    },
    {
      id: 10,
      date: "2024-05-01",
      title: "Presentation Preparation",
      notes: [
        "Prepared showcase presentation",
        "Created project timeline visuals",
        "Practiced public speaking",
        "Refined pitch deck",
        "Developed demonstration flow",
      ],
      highlights: ["Presentation", "Communication"],
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (timelineRef.current) {
        const element = timelineRef.current;
        const windowHeight = window.innerHeight;
        const scrollTop = window.scrollY;
        const elementHeight = element.scrollHeight - windowHeight;
        const scrollPosition = Math.min(
          100,
          Math.max(0, (scrollTop / elementHeight) * 100)
        );
        setScrollProgress(scrollPosition);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white p-4 border-b">
        <Progress value={scrollProgress} className="w-full" />
      </div>

      <div className="container mx-auto p-6 pt-16" ref={timelineRef}>
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-12 top-0 bottom-0 w-1 bg-gray-200" />

          {/* Session Cards */}
          <div className="space-y-8">
            {sessions.map((session) => (
              <div key={session.id} className="relative flex">
                {/* Timeline Circle */}
                <div className="absolute left-12 w-6 h-6 rounded-full bg-primary border-4 border-white shadow-sm transform -translate-x-1/2" />

                {/* Session Content */}
                <Card className="ml-24 p-6 w-full max-w-3xl hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">
                          {session.date}
                        </div>
                        <h3 className="text-xl font-semibold">
                          {session.title}
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        {session.highlights.map((highlight, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="bg-primary/10"
                          >
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <ul className="list-disc list-inside space-y-2">
                      {session.notes.map((note, i) => (
                        <li key={i} className="text-gray-600">
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeline;
