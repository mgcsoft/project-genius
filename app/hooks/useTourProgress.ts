"use client";

import { useState, useEffect } from "react";
import { loadProgress, saveProgress, resetProgress as resetStoredProgress } from "@/app/utils/storage";

export function useTourProgress() {
  const [visitedStops, setVisitedStops] = useState<Set<number>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = loadProgress();
    setVisitedStops(new Set(savedProgress));
    setIsLoaded(true);
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveProgress(Array.from(visitedStops));
    }
  }, [visitedStops, isLoaded]);

  const markAsVisited = (stopId: number) => {
    setVisitedStops((prev) => new Set(prev).add(stopId));
  };

  const isVisited = (stopId: number) => {
    return visitedStops.has(stopId);
  };

  const resetProgress = () => {
    setVisitedStops(new Set());
    resetStoredProgress();
  };

  return {
    visitedStops,
    markAsVisited,
    isVisited,
    resetProgress,
    isLoaded,
  };
}
