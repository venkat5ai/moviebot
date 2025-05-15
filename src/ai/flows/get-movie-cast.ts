
'use server';
/**
 * @fileOverview Retrieves the lead cast (actor and actress) for a given movie title.
 *
 * - getMovieCast - A function that retrieves the lead cast for a movie.
 * - GetMovieCastInput - The input type for the getMovieCast function.
 * - GetMovieCastOutput - The return type for the getMovieCast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetMovieCastInputSchema = z.object({
  movieTitle: z.string().describe('The title of the movie to search for.'),
});
export type GetMovieCastInput = z.infer<typeof GetMovieCastInputSchema>;

const GetMovieCastOutputSchema = z.object({
  leadActor: z
    .string()
    .describe('The name of the lead actor. Returns N/A if not available or not applicable.'),
  leadActress: z
    .string()
    .describe('The name of the lead actress. Returns N/A if not available or not applicable.'),
});
export type GetMovieCastOutput = z.infer<typeof GetMovieCastOutputSchema>;

export async function getMovieCast(input: GetMovieCastInput): Promise<GetMovieCastOutput> {
  return getMovieCastFlow(input);
}

const getMovieCastTool = ai.defineTool({
  name: 'getMovieCast',
  description: 'Retrieves the lead actor and actress for a given movie title and provides it in a structured JSON format.',
  inputSchema: GetMovieCastInputSchema,
  outputSchema: GetMovieCastOutputSchema,
},
async (input: GetMovieCastInput): Promise<GetMovieCastOutput> => {
  const titleLower = input.movieTitle.toLowerCase();
  // Placeholder data for demonstration. A real implementation would query an API.
  if (titleLower.includes('inception')) {
    return { leadActor: 'Leonardo DiCaprio', leadActress: 'Elliot Page' };
  } else if (titleLower.includes('iron man')) {
    return { leadActor: 'Robert Downey Jr.', leadActress: 'Gwyneth Paltrow' };
  } else if (titleLower.includes('hercules') && titleLower.includes('disney')) { // More specific for Disney's Hercules
    return { leadActor: 'Tate Donovan (voice)', leadActress: 'Susan Egan (voice)'};
  } else if (titleLower.includes('the matrix')) {
    return { leadActor: 'Keanu Reeves', leadActress: 'Carrie-Anne Moss'};
  } else if (titleLower.includes('titanic')) {
    return { leadActor: 'Leonardo DiCaprio', leadActress: 'Kate Winslet'};
  }
  return { leadActor: 'N/A', leadActress: 'N/A' };
});

const prompt = ai.definePrompt({
  name: 'getMovieCastPrompt',
  input: {schema: GetMovieCastInputSchema},
  output: {schema: GetMovieCastOutputSchema},
  tools: [getMovieCastTool],
  prompt: `You must use the 'getMovieCast' tool to find the lead actor and lead actress for the movie "{{movieTitle}}".
The tool will return the data in the required JSON object format.
Your response should be ONLY the JSON object returned by the tool. Do not add any other text or explanation.
If the movie is animated, the tool may provide voice actors.
If specific lead actor/actress information is not applicable or easily discernible (e.g., ensemble cast with no clear single leads as per the tool's output), the tool will return "N/A".
Ensure your output strictly adheres to the tool's JSON structure: {"leadActor": "...", "leadActress": "..."}.`,
});

const getMovieCastFlow = ai.defineFlow(
  {
    name: 'getMovieCastFlow',
    inputSchema: GetMovieCastInputSchema,
    outputSchema: GetMovieCastOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!; // Trust the tool and prompt to return the correct structure
  }
);
