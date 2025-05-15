
"use server";

import { getImdbRating, type GetImdbRatingInput, type GetImdbRatingOutput } from "@/ai/flows/get-imdb-rating";
import { getRottenTomatoesRating, type GetRottenTomatoesRatingInput, type GetRottenTomatoesRatingOutput } from "@/ai/flows/get-rotten-tomatoes-rating";

export interface MovieRatings {
  title: string;
  imdbRating: string;
  rottenTomatoesRating: string;
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

    // Fetch ratings in parallel
    const [imdbResponse, rottenTomatoesResponse] = await Promise.all([
      getImdbRating(imdbInput),
      getRottenTomatoesRating(rottenTomatoesInput),
    ]);

    const imdbRating = (imdbResponse as GetImdbRatingOutput)?.imdbRating || "N/A";
    const rottenTomatoesRating = (rottenTomatoesResponse as GetRottenTomatoesRatingOutput)?.rottenTomatoesRating || "N/A";
    
    return {
      data: {
        title: movieTitle,
        imdbRating,
        rottenTomatoesRating,
      },
    };
  } catch (e) {
    console.error("Error fetching movie ratings:", e);
    // Check if e is an instance of Error to safely access e.message
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred while fetching ratings.";
    return { error: `Failed to fetch ratings: ${errorMessage}` };
  }
}
