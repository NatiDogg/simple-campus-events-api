

import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    example: 'NestJs Event',
    description: 'The title of the event',
  })
  title!: string;

  @ApiProperty({
    example: 'An event about a modern backend framework called Nestjss.',
    description: 'A detailed description of the event',
  })
  description!: string;

  @ApiProperty({
    example: 'Addis Ababa, Ethiopia',
    description: 'The physical or virtual location of the event',
  })
  location!: string;

  @ApiProperty({
    example: '2026-06-15T09:00:00.000Z',
    description: 'The date and time when the event takes place',
  })
  eventDate!: string;

  @ApiProperty({
    example: 'Technology',
    description: 'The category or type of the event',
  })
  category!: string;

  @ApiProperty({
    example: true,
    description: 'Flag indicating whether the event is published publicly or not',
  })
  isPublished!: boolean;
}
