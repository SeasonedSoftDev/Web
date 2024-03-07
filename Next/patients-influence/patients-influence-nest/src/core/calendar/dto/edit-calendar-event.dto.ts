import {
  IsArray,
  IsDate,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';

export class EditCalendarEventDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  meetUrl?: string;

  @IsDate()
  @IsOptional()
  startTime?: Date;

  @IsDate()
  @IsOptional()
  endTime?: Date;

  @IsInt()
  @IsPositive()
  @IsOptional()
  eventType?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  organizerId?: number;

  @IsInt({ each: true })
  @IsArray()
  @IsOptional()
  attendees?: number[];
}
