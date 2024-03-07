import { IsEmail, IsString, IsUrl } from 'class-validator';

export class SendgridEnvironmentVariables {
  @IsString()
  SENDGRID_API_KEY: string;

  @IsEmail()
  SENDGRID_SENDER_WELCOME: string;

  @IsEmail()
  SENDGRID_SENDER_CLIENT_SUPPORT: string;

  @IsEmail()
  SENDGRID_SENDER_INFLUENCER_SUPPORT: string;

  @IsEmail()
  SENDGRID_SENDER_AMBASSADOR_SUPPORT: string;

  @IsEmail()
  SENDGRID_SENDER_NOTIFICATION: string;

  @IsEmail()
  SENDGRID_SENDER_SUPPORT: string;

  @IsString()
  SENDGRID_CONFIRMATION_RETURN_URL: string;

  @IsString()
  SENDGRID_PASSWORD_RESET_RETURN_URL: string;

  @IsString()
  SENDGRID_CONFIRM_EMAIL_INFLUENCER_EN_TEMPLATE: string;

  @IsString()
  SENDGRID_CONFIRM_EMAIL_INFLUENCER_DE_TEMPLATE: string;

  @IsString()
  SENDGRID_CONFIRM_EMAIL_CLIENT_EN_TEMPLATE: string;

  @IsString()
  SENDGRID_CONFIRM_EMAIL_CLIENT_DE_TEMPLATE: string;

  @IsString()
  SENDGRID_ACCOUNT_ACTIVATED_AMBASSADOR_EN_TEMPLATE: string;

  @IsString()
  SENDGRID_ACCOUNT_ACTIVATED_CLIENT_EN_TEMPLATE: string;

  @IsString()
  SENDGRID_ACCOUNT_ACTIVATED_CLIENT_DE_TEMPLATE: string;

  @IsString()
  SENDGRID_ACCOUNT_ACTIVATED_INFLUENCER_EN_TEMPLATE: string;

  @IsString()
  SENDGRID_ACCOUNT_ACTIVATED_INFLUENCER_DE_TEMPLATE: string;

  @IsString()
  SENDGRID_RESET_PASSWORD_EN_TEMPLATE: string;

  @IsString()
  SENDGRID_EMPTY_CLIENT_TEMPLATE: string;

  @IsString()
  SENDGRID_EMPTY_INFLUENCER_TEMPLATE: string;

  // send invitation to discover client
  @IsString()
  SENDGRID_INVITE_CLIENT_TEMPLATE: string;

  // Notify Influencer and Client
  @IsString()
  SENDGRID_NOTIFY_INFLUENCER_TEMPLATE: string;

  @IsString()
  SENDGRID_NOTIFY_CLIENT_TEMPLATE: string;
}
