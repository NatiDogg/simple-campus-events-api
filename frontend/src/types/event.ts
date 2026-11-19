export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  eventDate: string;
  category: string;
  isPublished: boolean;
}

export interface Session {
  id: string;
  eventId: string;
  title: string;
  startsAt: string;
  endsAt: string;
  room: string;
}

export interface PaginatedEvents {
  items: CampusEvent[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EventQuery {
  category?: string;
  location?: string;
  isPublished?: "true" | "false";
  sortBy?: "eventDate" | "title";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export type CreateEventInput = Omit<CampusEvent, "id">;