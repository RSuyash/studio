'use server';
/**
 * @fileOverview The public interface for the study plan generation flow.
 *
 * This file exports:
 * - generateStudyPlan: The main function to call to generate a study plan.
 * - GenerateStudyPlanInput: The Zod type for the input.
 * - GenerateStudyPlanOutput: The Zod type for the output.
 */

import {z} from 'genkit';
import { GenerateStudyPlanInputSchema, GenerateStudyPlanOutputSchema } from './schemas';
import { createStudyPlanFlow } from './flow';

// Export the types for use in the frontend.
export type GenerateStudyPlanInput = z.infer<typeof GenerateStudyPlanInputSchema>;
export type GenerateStudyPlanOutput = z.infer<typeof GenerateStudyPlanOutputSchema>;

/**
 * Generates an actionable, scheduled study plan by orchestrating a chunked generation process.
 * @param input The details for the plan to be generated.
 * @returns A promise that resolves to the complete study plan.
 */
export async function generateStudyPlan(input: GenerateStudyPlanInput): Promise<GenerateStudyPlanOutput> {
  return createStudyPlanFlow(input);
}
