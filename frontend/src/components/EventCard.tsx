import Link from "next/link";
import type { CampusEvent } from "@/types/event";
import { formatDate, humanize } from "@/lib/format";

export default function EventCard({ event }: { event: CampusEvent }) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
            event.isPublished
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {event.isPublished ? "Published" : "Draft"}
        </span>
      </div>

      <p className="line-clamp-2 text-sm text-gray-600">{event.description}</p>

      <ul className="space-y-1 text-sm text-gray-500">
        <li>📅 {formatDate(event.eventDate)}</li>
        <li>📍 {humanize(event.location)}</li>
      </ul>

      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="rounded bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
          {humanize(event.category)}
        </span>
        <Link
          href={`/events/${event.id}`}
          className="rounded bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}