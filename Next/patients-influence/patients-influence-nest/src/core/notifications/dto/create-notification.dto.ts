import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  isInt,
} from 'class-validator';
import { NotificationType } from '../../../utils';
import { Type } from 'class-transformer';

export class CreateNotificationPayload {
  @IsInt()
  @IsPositive()
  @IsOptional()
  userId?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  adminId?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  ambassadorId?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  influencerId?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  clientId?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  campaignId?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  campaignReportId?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  socialMediaListeningId?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  surveyId?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  calendarEventId?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  transactionId?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  transactionFlowId?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  platformProductOrderId?: number;
}

export class CreateNotificationDto {
  @IsInt()
  @IsPositive()
  @IsIn(
    Object.keys(NotificationType)
      .map((x) => parseInt(x))
      .filter((x) => !isNaN(x)),
  )
  type: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsIn(['info', 'success', 'error', 'warning'])
  @IsOptional()
  variant?: 'info' | 'success' | 'error' | 'warning';

  @IsInt({ each: true })
  @IsPositive({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  notificationUsers: number[];

  @IsOptional()
  @Type(() => CreateNotificationPayload)
  notificationPayload?: CreateNotificationPayload;
}
