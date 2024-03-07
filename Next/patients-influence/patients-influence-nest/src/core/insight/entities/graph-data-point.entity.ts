export class GraphDataPointEntity {
  value: number;
  timestamp: Date;

  constructor(dataPoint: GraphDataPointEntity) {
    Object.assign(this, dataPoint);
  }
}
