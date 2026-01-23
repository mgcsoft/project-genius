"use client";

import { useState, useEffect } from "react";
import StopMarker from "./StopMarker";
import StopDetails from "./StopDetails";
import ProximityNotification from "./ProximityNotification";
import TourProgress from "./TourProgress";
import { TOUR_STOPS } from "@/app/data/tourStops";
import { useTourProgress } from "@/app/hooks/useTourProgress";
import { useProximity } from "@/app/hooks/useProximity";
import { saveNotificationState, hasShownNotification } from "@/app/utils/storage";

// GPS coordinates for the 4 corners of the map image (TU/e Campus)
const MAP_BOUNDS = {
  topLeft: { lat: 51.45101760460129, lng: 5.496808389521499 },
  topRight: { lat: 51.45101760460129, lng: 5.484095445898115 },
  bottomLeft: { lat: 51.44556112034438, lng: 5.496808389521499 },
  bottomRight: { lat: 51.44556112034438, lng: 5.484095445898115 },
};

interface Position {
  lat: number;
  lng: number;
}

export default function LocationMap() {
  const [userPosition, setUserPosition] = useState<Position | null>(null);
  const [dotPosition, setDotPosition] = useState<{ x: number; y: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLandscape, setIsLandscape] = useState(true);
  const [selectedStop, setSelectedStop] = useState<number | null>(null);
  const [isClosingModal, setIsClosingModal] = useState(false);
  const [notificationStop, setNotificationStop] = useState<number | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [editedPositions, setEditedPositions] = useState<
    Map<number, { x: number; y: number }>
  >(new Map());
  const [draggingStop, setDraggingStop] = useState<number | null>(null);

  // Custom hooks
  const { visitedStops, markAsVisited, isVisited, resetProgress } = useTourProgress();
  const { nearbyStops, isNearby, getDistance, getNearestStop } = useProximity(
    userPosition,
    TOUR_STOPS
  );

  // Get map position based on current orientation
  const getMapPosition = (stop: typeof TOUR_STOPS[0]) => {
    return isLandscape
      ? stop.coordinates.mapPosition.landscape
      : stop.coordinates.mapPosition.portrait;
  };

  // Convert GPS to percentage for user dot
  const gpsToPercent = (lat: number, lng: number) => {
    const minLat = Math.min(MAP_BOUNDS.bottomLeft.lat, MAP_BOUNDS.bottomRight.lat);
    const maxLat = Math.max(MAP_BOUNDS.topLeft.lat, MAP_BOUNDS.topRight.lat);
    const minLng = Math.min(MAP_BOUNDS.topLeft.lng, MAP_BOUNDS.bottomLeft.lng);
    const maxLng = Math.max(MAP_BOUNDS.topRight.lng, MAP_BOUNDS.bottomRight.lng);

    const xPercent = (lng - minLng) / (maxLng - minLng);
    const yPercent = (maxLat - lat) / (maxLat - minLat);

    const x = isLandscape ? (1 - xPercent) * 100 : xPercent * 100;
    const y = yPercent * 100;

    return { x, y };
  };

  // Check if position is within map bounds
  const isWithinBounds = (lat: number, lng: number) => {
    const minLat = Math.min(MAP_BOUNDS.bottomLeft.lat, MAP_BOUNDS.bottomRight.lat);
    const maxLat = Math.max(MAP_BOUNDS.topLeft.lat, MAP_BOUNDS.topRight.lat);
    const minLng = Math.min(MAP_BOUNDS.topLeft.lng, MAP_BOUNDS.bottomLeft.lng);
    const maxLng = Math.max(MAP_BOUNDS.topRight.lng, MAP_BOUNDS.bottomRight.lng);

    return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
  };

  // Detect orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    // Set initial orientation
    handleOrientationChange();

    // Listen for window resize and orientation change
    window.addEventListener("resize", handleOrientationChange);
    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("resize", handleOrientationChange);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  // Track user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserPosition({ lat: latitude, lng: longitude });

        if (isWithinBounds(latitude, longitude)) {
          setDotPosition(gpsToPercent(latitude, longitude));
          setError(null);
        } else {
          setDotPosition(null);
          setError("You are outside the map area");
        }
        setLoading(false);
      },
      (err) => {
        setError(`Error getting location: ${err.message}`);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Show notification when user gets near a stop
  useEffect(() => {
    const nearestStopId = getNearestStop();

    if (
      nearestStopId &&
      !notificationStop &&
      !hasShownNotification(nearestStopId) &&
      !isVisited(nearestStopId)
    ) {
      setNotificationStop(nearestStopId);
      saveNotificationState(nearestStopId);
    }
  }, [nearbyStops, notificationStop, isVisited, getNearestStop]);

  const getStopStatus = (stopId: number) => {
    if (selectedStop === stopId) return "active";
    if (isVisited(stopId)) return "visited";
    if (isNearby(stopId)) return "nearby";
    return "unvisited";
  };

  const handleNextStop = () => {
    if (!selectedStop) return;
    const currentIndex = TOUR_STOPS.findIndex((s) => s.id === selectedStop);
    if (currentIndex < TOUR_STOPS.length - 1) {
      setSelectedStop(TOUR_STOPS[currentIndex + 1].id);
      setIsClosingModal(false);
    } else {
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setIsClosingModal(true);
    setTimeout(() => {
      setSelectedStop(null);
      setIsClosingModal(false);
    }, 300); // Match animation duration
  };

  const handleMarkerDrag = (
    stopId: number,
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (!editMode) return;

    e.preventDefault();
    setDraggingStop(stopId);

    const mapContainer = document.querySelector(".map-container");
    if (!mapContainer) return;

    const rect = mapContainer.getBoundingClientRect();

    const updatePosition = (clientX: number, clientY: number) => {
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;

      setEditedPositions((prev) => {
        const newMap = new Map(prev);
        newMap.set(stopId, { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
        return newMap;
      });
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (e instanceof MouseEvent) {
        updatePosition(e.clientX, e.clientY);
      } else if (e instanceof TouchEvent && e.touches.length > 0) {
        updatePosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleEnd = () => {
      setDraggingStop(null);
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleEnd);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleMove);
    document.addEventListener("touchend", handleEnd);
  };

  const getMarkerPosition = (stop: typeof TOUR_STOPS[0]) => {
    if (editMode && editedPositions.has(stop.id)) {
      return editedPositions.get(stop.id)!;
    }
    return getMapPosition(stop);
  };

  const mapSrc = isLandscape
    ? "/Wandelroute Landscape.svg"
    : "/Wandelroute Portrait.svg";

  const selectedStopData = selectedStop
    ? TOUR_STOPS.find((s) => s.id === selectedStop)
    : null;

  const notificationStopData = notificationStop
    ? TOUR_STOPS.find((s) => s.id === notificationStop)
    : null;

  return (
    <div className="flex flex-col items-center gap-4 p-4 min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          TU/e Campus Audio Tour
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
          GENIUS Project - Sustainable Energy Systems
        </p>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Getting your location...
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 max-w-6xl w-full">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Tour Progress */}
      <div className="w-full max-w-6xl">
        <TourProgress
          visitedCount={visitedStops.size}
          totalStops={TOUR_STOPS.length}
          onReset={resetProgress}
        />
      </div>

      {/* Edit Mode Toggle */}
      <div className="w-full max-w-6xl flex justify-end">
        <button
          onClick={() => setEditMode(!editMode)}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            editMode
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
          }`}
        >
          {editMode ? "Exit Edit Mode" : "Edit Marker Positions"}
        </button>
      </div>

      {/* Edit Mode Instructions */}
      {editMode && (
        <div className="w-full max-w-6xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-blue-900 dark:text-blue-100 font-semibold mb-2">
            Edit Mode - {isLandscape ? "Landscape" : "Portrait"} Orientation
          </p>
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            Click and drag markers to reposition them. Rotate your device to edit the other orientation.
            Copy the coordinates below when done.
          </p>
        </div>
      )}

      {/* Map Container */}
      <div className="relative w-full max-w-6xl border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-2xl map-container">
        {/* SVG Map - switches based on orientation */}
        <img src={mapSrc} alt="TU/e Campus Map" className="w-full h-auto" />

        {/* Stop Markers */}
        {TOUR_STOPS.map((stop) => {
          const position = getMarkerPosition(stop);
          return editMode ? (
            <div
              key={stop.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-move ${
                draggingStop === stop.id ? "scale-110" : ""
              }`}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
              onMouseDown={(e) => handleMarkerDrag(stop.id, e)}
              onTouchStart={(e) => handleMarkerDrag(stop.id, e)}
            >
              <div className="relative w-10 h-10 rounded-full border-3 shadow-lg flex items-center justify-center text-white font-bold text-sm bg-purple-500 border-purple-600">
                {stop.id}
              </div>
            </div>
          ) : (
            <StopMarker
              key={stop.id}
              stopNumber={stop.id}
              position={position}
              status={getStopStatus(stop.id)}
              onClick={() => setSelectedStop(stop.id)}
            />
          );
        })}

        {/* User Position Dot */}
        {dotPosition && (
          <div
            className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{
              left: `${dotPosition.x}%`,
              top: `${dotPosition.y}%`,
            }}
          >
            {/* Pulse animation ring */}
            <div className="absolute inset-0 rounded-full bg-red-500 opacity-75 animate-ping"></div>
          </div>
        )}
      </div>

      {/* Debug Info */}
      {userPosition && (
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          GPS: {userPosition.lat.toFixed(6)}, {userPosition.lng.toFixed(6)} •{" "}
          {isLandscape ? "Landscape" : "Portrait"}
        </div>
      )}

      {/* Edit Mode Coordinates Output */}
      {editMode && editedPositions.size > 0 && (
        <div className="w-full max-w-6xl bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Updated {isLandscape ? "Landscape" : "Portrait"} Coordinates
          </h3>
          <pre className="text-xs bg-white dark:bg-gray-900 p-4 rounded border border-gray-300 dark:border-gray-700 overflow-x-auto">
            {TOUR_STOPS.map((stop) => {
              const pos = editedPositions.get(stop.id);
              if (!pos) return null;
              const orientation = isLandscape ? "landscape" : "portrait";
              return `Stop ${stop.id}: ${orientation}: { x: ${pos.x.toFixed(2)}, y: ${pos.y.toFixed(2)} }\n`;
            }).join("")}
          </pre>
        </div>
      )}

      {/* Proximity Notification */}
      {notificationStopData && (
        <ProximityNotification
          stop={notificationStopData}
          distance={getDistance(notificationStopData.id)}
          onDismiss={() => setNotificationStop(null)}
          onOpen={() => {
            setSelectedStop(notificationStopData.id);
            setNotificationStop(null);
          }}
        />
      )}

      {/* Stop Details Modal */}
      {selectedStopData && (
        <StopDetails
          stop={selectedStopData}
          isVisited={isVisited(selectedStopData.id)}
          isClosing={isClosingModal}
          onClose={handleCloseModal}
          onMarkVisited={() => markAsVisited(selectedStopData.id)}
          onNext={
            selectedStopData.id < TOUR_STOPS.length ? handleNextStop : undefined
          }
        />
      )}
    </div>
  );
}
