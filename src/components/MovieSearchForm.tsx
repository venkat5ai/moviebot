
"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

interface MovieSearchFormProps {
  onSearch: (movieTitle: string) => void;
  isLoading: boolean;
}

export default function MovieSearchForm({ onSearch, isLoading }: MovieSearchFormProps) {
  const [movieTitle, setMovieTitle] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (movieTitle.trim()) {
      onSearch(movieTitle.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2 p-1 bg-card rounded-lg shadow-md">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Enter movie title (e.g., Inception)"
          value={movieTitle}
          onChange={(e) => setMovieTitle(e.target.value)}
          className="pl-10 pr-2 py-3 text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={isLoading}
          aria-label="Movie Title"
        />
      </div>
      <Button type="submit" disabled={isLoading || !movieTitle.trim()} className="bg-accent hover:bg-accent/90 text-accent-foreground">
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Search className="h-5 w-5 md:mr-2" />
        )}
        <span className="hidden md:inline">Search</span>
      </Button>
    </form>
  );
}
