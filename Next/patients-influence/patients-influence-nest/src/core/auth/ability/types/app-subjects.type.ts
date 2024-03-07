import { Subjects } from '@casl/prisma';
import {
  User,
  Stakeholder,
  Influencer,
  Client,
  Ambassador,
  UserComment,
  UserLabel,
  Label,
  PlatformProductOrderLabel,
  DiseaseArea,
  Location,
  Company,
  Campaign,
  PlatformProductOrderComment,
  Survey,
  SocialMediaListening,
  Benefit,
  PlatformProductOrder,
  BenefitSuggestion,
  DiscoverClient,
  Legal,
  CampaignReport,
  ClientDiseaseArea,
  Product,
  ClientProduct,
  Currency,
} from '@prisma/client';

export type AppSubjects =
  | 'all'
  | Subjects<{
      User: User;
      Stakeholder: Stakeholder;
      Influencer: Influencer;
      Client: Client;
      ClientDiseaseArea: ClientDiseaseArea;
      Currency: Currency;
      DiscoverClient: DiscoverClient;
      Ambassador: Ambassador;
      UserComment: UserComment;
      UserLabel: UserLabel;
      Label: Label;
      PlatformProductComment: PlatformProductOrderComment;
      PlatformProductLabel: PlatformProductOrderLabel; // TODO rename PlatformProductLabel to proper name
      Product: Product;
      DiseaseArea: DiseaseArea;
      Location: Location;
      Company: Company;
      Campaign: Campaign;
      CampaignReport: CampaignReport;
      Survey: Survey;
      SML: SocialMediaListening;
      Benefit: Benefit;
      BenefitSuggestion: BenefitSuggestion;
      PlatformProductOrder: PlatformProductOrder;
      Legal: Legal;
      ClientProduct: ClientProduct;
    }>;
