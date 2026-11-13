
export interface Session {
  id: string;
  eventId: string;
  title: string;
  startsAt: string;
  endsAt: string;
  room: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  eventDate: string; 
  category: string;
  isPublished: boolean;
}


export class CreateEventDto {
  title!: string;
  description!: string;
  location!: string;
  eventDate!: string;
  category!: string;
  isPublished!: boolean;
}


export class FindEventsQueryDto {
  category?: string;
  location?: string;
  isPublished?: string;
  sortBy?: 'eventDate' | 'title';
  order?: 'asc' | 'desc';
  page?: string;
  limit?: string;
}