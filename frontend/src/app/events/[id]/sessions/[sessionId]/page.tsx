import Link from "next/link";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import StatusMessage from "@/components/StatusMessage";
import { ApiError, getEventById, getSessionById } from "@/services/eventService";
import { formatDate, humanize } from "@/lib/format";
import type { CampusEvent, Session } from "@/types/event";

type Params = Promise<{ id: string; sessionId: string }>;

async function SessionDetails({ params }: { params: Params }) {
  const { id, sessionId } = await params;

  let session: Session;
  let event: CampusEvent;
  try {
    [session, event] = await Promise.all([
      getSessionById(id, sessionId),
      getEventById(id),
    ]);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return <StatusMessage type="info" message="Session not found." />;
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
      <Link
        href={`/events/${event.id}`}
        className="mb-4 inline-block text-sm text-indigo-600 hover:underline"
      >
        ← Back to {event.title}
      </Link>

      <article className="rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold">{session.title}</h1>

        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-gray-500">🕐 Starts</dt>
            <dd className="font-medium">{formatDate(session.startsAt)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">🕑 Ends</dt>
            <dd className="font-medium">{formatDate(session.endsAt)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">🚪 Room</dt>
            <dd className="font-medium">{session.room}</dd>
          </div>
        </dl>
      </article>

      <section className="mt-8 rounded-lg border bg-indigo-50 p-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-indigo-700">
          Part of this event
        </h2>
        <p className="text-lg font-semibold">{event.title}</p>
        <p className="mt-1 text-sm text-gray-600">
          📅 {formatDate(event.eventDate)} · 📍 {humanize(event.location)}
        </p>
        <Link
          href={`/events/${event.id}`}
          className="mt-3 inline-block text-sm font-medium text-indigo-700 hover:underline"
        >
          View event details →
        </Link>
      </section>
    </>
  );
}

export default function SessionPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<Loading label="Loading session..." />}>
      <SessionDetails params={params} />
    </Suspense>
  );
}