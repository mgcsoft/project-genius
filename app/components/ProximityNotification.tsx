import { useEffect } from "react";
import type { TourStop } from "@/app/data/tourStops";

interface ProximityNotificationProps {
  stop: TourStop;
  distance: number; // Distance in meters
  onDismiss: () => void;
  onOpen: () => void;
}

export default function ProximityNotification({
  stop,
  distance,
  onDismiss,
  onOpen,
}: ProximityNotificationProps) {
  // Auto-dismiss after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div className="bg-orange-500 text-white rounded-lg shadow-2xl p-4 max-w-md flex items-center gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-bold text-lg">Je bent dichtbij {stop.title}!</h3>
          <p className="text-sm text-white/90">
            {Math.round(distance)}m ver • {stop.shortTitle}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onOpen}
            className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-orange-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
          >
            Open
          </button>
          <button
            onClick={onDismiss}
            className="text-white/80 hover:text-white text-sm underline focus:outline-none cursor-pointer"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
}
