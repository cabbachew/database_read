export const PROMPT_TEMPLATES = {
  overview: `Given the following context about a student and their engagement, generate three distinct sections for a learning plan overview that matches this exact structure:

{
  studentBlurb: string,   // About the student
  engagementBlurb: string,  // About the engagement
  mentorFitBlurb: string  // About the mentor fit
}

Requirements for student blurb:
- Include name, grade, school, location
- Describe personality traits and learning style
- List relevant activities and interests
- Note strengths and areas for growth
- Consider archetype implications for mentorship approach
- Focus on what mentor needs to know
- Keep tone positive but realistic

Requirements for engagement blurb:
- Explain engagement type naturally (avoid internal terms)
- Show how it addresses student's needs
- Include realistic scope for evaluation period
- Connect to longer-term objectives
- Consider grade level and experience
- Make actionable for mentors

Requirements for mentor fit blurb:
- Highlight relevant mentor experience
- Connect mentor background to student goals
- Show understanding of student's needs
- Keep focused on value to student

Context:
Student Profile: {profileText}
Archetype(s): {archetypes}
Consultation Notes: {consultationNotes}
Offering Type: {offeringType}
Add-ons: {addOns}
Topic: {topic}
Goals: {goals}
Mentor Message: {mentorMessage}
Mentor Bio: {mentorBio}

Format the response as a valid JSON object with the three required string fields.`,

  synthesizedGoal: `Generate a structured goal hierarchy for a learning plan that exactly matches this structure:

{
  highLevelGoal: string,
  subGoals: Array<{
    title: string,
    items: string[]
  }>
}

Requirements:
- High-level goal should be ambitious but achievable
- Each sub-goal should have a clear focus area
- Items should be specific and measurable
- Consider student's grade level and experience
- Account for evaluation period timeline
- Align with our goal taxonomy
- Balance short and long-term objectives
- Sequence from foundational to advanced
- 3-4 sub-goals maximum
- 2-4 specific items per sub-goal

Relevant taxonomy and guidelines:
{goalTaxonomy}

Context:
Success Metrics: {successMetrics}
Engagement Goals: {engagementGoals}
Student Grade: {grade}
Core Offering: {offeringType}
Add-ons: {addOns}

Format the response as a valid JSON object matching the specified structure exactly.`,

  sessionStructure: `Generate a session structure for a learning plan that exactly matches this format:

{
  firstSessionAgenda: Array<{
    title: string,  // Must include time allocation
    items: string[]
  }>,
  generalSessionAgenda: Array<{
    title: string,  // Must include time allocation
    items: string[]
  }>
}

Requirements for first session:
- Follow 15/30-40/5-10 minute time blocks
- Focus on rapport building and goal setting
- Include systems setup and documentation
- Adapt based on offering type
- Set clear next steps
- Must reference CC Notetaker setup
- Consider student's personality and comfort level

Requirements for general sessions:
- Follow 5-10/40-50/5-10 minute time blocks
- Include progress checks and updates
- Focus on skill development and project work
- Build in reflection and planning
- Maintain consistent structure
- Allow for flexibility in core work period

Context:
Offering Type: {offeringType}
Add-ons: {addOns}
Student Personality: {studentPersonality}
Goals: {goals}

Format the response as a valid JSON object matching the specified structure exactly.`,

  roadmap: `Generate a dual-view roadmap for a learning plan that exactly matches this structure:

{
  monthlyRoadmap: Array<{
    title: string,
    items: string[]
  }>,
  weeklyRoadmap: Array<{
    title: string,
    items: string[]
  }>
}

Requirements for monthly roadmap:
- Start with 3 months minimum
- Titles should reflect progression (Foundation → Development → Advancement)
- Items should be concrete and measurable
- Show clear progression of difficulty
- Account for evaluation period
- Build towards longer-term success
- Include checkpoints and milestones

Requirements for weekly roadmap:
- Cover first 12 sessions (6 two-session blocks)
- Show granular progression
- Connect to monthly objectives
- Include specific deliverables
- Balance structure with flexibility
- Consider student's pace and style

Context:
Offering Type: {offeringType}
Add-ons: {addOns}
Goals: {goals}
Engagement Goals: {engagementGoals}
Student Grade: {grade}
Student Archetypes: {archetypes}

Format the response as a valid JSON object matching the specified structure exactly.`,
};
