import React, { useCallback, useState } from 'react';
import { Modal, Tabs } from 'components/custom';
import { TExportFinanceModalProps } from 'features/finance/role/admin/elements/export-finance-modal/types';
import { ExportFinanceModalMain } from 'features/finance/role/admin/elements/export-finance-modal/styles';
import { Button, Checkbox, RadioButton } from 'components/ui';
import { Stack } from 'components/system';
import FinanceAPI from 'api/finance';
import { convertToCSV, downloadCSV } from 'utilities/export-csv';
import { PlatformProductOrderAPI } from 'api/platform-product-order';

const ExportFinanceModal = ({
  onClose,
  checkedPayments,
  checkedPending,
  checkedWithdraws,
  checkedRevenues,
  ...props
}: TExportFinanceModalProps) => {
  const [state, setState] = useState({
    payments: false,
    withdrawals: false,
    pending: false,
    received: false,
  });

  const [tab, setTab] = useState(0);

  const [costRadioState, setCostRadioState] = useState('');
  const [revenueRadioState, setRevenuRadioState] = useState('');

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCostRadioState(e.target.value);
  };

  const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRevenuRadioState(e.target.value);
  };

  const handleExport = useCallback(async () => {
    if (costRadioState && costRadioState === 'allCosts') {
      if (state.payments && state.withdrawals) {
        await FinanceAPI.getAllPayments({ ids: [] }).then((data) => {
          const csvContent = convertToCSV(data);
          downloadCSV(
            csvContent,
            `all_payments_${new Date().toISOString()}.csv`
          );
        });

        await FinanceAPI.getAllWithdrawals({ ids: [] }).then((data) => {
          const csvContent = convertToCSV(data);
          downloadCSV(
            csvContent,
            `all_withdrawals_${new Date().toISOString()}.csv`
          );
        });
      } else if (state.payments) {
        await FinanceAPI.getAllPayments({ ids: [] }).then((data) => {
          const csvContent = convertToCSV(data);
          downloadCSV(
            csvContent,
            `all_payments_${new Date().toISOString()}.csv`
          );
        });
      } else if (state.withdrawals) {
        await FinanceAPI.getAllWithdrawals({ ids: [] }).then((data) => {
          const csvContent = convertToCSV(data);
          downloadCSV(
            csvContent,
            `all_withdrawals_${new Date().toISOString()}.csv`
          );
        });
      }
    } else if (costRadioState && costRadioState === 'selectedCosts') {
      if (state.payments && state.withdrawals) {
        await FinanceAPI.getAllWithdrawals({ ids: checkedWithdraws }).then(
          (data) => {
            const csvContent = convertToCSV(data);
            downloadCSV(
              csvContent,
              `selected_withdrawals_${new Date().toISOString()}.csv`
            );
          }
        );

        await FinanceAPI.getAllPayments({ ids: checkedPayments }).then(
          (data) => {
            const csvContent = convertToCSV(data);
            downloadCSV(
              csvContent,
              `selected_payments_${new Date().toISOString()}.csv`
            );
          }
        );
      } else if (state.payments) {
        await FinanceAPI.getAllPayments({ ids: checkedPayments }).then(
          (data) => {
            const csvContent = convertToCSV(data);
            downloadCSV(
              csvContent,
              `selected_payments_${new Date().toISOString()}.csv`
            );
          }
        );
      } else if (state.withdrawals) {
        await FinanceAPI.getAllWithdrawals({ ids: checkedWithdraws }).then(
          (data) => {
            const csvContent = convertToCSV(data);
            downloadCSV(
              csvContent,
              `selected_withdrawals_${new Date().toISOString()}.csv`
            );
          }
        );
      }
    }

    if (revenueRadioState && revenueRadioState === 'allRevenues') {
      if (state.pending && state.received) {
        await PlatformProductOrderAPI.allRevenues({
          ids: [],
          financeStatus: 1,
        }).then((data) => {
          const csvContent = convertToCSV(data);
          downloadCSV(
            csvContent,
            `all_received_revenues_${new Date().toISOString()}.csv`
          );
        });
        await PlatformProductOrderAPI.allRevenues({
          ids: [],
          financeStatus: 0,
        }).then((data) => {
          const csvContent = convertToCSV(data);
          downloadCSV(
            csvContent,
            `all_pending_revenues_${new Date().toISOString()}.csv`
          );
        });
      } else if (state.pending) {
        await PlatformProductOrderAPI.allRevenues({
          ids: [],
          financeStatus: 0,
        }).then((data) => {
          const csvContent = convertToCSV(data);
          downloadCSV(
            csvContent,
            `all_pending_revenues_${new Date().toISOString()}.csv`
          );
        });
      } else if (state.received) {
        await PlatformProductOrderAPI.allRevenues({
          ids: [],
          financeStatus: 1,
        }).then((data) => {
          const csvContent = convertToCSV(data);
          downloadCSV(
            csvContent,
            `all_pending_received_${new Date().toISOString()}.csv`
          );
        });
      }
    } else if (revenueRadioState && revenueRadioState === 'selectedRevenues') {
      if (state.pending && state.received) {
        await PlatformProductOrderAPI.allRevenues({
          ids: checkedPending,
          financeStatus: 0,
        }).then((data) => {
          const csvContent = convertToCSV(data);
          downloadCSV(
            csvContent,
            `selected_pending_revenues_${new Date().toISOString()}.csv`
          );
        });
        await PlatformProductOrderAPI.allRevenues({
          ids: checkedRevenues,
          financeStatus: 1,
        }).then((data) => {
          const csvContent = convertToCSV(data);
          downloadCSV(
            csvContent,
            `selected_received_revenues_${new Date().toISOString()}.csv`
          );
        });
      } else if (state.pending) {
        await PlatformProductOrderAPI.allRevenues({
          ids: checkedPending,
          financeStatus: 0,
        }).then((data) => {
          const csvContent = convertToCSV(data);
          downloadCSV(
            csvContent,
            `selected_pending_revenues_${new Date().toISOString()}.csv`
          );
        });
      } else if (state.received) {
        await PlatformProductOrderAPI.allRevenues({
          ids: checkedRevenues,
          financeStatus: 1,
        }).then((data) => {
          const csvContent = convertToCSV(data);
          downloadCSV(
            csvContent,
            `selected_received_revenues_${new Date().toISOString()}.csv`
          );
        });
      }
    }
  }, [
    costRadioState,
    revenueRadioState,
    state,
    checkedPayments,
    checkedPending,
    checkedRevenues,
    checkedWithdraws,
  ]);

  const disabled = useCallback(() => {
    const hasPayments = state.payments || state.withdrawals;
    const hasPending = state.pending || state.received;

    if (
      (costRadioState === 'allCosts' && hasPayments) ||
      (costRadioState === 'selectedCosts' && hasPayments) ||
      (revenueRadioState === 'allRevenues' && hasPending) ||
      (revenueRadioState === 'selectedRevenues' && hasPending)
    ) {
      return false;
    }

    return true;
  }, [costRadioState, revenueRadioState, state]);

  return (
    <Modal
      size="small"
      title="Do you want to export:"
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          disabled={disabled()}
          onClick={() => {
            handleExport();
            onClose();
          }}
        >
          Export
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <Stack>
        <Tabs tabs={['Cost', 'Revenue']} value={tab} onValue={setTab} />
        {tab === 0 && (
          <ExportFinanceModalMain columns={2}>
            <RadioButton
              checked={costRadioState === 'allCosts'}
              onChange={handleCostChange}
              value="allCosts"
              label="All"
            />
            <RadioButton
              checked={costRadioState === 'selectedCosts'}
              onChange={handleCostChange}
              value="selectedCosts"
              label="Selected"
            />
            <Checkbox
              color="secondary"
              label="Payments"
              size="large"
              value={state.payments}
              onValue={(payments) => setState({ ...state, payments })}
            />
            <Checkbox
              color="secondary"
              label="Withdrawals"
              size="large"
              value={state.withdrawals}
              onValue={(withdrawals) => setState({ ...state, withdrawals })}
            />
          </ExportFinanceModalMain>
        )}
        {tab === 1 && (
          <ExportFinanceModalMain columns={2}>
            <RadioButton
              checked={revenueRadioState === 'allRevenues'}
              onChange={handleRevenueChange}
              value="allRevenues"
              label="All"
            />
            <RadioButton
              checked={revenueRadioState === 'selectedRevenues'}
              onChange={handleRevenueChange}
              value="selectedRevenues"
              label="Selected"
            />
            <Checkbox
              color="secondary"
              label="Pending"
              size="large"
              value={state.pending}
              onValue={(pending) => setState({ ...state, pending })}
            />
            <Checkbox
              color="secondary"
              label="Received"
              size="large"
              value={state.received}
              onValue={(received) => setState({ ...state, received })}
            />
          </ExportFinanceModalMain>
        )}
      </Stack>
    </Modal>
  );
};

export default ExportFinanceModal;
