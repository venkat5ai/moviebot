
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Star, Award, User } from "lucide-react"; 
import type { MovieRatings } from "@/app/actions";
import { Separator } from "@/components/ui/separator";

export default function MovieRatingCard({ title, imdbRating, rottenTomatoesRating, leadActor, leadActress }: MovieRatings) {
  const showCast = (leadActor && leadActor !== "N/A") || (leadActress && leadActress !== "N/A");

  return (
    <Card className="w-full shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-3xl font-semibold text-primary">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground pt-1">Rating & Cast Details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg mb-4">
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
              <Award className="h-7 w-7 text-red-600" />
              <span className="text-lg font-medium text-secondary-foreground">Rotten Tomatoes</span>
            </div>
            <span className={`text-2xl font-bold ${rottenTomatoesRating === "N/A" ? "text-muted-foreground" : "text-accent"}`}>
              {rottenTomatoesRating}
            </span>
          </div>
          
          {(imdbRating === "N/A" && rottenTomatoesRating === "N/A" && !showCast) && (
              <p className="text-center text-muted-foreground pt-4">
                  Details for this movie are not yet available.
              </p>
          )}
        </div>

        {showCast && (
          <div>
            <Separator className="my-4" />
            <h3 className="text-xl font-semibold text-primary mb-3">Lead Cast</h3>
            <div className="space-y-3">
              {leadActor && leadActor !== "N/A" && (
                <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                  <User className="h-6 w-6 text-primary mr-3" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Lead Actor</p>
                    <p className="text-md font-semibold text-secondary-foreground">{leadActor}</p>
                  </div>
                </div>
              )}
              {leadActress && leadActress !== "N/A" && (
                <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                  <User className="h-6 w-6 text-pink-500 mr-3" /> 
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Lead Actress</p>
                    <p className="text-md font-semibold text-secondary-foreground">{leadActress}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
         {(imdbRating === "N/A" && rottenTomatoesRating === "N/A" && !showCast) && (
            <p className="text-center text-muted-foreground pt-2">
                Ratings and cast for this movie are not yet available.
            </p>
        )}
      </CardContent>
    </Card>
  );
}
