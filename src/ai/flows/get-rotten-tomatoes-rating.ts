'use server';
/**
 * @fileOverview Retrieves the Rotten Tomatoes rating for a given movie title.
 *
 * - getRottenTomatoesRating - A function that retrieves the Rotten Tomatoes rating for a movie.
 * - GetRottenTomatoesRatingInput - The input type for the getRottenTomatoesRating function.
 * - GetRottenTomatoesRatingOutput - The return type for the getRottenTomatoesRating function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetRottenTomatoesRatingInputSchema = z.object({
  movieTitle: z.string().describe('The title of the movie to search for.'),
});
export type GetRottenTomatoesRatingInput = z.infer<typeof GetRottenTomatoesRatingInputSchema>;

const GetRottenTomatoesRatingOutputSchema = z.object({
  rottenTomatoesRating: z
    .string()
    .describe('The Rotten Tomatoes rating for the movie, or N/A if not available.'),
});
export type GetRottenTomatoesRatingOutput = z.infer<typeof GetRottenTomatoesRatingOutputSchema>;

export async function getRottenTomatoesRating(input: GetRottenTomatoesRatingInput): Promise<GetRottenTomatoesRatingOutput> {
  return getRottenTomatoesRatingFlow(input);
}

const getRottenTomatoesRatingPrompt = ai.definePrompt({
  name: 'getRottenTomatoesRatingPrompt',
  input: {schema: GetRottenTomatoesRatingInputSchema},
  output: {schema: GetRottenTomatoesRatingOutputSchema},
  prompt: `What is the Rotten Tomatoes rating for the movie "{{movieTitle}}"? If the rating is not available, respond with N/A.`,
});

const getRottenTomatoesRatingFlow = ai.defineFlow(
  {
    name: 'getRottenTomatoesRatingFlow',
    inputSchema: GetRottenTomatoesRatingInputSchema,
    outputSchema: GetRottenTomatoesRatingOutputSchema,
  },
  async input => {
    const {output} = await getRottenTomatoesRatingPrompt(input);
    return output!;
  }
);
