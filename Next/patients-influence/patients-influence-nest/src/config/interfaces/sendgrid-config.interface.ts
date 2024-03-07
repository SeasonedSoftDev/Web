export interface ISendgridConfig {
  apiKey: string;
  senders: {
    welcome: string;
    support: string;
    clientSupport: string;
    ambassadorSupport: string;
    influencerSupport: string;
    notification: string;
  };
  returnUrls: {
    emailConfirmation: string;
    passwordReset: string;
  };
  templates: {
    confirmEmailInfluencerEN: string;
    confirmEmailInfluencerDE: string;
    confirmEmailClientEN: string;
    confirmEmailClientDE: string;
    accountActivatedAmbassadorEN: string;
    accountActivatedClientEN: string;
    accountActivatedClientDE: string;
    accountActivatedInfluencerEN: string;
    accountActivatedInfluencerDE: string;
    resetPasswordEN: string;
    emptyClient: string;
    emptyInfluencer: string;
    inviteClient: string;
    notifyInfluencer: string;
    notifyClient: string;
  };
}
