export interface IDesiredAmountResultMetadata {
  followersDistributionRange: {
    count: number;
    from?: number;
    to?: number;
  };
  influencerPostTypeSetting: {
    desiredAmount: number;
    postType: number;
  };
}
