"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

interface TourProgressProps {
  visitedCount: number;
  totalStops: number;
  onReset?: () => void;
}

export default function TourProgress({
  visitedCount,
  totalStops,
  onReset,
}: TourProgressProps) {
  const percentage = (visitedCount / totalStops) * 100;
  const isComplete = visitedCount === totalStops && totalStops > 0;

  // Trigger confetti when tour is completed
  useEffect(() => {
    if (isComplete) {
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ["#c72125", "#a01b1e", "#FFD700", "#FFA500"];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [isComplete]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Tour voortgang
          </h3>
          <p className="text-xs text-gray-600">
            {visitedCount} van {totalStops} stops bezocht
          </p>
        </div>

        {visitedCount > 0 && onReset && (
          <button
            onClick={onReset}
            className="text-xs text-gray-500 hover:text-gray-700 underline focus:outline-none cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-[#c72125] h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Milestone message */}
      {visitedCount === totalStops && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 font-semibold flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Tour voltooid! Goed gedaan!
          </p>
        </div>
      )}
    </div>
  );
}
