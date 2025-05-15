
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from "@/components/ui/popover";
import { fetchMovieSuggestionsAction, type FetchMovieSuggestionsResult } from "@/app/actions";

interface MovieSearchFormProps {
  onSearch: (movieTitle: string) => void;
  isLoading: boolean;
}

export default function MovieSearchForm({ onSearch, isLoading }: MovieSearchFormProps) {
  const [movieTitle, setMovieTitle] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestionsPopover, setShowSuggestionsPopover] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setMovieTitle(newTitle);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (newTitle.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestionsPopover(false);
      setIsLoadingSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    // No need to setShowSuggestionsPopover(true) here, Popover's open prop handles it
    debounceTimeoutRef.current = setTimeout(async () => {
      const result: FetchMovieSuggestionsResult = await fetchMovieSuggestionsAction(newTitle.trim());
      setIsLoadingSuggestions(false);
      if (result.suggestions && result.suggestions.length > 0) {
        setSuggestions(result.suggestions);
        setShowSuggestionsPopover(true); 
      } else {
        setSuggestions([]);
        setShowSuggestionsPopover(false);
      }
      if (result.error) {
        console.error("Suggestion error:", result.error);
        setSuggestions([]);
        setShowSuggestionsPopover(false);
      }
    }, 300); // 300ms debounce
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMovieTitle(suggestion);
    setSuggestions([]);
    setShowSuggestionsPopover(false);
    // Optionally, trigger search immediately:
    // onSearch(suggestion); 
    // For now, let the user press search
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowSuggestionsPopover(false); 
    if (movieTitle.trim()) {
      onSearch(movieTitle.trim());
    }
  };
  
  // Close suggestions when input loses focus, unless a suggestion is clicked (handled by Popover's onOpenChange)
  // Or when the main form is loading.
  useEffect(() => {
    if (isLoading) {
      setShowSuggestionsPopover(false);
    }
  }, [isLoading]);

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-start space-x-2 p-1 bg-card rounded-lg shadow-md">
      <Popover open={showSuggestionsPopover && suggestions.length > 0 && !isLoading} onOpenChange={setShowSuggestionsPopover}>
        <PopoverAnchor className="relative flex-grow">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Enter movie title (e.g., Inception)"
              value={movieTitle}
              onChange={handleInputChange}
              onFocus={() => {
                if (movieTitle.trim().length >=2 && suggestions.length > 0) {
                  setShowSuggestionsPopover(true);
                }
              }}
              className="pl-10 pr-2 py-3 text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
              disabled={isLoading}
              aria-label="Movie Title"
              autoComplete="off"
            />
          </div>
        </PopoverAnchor>
        <PopoverContent 
            className="p-0 w-[--radix-popover-trigger-width] shadow-lg"
            onOpenAutoFocus={(e) => e.preventDefault()} // Prevent focus stealing from input
        >
          {isLoadingSuggestions && (
            <div className="p-2 text-sm text-muted-foreground flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading suggestions...
            </div>
          )}
          {!isLoadingSuggestions && suggestions.length > 0 && (
            <ul className="max-h-60 overflow-y-auto rounded-md">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseDown={(e) => e.preventDefault()} // Prevents input blur before click
                  className="px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  role="option"
                  aria-selected={false} // Basic accessibility, can be enhanced
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </PopoverContent>
      </Popover>
      <Button type="submit" disabled={isLoading || !movieTitle.trim()} className="bg-accent hover:bg-accent/90 text-accent-foreground mt-[1px]"> {/* Align button better with PopoverAnchor */}
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
