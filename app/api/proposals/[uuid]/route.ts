import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Define specific types for structured data
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

// Define the complex return type structure
type TransformedProposalData = {
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

// Define the database return type
type ProposalWithRelations = {
  offeringType: string | null;
  goals: string | null;
  addOnSelections: string[];
  engagementGoals: EngagementGoal[];
  studentArchetypes: string[];
  availabilityNotes: string | null;
  successMetrics: SuccessMetric[];
  topics: {
    name: string | null;
  } | null;
  mentor_proposals: Array<{
    acceptanceMessage: string | null;
    mentorUuid: string | null;
  }>;
  studentProfileUuids: string[];
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ uuid: string }> }
) {
  console.log("API Route hit - GET /api/proposals/[uuid]", {
    url: req.url,
  });

  try {
    const { uuid } = await params;
    console.log("Looking up proposal in database:", uuid);

    const result = (await prisma.engagement_proposals.findUnique({
      where: { uuid },
      select: {
        offeringType: true,
        goals: true,
        addOnSelections: true,
        engagementGoals: true,
        studentArchetypes: true,
        availabilityNotes: true,
        successMetrics: true,
        topics: {
          select: {
            name: true,
          },
        },
        mentor_proposals: {
          where: {
            selected: true,
          },
          take: 1,
          select: {
            acceptanceMessage: true,
            mentorUuid: true,
          },
        },
        studentProfileUuids: true,
      },
    })) as ProposalWithRelations | null;

    console.log("Database query result:", {
      found: !!result,
      proposal: result || "null",
    });

    if (!result) {
      console.log("Proposal not found:", uuid);
      return NextResponse.json(
        { data: null, error: "Proposal not found" },
        { status: 404 }
      );
    }

    // Transform the data
    const transformedData: TransformedProposalData = {
      // Basic proposal info
      offeringType: result.offeringType || null,
      pitchDescription: result.goals || null,
      topic: result.topics?.name || null,

      // Selections and preferences
      addOnSelections: result.addOnSelections || [],
      engagementGoals: result.engagementGoals || [],
      studentArchetypes: result.studentArchetypes || [],
      availabilityNotes: result.availabilityNotes || null,
      successMetrics: result.successMetrics || [],

      // Mentor information
      acceptanceMessage: result.mentor_proposals[0]?.acceptanceMessage || null,
      mentorBio: null,

      // Student information
      studentProfile: null,
      meetingTranscript: null,
    };

    // If we need mentor profile info, make a separate query
    if (result?.mentor_proposals[0]?.mentorUuid) {
      const mentorProfile = await prisma.mentor_profiles.findFirst({
        where: {
          userUuid: result.mentor_proposals[0].mentorUuid,
        },
        select: {
          biography: true,
        },
      });

      // Update the transformed data with mentor bio
      transformedData.mentorBio = mentorProfile?.biography || null;
    }

    // If there's a student profile UUID, fetch it separately
    if (result?.studentProfileUuids?.[0]) {
      const studentProfile = await prisma.student_profiles.findUnique({
        where: {
          uuid: result.studentProfileUuids[0],
        },
        select: {
          profileText: true,
        },
      });

      // Separate query for submissions with explicit ordering
      const submissions = await prisma.student_profile_submissions.findFirst({
        where: {
          studentProfileUuid: result.studentProfileUuids[0],
        },
        orderBy: {
          createdAt: "desc", // Order by creation date descending to get the latest
        },
        select: {
          meetingTranscript: true,
        },
      });

      // Update transformed data
      transformedData.studentProfile = studentProfile?.profileText || null;
      transformedData.meetingTranscript =
        submissions?.meetingTranscript || null;
    }

    return NextResponse.json({ data: transformedData, error: null });
  } catch (error) {
    console.error("Error in proposal API route:", {
      error,
      stack: error instanceof Error ? error.stack : undefined,
      url: req.url,
    });
    return NextResponse.json(
      { data: null, error: "Failed to fetch proposal" },
      { status: 500 }
    );
  }
}
