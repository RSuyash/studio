'use server';

import { pool } from '@/lib/db';
import type { StudyPlanData, StudyPlanInput } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function saveStudyPlan(
  name: string,
  planData: StudyPlanData,
  inputDetails: StudyPlanInput
) {
  if (!pool) {
    throw new Error('Database not connected. Cannot save plan.');
  }
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO study_plans (name, input_details, plan_data)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;
    const result = await client.query(query, [name, inputDetails, planData]);
    
    // Revalidate the path to show the new plan in the list
    revalidatePath('/');

    return { success: true, id: result.rows[0].id };
  } catch (error) {
    console.error('Failed to save study plan:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown database error occurred.';
    return { success: false, error: errorMessage };
  } finally {
    client.release();
  }
}
