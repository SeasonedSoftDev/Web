import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { JobService } from 'src/utils/classes/job-service';
import { NotificationType, UserRole, UserStatus } from 'src/utils';
import { NotificationsService } from 'src/core/notifications/notifications.service';

@Injectable()
export class ClientReminderService extends JobService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationsService,
  ) {
    super(new Logger(ClientReminderService.name));
  }

  private notifyAdminToContactClientAfterThreeDays = async () => {
    this.logger.log('Notification ran');
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    return await this.prismaService.$transaction(async (tx) => {
      const uncontactedNotifications = await tx.notification.findMany({
        where: {
          type: NotificationType.ClientStatusUnchanged,
          notificationUsers: {
            every: {
              user: {
                role: UserRole.SuperAdmin,
              },
            },
          },
        },
        select: {
          id: true,
        },
      });

      if (uncontactedNotifications.length) {
        const notificationIds = uncontactedNotifications.map(
          (notification) => notification.id,
        );
        await tx.notification.deleteMany({
          where: {
            id: {
              in: notificationIds,
            },
          },
        });
      }
      const unconfirmedClients = await tx.client.findMany({
        where: {
          createdAt: {
            lte: threeDaysAgo,
          },
          user: {
            status: UserStatus.Unconfirmed,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      unconfirmedClients.forEach(async (client) => {
        // const createdAtDate = client.createdAt;
        // const timeDifference = today.getTime() - createdAtDate.getTime();
        // const daysSinceCreation = Math.floor(timeDifference / (1000 * 3600 * 24));
        const clientFullName = `${client.user.firstName} ${client.user.lastName}`;
        await this.notificationService.clientStatusUnchanged(
          client.id,
          clientFullName,
        );
      });
    });
  };

  private notifyAdminThatClientHasNotMadeFirstOrderInSevenDays = async () => {
    this.logger.log('Notification ran');
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return await this.prismaService.$transaction(async (tx) => {
      const scheduledClientsWithNoProducts = await tx.client.findMany({
        where: {
          createdAt: {
            lte: sevenDaysAgo,
          },
          user: {
            status: UserStatus.Scheduled,
          },
          platformProductOrder: {
            none: {},
          },
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      scheduledClientsWithNoProducts.forEach(async (client) => {
        const clientUserNotifications =
          await this.prismaService.notification.findMany({
            where: {
              type: NotificationType.ClientNoFirstOrderInSetDays,
            },
            include: {
              notificationUsers: {
                where: {
                  userId: client.userId,
                },
              },
            },
          });

        if (clientUserNotifications.length) {
          const notificationIds = clientUserNotifications.map(
            (clientNotification) => clientNotification.id,
          );
          await this.prismaService.notification.deleteMany({
            where: {
              id: {
                in: notificationIds,
              },
            },
          });
        }
        const clientFullName = `${client.user.firstName} ${client.user.lastName}`;
        await this.notificationService.noClientFirstOrderInSetDays(
          client.user.id,
          clientFullName,
        );
      });
    });
  };

  private NotifyAdminThatClientHasntVerifiedEmailInThreeDays = async () => {
    // const today = new Date();
    this.logger.log('Notification ran');
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    return await this.prismaService.$transaction(async (tx) => {
      const scheduledClientsWithNoProducts = await tx.client.findMany({
        where: {
          createdAt: {
            lte: threeDaysAgo,
          },
          user: {
            status: UserStatus.Unconfirmed,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      scheduledClientsWithNoProducts.forEach(async (client) => {
        const clientUserNotifications =
          await this.prismaService.notification.findMany({
            where: {
              type: NotificationType.ClientEmailUnverified,
            },
            include: {
              notificationUsers: {
                where: {
                  userId: client.userId,
                },
              },
            },
          });

        if (clientUserNotifications.length) {
          const notificationIds = clientUserNotifications.map(
            (clientNotification) => clientNotification.id,
          );
          await this.prismaService.notification.deleteMany({
            where: {
              id: {
                in: notificationIds,
              },
            },
          });
        }
        const clientFullName = `${client.user.firstName} ${client.user.lastName}`;
        await this.notificationService.clientEmailUnverified(
          client.user.id,
          clientFullName,
        );
      });
    });
  };

  @Cron(CronExpression.EVERY_DAY_AT_7AM, {
    name: 'remind-admin-about-unconfirmed-clients',
  })
  async remindAdminsAboutUnconfirmedClientsJob() {
    await this.jobWrapper(
      'remind-admin-about-unconfirmed-clients',
      this.notifyAdminToContactClientAfterThreeDays,
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_7AM, {
    name: 'remind-admin-about-unverified-client-email',
  })
  async remindAdminsAboutUnverifiedClientEmailJob() {
    await this.jobWrapper(
      'remind-admin-about-unverified-client-email',
      this.NotifyAdminThatClientHasntVerifiedEmailInThreeDays,
    );
  }

  // @Cron(CronExpression.EVERY_DAY_AT_7AM, {
  @Cron(CronExpression.EVERY_DAY_AT_7AM, {
    name: 'remind-admin-about-client-no-project',
  })
  async remindAdminsAboutClientWithNoProductsJob() {
    await this.jobWrapper(
      'remind-admin-about-client-no-project',
      this.notifyAdminThatClientHasNotMadeFirstOrderInSevenDays,
    );
  }
}
