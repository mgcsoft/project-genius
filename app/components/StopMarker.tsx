interface StopMarkerProps {
  stopNumber: number;
  position: { x: number; y: number }; // Percentage position (0-100%)
  status: "unvisited" | "nearby" | "active" | "visited";
  onClick: () => void;
}

export default function StopMarker({
  stopNumber,
  position,
  status,
  onClick,
}: StopMarkerProps) {
  const getMarkerStyles = () => {
    switch (status) {
      case "nearby":
        return "bg-orange-600 border-orange-700 animate-pulse";
      case "active":
        return "bg-blue-500 border-blue-600";
      case "visited":
        return "bg-green-500 border-green-600";
      default:
        return "bg-orange-400 border-orange-500";
    }
  };

  const showPulse = status === "nearby";

  return (
    <button
      onClick={onClick}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      aria-label={`Stop ${stopNumber}`}
    >
      {/* Pulse ring for nearby stops */}
      {showPulse && (
        <div className="absolute inset-0 -m-2">
          <div className="w-12 h-12 rounded-full bg-orange-400 opacity-75 animate-ping"></div>
        </div>
      )}

      {/* Main marker circle */}
      <div
        className={`relative w-10 h-10 rounded-full border-3 shadow-lg flex items-center justify-center text-white font-bold text-sm transition-all hover:scale-110 ${getMarkerStyles()}`}
      >
        {status === "visited" ? (
          // Checkmark for visited stops
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          // Stop number
          stopNumber
        )}
      </div>
    </button>
  );
}
