/**
 * @fileOverview Zod schemas for the study plan generation flow.
 */
import {z} from 'genkit';

export const GenerateStudyPlanInputSchema = z.object({
  focusAreas: z.string().describe('A comma-separated string of the main syllabus subjects or topics the user wants to focus on.'),
  timeframe: z.string().describe('The total duration for the study plan (e.g., "This Week", "Next Month", "For Today").'),
  hoursPerWeek: z.number().describe('The total number of hours the user can study per week.'),
  syllabusContext: z.string().describe('A text representation of the entire syllabus tree, including user-defined mastery levels for each topic (e.g., "[id] [Mastery: novice] Title").'),
});

export const DailyTaskSchema = z.object({
  topicId: z.string().describe('The unique ID of the syllabus topic this task refers to. This ID must come from the provided syllabus context.'),
  duration: z.string().describe('Suggested time allocation for the task (e.g., "2h", "45m", "10 hours this week").'),
  topic: z.string().describe('The specific syllabus topic or concept to study.'),
  activity: z.enum(['Study', 'Revise', 'Practice', 'Test', 'Weekly Revision', 'Analyze Test']).describe('The type of activity to perform.'),
  suggestion: z.string().describe("A brief, actionable suggestion for the activity, e.g., 'GS-II Notes' or 'Focus on PYQs'. Include the GS Paper number if applicable."),
});

export const DailyPlanSchema = z.object({
    day: z.string().describe('The day for this part of the plan, formatted as "Day X" where X is the absolute day number (e.g., "Day 1", "Day 8").'),
    tasks: z.array(DailyTaskSchema).describe('A list of tasks scheduled for that day.'),
});

export const WeeklyFocusSchema = z.object({
    week: z.number().describe('The week number this focus applies to.'),
    focus: z.string().describe('A concise summary of the main topics and goals for this week.'),
});

export const MetaPlanSchema = z.object({
    weeklyPlan: z.array(WeeklyFocusSchema),
});

export const GenerateStudyPlanOutputSchema = z.object({
  plan: z.array(DailyPlanSchema).describe('A breakdown of the study plan, corresponding to the requested timeframe.'),
  summary: z.string().describe('A brief, encouraging summary of the generated plan.'),
});
