export enum Status {
  // campaign and survey
  InPreparation = 0,
  OnGoing = 1,
  Finished = 2,
  Archived = 3,

  // sml and report
  Ordered = 4, // similar to "in preparation"
  Ready = 5, // similar to "on going"
  Delivered = 6,
}
