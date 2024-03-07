import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { JobService } from 'src/utils/classes/job-service';
import { NotificationType, UserRole, UserStatus } from 'src/utils';
import { NotificationsService } from 'src/core/notifications/notifications.service';

@Injectable()
export class InfluencerReminderService extends JobService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationsService,
  ) {
    super(new Logger(InfluencerReminderService.name));
  }

  private notifyAdminInfluencerNotCmpletedVerificationAfterThreeDays =
    async () => {
      this.logger.log('Notification ran');
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      return await this.prismaService.$transaction(async (tx) => {
        const uncontactedNotifications = await tx.notification.findMany({
          where: {
            type: NotificationType.InfluencerNotVerified,
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
        const unverifiedInfluencers = await tx.influencer.findMany({
          where: {
            createdAt: {
              lte: threeDaysAgo,
            },
            user: {
              status: UserStatus.Confirmed,
              role: UserRole.Influencer,
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

        unverifiedInfluencers.forEach(async (influencer) => {
          // const createdAtDate = influencer.createdAt;
          // const timeDifference = today.getTime() - createdAtDate.getTime();
          // const daysSinceCreation = Math.floor(timeDifference / (1000 * 3600 * 24));
          const influencerFullName = `${influencer.user.firstName} ${influencer.user.lastName}`;
          await this.notificationService.influencerHasntVerified(
            influencer.user.id,
            influencerFullName,
          );
        });
      });
    };

  private notifyAdminToApproveInfluencerAfterThreeDays = async () => {
    this.logger.log('Notification ran');
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    return await this.prismaService.$transaction(async (tx) => {
      const toBeApprovedInfluencers = await tx.influencer.findMany({
        where: {
          createdAt: {
            lte: threeDaysAgo,
          },
          user: {
            status: UserStatus.ToBeApproved,
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

      toBeApprovedInfluencers.forEach(async (influencer) => {
        const influencerUserNotifications =
          await this.prismaService.notification.findMany({
            where: {
              type: NotificationType.InfluencerStatusUnchanged,
            },
            include: {
              notificationUsers: {
                where: {
                  userId: influencer.userId,
                },
              },
            },
          });

        if (influencerUserNotifications.length) {
          const notificationIds = influencerUserNotifications.map(
            (influencerNotification) => influencerNotification.id,
          );
          await this.prismaService.notification.deleteMany({
            where: {
              id: {
                in: notificationIds,
              },
            },
          });
        }
        const influencerFullName = `${influencer.user.firstName} ${influencer.user.lastName}`;
        await this.notificationService.influencerStatusUnchanged(
          influencer.user.id,
          influencerFullName,
        );
      });
    });
  };

  private notifyAdminThatInfluencerHasntVerifiedEmailInThreeDays = async () => {
    // const today = new Date();
    this.logger.log('Notification ran');
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    return await this.prismaService.$transaction(async (tx) => {
      const unverifiedInfluencers = await tx.influencer.findMany({
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

      unverifiedInfluencers.forEach(async (influencer) => {
        const influencerUserNotifications =
          await this.prismaService.notification.findMany({
            where: {
              type: NotificationType.InfluencerEmailUnverified,
            },
            include: {
              notificationUsers: {
                where: {
                  userId: influencer.userId,
                },
              },
            },
          });

        if (influencerUserNotifications.length) {
          const notificationIds = influencerUserNotifications.map(
            (influencerNotification) => influencerNotification.id,
          );
          await this.prismaService.notification.deleteMany({
            where: {
              id: {
                in: notificationIds,
              },
            },
          });
        }
        const influencerFullName = `${influencer.user.firstName} ${influencer.user.lastName}`;
        await this.notificationService.influencerEmailUnverified(
          influencer.user.id,
          influencerFullName,
        );
      });
    });
  };

  @Cron(CronExpression.EVERY_DAY_AT_7AM, {
    name: 'remind-admin-about-unverified-influencers',
  })
  async remindAdminsAboutUnverifiedInfluencersJob() {
    await this.jobWrapper(
      'remind-admin-about-unverified-influencers',
      this.notifyAdminInfluencerNotCmpletedVerificationAfterThreeDays,
    );
  }

  // NotifyAdminToApproveInfluencerAfterThreeDays
  @Cron(CronExpression.EVERY_DAY_AT_7AM, {
    name: 'remind-admin-about-not-approved-influencers',
  })
  async remindAdminAboutNotApprovedInfluencersAfterThreeDays() {
    await this.jobWrapper(
      'remind-admin-about-not-approved-influencers',
      this.notifyAdminToApproveInfluencerAfterThreeDays,
    );
  }

  // // @Cron(CronExpression.EVERY_DAY_AT_7AM, {
  @Cron(CronExpression.EVERY_DAY_AT_7AM, {
    name: 'remind-admin-about-influencer-unverified-email',
  })
  async remindAdminAboutInfluencersUnverifiedEmails() {
    await this.jobWrapper(
      'remind-admin-about-influencer-unverified-email',
      this.notifyAdminThatInfluencerHasntVerifiedEmailInThreeDays,
    );
  }
}
