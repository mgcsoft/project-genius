import type { Metadata } from "next";
import LocationMap from "../components/LocationMap";
import Header from "../components/Header";

export const metadata: Metadata = {
  title: "TU/e Campus Audio Tour - GENIUS Project",
  description:
    "Interactieve audiotour van de TU/e campus met duurzame energiesystemen en innovatieve gebouwen",
};

export default function WandelroutePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center lux-header-padding">
        <LocationMap />
      </main>
    </div>
  );
}
