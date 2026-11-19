import type {
  CampusEvent,
  CreateEventInput,
  EventQuery,
  PaginatedEvents,
  Session,
} from "@/types/event";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_URL) {
    throw new ApiError("NEXT_PUBLIC_API_BASE_URL is not set", 0);
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { cache: "no-store", ...init });
  } catch {
    throw new ApiError("Cannot reach the server. Is the backend running?", 0);
  }

  if (!response.ok) {
    throw new ApiError(`Request failed (${response.status})`, response.status);
  }
  return response.json();
}

export function getEvents(query: EventQuery = {}): Promise<PaginatedEvents> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const qs = params.toString();
  return request<PaginatedEvents>(`/events${qs ? `?${qs}` : ""}`);
}

export function getUpcomingEvents(): Promise<CampusEvent[]> {
  return request<CampusEvent[]>("/events/upcoming");
}

export function getEventById(id: string): Promise<CampusEvent> {
  return request<CampusEvent>(`/events/${id}`);
}

export function getEventSessions(id: string): Promise<Session[]> {
  return request<Session[]>(`/events/${id}/sessions`);
}

export function getSessionById(id: string, sessionId: string): Promise<Session> {
  return request<Session>(`/events/${id}/sessions/${sessionId}`);
}

export function createEvent(event: CreateEventInput): Promise<CampusEvent> {
  return request<CampusEvent>("/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
}