import LocationMap from "./components/LocationMap";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="flex min-h-screen flex-col items-center justify-center">
        <LocationMap />
      </main>
    </div>
  );
}
