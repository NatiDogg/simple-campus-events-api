import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, Matches } from 'class-validator';

export class FindEventsQueryDto {
  @ApiPropertyOptional({
    example: 'technology',
    description: 'Filter events by category',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    example: 'main',
    description: 'Filter events by location',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    example: 'true',
    description: 'Filter events by publication status',
  })
  @IsOptional()
  @IsIn(['true', 'false'], { message: 'isPublished must be "true" or "false"' })
  isPublished?: string;

  @ApiPropertyOptional({
    enum: ['eventDate', 'title'],
    example: 'eventDate',
    description: 'The field to sort the results by',
  })
  @IsOptional()
  @IsIn(['eventDate', 'title'])
  sortBy?: 'eventDate' | 'title';

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    example: 'asc',
    description: 'The sort order direction',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';

  @ApiPropertyOptional({
    example: '1',
    description: 'The page number for pagination',
  })
  @IsOptional()
  @Matches(/^[1-9]\d*$/, { message: 'page must be a positive whole number' })
  page?: string;

  @ApiPropertyOptional({
    example: '10',
    description: 'The number of items to return per page',
  })
  @IsOptional()
  @Matches(/^[1-9]\d*$/, { message: 'limit must be a positive whole number' })
  limit?: string;
}