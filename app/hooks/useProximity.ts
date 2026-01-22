"use client";

import { useState, useEffect } from "react";
import { calculateDistance } from "@/app/utils/distance";
import type { TourStop } from "@/app/data/tourStops";

interface Position {
  lat: number;
  lng: number;
}

export function useProximity(
  userPosition: Position | null,
  stops: TourStop[]
) {
  const [nearbyStops, setNearbyStops] = useState<Map<number, number>>(
    new Map()
  ); // Map<stopId, distance>

  useEffect(() => {
    if (!userPosition) {
      setNearbyStops(new Map());
      return;
    }

    const nearby = new Map<number, number>();

    stops.forEach((stop) => {
      const distance = calculateDistance(
        userPosition.lat,
        userPosition.lng,
        stop.coordinates.lat,
        stop.coordinates.lng
      );

      if (distance <= stop.triggerRadius) {
        nearby.set(stop.id, distance);
      }
    });

    setNearbyStops(nearby);
  }, [userPosition, stops]);

  const isNearby = (stopId: number) => nearbyStops.has(stopId);

  const getDistance = (stopId: number) => nearbyStops.get(stopId) ?? Infinity;

  const getNearestStop = () => {
    if (nearbyStops.size === 0) return null;

    let nearestId = -1;
    let minDistance = Infinity;

    nearbyStops.forEach((distance, stopId) => {
      if (distance < minDistance) {
        minDistance = distance;
        nearestId = stopId;
      }
    });

    return nearestId > 0 ? nearestId : null;
  };

  return {
    nearbyStops,
    isNearby,
    getDistance,
    getNearestStop,
  };
}
