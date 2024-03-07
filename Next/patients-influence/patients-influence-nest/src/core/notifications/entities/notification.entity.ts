import {
  CalendarEvent,
  Campaign,
  CampaignReport,
  Notification,
  NotificationPayload,
  NotificationUser,
  PlatformProductOrder,
  SocialMediaListening,
  Survey,
  Transaction,
  TransactionFlow,
  User,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { Expose, Transform, Type } from 'class-transformer';

export class NotificationTransactionFlowEntity {
  @Expose()
  id: number;

  @Expose()
  userId: number;

  @Expose()
  type: number;

  @Expose()
  productOrderId: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(data: Partial<TransactionFlow>) {
    Object.assign(this, data);
  }
}

export class NotificationTransactionEntity {
  @Expose()
  id: number;

  @Expose()
  transactionFlowId: number;

  @Expose()
  status: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(data: Partial<Transaction>) {
    Object.assign(this, data);
  }
}

export class NotificationCampaignReportEntity {
  @Expose()
  id: number;

  @Expose()
  reportId: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(data: Partial<CampaignReport>) {
    Object.assign(this, data);
  }
}

export class NotificationCampaignEntity {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  platformProductOrderId: number;

  @Expose()
  productId: number;

  @Expose()
  dateStart: Date;

  @Expose()
  dateEnd: Date;

  @Expose()
  campaignDescription: string;

  @Expose()
  ageMax: number;

  @Expose()
  socialPlatformId: number;

  @Expose()
  clientCompanyWebsite: string;

  @Expose()
  status: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(data: Partial<Campaign>) {
    Object.assign(this, data);
  }
}

export class NotificationUserEntity {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }
}

export class NotificationUsersEntity {
  @Expose()
  id: number;

  @Expose()
  notificationId: number;

  @Expose()
  userId: number;

  @Expose()
  seen: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(data: Partial<NotificationUser>) {
    Object.assign(this, data);
  }
}

export class NotificationSocialMediaListeningEntity {
  @Expose()
  id: number;

  @Expose()
  platformProduct: number;

  @Expose()
  subscriptionLength: number;

  @Expose()
  monthlyTokens: number;

  @Expose()
  smlDescription: string;

  @Expose()
  status: number;

  @Expose()
  startedAt: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(data: Partial<SocialMediaListening>) {
    Object.assign(this, data);
  }
}

export class NotificationSurveyEntity {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  platformProduct: number;

  @Expose()
  dateStart: Date;

  @Expose()
  dateEnd: Date;

  @Expose()
  surveyType: number;

  @Expose()
  status: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(data: Partial<Survey>) {
    Object.assign(this, data);
  }
}

export class NotificationCalendarEventEntity {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  meetUrl: string;

  @Expose()
  startTime: Date;

  @Expose()
  endTime: Date;

  @Expose()
  eventType: number;

  @Expose()
  creatorId: number;

  @Expose()
  organizerId: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(data: Partial<CalendarEvent>) {
    Object.assign(this, data);
  }
}

export class NotificationPlatformProductOrderEntity {
  @Expose()
  id: number;

  @Expose()
  platformProduct: number;

  @Expose()
  budget: Decimal;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
  constructor(data: Partial<PlatformProductOrder>) {
    Object.assign(this, data);
  }
}

export class NotificationPayloadEntity {
  @Expose()
  id: number;

  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  user?: NotificationUserEntity;

  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  admin?: NotificationUserEntity;

  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  influencer?: NotificationUserEntity;

  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  ambassador?: NotificationUserEntity;

  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  client?: NotificationUserEntity;

  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  campaign?: NotificationCampaignEntity;

  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  campaignReport?: NotificationCampaignReportEntity;

  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  socialMediaListening?: NotificationSocialMediaListeningEntity;

  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  survey?: NotificationSurveyEntity;

  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  calendarEvent?: NotificationCalendarEventEntity;

  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  transaction?: NotificationTransactionEntity;

  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  transactionFlow?: NotificationTransactionFlowEntity;

  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  platformProductOrder?: NotificationPlatformProductOrderEntity;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(data: Partial<NotificationPayload>) {
    Object.assign(this, data);
  }
}

export class NotificationEntity {
  @Expose()
  id: number;

  @Expose()
  type: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  link: string;

  @Expose()
  variant: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => NotificationPayloadEntity)
  notificationPayload: NotificationPayloadEntity;

  @Expose()
  @Type(() => NotificationUsersEntity) // Define it as an array
  notificationUsers: NotificationUsersEntity[]; // Make it an array

  constructor(data: Partial<Notification>) {
    Object.assign(this, data);
  }
}
