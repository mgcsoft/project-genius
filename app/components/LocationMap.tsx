"use client";

import { useState, useEffect } from "react";

// GPS coordinates for the 4 corners of the map image
const MAP_BOUNDS = {
  topLeft: { lat: 51.20546392247269, lng: 6.01823876980624 },
  topRight: { lat: 51.20546392247269, lng: 6.027991031449112 },
  bottomLeft: { lat: 51.20006557443836, lng: 6.01823876980624 },
  bottomRight: { lat: 51.20006557443836, lng: 6.027991031449112 },
};

// Image dimensions (will be set dynamically or you can hardcode)
const IMAGE_WIDTH = 800;
const IMAGE_HEIGHT = 600;

interface Position {
  lat: number;
  lng: number;
}

export default function LocationMap() {
  const [userPosition, setUserPosition] = useState<Position | null>(null);
  const [dotPosition, setDotPosition] = useState<{ x: number; y: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Convert GPS coordinates to image pixel coordinates
  const gpsToPixel = (lat: number, lng: number) => {
    const minLat = Math.min(MAP_BOUNDS.bottomLeft.lat, MAP_BOUNDS.bottomRight.lat);
    const maxLat = Math.max(MAP_BOUNDS.topLeft.lat, MAP_BOUNDS.topRight.lat);
    const minLng = Math.min(MAP_BOUNDS.topLeft.lng, MAP_BOUNDS.bottomLeft.lng);
    const maxLng = Math.max(MAP_BOUNDS.topRight.lng, MAP_BOUNDS.bottomRight.lng);

    // Calculate percentage position within bounds
    const xPercent = (lng - minLng) / (maxLng - minLng);
    const yPercent = (maxLat - lat) / (maxLat - minLat); // Inverted because y increases downward

    // Convert to pixel coordinates
    const x = xPercent * IMAGE_WIDTH;
    const y = yPercent * IMAGE_HEIGHT;

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
          setDotPosition(gpsToPixel(latitude, longitude));
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

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Location Map</h1>

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

      <div
        className="relative border-2 border-gray-300 rounded-lg overflow-hidden"
        style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
      >
        {/* Replace this with your actual map image */}
        <img
          src="/map.png"
          alt="Map"
          className="w-full h-full object-cover"
          style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
        />

        {/* Red dot marker */}
        {dotPosition && (
          <div
            className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: dotPosition.x,
              top: dotPosition.y,
            }}
          />
        )}
      </div>
    </div>
  );
}
