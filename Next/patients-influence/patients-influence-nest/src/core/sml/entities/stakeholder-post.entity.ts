import { StakeholderPost } from '@prisma/client';

export class StakeholderPostEntity implements StakeholderPost {
  constructor(partial: Partial<StakeholderPostEntity>) {
    Object.assign(this, partial);
  }
  id: number;
  stakeholderId: number;
  postTimestamp: Date;
  content: string;
  language: string;
  overallSentiment: number;
  postInterest: number;
  postTheme: number;
  comments: number;
  likes: number;
  isReported: boolean;
  reportComment: string;
  preprocessedContent: string;
  isContentProcessed: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
