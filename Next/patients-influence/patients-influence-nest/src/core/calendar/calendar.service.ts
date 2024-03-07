import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { generateRelatedModelCRUDFactory } from '../../utils/factories/generate-related-model-crud.factory';
import { CreateCalendarEventDto, EditCalendarEventDto } from './dto';
import { CalendarEventAttendee, Prisma } from '@prisma/client';

@Injectable()
export class CalendarService {
  constructor(private readonly prismaService: PrismaService) {}

  async getCalendarEvents(userId: number) {
    return this.prismaService.calendarEvent.findMany({
      where: {
        OR: [
          { attendees: { some: { userId } } },
          { organizerId: userId },
          { creatorId: userId },
        ],
      },
      include: {
        attendees: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async getCalendarEvent(userId: number, id: number) {
    const event = await this.prismaService.calendarEvent.findFirst({
      where: {
        AND: [
          { id },
          {
            OR: [
              { attendees: { some: { userId } } },
              { organizerId: userId },
              { creatorId: userId },
            ],
          },
        ],
      },
      include: {
        attendees: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Calendar event ${id} not found!`);
    }

    return event;
  }

  async createCalendarEvent(creatorId: number, dto: CreateCalendarEventDto) {
    const {
      title,
      description,
      startTime,
      endTime,
      eventType,
      organizerId,
      attendees,
      meetUrl,
    } = dto;

    return await this.prismaService.calendarEvent.create({
      data: {
        title,
        description,
        startTime,
        endTime,
        eventType,
        creatorId,
        organizerId,
        meetUrl,
        attendees: {
          createMany: {
            data: attendees.map((userId) => ({
              userId,
            })),
          },
        },
      },
    });
  }

  async deleteCalendarEvent(id: number) {
    return await this.prismaService.calendarEvent.delete({
      where: {
        id,
      },
    });
  }

  async editCalendarEvent(id: number, dto: EditCalendarEventDto) {
    const {
      title,
      description,
      startTime,
      endTime,
      eventType,
      organizerId,
      attendees,
      meetUrl,
    } = dto;

    return await this.prismaService.calendarEvent.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        startTime,
        endTime,
        eventType,
        organizerId,
        meetUrl,
        attendees: generateRelatedModelCRUDFactory<
          CalendarEventAttendee,
          Prisma.CalendarEventAttendeeWhereUniqueInput
        >()(
          attendees,
          { id, foreignKey: 'calendarEventId' },
          [{ id: (obj) => obj, foreignKey: 'userId' }],
          'CalendarEventAttendeeIdentifier',
        ),
      },
    });
  }
}
