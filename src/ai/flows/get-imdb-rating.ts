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
  description: 'Retrieves the IMDB rating for a given movie title and provides it in a structured JSON format.',
  inputSchema: GetImdbRatingInputSchema, // Use the existing input schema
  outputSchema: GetImdbRatingOutputSchema, // Tool now outputs the final JSON object
},
async (input: GetImdbRatingInput): Promise<GetImdbRatingOutput> => {
  let ratingValue: string;
  // In a real implementation, this would call an external API
  // to fetch the IMDB rating for the given movie title.
  // For this example, we'll just return a placeholder value.
  if (input.movieTitle.toLowerCase().includes('example')) {
    ratingValue = '7.5';
  } else if (input.movieTitle.toLowerCase().includes('unavailable')) {
    ratingValue = 'N/A';
  } else {
    // For any other movie title, return a placeholder rating.
    // A real implementation would query an API here.
    ratingValue = '8.0'; 
  }
  return { imdbRating: ratingValue }; // Tool returns the complete object
});

const prompt = ai.definePrompt({
  name: 'getImdbRatingPrompt',
  input: {schema: GetImdbRatingInputSchema},
  output: {schema: GetImdbRatingOutputSchema}, // This aligns with the tool's output
  tools: [getImdbRatingTool],
  prompt: `You must use the 'getImdbRating' tool to find the IMDB rating for the movie "{{movieTitle}}".
The tool will return the data in the required JSON object format.
Your response should be ONLY the JSON object returned by the tool. Do not add any other text or explanation.`,
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
