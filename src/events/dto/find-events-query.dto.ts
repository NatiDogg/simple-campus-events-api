

import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindEventsQueryDto {
  @ApiPropertyOptional({
    example: 'Technology',
    description: 'Filter events by category',
  })
  category?: string;

  @ApiPropertyOptional({
    example: 'Addis Ababa',
    description: 'Filter events by location',
  })
  location?: string;

  @ApiPropertyOptional({
    example: 'true',
    description: 'Filter events by publication status',
  })
  isPublished?: string;

  @ApiPropertyOptional({
    enum: ['eventDate', 'title'],
    example: 'eventDate',
    description: 'The field to sort the results by',
  })
  sortBy?: 'eventDate' | 'title';

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    example: 'asc',
    description: 'The sort order direction',
  })
  order?: 'asc' | 'desc';

  @ApiPropertyOptional({
    example: '1',
    description: 'The page number for pagination',
  })
  page?: string;

  @ApiPropertyOptional({
    example: '10',
    description: 'The number of items to return per page',
  })
  limit?: string;
}