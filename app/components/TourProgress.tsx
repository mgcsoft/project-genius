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

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Tour Progress
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {visitedCount} of {totalStops} stops visited
          </p>
        </div>

        {visitedCount > 0 && onReset && (
          <button
            onClick={onReset}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline focus:outline-none"
          >
            Reset
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Milestone message */}
      {visitedCount === totalStops && (
        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-300 font-semibold flex items-center gap-2">
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
            Tour Complete! Great job! 🎉
          </p>
        </div>
      )}
    </div>
  );
}
