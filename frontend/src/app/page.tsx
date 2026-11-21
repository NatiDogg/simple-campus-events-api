import Link from "next/link";
import { Suspense } from "react";
import EventCard from "@/components/EventCard";
import Loading from "@/components/Loading";
import StatusMessage from "@/components/StatusMessage";
import { getUpcomingEvents } from "@/services/eventService";
import type { CampusEvent } from "@/types/event";

async function UpcomingEvents() {
  let events: CampusEvent[];
  try {
    events = await getUpcomingEvents();
  } catch (error) {
    return (
      <StatusMessage
        type="error"
        message={error instanceof Error ? error.message : "Something went wrong."}
      />
    );
  }

  // The backend also returns drafts and doesn't sort, so we tidy up here.
  const upcoming = events
    .filter((e) => e.isPublished)
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate))
    .slice(0, 3);

  if (upcoming.length === 0) {
    return (
      <StatusMessage type="info" message="No events found. Check back later!" />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {upcoming.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <section className="rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-14 text-center text-white sm:py-20">
        <h1 className="text-3xl font-bold sm:text-5xl">
          Discover What&apos;s Happening on Campus
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-indigo-100">
          Find workshops, technology events and activities, all in one place.
        </p>
        <Link
          href="/events"
          className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-indigo-700 hover:bg-indigo-50"
        >
          Explore Events
        </Link>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">Upcoming Events</h2>
          <Link
            href="/events"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            View all events →
          </Link>
        </div>

        <Suspense fallback={<Loading label="Loading upcoming events..." />}>
          <UpcomingEvents />
        </Suspense>
      </section>
    </>
  );
}