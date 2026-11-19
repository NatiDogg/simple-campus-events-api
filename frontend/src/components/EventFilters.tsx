"use client";

import { useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { humanize } from "@/lib/format";

interface Props {
  categories: string[];
  locations: string[];
}

const field = "rounded border bg-white px-3 py-2 text-sm";

export default function EventFilters({ categories, locations }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page"); // any filter change goes back to page 1
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function onSearch(value: string) {
    setSearch(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => update("q", value.trim()), 400);
  }

  function clearAll() {
    setSearch("");
    router.replace(pathname, { scroll: false });
  }

  return (
    <section className="mb-6 grid gap-3 rounded-lg border bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-6">
      <input
        type="search"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search by title..."
        aria-label="Search events by title"
        className={`${field} sm:col-span-2`}
      />

      <select
        value={searchParams.get("category") ?? ""}
        onChange={(e) => update("category", e.target.value)}
        aria-label="Filter by category"
        className={field}
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {humanize(c)}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("location") ?? ""}
        onChange={(e) => update("location", e.target.value)}
        aria-label="Filter by location"
        className={field}
      >
        <option value="">All locations</option>
        {locations.map((l) => (
          <option key={l} value={l}>
            {humanize(l)}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("isPublished") ?? ""}
        onChange={(e) => update("isPublished", e.target.value)}
        aria-label="Filter by status"
        className={field}
      >
        <option value="">All status</option>
        <option value="true">Published</option>
        <option value="false">Draft</option>
      </select>

      <select
        value={searchParams.get("sort") ?? "eventDate:asc"}
        onChange={(e) => update("sort", e.target.value)}
        aria-label="Sort events"
        className={field}
      >
        <option value="eventDate:asc">Date (oldest first)</option>
        <option value="eventDate:desc">Date (newest first)</option>
        <option value="title:asc">Title (A to Z)</option>
        <option value="title:desc">Title (Z to A)</option>
      </select>

      <button
        onClick={clearAll}
        className="rounded border px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 lg:col-span-6 lg:justify-self-end"
      >
        Clear filters
      </button>
    </section>
  );
}