import React from 'react';
import {
  OrderListDraggableMain,
  OrderListDraggableDrag,
} from 'components/custom/table/elements/order-list-draggable/styles';
import { TOrderListDraggableProps } from 'components/custom/table/elements/order-list-draggable/types';
import { Reorder, useDragControls } from 'framer-motion';
import { DragIndicatorRounded } from '@mui/icons-material';
import { Checkbox } from 'components/ui';

const OrderListDraggable = ({
  reference,
  label,
  value,
  onValue,
  item,
}: TOrderListDraggableProps) => {
  const controls = useDragControls();

  return (
    <Reorder.Item
      key={reference}
      value={item}
      as="div"
      id={reference}
      dragListener={false}
      dragControls={controls}
    >
      <OrderListDraggableMain>
        <OrderListDraggableDrag
          dragControls={controls}
          onPointerDown={(e) => controls.start(e)}
        >
          <DragIndicatorRounded />
        </OrderListDraggableDrag>
        <Checkbox
          value={value}
          label={label}
          size="large"
          color="secondary"
          onValue={onValue}
        />
      </OrderListDraggableMain>
    </Reorder.Item>
  );
};

export default OrderListDraggable;
