import React, { useEffect, useState } from 'react';
import { Modal } from 'components/custom';
import { Button, Input } from 'components/ui';
import { Stack } from 'components/system';
import { AmbassadorAPI, CompanyAPI } from 'api';
import { useAppContext } from 'context';
import { useSnackbar } from 'hooks';
// eslint-disable-next-line import/named
import { ChangeAmbassadorInfoModalMain } from 'features/account/role/ambasador/elements/change-company-role-modal/styles';
import { TChangeAmbassadorInfoModalProps } from './types';

const ChangeAmbassadorInfoModal = ({
  onClose,
  data,
  setParentFilter,
  setCompanyRole,
  ...props
}: TChangeAmbassadorInfoModalProps) => {
  const [state, setState] = useState<any>({
    company: data.company,
    role: data.role,
  });

  const { user } = useAppContext();

  const [id, setId] = useState(user.id);

  const debounce = (func: any, wait: any) => {
    let timeout: any;

    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const [company, setCompany] = useState<any>();
  const [role, setRole] = useState<any>();
  const [loading, setLoading] = useState(false);

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setState({
        ...state,
        company: { ...state.company, label: event.target.value },
      });
      event.target.blur();
    }
  };

  const getCompanies = async (s: string = '') => {
    setLoading(true);
    const { result } = await CompanyAPI.getAll(s);

    setCompany(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
    setLoading(false);
  };
  const getTitles = async (s: string = '') => {
    const { result } = await CompanyAPI.getAllTitles(s);

    setRole(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  useEffect(() => {
    getCompanies();
    getTitles();
  }, []);

  const { push } = useSnackbar();

  const handleUpdate = async () => {
    try {
      await AmbassadorAPI.updateSingleAmbassador(
        {
          company: {
            name: state.company ? state.company.label : undefined,
            companyId: state.company ? state.company.value : undefined,
          },
          companyTitleId: state.role ? state.role.value : undefined,
        },
        id
      ).finally(() => {
        if (setParentFilter && setCompanyRole && state.company && state.role) {
          setParentFilter((prevState: any) => ({
            ...prevState,
            company: state.company.label,
            role: state.role.label,
          }));

          setCompanyRole((prevState: any) => ({
            ...prevState,
            company: {
              label: state.company.label,
              value: state.company.value,
            },
            role: {
              label: state.role.label,
              value: state.role.value,
            },
          }));
        }
      });

      push('User successfully updated.', { variant: 'success' });
    } catch {
      push('User update failed.', { variant: 'error' });
    }
  };

  return (
    <Modal
      size="medium"
      title="Do you want to change info?"
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={() => {
            handleUpdate();
            setTimeout(onClose, 250);
          }}
        >
          Change info
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <Stack>
        <ChangeAmbassadorInfoModalMain columns={2}>
          <Input
            type="select"
            label="Company"
            placeholder="Please Select"
            value={state.company}
            onValue={(input) => setState({ ...state, company: input })}
            onSearch={debounce(getCompanies, 250)}
            onKeyDown={handleKeyDown}
            options={company}
            loading={loading}
          />
          <Input
            type="select"
            label="Role"
            placeholder="Please Select"
            value={state.role}
            onValue={(input) => setState({ ...state, role: input })}
            onSearch={debounce(getTitles, 250)}
            options={role}
            loading={loading}
          />
        </ChangeAmbassadorInfoModalMain>
      </Stack>
    </Modal>
  );
};

export default ChangeAmbassadorInfoModal;
