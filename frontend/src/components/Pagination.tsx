import Link from "next/link";

interface Props {
  page: number;
  totalPages: number;
  params: Record<string, string>;
}

export default function Pagination({ page, totalPages, params }: Props) {
  function href(target: number) {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) sp.set(key, value);
    });
    sp.set("page", String(target));
    return `/events?${sp.toString()}`;
  }

  const base = "rounded border bg-white px-3 py-1.5 text-sm";

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-between"
    >
      {page > 1 ? (
        <Link href={href(page - 1)} className={`${base} hover:bg-gray-100`}>
          ← Previous
        </Link>
      ) : (
        <span className={`${base} opacity-40`}>← Previous</span>
      )}

      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>

      {page < totalPages ? (
        <Link href={href(page + 1)} className={`${base} hover:bg-gray-100`}>
          Next →
        </Link>
      ) : (
        <span className={`${base} opacity-40`}>Next →</span>
      )}
    </nav>
  );
}