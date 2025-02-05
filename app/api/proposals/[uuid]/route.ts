import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    console.log("Database query result:", {
      found: !!proposal,
      proposal: proposal || "null",
    });

    if (!proposal) {
      console.log("Proposal not found:", uuid);
      return NextResponse.json(
        { data: null, error: "Proposal not found" },
        { status: 404 }
      );
    }

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
    };

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
