import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CampusEvent, Session } from './interface/events.model';
import { CreateEventDto } from './dto/create-event.dto';
import { FindEventsQueryDto } from './dto/find-events-query.dto';
@Injectable()
export class EventsService {
  private events: CampusEvent[] = [
    {
      id: '1',
      title: 'AI & Machine Learning Hackathon',
      description: 'Build innovative solutions using cutting-edge AI models.',
      location: 'main',
      eventDate: '2026-06-15T09:00:00Z',
      category: 'technology',
      isPublished: true,
    },
    {
      id: '2',
      title: 'Web Development Bootcamp',
      description: 'Learn modern full-stack development with NestJS and React.',
      location: 'main',
      eventDate: '2026-06-20T10:00:00Z',
      category: 'technology',
      isPublished: true,
    },
    {
      id: '3',
      title: 'Annual Art Exhibition',
      description: 'Showcasing contemporary works by student artists.',
      location: 'east-wing',
      eventDate: '2026-05-10T14:00:00Z',
      category: 'arts',
      isPublished: true,
    },
    {
      id: '4',
      title: 'Inter-College Basketball Finals',
      description: 'Watch the campus titans battle for the championship trophy.',
      location: 'sports-complex',
      eventDate: '2026-07-01T16:00:00Z',
      category: 'sports',
      isPublished: true,
    },
    {
      id: '5',
      title: 'Drafting Entrepreneurship Pitches',
      description: 'Unpublished workshop session for startup founders.',
      location: 'business-hall',
      eventDate: '2026-07-10T11:00:00Z',
      category: 'business',
      isPublished: false,
    },
  ];

  private sessions: Session[] = [
    {
      id: 's1',
      eventId: '1',
      title: 'Introduction to LLM Fine-Tuning',
      startsAt: '2026-06-15T09:30:00Z',
      endsAt: '2026-06-15T11:00:00Z',
      room: 'Lab 3A',
    },
    {
      id: 's2',
      eventId: '1',
      title: 'Prompt Engineering Best Practices',
      startsAt: '2026-06-15T11:30:00Z',
      endsAt: '2026-06-15T13:00:00Z',
      room: 'Auditorium B',
    },
    {
      id: 's3',
      eventId: '2',
      title: 'NestJS Architecture Deep Dive',
      startsAt: '2026-06-20T10:30:00Z',
      endsAt: '2026-06-20T12:00:00Z',
      room: 'Room 204',
    },
    {
      id: 's4',
      eventId: '2',
      title: 'State Management with Zustand & React',
      startsAt: '2026-06-20T13:00:00Z',
      endsAt: '2026-06-20T14:30:00Z',
      room: 'Room 204',
    },
  ];

  findAll(query: FindEventsQueryDto) {
    let result = [...this.events];


    if (query.category) {
      result = result.filter((e) => e.category.toLowerCase() === query.category?.toLowerCase());
    }
    if (query.location) {
      result = result.filter((e) => e.location.toLowerCase() === query.location?.toLowerCase());
    }
    if (query.isPublished !== undefined) {
      const isPub = query.isPublished === 'true';
      result = result.filter((e) => e.isPublished === isPub);
    }

    
    if (query.sortBy) {
      const order = query.order === 'desc' ? -1 : 1;
      result.sort((a, b) => {
        if (query.sortBy === 'eventDate') {
          return (new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()) * order;
        }
        if (query.sortBy === 'title') {
          return a.title.localeCompare(b.title) * order;
        }
        return 0;
      });
    }

  
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.max(1, parseInt(query.limit || '5', 10));
    const total = result.length;
    const totalPages = Math.ceil(total / limit) || 1;

    const offset = (page - 1) * limit;
    const items = result.slice(offset, offset + limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  findUpcoming() {
    const now = new Date();
    return this.events.filter((e) => new Date(e.eventDate) >= now);
  }

  findOne(id: string): CampusEvent {
    const event = this.events.find((e) => e.id === id);
    if (!event) {
      throw new NotFoundException(`Event with ID '${id}' not found`);
    }
    return event;
  }

  findSessions(eventId: string): Session[] {
    this.findOne(eventId); 
    return this.sessions.filter((s) => s.eventId === eventId);
  }

  findSessionById(eventId: string, sessionId: string): Session {
    this.findOne(eventId); // Ensures event exists
    const session = this.sessions.find((s) => s.id === sessionId && s.eventId === eventId);
    if (!session) {
      throw new NotFoundException(`Session with ID '${sessionId}' not found for event '${eventId}'`);
    }
    return session;
  }

  create(dto: CreateEventDto): CampusEvent {
    if (!dto.title || !dto.eventDate || !dto.category || !dto.location) {
      throw new BadRequestException('Missing required event fields');
    }

    const newEvent: CampusEvent = {
      id: String(this.events.length + 1),
      title: dto.title,
      description: dto.description || '',
      location: dto.location,
      eventDate: dto.eventDate,
      category: dto.category,
      isPublished: dto.isPublished ?? true,
    };

    this.events.push(newEvent);
    return newEvent;
  }
}
