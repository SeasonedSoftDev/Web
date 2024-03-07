import { IGraphDataPoint } from './graph-data-point.interface';

export interface IGraphResult {
  [property: string]: any;
  data: IGraphDataPoint[];
  dataLength?: number;
}

/* export interface IGraphGroupResult {
  [property: string]: any;
  graph: IGraphResult;
} */
