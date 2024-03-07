import { TTableHeadItem } from 'components/custom/table/types';

export type TOrderListDraggableProps = {
  label: string;
  reference: string;
  value: boolean;
  onValue: (v: boolean) => void;
  item: TTableHeadItem;
};
