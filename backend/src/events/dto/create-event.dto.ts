import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'NestJs Event' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: 'An event about NestJS.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Addis Ababa, Ethiopia' })
  @IsString()
  @IsNotEmpty()
  location!: string;

  @ApiProperty({ example: '2026-12-15T09:00:00.000Z' })
  @IsISO8601()
  eventDate!: string;

  @ApiProperty({ example: 'Technology' })
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}