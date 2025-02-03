import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { pathname } = new URL(request.url);
    const uuid = pathname.split("/").pop();

    if (!uuid) {
      return NextResponse.json(
        { data: null, error: "UUID parameter is required" },
        { status: 400 }
      );
    }

    const proposal = await prisma.engagement_proposals.findUnique({
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
          },
        },
        studentProfileUuids: true,
      },
    });

    if (!proposal) {
      return NextResponse.json(
        { data: null, error: "Proposal not found" },
        { status: 404 }
      );
    }

    // Get student profile data
    const studentProfile = proposal.studentProfileUuids?.[0]
      ? await prisma.student_profiles.findUnique({
          where: {
            uuid: proposal.studentProfileUuids[0],
          },
          select: {
            profileText: true,
          },
        })
      : null;

    // Get meeting transcript

    const submission = proposal.studentProfileUuids?.[0]
      ? await prisma.student_profile_submissions.findFirst({
          where: {
            studentProfileUuid: proposal.studentProfileUuids[0],
            meetingTranscript: {
              not: null,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            meetingTranscript: true,
          },
        })
      : null;

    console.log("Found submission:", submission);

    const transformedData = {
      offeringType: proposal.offeringType || null,
      pitchDescription: proposal.goals || null,
      topic: proposal.topics?.name || null,
      addOnSelections: proposal.addOnSelections || [],
      engagementGoals: proposal.engagementGoals || [],
      studentArchetypes: proposal.studentArchetypes || [],
      availabilityNotes: proposal.availabilityNotes || null,
      successMetrics: proposal.successMetrics || [],
      acceptanceMessage:
        proposal.mentor_proposals[0]?.acceptanceMessage || null,
      profileText: studentProfile?.profileText || null,
      meetingTranscript: submission?.meetingTranscript || null,
    };

    return NextResponse.json({ data: transformedData, error: null });
  } catch (error) {
    console.error("Error fetching proposal:", error);
    return NextResponse.json(
      { data: null, error: "Failed to fetch proposal" },
      { status: 500 }
    );
  }
}
