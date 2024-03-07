import {
  Get,
  Body,
  Patch,
  Delete,
  Param,
  Controller,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateCalendarEventDto, EditCalendarEventDto } from './dto';
import { AuthUser } from '../auth/decorators';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@Controller('calendar')
@ApiTags('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('events')
  getCalendarEvents(@AuthUser() user: User) {
    return this.calendarService.getCalendarEvents(user.id);
  }

  @Get('events/:id')
  getCalendarEvent(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.calendarService.getCalendarEvent(user.id, id);
  }

  @Post('events')
  createCalendarEvent(
    @AuthUser() user: User,
    @Body() dto: CreateCalendarEventDto,
  ) {
    return this.calendarService.createCalendarEvent(user.id, dto);
  }

  @Patch('events/:id')
  editCalendarEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditCalendarEventDto,
  ) {
    return this.calendarService.editCalendarEvent(id, dto);
  }

  @Delete('events/:id')
  deleteCalendarEvent(@Param('id', ParseIntPipe) id: number) {
    return this.calendarService.deleteCalendarEvent(id);
  }
}
