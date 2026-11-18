import { Controller, Get, Post, Param, Query, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { FindEventsQueryDto } from './dto/find-events-query.dto';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all events (with optional filters)' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved list of events.' })
  findAll(@Query() query: FindEventsQueryDto) {
    return this.eventsService.findAll(query);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get all upcoming events' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved upcoming events.' })
  findUpcoming() {
    return this.eventsService.findUpcoming();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific event by ID' })
  @ApiParam({ name: 'id', description: 'The unique identifier of the event', type: 'string' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the event.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Get(':id/sessions')
  @ApiOperation({ summary: 'Get all sessions for a specific event' })
  @ApiParam({ name: 'id', description: 'The unique identifier of the event', type: 'string' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved sessions for the event.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  findSessions(@Param('id') id: string) {
    return this.eventsService.findSessions(id);
  }

  @Get(':id/sessions/:sessionId')
  @ApiOperation({ summary: 'Get a specific session by ID within an event' })
  @ApiParam({ name: 'id', description: 'The unique identifier of the event', type: 'string' })
  @ApiParam({ name: 'sessionId', description: 'The unique identifier of the session', type: 'string' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the session.' })
  @ApiResponse({ status: 404, description: 'Event or session not found.' })
  findSessionById(
    @Param('id') id: string,
    @Param('sessionId') sessionId: string,
  ) {
    return this.eventsService.findSessionById(id, sessionId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({ status: 201, description: 'The event has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request - validation failed on DTO properties.' })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }
}