"use client";

import { useEffect } from "react";
import AudioPlayer from "./AudioPlayer";
import type { TourStop } from "@/app/data/tourStops";

interface StopDetailsProps {
  stop: TourStop;
  isVisited: boolean;
  isClosing?: boolean;
  onClose: () => void;
  onMarkVisited: () => void;
  onNext?: () => void;
}

export default function StopDetails({
  stop,
  isVisited,
  isClosing = false,
  onClose,
  onMarkVisited,
  onNext,
}: StopDetailsProps) {

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 ${
          isClosing ? "animate-fade-out" : "animate-fade-in"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-50 ${
          isClosing ? "animate-slide-down-exit" : "animate-slide-up"
        }`}
      >
        <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-gray-200 shrink-0">
            <div className="flex-1">
              <div className="text-sm text-blue-600 font-semibold mb-1">
                {stop.shortTitle}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {stop.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Audio Player */}
          <div className="px-6 pt-4 flex-shrink-0">
            <AudioPlayer audioSrc={stop.audioFile} />
          </div>

          {/* Content - Scrollable Area */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 min-h-0">
            {/* Introduction */}
            <div>
              <p className="text-gray-700 leading-relaxed">
                {stop.content.introduction}
              </p>
            </div>

            {/* Sections */}
            {stop.content.sections.map((section, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {section.heading}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex flex-wrap gap-3">
            {!isVisited && (
              <button
                onClick={onMarkVisited}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 flex items-center justify-center gap-2"
              >
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Mark as Visited
              </button>
            )}

            {isVisited && (
              <div className="flex-1 bg-green-100 text-green-700 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Visited
              </div>
            )}

            {onNext && (
              <button
                onClick={onNext}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center gap-2"
              >
                Next Stop
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
