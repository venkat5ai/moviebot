'use server';
/**
 * @fileOverview Provides movie title suggestions based on a partial query.
 *
 * - getMovieSuggestions - A function that retrieves movie suggestions.
 * - GetMovieSuggestionsInput - The input type for the getMovieSuggestions function.
 * - GetMovieSuggestionsOutput - The return type for the getMovieSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetMovieSuggestionsInputSchema = z.object({
  query: z.string().describe('The partial movie title to search for.'),
});
export type GetMovieSuggestionsInput = z.infer<typeof GetMovieSuggestionsInputSchema>;

const GetMovieSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of movie title suggestions. Return up to 5 suggestions. If no suggestions, return an empty array.'),
});
export type GetMovieSuggestionsOutput = z.infer<typeof GetMovieSuggestionsOutputSchema>;

export async function getMovieSuggestions(input: GetMovieSuggestionsInput): Promise<GetMovieSuggestionsOutput> {
  return getMovieSuggestionsFlow(input);
}

const getMovieSuggestionsPrompt = ai.definePrompt({
  name: 'getMovieSuggestionsPrompt',
  input: {schema: GetMovieSuggestionsInputSchema},
  output: {schema: GetMovieSuggestionsOutputSchema},
  prompt: `Based on the query "{{query}}", provide up to 5 movie title suggestions that are likely matches.
  Examples:
  - query: "star w" -> suggestions: ["Star Wars: A New Hope", "Star Wars: The Empire Strikes Back", "Star Trek", "Stargate"]
  - query: "bat" -> suggestions: ["Batman Begins", "The Batman", "Batman v Superman: Dawn of Justice", "Battlefield Earth"]
  - query: "lord of the r" -> suggestions: ["The Lord of the Rings: The Fellowship of the Ring", "The Lord of the Rings: The Two Towers", "The Lord of the Rings: The Return of the King"]
  If no relevant suggestions can be found, or the query is too vague, return an empty array for suggestions.
  Provide only actual movie titles. Ensure the suggestions are diverse if possible.
  Return the suggestions in a JSON object with a "suggestions" key containing an array of strings.`,
});

const getMovieSuggestionsFlow = ai.defineFlow(
  {
    name: 'getMovieSuggestionsFlow',
    inputSchema: GetMovieSuggestionsInputSchema,
    outputSchema: GetMovieSuggestionsOutputSchema,
  },
  async (input: GetMovieSuggestionsInput): Promise<GetMovieSuggestionsOutput> => {
    // Do not attempt to get suggestions for very short queries to save resources
    // and avoid irrelevant suggestions.
    if (!input.query || input.query.trim().length < 2) {
      return { suggestions: [] };
    }
    const {output} = await getMovieSuggestionsPrompt(input);
    // Ensure that we always return an object with a suggestions array, even if the LLM fails.
    return output || { suggestions: [] };
  }
);
