export enum ProductOrderInfluencerStatus {
  /* Invited, // influencer is invited by an admin or a client
  Accepted, // influencer accepted the invitation
  Declined, // influencer declined the invitation
  Removed, // removed by an admin or a client */

  Added, // client and admin can put to not selected
  Invited, // same
  Matching, // same
  NotSelected,
  Withdrawn,
  Declined,
  // ToBeSigned, // TODO remove
  ToBeSubmitted, // client can't remove anyone on and after this stage
  ToBeApproved,
  Approved,
  NotApproved,
  ToBePaid,
  Paid,
  Removed,

  // * after matching goes to be submitted

  ToBeAnswered,
}
