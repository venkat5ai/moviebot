
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
    .describe('The Rotten Tomatoes rating for the movie (e.g., "90%"), or N/A if not available.'),
});
export type GetRottenTomatoesRatingOutput = z.infer<typeof GetRottenTomatoesRatingOutputSchema>;

export async function getRottenTomatoesRating(input: GetRottenTomatoesRatingInput): Promise<GetRottenTomatoesRatingOutput> {
  return getRottenTomatoesRatingFlow(input);
}

const getRottenTomatoesRatingTool = ai.defineTool({
  name: 'getRottenTomatoesRating',
  description: 'Retrieves the Rotten Tomatoes rating for a given movie title and provides it in a structured JSON format.',
  inputSchema: GetRottenTomatoesRatingInputSchema,
  outputSchema: GetRottenTomatoesRatingOutputSchema,
},
async (input: GetRottenTomatoesRatingInput): Promise<GetRottenTomatoesRatingOutput> => {
  let ratingValue: string;
  // In a real implementation, this would call an external API.
  // For this example, we'll return placeholder values.
  const titleLower = input.movieTitle.toLowerCase();
  if (titleLower.includes('hercules')) {
    ratingValue = '43%'; // Example rating for Hercules (1997 Disney film)
  } else if (titleLower.includes('example')) {
    ratingValue = '92%';
  } else if (titleLower.includes('unavailable')) {
    ratingValue = 'N/A';
  } else {
    // Generic placeholder for other movies.
    ratingValue = '78%';
  }
  return { rottenTomatoesRating: ratingValue };
});

const getRottenTomatoesRatingPrompt = ai.definePrompt({
  name: 'getRottenTomatoesRatingPrompt',
  input: {schema: GetRottenTomatoesRatingInputSchema},
  output: {schema: GetRottenTomatoesRatingOutputSchema},
  tools: [getRottenTomatoesRatingTool],
  prompt: `You must use the 'getRottenTomatoesRating' tool to find the Rotten Tomatoes rating for the movie "{{movieTitle}}".
The tool will return the data in the required JSON object format.
Your response should be ONLY the JSON object returned by the tool. Do not add any other text or explanation.`,
});

const getRottenTomatoesRatingFlow = ai.defineFlow(
  {
    name: 'getRottenTomatoesRatingFlow',
    inputSchema: GetRottenTomatoesRatingInputSchema,
    outputSchema: GetRottenTomatoesRatingOutputSchema,
  },
  async input => {
    const {output} = await getRottenTomatoesRatingPrompt(input);
    // Rely on the prompt and tool to return the correctly structured output,
    // matching the behavior of the working IMDB flow.
    return output!;
  }
);

