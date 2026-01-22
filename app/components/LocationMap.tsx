"use client";

import { useState, useEffect } from "react";

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

  // Convert GPS coordinates to percentage positions (0-100%)
  const gpsToPercent = (lat: number, lng: number) => {
    const minLat = Math.min(MAP_BOUNDS.bottomLeft.lat, MAP_BOUNDS.bottomRight.lat);
    const maxLat = Math.max(MAP_BOUNDS.topLeft.lat, MAP_BOUNDS.topRight.lat);
    const minLng = Math.min(MAP_BOUNDS.topLeft.lng, MAP_BOUNDS.bottomLeft.lng);
    const maxLng = Math.max(MAP_BOUNDS.topRight.lng, MAP_BOUNDS.bottomRight.lng);

    // Calculate percentage position within bounds (0 to 1)
    const xPercent = (lng - minLng) / (maxLng - minLng);
    const yPercent = (maxLat - lat) / (maxLat - minLat); // Inverted because y increases downward

    // Convert to percentage (0-100%)
    const x = xPercent * 100;
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

  const mapSrc = isLandscape
    ? "/Wandelroute Landscape.svg"
    : "/Wandelroute Portrait.svg";

  return (
    <div className="flex flex-col items-center gap-4 p-4 min-h-screen">
      <h1 className="text-2xl font-bold">TU/e Campus Tour</h1>

      {loading && (
        <p className="text-gray-600">Getting your location...</p>
      )}

      {error && (
        <p className="text-red-500">{error}</p>
      )}

      {userPosition && (
        <p className="text-sm text-gray-600">
          Your GPS: {userPosition.lat.toFixed(6)}, {userPosition.lng.toFixed(6)}
        </p>
      )}

      <div className="relative w-full max-w-6xl border-2 border-gray-300 rounded-lg overflow-hidden bg-white shadow-lg">
        {/* SVG Map - switches based on orientation */}
        <img
          src={mapSrc}
          alt="TU/e Campus Map"
          className="w-full h-auto"
        />

        {/* Red dot marker for user position */}
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

      <p className="text-xs text-gray-500">
        Orientation: {isLandscape ? "Landscape" : "Portrait"}
      </p>
    </div>
  );
}
