import Link from "next/link";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import StatusMessage from "@/components/StatusMessage";
import { ApiError, getEventById, getEventSessions } from "@/services/eventService";
import { formatDate, humanize } from "@/lib/format";
import type { CampusEvent, Session } from "@/types/event";

type Params = Promise<{ id: string }>;

async function Sessions({ eventId }: { eventId: string }) {
  let sessions: Session[];
  try {
    sessions = await getEventSessions(eventId);
  } catch (error) {
    return (
      <StatusMessage
        type="error"
        message={error instanceof Error ? error.message : "Could not load sessions."}
      />
    );
  }

  if (sessions.length === 0) {
    return <StatusMessage type="info" message="No sessions have been added to this event yet." />;
  }

  return (
    <ul className="space-y-3">
      {sessions.map((s) => (
        <li key={s.id}>
          <Link
            href={`/events/${eventId}/sessions/${s.id}`}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div>
              <p className="font-semibold">{s.title}</p>
              <p className="text-sm text-gray-500">
                🕐 {formatDate(s.startsAt)} – {formatDate(s.endsAt)}
              </p>
            </div>
            <span className="rounded bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
              🚪 {s.room}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

async function EventDetails({ params }: { params: Params }) {
  const { id } = await params;

  let event: CampusEvent;
  try {
    event = await getEventById(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return (
        <StatusMessage
          type="info"
          message="Event not found. It may have been removed, or the link is wrong."
        />
      );
    }
    return (
      <StatusMessage
        type="error"
        message={error instanceof Error ? error.message : "Something went wrong."}
      />
    );
  }

  return (
    <>
      <article className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              event.isPublished
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {event.isPublished ? "Published" : "Draft"}
          </span>
        </div>

        <p className="mt-4 whitespace-pre-line text-gray-700">{event.description}</p>

        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-gray-500">📅 Date</dt>
            <dd className="font-medium">{formatDate(event.eventDate)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">📍 Location</dt>
            <dd className="font-medium">{humanize(event.location)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">🏷️ Category</dt>
            <dd className="font-medium">{humanize(event.category)}</dd>
          </div>
        </dl>
      </article>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Sessions</h2>
        <Suspense fallback={<Loading label="Loading sessions..." />}>
          <Sessions eventId={event.id} />
        </Suspense>
      </section>
    </>
  );
}

export default function EventDetailsPage({ params }: { params: Params }) {
  return (
    <>
      <Link href="/events" className="mb-4 inline-block text-sm text-indigo-600 hover:underline">
        ← Back to events
      </Link>
      <Suspense fallback={<Loading label="Loading event..." />}>
        <EventDetails params={params} />
      </Suspense>
    </>
  );
}