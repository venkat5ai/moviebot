
"use server";

import { getImdbRating, type GetImdbRatingInput, type GetImdbRatingOutput } from "@/ai/flows/get-imdb-rating";
import { getRottenTomatoesRating, type GetRottenTomatoesRatingInput, type GetRottenTomatoesRatingOutput } from "@/ai/flows/get-rotten-tomatoes-rating";
import { getMovieSuggestions, type GetMovieSuggestionsInput, type GetMovieSuggestionsOutput } from "@/ai/flows/get-movie-suggestions";
import { getMovieCast, type GetMovieCastInput, type GetMovieCastOutput } from "@/ai/flows/get-movie-cast";


export interface MovieRatings {
  title: string;
  imdbRating: string;
  rottenTomatoesRating: string;
  leadActor: string;
  leadActress: string;
}

export interface FetchMovieRatingsResult {
  data?: MovieRatings;
  error?: string;
}

export async function fetchMovieRatingsAction(movieTitle: string): Promise<FetchMovieRatingsResult> {
  if (!movieTitle || movieTitle.trim() === "") {
    return { error: "Movie title cannot be empty." };
  }

  try {
    const imdbInput: GetImdbRatingInput = { movieTitle };
    const rottenTomatoesInput: GetRottenTomatoesRatingInput = { movieTitle };
    const castInput: GetMovieCastInput = { movieTitle };

    // Fetch ratings and cast in parallel
    const [imdbResponse, rottenTomatoesResponse, castResponse] = await Promise.all([
      getImdbRating(imdbInput),
      getRottenTomatoesRating(rottenTomatoesInput),
      getMovieCast(castInput),
    ]);

    const imdbRating = (imdbResponse as GetImdbRatingOutput)?.imdbRating || "N/A";
    const rottenTomatoesRating = (rottenTomatoesResponse as GetRottenTomatoesRatingOutput)?.rottenTomatoesRating || "N/A";
    const leadActor = (castResponse as GetMovieCastOutput)?.leadActor || "N/A";
    const leadActress = (castResponse as GetMovieCastOutput)?.leadActress || "N/A";
    
    return {
      data: {
        title: movieTitle,
        imdbRating,
        rottenTomatoesRating,
        leadActor,
        leadActress,
      },
    };
  } catch (e) {
    console.error("Error fetching movie ratings/cast:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred while fetching details.";
    return { error: `Failed to fetch details: ${errorMessage}` };
  }
}

export interface FetchMovieSuggestionsResult {
  suggestions?: string[];
  error?: string;
}

export async function fetchMovieSuggestionsAction(query: string): Promise<FetchMovieSuggestionsResult> {
  if (!query || query.trim().length < 2) { // Minimum query length for suggestions
    return { suggestions: [] };
  }
  try {
    const input: GetMovieSuggestionsInput = { query };
    const response = await getMovieSuggestions(input);
    return { suggestions: (response as GetMovieSuggestionsOutput)?.suggestions || [] };
  } catch (e) {
    console.error("Error fetching movie suggestions:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred while fetching suggestions.";
    return { error: `Failed to fetch suggestions: ${errorMessage}` };
  }
}
