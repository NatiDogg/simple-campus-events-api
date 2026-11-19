export default function StatusMessage({
  type,
  message,
}: {
  type: "error" | "info";
  message: string;
}) {
  const styles =
    type === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-gray-200 bg-white text-gray-600";

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`rounded-lg border px-4 py-10 text-center ${styles}`}
    >
      {message}
    </div>
  );
}