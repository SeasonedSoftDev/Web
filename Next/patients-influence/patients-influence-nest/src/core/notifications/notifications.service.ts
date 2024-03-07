import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Namespace } from 'socket.io';
import { NotificationType, NotificationTypeToName, UserRole } from 'src/utils';
import { NotificationEntity } from './entities';
import { plainToClass } from 'class-transformer';
import { IUserJwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class NotificationsService {
  constructor(private readonly prismaService: PrismaService) {}

  public socket: Namespace = null;

  async getAllAdminIndexes() {
    const admins = await this.prismaService.user.findMany({
      where: {
        role: UserRole.SuperAdmin,
      },
    });
    return admins.map((a) => a.id);
  }

  async createNotification(dto: CreateNotificationDto) {
    const {
      title,
      description,
      type,
      link,
      variant,
      notificationUsers,
      notificationPayload,
    } = dto;

    const payload =
      typeof notificationPayload === 'object' &&
      !!Object.keys(notificationPayload).length
        ? { create: notificationPayload }
        : undefined;

    const notification = await this.prismaService.notification.create({
      data: {
        title,
        description,
        type,
        link,
        variant,
        notificationUsers: {
          createMany: {
            data: notificationUsers.map((userId) => ({
              userId,
            })),
          },
        },
        notificationPayload: payload,
      },
      include: {
        notificationPayload: {
          include: {
            user: true,
            admin: { include: { admin: true } },
            ambassador: { include: { ambassador: true } },
            influencer: { include: { influencer: true } },
            client: { include: { client: true } },
            calendarEvent: true,
            campaign: true,
            platformProductOrder: true,
            socialMediaListening: true,
            survey: true,
            transaction: true,
            transactionFlow: true,
            campaignReport: true,
          },
        },
        notificationUsers: true,
      },
    });

    const eventName = NotificationTypeToName(type);

    const formattedNotification = plainToClass(
      NotificationEntity,
      notification,
      {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
        exposeUnsetFields: false,
      },
    );

    this.socket
      .in(notificationUsers.map((u) => u.toString()))
      .emit('getUsersNotifications', [formattedNotification]);

    return formattedNotification;
  }

  async getUsersNotifications(user: IUserJwtPayload) {
    const notifications = await this.prismaService.notification.findMany({
      where: {
        notificationUsers: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        notificationPayload: {
          include: {
            user: true,
            admin: { include: { admin: true } },
            ambassador: { include: { ambassador: true } },
            influencer: { include: { influencer: true } },
            client: { include: { client: true } },
            calendarEvent: true,
            campaign: true,
            platformProductOrder: true,
            socialMediaListening: true,
            survey: true,
            transaction: true,
            transactionFlow: true,
            campaignReport: true,
          },
        },
        notificationUsers: {
          where: {
            userId: user.id,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    const formattedNotifications: NotificationEntity[] = [];

    notifications.forEach((notification) => {
      const formattedNotification = plainToClass(
        NotificationEntity,
        notification,
        {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
          exposeUnsetFields: false,
        },
      );
      formattedNotifications.push(formattedNotification);
    });

    return formattedNotifications;
  }

  async welcomeUserAfterRegistration(clientId) {
    const notification = await this.createNotification({
      title: 'Welcome User',
      description: `Welcome to Patients Influence!`,
      type: NotificationType.WelcomeRegisteredUser,
      variant: 'info',
      notificationPayload: { clientId },
      notificationUsers: [clientId],
    });

    return notification;
  }

  async clientICRegistered(clientId: number) {
    const notification = await this.createNotification({
      title: 'Client Registered (CI)',
      description: `New client has been registered (From contacted/identified)`,
      type: NotificationType.ClientICRegistered,
      variant: 'info',
      notificationPayload: { clientId },
      notificationUsers: await this.getAllAdminIndexes(),
    });

    return notification;
  }

  async clientRegistered(clientId: number, clientFullName: string) {
    const notification = await this.createNotification({
      title: 'Client Registered',
      description: `New client sign-up: ${clientFullName}`,
      type: NotificationType.ClientRegistered,
      variant: 'info',
      notificationPayload: { clientId },
      notificationUsers: await this.getAllAdminIndexes(),
    });

    return notification;
  }

  async clientStatusUnchanged(clientId: number, userFullName: string) {
    const adminNotification = await this.createNotification({
      title: 'Client Status Unchanged',
      description: `You haven't contacted client ${userFullName} yet.`,
      type: NotificationType.ClientStatusUnchanged,
      variant: 'warning',
      notificationPayload: { clientId },
      notificationUsers: await this.getAllAdminIndexes(),
    });

    return { adminNotification };
  }

  async clientOrderCreated(
    clientId: number,
    clientFullname: string,
    platformProductOrderId: number,
  ) {
    const notification = await this.createNotification({
      title: 'New Order',
      description: `Client ${clientFullname} made their first order!`,
      type: NotificationType.ClientOrderCreated,
      variant: 'info',
      notificationPayload: { clientId, platformProductOrderId },
      notificationUsers: await this.getAllAdminIndexes(),
    });

    return notification;
  }

  async clientEmailUnverified(userId: number, userFullName: string) {
    const notification = await this.createNotification({
      title: 'Client Email Unverified',
      description: `Client ${userFullName} hasn't verified their email.`,
      type: NotificationType.ClientEmailUnverified,
      variant: 'warning',
      notificationPayload: { userId },
      notificationUsers: await this.getAllAdminIndexes(),
    });

    return notification;
  }

  async noClientFirstOrderInSetDays(clientId: number, userFullName: string) {
    const adminNotification = await this.createNotification({
      title: "Client Hasn't Ordered",
      description: `Client ${userFullName} hasn't made their first order.`,
      type: NotificationType.ClientNoFirstOrderInSetDays,
      variant: 'warning',
      notificationPayload: { clientId },
      notificationUsers: await this.getAllAdminIndexes(),
    });

    const clientNotification = await this.createNotification({
      title: 'First Order Missing',
      description: `Ready to make your first order? We're here to help.`,
      type: NotificationType.ClientNoFirstOrderInSetDays,
      variant: 'warning',
      notificationPayload: { clientId },
      notificationUsers: [clientId],
    });

    return { adminNotification, clientNotification };
  }

  async clientIndustryUpdated(userId: number, userFullName: string) {
    const notification = await this.createNotification({
      title: 'Client Industry Updated',
      description: `Client ${userFullName} industry updated.`,
      type: NotificationType.ClientIndustryUpdated,
      variant: 'success',
      notificationPayload: { userId },
      notificationUsers: await this.getAllAdminIndexes(),
    });

    return notification;
  }

  async influencerRegistered(influencerId: number, influencerFullName: string) {
    const notification = await this.createNotification({
      title: 'Influencer Registered',
      description: `New influencer sign-up: ${influencerFullName}`,
      type: NotificationType.InfluencerRegistered,
      variant: 'info',
      notificationPayload: { influencerId },
      notificationUsers: await this.getAllAdminIndexes(),
    });

    return notification;
  }

  async influencerVerified(influencerId: number, influencerFullName: string) {
    const notification = await this.createNotification({
      title: 'Influencer Verified',
      description: `Influencer ${influencerFullName} completed the verification process.`,
      type: NotificationType.InfluencerVerified,
      variant: 'success',
      notificationPayload: { influencerId },
      notificationUsers: await this.getAllAdminIndexes(),
    });

    return notification;
  }

  async influencerApproved(influencerId: number) {
    const notification = await this.createNotification({
      title: 'Account Approved',
      description: "Congratulations! You've been approved.",
      type: NotificationType.InfluencerApproved,
      variant: 'success',
      notificationPayload: { influencerId },
      notificationUsers: [influencerId],
    });

    return notification;
  }

  async influencerStatusUnchanged(
    influencerId: number,
    influencerFullName: string,
  ) {
    const notification = await this.createNotification({
      title: 'Influencer Status Not Approved',
      description: `Influencer ${influencerFullName} hasn't been approved yet.`,
      type: NotificationType.InfluencerStatusUnchanged,
      variant: 'warning',
      notificationPayload: { influencerId },
      notificationUsers: await this.getAllAdminIndexes(),
    });

    return notification;
  }

  async influencerEmailUnverified(
    influencerId: number,
    influencerFullName: string,
  ) {
    const notification = await this.createNotification({
      title: 'Influencer Email Unverified',
      description: `Influencer ${influencerFullName} hasn't verified their email.`,
      type: NotificationType.InfluencerEmailUnverified,
      variant: 'warning',
      notificationPayload: { influencerId },
      notificationUsers: await this.getAllAdminIndexes(),
    });

    return notification;
  }

  async influencerHasntVerified(
    influencerUserId: number,
    influencerFullName: string,
  ) {
    const adminNotification = await this.createNotification({
      title: "Influencer Didn't verify",
      description: `Influencer ${influencerFullName} hasn't completed verification.`,
      type: NotificationType.InfluencerNotVerified,
      variant: 'warning',
      notificationPayload: { influencerId: influencerUserId },
      notificationUsers: await this.getAllAdminIndexes(),
    });

    const influencerNotification = await this.createNotification({
      title: "Influencer Didn't verify",
      description: `Complete your verification to start using all our features.`,
      type: NotificationType.InfluencerNotVerified,
      variant: 'warning',
      notificationPayload: { influencerId: influencerUserId },
      notificationUsers: [influencerUserId],
    });

    return [adminNotification, influencerNotification];
  }

  // Saving example
  // async influencerStatusUnchanged(influencerId: number, days: number) {
  //   const adminNotification = await this.createNotification({
  //     title: 'Influencer Status Unchanged',
  //     description: `Influencer status hasn't been changed for ${days} days`,
  //     type: NotificationType.InfluencerStatusUnchanged,
  //     variant: 'warning',
  //     notificationPayload: { influencerId },
  //     notificationUsers: await this.getAllAdminIndexes(),
  //   });

  //   const influencerNotification = await this.createNotification({
  //     title: 'Status Unchanged',
  //     description: `Your status hasn't been changed for ${days} days`,
  //     type: NotificationType.InfluencerStatusUnchanged,
  //     variant: 'warning',
  //     notificationPayload: { influencerId },
  //     notificationUsers: [influencerId],
  //   });

  //   return { adminNotification, influencerNotification };
  // }

  async campaignCreated(
    userId: number,
    campaignId: number,
    userFullName: string,
  ) {
    const notification = await this.createNotification({
      title: 'New Campaign',
      description: `New campaign created by client ${userFullName}`,
      type: NotificationType.CampaignCreated,
      variant: 'info',
      notificationPayload: { userId, campaignId },
      notificationUsers: await this.getAllAdminIndexes(),
    });

    return notification;
  }

  async campaignInfluencersAdded(clientId: number, campaignId: number) {
    const notification = await this.createNotification({
      title: 'Campaign',
      description: 'Influencers have been added to your campaign.',
      type: NotificationType.CampaignInfluencerAdded,
      variant: 'info',
      notificationPayload: { campaignId },
      notificationUsers: [clientId],
    });

    return notification;
  }

  async campaignInfluencerRemovedBeforeApplication(
    influencerId: number,
    campaignId: number,
  ) {
    const notification = await this.createNotification({
      title: 'Campaign',
      description: 'Influencer has been removed before their application',
      type: NotificationType.CampaignInfluencerRemovedBeforeApplication,
      variant: 'warning',
      notificationPayload: { influencerId, campaignId },
      notificationUsers: await this.getAllAdminIndexes(),
    });

    return notification;
  }

  async campaignInfluencerRemovedAfterApplication(
    influencerId: number,
    campaignId: number,
    influencerFullName: string,
    campaignName: string,
  ) {
    const adminNotification = await this.createNotification({
      title: 'Campaign',
      description: `Influencer ${influencerFullName} has been removed from the campaign "${campaignName}".`,
      type: NotificationType.CampaignInfluencerRemovedAfterApplication,
      variant: 'error',
      notificationPayload: { influencerId, campaignId },
      notificationUsers: await this.getAllAdminIndexes(),
    });

    const influencerNotification = await this.createNotification({
      title: 'Campaign',
      description: `We're sorry to let you know that you've been removed from a campaign.`,
      type: NotificationType.CampaignInfluencerRemovedAfterApplication,
      variant: 'error',
      notificationPayload: { influencerId, campaignId },
      notificationUsers: [influencerId],
    });

    return { adminNotification, influencerNotification };
  }

  async campaignInfluencerInvitedByClient(
    influencerId: number,
    clientId: number,
    campaignId: number,
  ) {
    const adminNotification = await this.createNotification({
      title: 'Campaign',
      description: 'Client have invited influencer to the campaign',
      type: NotificationType.CampaignInfluencerInvited,
      variant: 'info',
      notificationPayload: { influencerId, clientId, campaignId },
      notificationUsers: await this.getAllAdminIndexes(),
    });

    const influencerNotification = await this.createNotification({
      title: 'Campaign',
      description: 'Client have invited you to the campaign',
      type: NotificationType.CampaignInfluencerInvited,
      variant: 'info',
      notificationPayload: { clientId, campaignId },
      notificationUsers: [influencerId],
    });

    return { adminNotification, influencerNotification };
  }

  async campaignInfluencerInvitedByAdmin(
    influencerIds: number[],
    adminId: number,
    clientId: number,
    campaignId: number,
  ) {
    const influencerNotification = await this.createNotification({
      title: 'Campaign',
      description: "You've been invited to join the campaign.",
      type: NotificationType.CampaignInfluencerInvited,
      variant: 'info',
      notificationPayload: { adminId, campaignId },
      notificationUsers: [...influencerIds],
    });

    const clientNotification = await this.createNotification({
      title: 'Campaign',
      description: 'Influencers have been invited to your campaign.',
      type: NotificationType.CampaignInfluencerInvited,
      variant: 'info',
      notificationPayload: { adminId, campaignId },
      notificationUsers: [clientId],
    });

    return [influencerNotification, clientNotification];
  }

  async campaignInfluencerInviteAccepted(
    influencerId: number,
    campaignId: number,
    influencerFullName: string,
    campaignName: string,
  ) {
    const adminIndexes = await this.getAllAdminIndexes();

    const notification = await this.createNotification({
      title: 'Campaign',
      description: `Influencer ${influencerFullName} has responded to the campaign invitation for "${campaignName}"`,
      type: NotificationType.CampaignInfluencerInviteAccepted,
      variant: 'success',
      notificationPayload: { influencerId, campaignId },
      notificationUsers: [...adminIndexes],
    });

    return notification;
  }

  async campaignInfluencerInviteDeclined(
    influencerId: number,
    campaignId: number,
    influencerFullName: string,
    campaignName: string,
  ) {
    const adminIndexes = await this.getAllAdminIndexes();

    const notification = await this.createNotification({
      title: 'Campaign',
      description: `Influencer ${influencerFullName} has responded to the campaign invitation for "${campaignName}"`,
      type: NotificationType.CampaignInfluencerInviteDeclined,
      variant: 'error',
      notificationPayload: { influencerId, campaignId },
      notificationUsers: [...adminIndexes],
    });

    return notification;
  }

  async campaignInfluencerWithdrawAfterApplication(
    influencerId: number,
    clientId: number,
    campaignId: number,
    firstName: string,
    lastName: string,
    campaignName: string,
  ) {
    const adminIndexes = await this.getAllAdminIndexes();

    const adminNotification = await this.createNotification({
      title: 'Campaign',
      description: `Influencer ${firstName} ${lastName} withdrew from the campaign "${campaignName}".`,
      type: NotificationType.CampaignInfluencerWithdrawAfterApplication,
      variant: 'info',
      notificationPayload: { influencerId, campaignId },
      notificationUsers: adminIndexes,
    });

    const clientNotification = await this.createNotification({
      title: 'Campaign',
      description: `Influencer ${firstName} withdrew from the campaign.`,
      type: NotificationType.CampaignInfluencerWithdrawAfterApplication,
      variant: 'info',
      notificationPayload: { influencerId, campaignId },
      notificationUsers: [clientId],
    });

    return [clientNotification, adminNotification];
  }

  async campaignInfluencerLinkSubmitted(
    influencerId: number,
    clientId: number,
    campaignId: number,
    campaignName: string,
    firstName: string,
    lastName: string,
  ) {
    const adminIndexes = await this.getAllAdminIndexes();

    const clientNotification = await this.createNotification({
      title: 'Campaign',
      description: `Influencer ${firstName} submitted their link for the campaign.`,
      type: NotificationType.CampaignInfluencerLinkSubmitted,
      variant: 'info',
      notificationPayload: { influencerId, campaignId },
      notificationUsers: [clientId],
    });

    const adminNotification = await this.createNotification({
      title: 'Campaign',
      description: `Influencer ${firstName} ${lastName} submitted their link for the campaign "${campaignName}"`,
      type: NotificationType.CampaignInfluencerLinkSubmitted,
      variant: 'info',
      notificationPayload: { influencerId, campaignId },
      notificationUsers: [...adminIndexes],
    });

    return [clientNotification, adminNotification];
  }

  async campaignInfluencerMention(
    influencerId: number,
    adminId: number,
    campaignId: number,
  ) {
    const notification = await this.createNotification({
      title: 'Campaign',
      description: 'Influencer has mentioned you in chat',
      type: NotificationType.CampaignInfluencerMention,
      variant: 'info',
      notificationPayload: { influencerId, campaignId },
      notificationUsers: [adminId],
    });

    return notification;
  }

  async campaignMessageUnreadByInfluencer(
    influencerId: number,
    influencerFirstName: string,
    clientId: number,
    campaignId: number,
    campaignName: string,
  ) {
    const notification = await this.createNotification({
      title: 'Campaign',
      description: `Unread message from ${influencerFirstName} regarding the campaign "${campaignName}".`,
      type: NotificationType.CampaignMessageUnread,
      variant: 'info',
      notificationPayload: { influencerId, campaignId },
      notificationUsers: [clientId],
    });

    return notification;
  }

  async campaignMessageUnreadByClient(
    influencerId: number,
    clientId: number,
    campaignId: number,
    clientCompanyName: string,
  ) {
    const notification = await this.createNotification({
      title: 'Campaign',
      description: `Unread message from ${clientCompanyName} regarding the campaign.`,
      type: NotificationType.CampaignMessageUnread,
      variant: 'info',
      notificationPayload: { clientId, campaignId },
      notificationUsers: [influencerId],
    });

    return notification;
  }

  async campaignStarted(
    influencerIds: number[],
    clientId: number,
    clientFirstName: string,
    clientLastName: string,
    campaignId: number,
    campaignName: string,
    ambassadorId: number | undefined,
  ) {
    const clientNotification = await this.createNotification({
      title: 'Campaign',
      description: `Your campaign "${campaignName}" has started.`,
      type: NotificationType.CampaignStarted,
      variant: 'info',
      notificationPayload: { campaignId },
      notificationUsers: [clientId],
    });

    const influencerNotification = await this.createNotification({
      title: 'Campaign',
      description: `The campaign "${campaignName}" you're part of has started.`,
      type: NotificationType.CampaignStarted,
      variant: 'info',
      notificationPayload: { campaignId },
      notificationUsers: [...influencerIds],
    });

    if (ambassadorId) {
      const ambassadorNotification = await this.createNotification({
        title: 'Campaign',
        description: `${clientFirstName} ${clientLastName}'s campaign has started.`,
        type: NotificationType.CampaignStarted,
        variant: 'info',
        notificationPayload: { campaignId },
        notificationUsers: [ambassadorId],
      });

      return [
        clientNotification,
        influencerNotification,
        ambassadorNotification,
      ];
    }
    return [clientNotification, influencerNotification];
  }

  async pingAdminForChatRoom(
    campaignId: number,
    campaignName: string,
    userId: number,
    userFullName: string,
  ) {
    const adminIndexes = await this.getAllAdminIndexes();

    const adminNotification = await this.createNotification({
      title: 'Campaign',
      description: `You have a new message from ${userFullName} related to the campaign "${campaignName}".`,
      type: NotificationType.CampaignAdminPinged,
      variant: 'info',
      notificationPayload: { userId, campaignId },
      notificationUsers: [...adminIndexes],
    });

    return adminNotification;
  }

  async CampaignEnded(
    influencerIds: number[],
    clientId: number,
    ambassadorId: number | undefined,
    campaignId: number,
    campaignName: string,
    clientFullName: string,
  ) {
    const clientNotification = await this.createNotification({
      title: 'Campaign',
      description: `Your campaign "${campaignName}" has ended.`,
      type: NotificationType.CampaignEnded,
      variant: 'info',
      notificationPayload: { campaignId },
      notificationUsers: [clientId],
    });

    const influencerNotification = await this.createNotification({
      title: 'Campaign',
      description: `The campaign "${campaignName}" you're part of has ended.`,
      type: NotificationType.CampaignEnded,
      variant: 'info',
      notificationPayload: { campaignId },
      notificationUsers: [...influencerIds],
    });

    const ambassadorNotification =
      ambassadorId !== undefined
        ? await this.createNotification({
            title: 'Campaign',
            description: `${clientFullName}'s campaign has ended.`,
            type: NotificationType.CampaignEnded,
            variant: 'info',
            notificationPayload: { campaignId },
            notificationUsers: [ambassadorId],
          })
        : undefined;

    return [clientNotification, influencerNotification, ambassadorNotification];
  }

  async campaignReportOrdered(campaignId: number, campaignName: string) {
    const notification = await this.createNotification({
      title: 'Campaign Report',
      description: `A report for "${campaignName}" has been ordered.`,
      type: NotificationType.CampaignReportOrdered,
      variant: 'info',
      notificationPayload: { campaignId },
      notificationUsers: await this.getAllAdminIndexes(),
    });

    return notification;
  }

  async campaignReportDelivered(
    clientId: number,
    ambassadorId: number,
    campaignId: number,
    campaignReportId: number,
  ) {
    const notification = await this.createNotification({
      title: 'Campaign Report',
      description: `Report delivered for campaign`,
      type: NotificationType.CampaignReportDelivered,
      variant: 'info',
      notificationPayload: { campaignId, campaignReportId },
      notificationUsers: [clientId, ambassadorId],
    });

    return notification;
  }

  async markNotificationsAsSeenByUser(
    notificationIds: number[],
    user: IUserJwtPayload,
  ) {
    const notificationsThatAreNotSeen =
      await this.prismaService.notificationUser.findMany({
        where: {
          notificationId: {
            in: notificationIds,
          },
          userId: user.id,
          seen: false,
        },
      });

    if (notificationsThatAreNotSeen.length) {
      const notSeenNotificationIds = notificationsThatAreNotSeen.map(
        (notSeenNotifications) => notSeenNotifications.id,
      );

      const updatedUserNotificationsSeen =
        await this.prismaService.notificationUser.updateMany({
          where: {
            id: {
              in: notSeenNotificationIds,
            },
            userId: user.id,
          },
          data: {
            seen: true,
          },
        });

      return updatedUserNotificationsSeen;
    }
  }

  async campaignSubmissionApprovedOrDeclined(
    influencerId: number,
    campaignId: number,
    campaignName: string,
    influencerFullName: string,
    clientFullName: string,
    isAdmin: boolean,
  ) {
    const adminIndexes = await this.getAllAdminIndexes();

    const influencerNotification = await this.createNotification({
      title: 'Campaign',
      description: `Your submission for the campaign "${campaignName}" has been reviewed.`,
      type: NotificationType.CampaignSubmissionApprovedOrDeclined,
      variant: 'info',
      notificationPayload: { influencerId, campaignId },
      notificationUsers: [influencerId],
    });

    if (!isAdmin) {
      const adminNotification = await this.createNotification({
        title: 'Campaign',
        description: `Client ${clientFullName} reviewed influencer ${influencerFullName}'s submission for the campaign "${campaignName}".`,
        type: NotificationType.CampaignSubmissionApprovedOrDeclined,
        variant: 'info',
        notificationPayload: { influencerId, campaignId },
        notificationUsers: [...adminIndexes],
      });

      return [influencerNotification, adminNotification];
    }
    return influencerNotification;
  }

  async smlOrdered(socialMediaListeningId: number) {
    const notification = await this.createNotification({
      title: 'SML',
      description: `New order for SML`,
      type: NotificationType.SmlOrdered,
      variant: 'info',
      notificationPayload: { socialMediaListeningId },
      notificationUsers: await this.getAllAdminIndexes(),
    });

    return notification;
  }

  async smlDelivered(
    clientId: number,
    socialMediaListeningId: number,
    ambassadorId?: number,
  ) {
    const notification = await this.createNotification({
      title: 'SML',
      description: `SML has been delivered`,
      type: NotificationType.SmlDelivered,
      variant: 'info',
      notificationPayload: { socialMediaListeningId },
      notificationUsers: [clientId, ambassadorId].filter((user) => !!user),
    });

    return notification;
  }

  async smlTokensRequested(socialMediaListeningId: number) {
    const notification = await this.createNotification({
      title: 'SML',
      description: `SML tokens are requested`,
      type: NotificationType.SmlTokensRequested,
      variant: 'info',
      notificationPayload: { socialMediaListeningId },
      notificationUsers: await this.getAllAdminIndexes(),
    });

    return notification;
  }

  async surveyCreated(userId: number, surveyId: number, userFullName: string) {
    const notification = await this.createNotification({
      title: 'Survey',
      description: `New survey created by client ${userFullName}`,
      type: NotificationType.SurveyCreated,
      variant: 'info',
      notificationPayload: { userId, surveyId },
      notificationUsers: await this.getAllAdminIndexes(),
    });

    return notification;
  }

  async surveyInfluencerInvited(influencerIds: number[], surveyId: number) {
    const notification = await this.createNotification({
      title: 'Survey',
      description: `You have been invited to join the survey.`,
      type: NotificationType.SurveyInfluencerInvited,
      variant: 'info',
      notificationPayload: { surveyId },
      notificationUsers: [...influencerIds],
    });

    return notification;
  }

  async surveyInfluencerInviteAccepted(
    influencerId: number,
    surveyId: number,
    influencerFullName: string,
    surveyName: string,
  ) {
    const notification = await this.createNotification({
      title: 'Survey',
      description: `Influencer ${influencerFullName} has responded to the survey invitation for "${surveyName}"`,
      type: NotificationType.SurveyInfluencerInviteAccepted,
      variant: 'success',
      notificationPayload: { influencerId, surveyId },
      notificationUsers: await this.getAllAdminIndexes(),
    });

    return notification;
  }

  async surveyInfluencerInviteDeclined(
    influencerId: number,
    surveyId: number,
    influencerFullName: string,
    surveyName: string,
  ) {
    const notification = await this.createNotification({
      title: 'Survey',
      description: `Influencer ${influencerFullName} has responded to the survey invitation for "${surveyName}"`,
      type: NotificationType.SurveyInfluencerInviteDeclined,
      variant: 'error',
      notificationPayload: { influencerId, surveyId },
      notificationUsers: await this.getAllAdminIndexes(),
    });

    return notification;
  }

  async surveyInfluencerRemovedAfterApplication(
    influencerId: number,
    surveyId: number,
  ) {
    const notification = await this.createNotification({
      title: 'Survey',
      description: `We're sorry to let you know that you've been removed from a survey.`,
      type: NotificationType.SurveyInfluencerRemovedAfterApplication,
      variant: 'warning',
      notificationPayload: { influencerId, surveyId },
      notificationUsers: [influencerId],
    });

    return notification;
  }

  async surveyInfluencerAnswersSubmited(
    influencerId: number,
    surveyId: number,
    surveyName: string,
    firstName: string,
    lastName: string,
  ) {
    const adminIndexes = await this.getAllAdminIndexes();

    const notification = await this.createNotification({
      title: 'Survey',
      description: `Influencer ${firstName} ${lastName} submitted their link for the survey "${surveyName}"`,
      type: NotificationType.SurveyInfluencerAnswersSubmited,
      variant: 'info',
      notificationPayload: { influencerId, surveyId },
      notificationUsers: [...adminIndexes],
    });

    return notification;
  }

  async surveyAnswersApproved(influencerId: number, surveyId: number) {
    const notification = await this.createNotification({
      title: 'Survey',
      description: `Your survey answers have been approved`,
      type: NotificationType.SurveyAnswersApproved,
      variant: 'info',
      notificationPayload: { influencerId, surveyId },
      notificationUsers: [influencerId],
    });

    return notification;
  }

  async surveyMessageUnreadByInfluencer(
    influencerId: number,
    surveyId: number,
    influencerFullName: string,
    surveyName: string,
  ) {
    const notification = await this.createNotification({
      title: 'Survey',
      description: `Unread message from ${influencerFullName} regarding the survey "${surveyName}".`,
      type: NotificationType.SurveyMessageUnread,
      variant: 'info',
      notificationPayload: { influencerId, surveyId },
      notificationUsers: await this.getAllAdminIndexes(),
    });

    return notification;
  }

  async surveyMessageUnreadByAdmin(
    influencerId: number,
    adminId: number,
    surveyId: number,
    minutes: number,
  ) {
    const notification = await this.createNotification({
      title: 'Survey',
      description: `Admin sent a message before ${minutes} minutes`,
      type: NotificationType.SurveyMessageUnread,
      variant: 'info',
      notificationPayload: { adminId, surveyId },
      notificationUsers: [influencerId],
    });

    return notification;
  }

  async surveyInfluencerWithdrawAfterApplication(
    influencerId: number,
    surveyId: number,
    firstName: string,
    lastName: string,
    surveyName: string,
  ) {
    const adminIndexes = await this.getAllAdminIndexes();

    const notification = await this.createNotification({
      title: 'Campaign',
      description: `Influencer ${firstName} ${lastName} withdrew from the survey "${surveyName}".`,
      type: NotificationType.SurveyInfluencerWithdrawAfterApplication,
      variant: 'info',
      notificationPayload: { influencerId, surveyId },
      notificationUsers: adminIndexes,
    });

    return notification;
  }

  async SurveyStarted(
    influencerIds: number[],
    clientId: number,
    clientFirstName: string,
    clientLastName: string,
    surveyId: number,
    surveyName: string,
    ambassadorId: number | undefined,
  ) {
    const clientNotification = await this.createNotification({
      title: 'Survey',
      description: `Your survey "${surveyName}" has started.`,
      type: NotificationType.SurveyStarted,
      variant: 'info',
      notificationPayload: { surveyId },
      notificationUsers: [clientId],
    });

    const influencerNotification = await this.createNotification({
      title: 'Survey',
      description: `The survey "${surveyName}" you're part of has started.`,
      type: NotificationType.SurveyStarted,
      variant: 'info',
      notificationPayload: { surveyId },
      notificationUsers: [...influencerIds],
    });

    if (ambassadorId) {
      const ambassadorNotification = await this.createNotification({
        title: 'Survey',
        description: `${clientFirstName} ${clientLastName}'s survey has started.`,
        type: NotificationType.SurveyStarted,
        variant: 'info',
        notificationPayload: { surveyId },
        notificationUsers: [ambassadorId],
      });

      return [
        clientNotification,
        influencerNotification,
        ambassadorNotification,
      ];
    }
    return [clientNotification, influencerNotification];
  }

  async SurveyEnded(
    influencerIds: number[],
    clientId: number,
    ambassadorId: number,
    surveyId: number,
    surveyName: string,
    clientFullName: string,
  ) {
    const clientNotification = await this.createNotification({
      title: 'Survey',
      description: `Your survey "${surveyName}" has ended.`,
      type: NotificationType.SurveyEnded,
      variant: 'info',
      notificationPayload: { surveyId },
      notificationUsers: [clientId],
    });

    const influencerNotification = await this.createNotification({
      title: 'Survey',
      description: `The survey "${surveyName}" you're part of has ended.`,
      type: NotificationType.SurveyEnded,
      variant: 'info',
      notificationPayload: { surveyId },
      notificationUsers: [...influencerIds],
    });

    const ambassadorNotification = await this.createNotification({
      title: 'Survey',
      description: `${clientFullName}'s survey has ended.`,
      type: NotificationType.SurveyEnded,
      variant: 'info',
      notificationPayload: { surveyId },
      notificationUsers: [ambassadorId],
    });

    return [clientNotification, influencerNotification, ambassadorNotification];
  }

  async surveySubmissionApprovedOrDeclined(
    influencerId: number,
    surveyId: number,
    surveyName: string,
    influencerFullName: string,
    clientFullName: string,
    isAdmin: boolean,
  ) {
    const adminIndexes = await this.getAllAdminIndexes();

    const influencerNotification = await this.createNotification({
      title: 'Survey',
      description: `Your submission for the survey "${surveyName}" has been reviewed.`,
      type: NotificationType.SurveySubmissionApprovedOrDeclined,
      variant: 'info',
      notificationPayload: { influencerId, surveyId },
      notificationUsers: [influencerId],
    });

    if (!isAdmin) {
      const adminNotification = await this.createNotification({
        title: 'Survey',
        description: `Client ${clientFullName} reviewed influencer ${influencerFullName}'s submission for the survey "${surveyName}".`,
        type: NotificationType.SurveySubmissionApprovedOrDeclined,
        variant: 'info',
        notificationPayload: { influencerId, surveyId },
        notificationUsers: [...adminIndexes],
      });

      return [influencerNotification, adminNotification];
    }
    return influencerNotification;
  }

  async paymentRequested(
    userId: number,
    transactionId: number,
    transactionFlowId: number,
  ) {
    const notification = await this.createNotification({
      title: 'Finance',
      description: `New payment request`,
      type: NotificationType.PaymentRequested,
      variant: 'info',
      notificationPayload: { userId, transactionId, transactionFlowId },
      notificationUsers: await this.getAllAdminIndexes(),
    });

    return notification;
  }

  async paymentApproved(
    userId: number,
    transactionId: number,
    transactionFlowId: number,
  ) {
    const notification = await this.createNotification({
      title: 'Finance',
      description: `Your balance has increased.`,
      type: NotificationType.PaymentApproved,
      variant: 'success',
      notificationPayload: { userId, transactionId, transactionFlowId },
      notificationUsers: [userId],
    });

    return notification;
  }

  async paymentDeclined(
    userId: number,
    transactionId: number,
    transactionFlowId: number,
  ) {
    const notification = await this.createNotification({
      title: 'Finance',
      description: `Your payment has been declined`,
      type: NotificationType.PaymentDeclined,
      variant: 'error',
      notificationPayload: { userId, transactionId, transactionFlowId },
      notificationUsers: [userId],
    });

    return notification;
  }

  async withdrawRequested(userId: number, transactionId: number) {
    const notification = await this.createNotification({
      title: 'Finance',
      description: `New withdraw request`,
      type: NotificationType.WithdrawRequested,
      variant: 'info',
      notificationPayload: { transactionId, userId },
      notificationUsers: await this.getAllAdminIndexes(),
    });

    return notification;
  }

  async withdrawApproved(userId: number, transactionId: number) {
    const notification = await this.createNotification({
      title: 'Finance',
      description: `Your withdraw has been approved`,
      type: NotificationType.WithdrawApproved,
      variant: 'success',
      notificationPayload: { userId, transactionId },
      notificationUsers: [userId],
    });

    return notification;
  }

  async withdrawDeclined(userId: number, transactionId: number) {
    const notification = await this.createNotification({
      title: 'Finance',
      description: `Your withdraw has been declined`,
      type: NotificationType.WithdrawDeclined,
      variant: 'error',
      notificationPayload: { userId, transactionId },
      notificationUsers: [userId],
    });

    return notification;
  }
}
