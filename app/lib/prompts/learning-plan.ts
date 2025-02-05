export const PROMPT_TEMPLATES = {
  // ... existing prompts ...

  requirements: `Generate a list of requirements for a learning plan that matches this structure:

{
  requirements: string[]
}

Requirements should include:
- Essential tools and systems (always include CC Notetaker)
- Required materials and resources
- Documentation needs
- Access requirements
- Time commitments and availability
- Project-specific requirements
- Add-on specific requirements

Context:
Offering Type: {offeringType}
Add-ons: {addOns}
Availability Notes: {availabilityNotes}
Topic: {topic}
Goals: {goals}

Format the response as a valid JSON object with a single "requirements" array of strings.`,
};
