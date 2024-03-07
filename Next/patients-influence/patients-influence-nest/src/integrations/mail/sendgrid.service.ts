import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import SendGrid from '@sendgrid/mail';
import sendgridConfig from '../../config/sendgrid.config';
import { Mail, MailType } from './types/mail.type';
import { TemplateDataType } from './types/template-data.type';
import { MailServerException } from './exceptions/mail-server.exception';
import { SendgridSender } from './enums/sender.enum';

@Injectable()
export class SendgridService {
  constructor(
    @Inject(sendgridConfig.KEY)
    private readonly config: ConfigType<typeof sendgridConfig>,
  ) {
    SendGrid.setApiKey(config.apiKey);
  }

  private getTemplate(mailType: MailType): string {
    let template = undefined;

    switch (mailType) {
      case Mail.ConfirmEmailInfluencerEN:
        template = this.config.templates.confirmEmailInfluencerEN;
        break;
      case Mail.ConfirmEmailInfluencerDE:
        template = this.config.templates.confirmEmailInfluencerDE;
        break;
      case Mail.ConfirmEmailClientEN:
        template = this.config.templates.confirmEmailClientEN;
        break;
      case Mail.ConfirmEmailClientDE:
        template = this.config.templates.confirmEmailClientDE;
        break;
      case Mail.AccountActivatedAmbassadorEN:
        template = this.config.templates.accountActivatedAmbassadorEN;
        break;
      case Mail.AccountActivatedClientEN:
        template = this.config.templates.accountActivatedClientEN;
        break;
      case Mail.AccountActivatedClientDE:
        template = this.config.templates.accountActivatedClientDE;
        break;
      case Mail.AccountActivatedInfluencerEN:
        template = this.config.templates.accountActivatedInfluencerEN;
        break;
      case Mail.AccountActivatedInfluencerDE:
        template = this.config.templates.accountActivatedInfluencerDE;
        break;
      case Mail.ResetPasswordEN:
        template = this.config.templates.resetPasswordEN;
        break;
      case Mail.EmptyClient:
        template = this.config.templates.emptyClient;
        break;
      case Mail.EmptyInfluencer:
        template = this.config.templates.emptyInfluencer;
        break;
      case Mail.EmptyInfluencer:
        template = this.config.templates.inviteClient;
        break;
      case Mail.Other:
        // Other
        break;
      case Mail.NotifyInfluencer:
        template = this.config.templates.notifyInfluencer;
        break;
      case Mail.NotifyClient:
        template = this.config.templates.notifyClient;
        break;
    }

    if (template === undefined) {
      throw new Error(
        `Mail type of ${Mail[mailType]} couldn't find its template id within config`,
      );
    }

    return template;
  }

  getSender(sender: SendgridSender) {
    switch (sender) {
      case SendgridSender.Welcome:
        return this.config.senders.welcome;
      case SendgridSender.Support:
        return this.config.senders.support;
      case SendgridSender.Client:
        return this.config.senders.clientSupport;
      case SendgridSender.Ambassador:
        return this.config.senders.ambassadorSupport;
      case SendgridSender.Influencer:
        return this.config.senders.influencerSupport;
      case SendgridSender.Notification:
        return this.config.senders.notification;
      default:
        throw new Error(`Sender ${sender} is not in a config`);
    }
  }

  async send(
    sender: SendgridSender,
    recipient: string,
    mailType: MailType,
    data: TemplateDataType = {},
  ) {
    const mailData: SendGrid.MailDataRequired = {
      from: this.getSender(sender),
      to: recipient,
      templateId: this.getTemplate(mailType),
      dynamicTemplateData: data,
    };

    try {
      const transport = await SendGrid.send(mailData);

      return transport;
    } catch (err) {
      throw new MailServerException(mailData.to as string, err);
    }
  }

  async sendNoTemplate(
    recipient: SendgridSender,
    sender: SendgridSender,
    subject: string,
    html: string,
  ) {
    const mailData: SendGrid.MailDataRequired = {
      from: this.getSender(sender),
      to: this.getSender(recipient),
      subject,
      html,
    };

    try {
      const transport = await SendGrid.send(mailData);

      return transport;
    } catch (err) {
      throw new MailServerException(mailData.to as string, err);
    }
  }

  async sendNoTemplateToUser(
    sender: SendgridSender,
    recipient: string,
    subject: string,
    html: string,
  ) {
    const mailData: SendGrid.MailDataRequired = {
      from: this.getSender(sender),
      to: recipient,
      subject,
      html,
    };

    try {
      const transport = await SendGrid.send(mailData);

      return transport;
    } catch (err) {
      throw new MailServerException(mailData.to as string, err);
    }
  }
}
