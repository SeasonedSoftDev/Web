import React, { useState } from 'react';
import {
  TableContainer,
  TableWrapper,
  TableMain,
  TableHead,
  TableBody,
  TableHeadCell,
  TableHeadCellAction,
  TableBodyCell,
  TableHeadRow,
  TableBodyRow,
  TableEmpty,
} from 'components/custom/checkbox-table/styles';

import {
  TTableProps,
  TTableHeadItem,
} from 'components/custom/new-checkbox-table/types';
import getObjectDynamicPath from 'utilities/extended-proto/index';
import { Modal } from 'components/custom';
import { Button, Checkbox } from 'components/ui';
import { Reorder } from 'framer-motion';

import { useAppContext } from 'context';
import { OrderListDraggable } from './elements';

const Table = ({
  head = [],
  items = [],
  renderItem = (_b) => {},
  checkedRows,
  onSingleSelect,
  onSelectAll,
  renderElements,
  tableColModal,
  closeTableColModal,
  optionalRole,
  ...props
}: TTableProps) => {
  const [localHead, setLocalHead] = useState(head);

  const visibleItems = localHead.filter((x) => x.visible);

  const isChecked =
    checkedRows &&
    items.length > 0 &&
    items.every((row) => checkedRows!.includes(row.id));

  const handleRowSelection = (rowId: number, checked: boolean) => {
    if (onSingleSelect) onSingleSelect(rowId, checked);
  };

  const handleSelectAll = (checked: boolean) => {
    if (onSelectAll) {
      onSelectAll(checked);
    }
  };

  const { role } = useAppContext();

  return (
    <TableContainer {...props}>
      <TableWrapper>
        <TableMain>
          <TableHead>
            <TableHeadRow>
              {['ADMIN', 'SUPERADMIN', optionalRole].includes(role) && (
                <TableHeadCell action="false">
                  <Checkbox
                    value={isChecked}
                    onValue={(value) => handleSelectAll(value)}
                  />
                </TableHeadCell>
              )}
              {visibleItems.map((x: any, index: number) => {
                if (
                  visibleItems.length - 1 === index &&
                  ['ADMIN', 'SUPERADMIN', optionalRole].includes(role)
                ) {
                  return (
                    <TableHeadCell action="true" key={x.reference}>
                      <TableHeadCellAction color="primary">
                        {renderElements || undefined}
                      </TableHeadCellAction>
                    </TableHeadCell>
                  );
                }
                return (
                  <TableHeadCell key={x.reference} action="false">
                    {x.label}
                  </TableHeadCell>
                );
              })}
            </TableHeadRow>
          </TableHead>
          {!!items.length && (
            <TableBody>
              {items.map((rowData: any, rowIndex: number) => (
                <TableBodyRow key={rowData.id}>
                  {['ADMIN', 'SUPERADMIN', optionalRole].includes(role) && (
                    <TableBodyCell action="true">
                      <Checkbox
                        value={checkedRows?.includes(rowData.id)}
                        onValue={(checked) =>
                          handleRowSelection(rowData.id, checked)
                        }
                      />
                    </TableBodyCell>
                  )}
                  {visibleItems.map((a: TTableHeadItem, b: number) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <TableBodyCell action="false" key={b}>
                      {renderItem({
                        headItem: a,
                        cell: {
                          index: b,
                          data: getObjectDynamicPath(rowData, a.reference),
                        },
                        row: {
                          index: rowIndex,
                          data: rowData,
                        },
                        table: items,
                      })}
                    </TableBodyCell>
                  ))}
                </TableBodyRow>
              ))}
            </TableBody>
          )}
        </TableMain>
        {!items.length && <TableEmpty>No records</TableEmpty>}
      </TableWrapper>
      {tableColModal && (
        <Modal
          title="Manage columns"
          onClose={closeTableColModal}
          size="small"
          actions={[
            <Button
              color="primary"
              variant="contained"
              onClick={closeTableColModal}
            >
              Close
            </Button>,
          ]}
        >
          <Reorder.Group
            values={localHead}
            onReorder={setLocalHead}
            axis="y"
            as="div"
            style={{ height: '500px' }}
          >
            {localHead.map((x, index) => {
              if (localHead.length - 1 === index) {
                return undefined;
              }
              return (
                <OrderListDraggable
                  key={x.reference}
                  label={x.label}
                  value={x.visible}
                  reference={x.reference}
                  item={x}
                  onValue={(visible) =>
                    setLocalHead(
                      localHead.map((a) =>
                        a.reference === x.reference ? { ...a, visible } : a
                      )
                    )
                  }
                />
              );
            })}
          </Reorder.Group>
        </Modal>
      )}
    </TableContainer>
  );
};

export default Table;
