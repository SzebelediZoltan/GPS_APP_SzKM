// src/components/Routing.tsx
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

export default function Routing({ from, to }: { from: [number, number]; to: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const routingControl = (L as any).Routing.control({
      waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: true,
      lineOptions: { styles: [{ color: "blue", weight: 5 }] },
      show: false,

    }).addTo(map);


    const panels = document.getElementsByClassName("leaflet-routing-container");
    Array.from(panels).forEach((p) => p.remove());

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, from, to]);

  return null;
}
