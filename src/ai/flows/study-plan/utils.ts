/**
 * @fileOverview Utility functions for the study plan generation flow.
 */

/**
 * A helper function to parse a human-readable timeframe string into a total number of days.
 * @param timeframe The string to parse (e.g., "Next Month", "2 Years").
 * @returns The total number of days.
 */
export function getTimeframeInDays(timeframe: string): number {
    const lower = timeframe.toLowerCase();
    const numMatch = lower.match(/(\d+)/);
    const num = numMatch ? parseInt(numMatch[0], 10) : 1;

    if (lower.includes("today")) return 1;
    if (lower.includes("tomorrow")) return 1;
    if (lower.includes("week")) return num * 7;
    if (lower.includes("month")) return num * 30;
    if (lower.includes("year")) return num * 365;

    return 7; // Default to 7 days if no match
}
