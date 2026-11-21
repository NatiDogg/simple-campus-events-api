import EventForm from "@/components/EventForm";

export const metadata = { title: "Create Event | Campus Events" };

export default function CreateEventPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-3xl font-bold">Create Event</h1>
      <p className="mb-6 text-gray-600">
        Fill in the details below to add a new event to the campus calendar.
      </p>
      <EventForm />
    </div>
  );
}