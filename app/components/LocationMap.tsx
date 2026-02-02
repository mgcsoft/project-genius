"use client";

import { useState, useEffect } from "react";
import StopMarker from "./StopMarker";
import StopDetails from "./StopDetails";
import ProximityNotification from "./ProximityNotification";
import TourProgress from "./TourProgress";
import { TOUR_STOPS } from "@/app/data/tourStops";
import { useTourProgress } from "@/app/hooks/useTourProgress";
import { useProximity } from "@/app/hooks/useProximity";
import {
  saveNotificationState,
  hasShownNotification,
} from "@/app/utils/storage";

// GPS bounds for the map (TU/e Campus)
const MAP_BOUNDS = {
  minLat: 51.44556112034438,  // South
  maxLat: 51.45101760460129,  // North
  minLng: 5.484095445898115,  // West
  maxLng: 5.496808389521499,  // East
};

interface Position {
  lat: number;
  lng: number;
}

export default function LocationMap() {
  const [userPosition, setUserPosition] = useState<Position | null>(null);
  const [dotPosition, setDotPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLandscape, setIsLandscape] = useState(true);
  const [selectedStop, setSelectedStop] = useState<number | null>(null);
  const [isClosingModal, setIsClosingModal] = useState(false);
  const [notificationStop, setNotificationStop] = useState<number | null>(null);

  // Custom hooks
  const { visitedStops, markAsVisited, isVisited, resetProgress } =
    useTourProgress();
  const { nearbyStops, isNearby, getDistance, getNearestStop } = useProximity(
    userPosition,
    TOUR_STOPS,
  );

  // Get map position based on current orientation
  const getMapPosition = (stop: (typeof TOUR_STOPS)[0]) => {
    return isLandscape
      ? stop.coordinates.mapPosition.landscape
      : stop.coordinates.mapPosition.portrait;
  };

  // Convert GPS to percentage for user dot
  const gpsToPercent = (lat: number, lng: number) => {
    if (isLandscape) {
      // Landscape: North=top, South=bottom, West=left, East=right
      const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100;
      const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
      return { x, y };
    } else {
      // Portrait: 90° CCW rotated (East=top, West=bottom, North=left, South=right)
      const x = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
      const y = ((MAP_BOUNDS.maxLng - lng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100;
      return { x, y };
    }
  };

  // Check if position is within map bounds
  const isWithinBounds = (lat: number, lng: number) => {
    return (
      lat >= MAP_BOUNDS.minLat &&
      lat <= MAP_BOUNDS.maxLat &&
      lng >= MAP_BOUNDS.minLng &&
      lng <= MAP_BOUNDS.maxLng
    );
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
      setError("Geolocatie wordt niet ondersteund door je browser");
      setLoading(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserPosition({ lat: latitude, lng: longitude });
        setLoading(false);
      },
      (err) => {
        setError(`Fout bij ophalen locatie: ${err.message}`);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Update dot position when user position or orientation changes
  useEffect(() => {
    if (!userPosition) {
      setDotPosition(null);
      return;
    }

    if (isWithinBounds(userPosition.lat, userPosition.lng)) {
      setDotPosition(gpsToPercent(userPosition.lat, userPosition.lng));
      setError(null);
    } else {
      setDotPosition(null);
      setError("Je bevindt je buiten het kaartgebied");
    }
  }, [userPosition, isLandscape]);

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
    <div className="flex flex-col items-center gap-4 p-4 min-h-screen bg-gray-50">
      {/* Loading and Error States */}
      {loading && (
        <div className="flex items-center gap-2 text-gray-600">
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
          Locatie ophalen...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-6xl w-full">
          <p className="text-red-600">{error}</p>
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

      {/* Map Container */}
      <div className="relative w-full max-w-6xl border-2 border-gray-300 rounded-lg overflow-hidden bg-white shadow-2xl map-container">
        {/* SVG Map - switches based on orientation */}
        <img src={mapSrc} alt="TU/e Campus Map" className="w-full h-auto" />

        {/* Stop Markers */}
        {TOUR_STOPS.map((stop) => {
          const position = getMapPosition(stop);
          return (
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
        <div className="text-xs text-gray-500 text-center">
          GPS: {userPosition.lat.toFixed(6)}, {userPosition.lng.toFixed(6)} •{" "}
          {isLandscape ? "Landscape" : "Portrait"}
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
