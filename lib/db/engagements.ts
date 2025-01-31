import { prisma } from "@/lib/prisma";
export async function getEngagementData(uuid: string) {
  try {
    const result = await prisma.engagement_proposals.findUnique({
      where: {
        uuid: uuid,
      },
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

    if (!result) {
      return null;
    }

    // Get student profile data in a separate query if studentProfileUuids exists
    const studentProfile = result.studentProfileUuids?.[0]
      ? await prisma.student_profiles.findUnique({
          where: {
            uuid: result.studentProfileUuids[0],
          },
          select: {
            profileText: true,
          },
        })
      : null;

    // Separate query for submissions if needed
    const submission = result.studentProfileUuids?.[0]
      ? await prisma.student_profile_submissions.findFirst({
          where: {
            studentProfileUuid: result.studentProfileUuids[0],
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            meetingTranscript: true,
          },
        })
      : null;

    return {
      offeringType: result.offeringType || null,
      pitchDescription: result.goals || null,
      topic: result.topics?.name || null,
      addOnSelections: result.addOnSelections || [],
      engagementGoals: result.engagementGoals || [],
      studentArchetypes: result.studentArchetypes || [],
      availabilityNotes: result.availabilityNotes || null,
      successMetrics: result.successMetrics || [],
      acceptanceMessage: result.mentor_proposals[0]?.acceptanceMessage || null,
      profileText: studentProfile?.profileText || null,
      meetingTranscript: submission?.meetingTranscript || null,
    };
  } catch (error) {
    console.error("Database query error:", error);
    throw new Error("Failed to fetch engagement data");
  }
}
