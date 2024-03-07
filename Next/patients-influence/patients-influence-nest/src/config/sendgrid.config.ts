import { registerAs } from '@nestjs/config';
import { SendgridEnvironmentVariables } from '../config/dto/sendgrid-config.dto';
import { validate } from '../config/utils/env-validation';
import { ISendgridConfig } from './interfaces/sendgrid-config.interface';

export default registerAs('sendgrid', (): ISendgridConfig => {
  validate(process.env, SendgridEnvironmentVariables);

  return {
    apiKey: process.env.SENDGRID_API_KEY,
    senders: {
      welcome: process.env.SENDGRID_SENDER_WELCOME,
      support: process.env.SENDGRID_SENDER_SUPPORT,
      clientSupport: process.env.SENDGRID_SENDER_CLIENT_SUPPORT,
      ambassadorSupport: process.env.SENDGRID_SENDER_AMBASSADOR_SUPPORT,
      influencerSupport: process.env.SENDGRID_SENDER_INFLUENCER_SUPPORT,
      notification: process.env.SENDGRID_SENDER_NOTIFICATION,
    },
    returnUrls: {
      emailConfirmation: process.env.SENDGRID_CONFIRMATION_RETURN_URL,
      passwordReset: process.env.SENDGRID_PASSWORD_RESET_RETURN_URL,
    },
    templates: {
      confirmEmailInfluencerEN:
        process.env.SENDGRID_CONFIRM_EMAIL_INFLUENCER_EN_TEMPLATE,
      confirmEmailInfluencerDE:
        process.env.SENDGRID_CONFIRM_EMAIL_INFLUENCER_DE_TEMPLATE,
      confirmEmailClientEN:
        process.env.SENDGRID_CONFIRM_EMAIL_CLIENT_EN_TEMPLATE,
      confirmEmailClientDE:
        process.env.SENDGRID_CONFIRM_EMAIL_CLIENT_DE_TEMPLATE,
      accountActivatedAmbassadorEN:
        process.env.SENDGRID_ACCOUNT_ACTIVATED_AMBASSADOR_EN_TEMPLATE,
      accountActivatedClientEN:
        process.env.SENDGRID_ACCOUNT_ACTIVATED_CLIENT_EN_TEMPLATE,
      accountActivatedClientDE:
        process.env.SENDGRID_ACCOUNT_ACTIVATED_CLIENT_DE_TEMPLATE,
      accountActivatedInfluencerEN:
        process.env.SENDGRID_ACCOUNT_ACTIVATED_INFLUENCER_EN_TEMPLATE,
      accountActivatedInfluencerDE:
        process.env.SENDGRID_ACCOUNT_ACTIVATED_INFLUENCER_DE_TEMPLATE,
      resetPasswordEN: process.env.SENDGRID_RESET_PASSWORD_EN_TEMPLATE,
      emptyClient: process.env.SENDGRID_EMPTY_CLIENT_TEMPLATE,
      emptyInfluencer: process.env.SENDGRID_EMPTY_INFLUENCER_TEMPLATE,
      inviteClient: process.env.SENDGRID_INVITE_CLIENT_TEMPLATE,
      notifyInfluencer: process.env.SENDGRID_NOTIFY_INFLUENCER_TEMPLATE,
      notifyClient: process.env.SENDGRID_NOTIFY_CLIENT_TEMPLATE,
    },
  };
});
