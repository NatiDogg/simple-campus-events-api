"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/services/eventService";
import { slugify } from "@/lib/format";

interface FormValues {
  title: string;
  description: string;
  location: string;
  eventDate: string;
  category: string;
  isPublished: boolean;
}

type Errors = Partial<Record<keyof FormValues, string>>;

const emptyForm: FormValues = {
  title: "",
  description: "",
  location: "",
  eventDate: "",
  category: "",
  isPublished: true,
};

const inputClass =
  "w-full rounded border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

function validate(values: FormValues): Errors {
  const errors: Errors = {};
  if (values.title.trim().length < 3)
    errors.title = "Title is required (at least 3 characters).";
  if (!values.description.trim())
    errors.description = "Please add a description.";
  if (!values.location.trim()) errors.location = "Location is required.";
  if (!values.category.trim()) errors.category = "Category is required.";
  if (!values.eventDate || Number.isNaN(new Date(values.eventDate).getTime()))
    errors.eventDate = "Please choose a valid date and time.";
  return errors;
}

export default function EventForm() {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const created = await createEvent({
        title: values.title.trim(),
        description: values.description.trim(),
        location: slugify(values.location),
        category: slugify(values.category),
        eventDate: new Date(values.eventDate).toISOString(),
        isPublished: values.isPublished,
      });

      setSuccess(true);
      setValues(emptyForm);
      router.refresh(); // refresh data so the new event appears in the lists
      setTimeout(() => router.push(`/events/${created.id}`), 1500);
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Could not create the event.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-lg border bg-white p-6 shadow-sm"
    >
      {success && (
        <div
          role="status"
          className="rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          ✅ Event created successfully! Taking you to the event page...
        </div>
      )}
      {serverError && (
        <div
          role="alert"
          className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={values.title}
          onChange={(e) => setField("title", e.target.value)}
          className={inputClass}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={values.description}
          onChange={(e) => setField("description", e.target.value)}
          className={inputClass}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="location" className="mb-1 block text-sm font-medium">
            Location
          </label>
          <input
            id="location"
            type="text"
            list="location-options"
            placeholder="e.g. Main, East Wing"
            value={values.location}
            onChange={(e) => setField("location", e.target.value)}
            className={inputClass}
          />
          <datalist id="location-options">
            <option value="Main" />
            <option value="East Wing" />
            <option value="Sports Complex" />
          </datalist>
          {errors.location && (
            <p className="mt-1 text-xs text-red-600">{errors.location}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium">
            Category
          </label>
          <input
            id="category"
            type="text"
            list="category-options"
            placeholder="e.g. Technology"
            value={values.category}
            onChange={(e) => setField("category", e.target.value)}
            className={inputClass}
          />
          <datalist id="category-options">
            <option value="Technology" />
            <option value="Arts" />
            <option value="Sports" />
            <option value="Academic" />
          </datalist>
          {errors.category && (
            <p className="mt-1 text-xs text-red-600">{errors.category}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="eventDate" className="mb-1 block text-sm font-medium">
          Event date and time
        </label>
        <input
          id="eventDate"
          type="datetime-local"
          value={values.eventDate}
          onChange={(e) => setField("eventDate", e.target.value)}
          className={inputClass}
        />
        {errors.eventDate && (
          <p className="mt-1 text-xs text-red-600">{errors.eventDate}</p>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={values.isPublished}
          onChange={(e) => setField("isPublished", e.target.checked)}
          className="h-4 w-4"
        />
        Publish this event
      </label>

      <button
        type="submit"
        disabled={submitting || success}
        className="rounded bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {submitting ? "Creating..." : "Create Event"}
      </button>
    </form>
  );
}