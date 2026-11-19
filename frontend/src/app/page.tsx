import { Suspense } from "react";
import EventCard from "@/components/EventCard";
import { getEvents } from "@/services/eventService";

async function EventsPreview() {
  const data = await getEvents({ limit: 4 });
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {data.items.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<p>Loading events...</p>}>
      <EventsPreview />
    </Suspense>
  );
}