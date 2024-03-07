import React, { useState, useEffect, useRef } from 'react';
import {
  RegisterTitle,
  RegisterSubtitle,
  RegisterCompanyMain,
  RegisterCompanyTopStack,
  RegisterCompanyBottomStack,
  RegisterCompanyFName,
  RegisterCompanyLName,
  RegisterCompanyCompany,
  RegisterCompanyRole,
  RegisterCheckbox,
  RegisterLocalization,
} from 'features/register/styles';
import { Button, Input } from 'components/ui';
import { emailSchema, nameSchema, passwordSchema } from 'utilities/validators';
import { AmbassadorAPI, CompanyAPI, LegalsAPI } from 'api';
import { useDebounce, useModal, useSnackbar } from 'hooks';
import { ConfirmRegistrationModal } from 'features/register/elements';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';

type TSelect = {
  value: number;
  label: string;
};

interface IFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  invCode: string;
  company: any | null;
  role: TSelect | null;
  commonLegalId: number | null;
}

const RegisterPage = () => {
  const [state, setState] = useState<IFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    // companyTitleId: '',
    invCode: '',
    company: {
      value: undefined,
      label: '',
      name: '',
    },
    role: null,
    commonLegalId: null,
  });

  const [legalsChecked, setLegalsChecked] = useState({
    commonLegal: false,
  });

  const [commonLegal, setCommonLegal] = useState<any>('');

  const [counter, setCounter] = useState(0);

  const router = useRouter();

  const { token } = router.query;

  const { push } = useSnackbar();

  const { t } = useTranslation('register');

  const [errors, setErrors] = useState([
    false,
    false,
    false,
    // false,
    false,
    false,
    false,
  ]);

  const handleErrors = (index: number) => (value: boolean) => {
    setErrors((x) => x.map((a, b) => (b === index ? value : a)));
  };

  const getLegals = async (lang: string) => {
    const data = await LegalsAPI.getLegals(lang);

    const common = data.commonLegal;

    setState({
      ...state,
      commonLegalId: common.id,
    });
    setCommonLegal(common);
  };
  const [crModal, openCrModal, closeCrModal] = useModal(false);

  const timeoutTime = 10000;

  const isDisabled =
    !state.firstName ||
    !state.lastName ||
    !state.email ||
    !state.password ||
    !state.company ||
    !state.role ||
    !legalsChecked.commonLegal ||
    !!errors.find((x) => x) ||
    counter === 1;

  const handleRegister = async () => {
    const {
      firstName,
      lastName,
      company,
      email,
      password,
      role,
      commonLegalId,
    } = state;

    if (role && company && commonLegalId && token) {
      const formData = {
        firstName,
        lastName,
        email,
        companyTitleId: role.value,
        commonLegalId,
        company: {
          companyId: company.value,
          name: company.label,
        },
        password,
      };
      try {
        const locale = router.locale ? router.locale?.slice(0, 2) : '';
        await AmbassadorAPI.registration(formData, token?.toString(), locale);
        openCrModal();
      } catch (e: any) {
        let step = 0;
        step += 1;
        setCounter(step);
        push(e.response.data.message, { variant: 'error' });
        setTimeout(() => {
          setCounter(0);
        }, timeoutTime);
      }
    }
  };

  const handleClose = () => {
    router.push('/login');
    closeCrModal();
  };

  const [companies, setCompanies] = useState<any>([]);
  const [titles, setTitles] = useState<any>([]);

  const getCompanies = async (s: string = '') => {
    const { result } = await CompanyAPI.getAll(s);

    setCompanies(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const getTitles = async (s: string = '') => {
    const { result } = await CompanyAPI.getAllTitles(s);

    setTitles(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const debounceCompanies = useDebounce(getCompanies, 300);
  const debounceRoles = useDebounce(getTitles, 300);

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

  useEffect(() => {
    const lang = router.locale?.slice(0, 2);
    if (lang) {
      getLegals(lang);
    }
  }, [router.locale]);

  useEffect(() => {
    getCompanies();
    getTitles();
    if (token) {
      setState((prevState) => ({ ...prevState, invCode: token.toString() }));
    }
  }, []);

  return (
    <RegisterCompanyMain>
      <RegisterTitle>Sign Up as Ambassador</RegisterTitle>
      <RegisterSubtitle>
        Lead the revolution to empower patients and transform healthcare for the
        better by leveraging your expertise and network with us.
      </RegisterSubtitle>
      <RegisterCompanyTopStack direction="horizontal">
        <RegisterCompanyFName
          type="text"
          label="First Name"
          required
          placeholder="Please Enter your First Name"
          value={state.firstName}
          onValue={(firstName) => setState({ ...state, firstName })}
          errorCallback={handleErrors(0)}
          validators={[
            {
              message: 'First name is required',
              validator: (firstName) => {
                const v = firstName as string;
                if (v.trim()) return true;
                return false;
              },
            },
            {
              message: t(
                'First name needs to be between 2 and 15 characters in length'
              ),
              validator: (firstName) => {
                try {
                  nameSchema.validateSync({ length: firstName });
                  return true;
                } catch {
                  return false;
                }
              },
            },
            {
              message: t('First name must contain only letters'),
              validator: (firstName) => {
                try {
                  nameSchema.validateSync({ pattern: firstName });
                  return true;
                } catch {
                  return false;
                }
              },
            },
          ]}
        />
        <RegisterCompanyLName
          type="text"
          label="Last Name"
          required
          placeholder="Please Enter your Last Name"
          value={state.lastName}
          onValue={(lastName) => setState({ ...state, lastName })}
          errorCallback={handleErrors(1)}
          validators={[
            {
              message: 'Last name is required',
              validator: (lastName) => {
                const v = lastName as string;
                if (v.trim()) return true;
                return false;
              },
            },
            {
              message: t(
                'Last name needs to be between 2 and 15 characters in length'
              ),
              validator: (lastName) => {
                try {
                  nameSchema.validateSync({ length: lastName });
                  return true;
                } catch {
                  return false;
                }
              },
            },
            {
              message: t('Last name must contain only letters'),
              validator: (lastName) => {
                try {
                  nameSchema.validateSync({ pattern: lastName });
                  return true;
                } catch {
                  return false;
                }
              },
            },
          ]}
        />
      </RegisterCompanyTopStack>
      <RegisterCompanyBottomStack direction="horizontal">
        <RegisterCompanyCompany
          type="select"
          label="Company"
          placeholder="Please Enter your Company"
          required
          onSearch={debounceCompanies}
          onKeyDown={handleKeyDown}
          value={state.company}
          onValue={(company) =>
            setState({
              ...state,
              company,
            })
          }
          options={companies}
          errorCallback={handleErrors(2)}
          validators={[
            {
              message: 'Company is required',
              validator: (company) => {
                const v = company as object;
                if (v) return true;
                return false;
              },
            },
          ]}
        />
        <RegisterCompanyRole
          type="select"
          label="Role"
          required
          placeholder="Please Enter your Role"
          value={state.role}
          onSearch={debounceRoles}
          onValue={(role) =>
            setState({
              ...state,
              role,
            })
          }
          options={titles}
          errorCallback={handleErrors(3)}
          validators={[
            {
              message: 'Role is required',
              validator: (role) => {
                const v = role as object;
                if (v) return true;
                return false;
              },
            },
          ]}
        />
      </RegisterCompanyBottomStack>
      <Input
        type="text"
        label="Email"
        required
        placeholder="Please Enter your Email"
        value={state.email}
        onValue={(email) => setState({ ...state, email })}
        errorCallback={handleErrors(4)}
        validators={[
          {
            message: 'Email is required',
            validator: (email) => {
              const v = email as string;
              if (v.trim()) return true;
              return false;
            },
          },
          {
            message: 'Not a valid email format',
            validator: (email) => {
              try {
                emailSchema.validateSync({ email });
                return true;
              } catch {
                return false;
              }
            },
          },
        ]}
      />
      <Input
        type="password"
        label="Password"
        required
        placeholder="Please Enter your Password"
        value={state.password}
        onValue={(password) => setState({ ...state, password })}
        errorCallback={handleErrors(5)}
        validators={[
          {
            message: 'Password is required',
            validator: (password) => {
              const v = password as string;
              if (v.trim()) return true;
              return false;
            },
          },
          {
            message:
              'Password must have at least one uppercase, lowercase letter, number and symbol',
            validator: (password) => {
              try {
                passwordSchema.validateSync({ password });
                return true;
              } catch {
                return false;
              }
            },
          },
        ]}
      />
      <RegisterCheckbox
        label={
          <>
            {t('I agree to the')}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://patientsinfluence.com/terms-of-use/"
            >
              {' '}
              {t('Terms of Service')}
            </Link>{' '}
            {t('and')}{' '}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://patientsinfluence.com/privacy-statement/"
            >
              {t('Privacy Policy')}
            </Link>
            .
          </>
        }
        size="small"
        color="primary"
        value={legalsChecked.commonLegal}
        onValue={(v) => setLegalsChecked({ ...legalsChecked, commonLegal: v })}
      />
      <Button
        variant="contained"
        size="large"
        color="secondary"
        disabled={isDisabled}
        onClick={handleRegister}
      >
        SIGN UP NOW
      </Button>
      <RegisterLocalization />
      {crModal && (
        <ConfirmRegistrationModal email={state.email} onClose={handleClose} />
      )}
    </RegisterCompanyMain>
  );
};

export default RegisterPage;
