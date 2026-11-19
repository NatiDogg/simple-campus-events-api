import { Suspense } from "react";
import EventCard from "@/components/EventCard";
import EventFilters from "@/components/EventFilters";
import Pagination from "@/components/Pagination";
import Loading from "@/components/Loading";
import StatusMessage from "@/components/StatusMessage";
import { getEvents } from "@/services/eventService";
import type { EventQuery, PaginatedEvents } from "@/types/event";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const PAGE_SIZE = 6;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function EventsContent({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;

  const category = first(sp.category) ?? "";
  const location = first(sp.location) ?? "";
  const isPublished = first(sp.isPublished) ?? "";
  const sort = first(sp.sort) ?? "eventDate:asc";
  const q = (first(sp.q) ?? "").trim();
  const page = Math.max(1, Number(first(sp.page)) || 1);
  const [sortBy, order] = sort.split(":") as [
    EventQuery["sortBy"],
    EventQuery["order"],
  ];

  
  const query: EventQuery = {
    category,
    location,
    isPublished: isPublished as EventQuery["isPublished"],
    sortBy,
    order,
    page: q ? 1 : page,
    limit: q ? 100 : PAGE_SIZE,
  };

  let result: [PaginatedEvents, PaginatedEvents];
  try {
    result = await Promise.all([
      getEvents(query),
      getEvents({ limit: 100 }), 
    ]);
  } catch (error) {
    return (
      <StatusMessage
        type="error"
        message={
          error instanceof Error ? error.message : "Something went wrong."
        }
      />
    );
  }

  const [data, all] = result;
  const items = q
    ? data.items.filter((e) =>
        e.title.toLowerCase().includes(q.toLowerCase()),
      )
    : data.items;

  const categories = [...new Set(all.items.map((e) => e.category))].sort();
  const locations = [...new Set(all.items.map((e) => e.location))].sort();

  return (
    <>
      <EventFilters categories={categories} locations={locations} />

      <p className="mb-4 text-sm text-gray-500">
        {q ? items.length : data.total} event
        {(q ? items.length : data.total) === 1 ? "" : "s"} found
      </p>

      {items.length === 0 ? (
        <StatusMessage type="info" message="No events found. Check back later!" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {!q && data.totalPages > 1 && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          params={{ category, location, isPublished, sort, q }}
        />
      )}
    </>
  );
}

export default function EventsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">All Events</h1>
      <Suspense fallback={<Loading />}>
        <EventsContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}