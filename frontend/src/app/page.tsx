import { Suspense } from "react";
import { getEvents } from "@/services/eventService";

async function EventsPreview() {
  const data = await getEvents({ limit: 3 });
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

export default function Home() {
  return (
    <Suspense fallback={<p>Loading events...</p>}>
      <EventsPreview />
    </Suspense>
  );
}