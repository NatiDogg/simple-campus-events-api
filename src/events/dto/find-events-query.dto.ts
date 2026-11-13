

export class FindEventsQueryDto {
  category?: string;
  location?: string;
  isPublished?: string;
  sortBy?: 'eventDate' | 'title';
  order?: 'asc' | 'desc';
  page?: string;
  limit?: string;
}