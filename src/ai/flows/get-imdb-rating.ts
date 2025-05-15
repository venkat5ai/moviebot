'use server';
/**
 * @fileOverview Retrieves the IMDB rating for a given movie title.
 *
 * - getImdbRating - A function that retrieves the IMDB rating for a movie.
 * - GetImdbRatingInput - The input type for the getImdbRating function.
 * - GetImdbRatingOutput - The return type for the getImdbRating function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetImdbRatingInputSchema = z.object({
  movieTitle: z.string().describe('The title of the movie to search for.'),
});
export type GetImdbRatingInput = z.infer<typeof GetImdbRatingInputSchema>;

const GetImdbRatingOutputSchema = z.object({
  imdbRating: z
    .string()
    .describe('The IMDB rating of the movie. Returns N/A if not available.'),
});
export type GetImdbRatingOutput = z.infer<typeof GetImdbRatingOutputSchema>;

export async function getImdbRating(input: GetImdbRatingInput): Promise<GetImdbRatingOutput> {
  return getImdbRatingFlow(input);
}

const getImdbRatingTool = ai.defineTool({
  name: 'getImdbRating',
  description: 'Retrieves the IMDB rating for a given movie title.',
  inputSchema: z.object({
    movieTitle: z.string().describe('The title of the movie to search for.'),
  }),
  outputSchema: z.string(),
},
async (input) => {
  // In a real implementation, this would call an external API
  // to fetch the IMDB rating for the given movie title.
  // For this example, we'll just return a placeholder value.
  if (input.movieTitle.toLowerCase().includes('example')) {
    return '7.5';
  }
  if (input.movieTitle.toLowerCase().includes('unavailable')) {
    return 'N/A';
  }
  return '8.0';
});

const prompt = ai.definePrompt({
  name: 'getImdbRatingPrompt',
  input: {schema: GetImdbRatingInputSchema},
  output: {schema: GetImdbRatingOutputSchema},
  tools: [getImdbRatingTool],
  prompt: `What is the IMDB rating for the movie "{{movieTitle}}"? Use the getImdbRating tool to find the rating. If the rating is not available, respond with N/A.

Respond in the following format:
\{
  "imdbRating": "<rating>"
\}
`,
});

const getImdbRatingFlow = ai.defineFlow(
  {
    name: 'getImdbRatingFlow',
    inputSchema: GetImdbRatingInputSchema,
    outputSchema: GetImdbRatingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
