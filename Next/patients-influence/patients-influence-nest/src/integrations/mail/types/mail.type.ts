export enum Mail {
  ConfirmEmailInfluencerEN,
  ConfirmEmailInfluencerDE,
  ConfirmEmailClientEN,
  ConfirmEmailClientDE,
  AccountActivatedAmbassadorEN,
  AccountActivatedClientEN,
  AccountActivatedClientDE,
  AccountActivatedInfluencerEN,
  AccountActivatedInfluencerDE,
  ResetPasswordEN,
  EmptyClient,
  EmptyInfluencer,
  InviteClient,
  Other,
  NotifyInfluencer,
  NotifyClient,
}

export type MailType =
  | Mail.ConfirmEmailInfluencerEN
  | Mail.ConfirmEmailInfluencerDE
  | Mail.ConfirmEmailClientEN
  | Mail.ConfirmEmailClientDE
  | Mail.AccountActivatedAmbassadorEN
  | Mail.AccountActivatedClientEN
  | Mail.AccountActivatedClientDE
  | Mail.AccountActivatedInfluencerEN
  | Mail.AccountActivatedInfluencerDE
  | Mail.ResetPasswordEN
  | Mail.EmptyClient
  | Mail.EmptyInfluencer
  | Mail.InviteClient
  | Mail.Other
  | Mail.NotifyClient
  | Mail.NotifyInfluencer;
