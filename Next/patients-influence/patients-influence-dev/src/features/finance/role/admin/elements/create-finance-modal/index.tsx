import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Tabs } from 'components/custom';
import { TCreateFinanceModalProps } from 'features/finance/role/admin/elements/create-finance-modal/types';
import { CreateFinanceModalMain } from 'features/finance/role/admin/elements/create-finance-modal/styles';
import { Button, Input } from 'components/ui';
import { Stack } from 'components/system';
import UsersAPI from 'api/users';
import { ClientAPI, PlatformProductAPI } from 'api';
import { useSnackbar } from 'hooks';
import FinanceAPI from 'api/finance';

const CreateFinanceModal = ({
  onClose,
  reloadC,
  reloadP,
  reloadC1,
  reloadR,
  ...props
}: TCreateFinanceModalProps) => {
  const [state, setState] = useState({
    cost: '',
    amountC: null,
    typeC: { value: 0, label: '' },
    dateC: null,
    subjectC: { value: 0, label: '' },
    vendor: null,
    balanceChange: { value: false, label: '' },
    projectC: { value: 0, label: '' },
    emailC: null,
    statusC: { value: 0, label: '' },

    revenue: '',
    amountR: null,
    dateR: null,
    subjectR: { value: 0, label: '' },
    projectR: { value: 0, label: '' },
    emailR: '',
    statusR: { value: 0, label: '' },
  });

  const [tab, setTab] = useState(0);

  const [loading, setLoading] = useState(false);

  const [subjects, setSubjects] = useState<any>([]);
  const [projects, setProjects] = useState<any>([]);
  const [clients, setClients] = useState<any>([]);

  const handleRole = (v: number) => {
    switch (v) {
      case 2:
        return 'Ambassador';
      case 3:
        return 'Client';
      case 4:
        return 'Influencer';
      default:
        return '';
    }
  };

  const getClients = async (s: string = '') => {
    const { result } = await ClientAPI.getClients(s);

    setClients(
      result.map((data: any) => ({
        value: data.id,
        label: `${data.firstName} ${data.lastName}`,
      }))
    );
  };

  const getUsers = async (s: string = '') => {
    setLoading(true);
    const { result } = await UsersAPI.getUsers(s);

    setSubjects(
      result.map((item: any) => ({
        value: item.id,
        label: `${item.firstName} ${item.lastName} (${handleRole(item.role)})`,
      }))
    );
    setLoading(false);
  };

  const getProducts = useCallback(
    async (s: string = '') => {
      setLoading(true);
      if (state.subjectC && state.subjectC.value) {
        const result = await PlatformProductAPI.getUsersProducts(
          state.subjectC.value,
          s || undefined
        );

        if (result && result.length) {
          setProjects(
            result?.map((item: any) => ({
              value: item.platformProductOrderId,
              label: `${item.name}`,
            }))
          );
        }
      } else if (state.subjectR && state.subjectR.value) {
        const result = await PlatformProductAPI.getUsersProducts(
          state.subjectR.value,
          s || undefined
        );

        if (result && result.length) {
          setProjects(
            result?.map((item: any) => ({
              value: item.platformProductOrderId,
              label: `${item.name}`,
            }))
          );
        }
      }
      setLoading(false);
    },
    [state.subjectC, state.subjectR]
  );

  useEffect(() => {
    getUsers();
    getClients();
  }, []);

  useEffect(() => {
    getProducts();
  }, [state.subjectC, state.subjectR]);

  const debounce = (func: any, wait: any) => {
    let timeout: any;

    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const { push } = useSnackbar();

  const createCustomFinanceStatement = useCallback(async () => {
    if (tab === 0) {
      try {
        const body = {
          userId: state.subjectC.value,
          productOrderId: state.projectC.value,
          amount: state.amountC ? +state.amountC : 0,
          statementName: state.cost,
          type: state.typeC.value,
          vendor: state.vendor,
          statementDate: state.dateC,
          email: state.emailC,
          isBalanceChange: state.balanceChange.value,
          status: state.statusC.value,
        };

        await FinanceAPI.createCustomCostFinanceStatement(body).then((data) => {
          if (data) {
            push(`Create custom cost finance statement successfully.`, {
              variant: 'success',
            });
            if (reloadP && reloadC1) {
              reloadP();
              reloadC1();
            }
            onClose();
          }
        });
      } catch (error) {
        push(`Create custom cost finance statement failed.`, {
          variant: 'error',
        });
      }
    } else if (tab === 1) {
      try {
        const body = {
          userId: state.subjectR.value,
          productOrderId: state.projectR.value,
          amount: state.amountR ? +state.amountR : 0,
          statementName: state.revenue,
          statementDate: state.dateR,
          email: state.emailR,
          status: state.statusR.value,
        };

        await FinanceAPI.createCustomRevenueFinanceStatement(body).then(
          (data) => {
            if (data) {
              push(`Create custom revenue finance statement successfully.`, {
                variant: 'success',
              });
              if (reloadC && reloadR) {
                reloadC();
                reloadR();
              }
              onClose();
            }
          }
        );
      } catch (error) {
        push(`Create custom revenue finance statement failed.`, {
          variant: 'error',
        });
      }
    }
  }, [state, tab]);

  const disabledC =
    !state.subjectC?.value ||
    !state.projectC?.value ||
    !state.amountC ||
    !state.cost ||
    !state.typeC?.label ||
    !state.dateC ||
    !state.emailC ||
    !state.balanceChange.label ||
    !state.statusC?.label;

  const disabledR =
    !state.revenue ||
    !state.amountR ||
    !state.dateR ||
    !state.emailR ||
    !state.subjectR?.label ||
    !state.statusR?.label ||
    !state.projectR?.label;

  return (
    <Modal
      size="medium"
      title={tab === 0 ? 'Add Cost' : 'Add Revenue'}
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          disabled={tab === 0 ? !!disabledC : disabledR}
          onClick={createCustomFinanceStatement}
        >
          Create
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <Stack style={{ height: '500px' }}>
        <Tabs tabs={['Cost', 'Revenue']} value={tab} onValue={setTab} />
        {tab === 0 && (
          <CreateFinanceModalMain columns={2}>
            <Input
              type="text"
              label="Cost"
              placeholder="Please Enter"
              value={state.cost}
              onValue={(cost) => setState({ ...state, cost })}
              required
            />
            <Input
              type="number"
              label="Amount"
              placeholder="18"
              value={state.amountC}
              onValue={(amountC) => setState({ ...state, amountC })}
              required
            />
            <Input
              type="select"
              label="Type"
              placeholder="Please Enter"
              value={state.typeC}
              onValue={(typeC) => setState({ ...state, typeC })}
              required
              options={[
                { value: 3, label: 'Affiliate' },
                { value: 4, label: 'Comission' },
                { value: 2, label: 'Donation' },
                { value: 0, label: 'Salary' },
                // { value: 1, label: 'Withdrawal' },
              ]}
            />
            <Input
              type="date"
              label="Date"
              placeholder="Please Select"
              value={state.dateC}
              onValue={(dateC) => setState({ ...state, dateC })}
              required
            />
            <Input
              type="select"
              label="Subject"
              placeholder="Please Select"
              value={state.subjectC}
              onValue={(subjectC) => setState({ ...state, subjectC })}
              required
              loading={loading}
              options={subjects}
              onSearch={debounce(getUsers, 250)}
            />
            <Input
              type="text"
              label="Vendor"
              placeholder="Please Enter"
              value={state.vendor}
              onValue={(vendor) => setState({ ...state, vendor })}
              required
            />
            <Input
              type="select"
              label="Balance Change"
              placeholder="Please Select"
              value={state.balanceChange}
              onValue={(balanceChange) => setState({ ...state, balanceChange })}
              required
              options={[
                {
                  value: false,
                  label: 'No',
                },
                {
                  value: true,
                  label: 'Yes',
                },
              ]}
            />
            <Input
              type="select"
              label="Project"
              placeholder="Please Select"
              value={state.projectC}
              onValue={(projectC) => setState({ ...state, projectC })}
              required
              onSearch={debounce(getProducts, 250)}
              options={projects}
              loading={loading}
            />
            <Input
              type="text"
              label="Email"
              placeholder="Please Enter"
              value={state.emailC}
              onValue={(emailC) => setState({ ...state, emailC })}
              required
            />
            <Input
              type="select"
              label="Status"
              placeholder="Please Select"
              value={state.statusC}
              onValue={(statusC) => setState({ ...state, statusC })}
              required
              options={[
                { value: 1, label: 'Approved' },
                { value: 2, label: 'Declined' },
                { value: 0, label: 'Pending' },
              ]}
            />
          </CreateFinanceModalMain>
        )}
        {tab === 1 && (
          <CreateFinanceModalMain columns={2}>
            <Input
              type="text"
              label="Revenue"
              placeholder="Please Enter"
              value={state.revenue}
              onValue={(revenue) => setState({ ...state, revenue })}
              required
            />
            <Input
              type="number"
              label="Amount"
              placeholder="18"
              value={state.amountR}
              onValue={(amountR) => setState({ ...state, amountR })}
              required
            />
            <Input
              type="date"
              label="Date"
              placeholder="Please Select"
              value={state.dateR}
              onValue={(dateR) => setState({ ...state, dateR })}
              required
            />
            <Input
              type="select"
              label="Subject"
              placeholder="Please Select"
              value={state.subjectR}
              onValue={(subjectR) => setState({ ...state, subjectR })}
              loading={loading}
              options={clients}
              required
              onSearch={debounce(getClients, 250)}
            />
            <Input
              type="select"
              label="Project"
              placeholder="Please Select"
              value={state.projectR}
              onValue={(projectR) => setState({ ...state, projectR })}
              required
              onSearch={debounce(getProducts, 250)}
              options={projects}
              loading={loading}
            />
            <Input
              type="text"
              label="Email"
              placeholder="Please Enter"
              value={state.emailR}
              onValue={(emailR) => setState({ ...state, emailR })}
            />
            <Input
              type="select"
              label="Status"
              placeholder="Please Select"
              value={state.statusR}
              onValue={(statusR) => setState({ ...state, statusR })}
              options={[
                { value: 0, label: 'Pending' },
                { value: 1, label: 'Received' },
              ]}
            />
          </CreateFinanceModalMain>
        )}
      </Stack>
    </Modal>
  );
};

export default CreateFinanceModal;
