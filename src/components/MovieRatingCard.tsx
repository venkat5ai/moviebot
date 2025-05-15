
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Star, Award } from "lucide-react"; // Using Award as a stand-in for Rotten Tomatoes icon
import type { MovieRatings } from "@/app/actions";

export default function MovieRatingCard({ title, imdbRating, rottenTomatoesRating }: MovieRatings) {
  return (
    <Card className="w-full shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-3xl font-semibold text-primary">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground pt-1">Rating details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Star className="h-7 w-7 text-yellow-500" />
            <span className="text-lg font-medium text-secondary-foreground">IMDb Rating</span>
          </div>
          <span className={`text-2xl font-bold ${imdbRating === "N/A" ? "text-muted-foreground" : "text-primary"}`}>
            {imdbRating}
          </span>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
          <div className="flex items-center space-x-2">
            {/* Using Award icon as a placeholder for Rotten Tomatoes. Could be text or a custom SVG. */}
            {/* For simplicity, showing a tomato-like color for the icon. */}
            <Award className="h-7 w-7 text-red-600" />
            <span className="text-lg font-medium text-secondary-foreground">Rotten Tomatoes</span>
          </div>
          <span className={`text-2xl font-bold ${rottenTomatoesRating === "N/A" ? "text-muted-foreground" : "text-accent"}`}>
            {rottenTomatoesRating}
          </span>
        </div>
        
        {(imdbRating === "N/A" && rottenTomatoesRating === "N/A") && (
            <p className="text-center text-muted-foreground pt-2">
                Ratings for this movie are not yet available.
            </p>
        )}
      </CardContent>
    </Card>
  );
}
