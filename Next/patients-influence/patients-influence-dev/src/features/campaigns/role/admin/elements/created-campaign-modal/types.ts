import React from 'react';

export type TAddInfluencerModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
};

export type TState = {
  campaignName: string;
  product?: TStateItem[];
  client?: TStateItem;
  ambassador?: null;
  influencers?: number;
  dateStart?: null;
  dateEnd?: null;
  // report?: TStateItem;
  // currency: TStateItem;
  budget?: string;
  campaignInfo?: string;
  location?: TStateItem[];
  language?: TStateItem[];
  diseaseArea?: TStateItem[];
  symptoms?: TStateItem[];
  stakeholders?: TStateItem[];
  gender?: TStateItem[];
  age?: Age;
  ethnicity?: TStateItem[];
  struggles?: TStateItem[];
  interests?: TStateItem[];
  influencerSize?: TStateItem[];
  targetAudienceInfo?: string;
  platform?: TStateItem | null;
  postType?: TStateItem | null;
  image?: null;
  website?: string;
  instructions?: string;
  participantA?: null;
  submission?: null;
  participantC?: null;
  // reportC?: null;
  influencerCount?: number;
  chatRoomId?: any;
};

export type Age = {
  min?: number;
  max?: number;
};

export type TStateItem = {
  value?: number;
  label?: string;
};
