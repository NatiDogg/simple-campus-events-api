export default function Loading({
  label = "Loading events...",
}: {
  label?: string;
}) {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-3 py-16 text-gray-500"
    >
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      {label}
    </div>
  );
}