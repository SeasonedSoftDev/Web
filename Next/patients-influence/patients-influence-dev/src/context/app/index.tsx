import { AuthorizationAPI } from 'api';
import React, {
  createContext,
  useMemo,
  useContext,
  useState,
  useEffect,
} from 'react';
import { createInitialState } from 'context/app/data';
import { TAppContextState } from 'context/app/types';
import { TLoginParams } from 'api/authorization/types';
import { LoadingPage } from 'features';
import { convertNumberToRole } from 'utilities/converters';
import { IUser } from 'api/users/types';

const AppContext = createContext(createInitialState());

export const useAppContext = () => useContext(AppContext);

const AppContextProvider = ({ ...props }) => {
  const [state, setState] = useState<TAppContextState>({
    routeName: '',
    user: null,
    role: 'CLIENT',
    initialLoading: true,
    showMobileMenu: true,
    currency: 'CHF',
    influencer: null,
  });

  const handleMobileMenu = (value: boolean) => {
    setState((x) => ({ ...x, showMobileMenu: value }));
  };

  const setRouteName = (routeName: string) => {
    setState((x) => ({ ...x, routeName }));
  };

  const handleCurrencyChange = (value: string) => {
    setState((x) => ({ ...x, currency: value }));
  };

  const handleInfluencer = (body: IUser) => {
    setState((x) => ({ ...x, influencer: body }));
  };

  const logout = async () => {
    const response = await AuthorizationAPI.logout().finally(() => {
      localStorage.clear();
    });

    return response;
  };

  const getMeData = async () => {
    try {
      const user = await AuthorizationAPI.me();

      if (!user) throw 'No user returned';

      const roleResult = convertNumberToRole(user.role);

      if (!roleResult) throw 'No role found';

      setState({ ...state, user, role: roleResult, initialLoading: false });

      return user;
    } catch {
      setState({ ...state, initialLoading: false });
    }

    return '';
  };

  const login = async (body: TLoginParams) => {
    await AuthorizationAPI.login(body);

    // Cookies.set('Authorization', token);
    const user = await getMeData();

    return user;
  };

  useEffect(() => {
    (async () => {
      try {
        await getMeData();
      } catch {
        setState({ ...state, initialLoading: false });
      }
    })();
    if (window.innerWidth >= 1200) {
      handleMobileMenu(true);
    } else {
      handleMobileMenu(false);
    }
    // const token = Cookies.get('Authorization');
    // if (token) {
    //   axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    //   getMeData();
    // } else {
    //   setState({ ...state, initialLoading: false });
    // }
  }, []);

  const providerValue = useMemo(
    () => ({
      ...state,
      setRouteName,
      getMeData,
      login,
      logout,
      handleMobileMenu,
      handleCurrencyChange,
      handleInfluencer,
    }),
    [
      state,
      setRouteName,
      getMeData,
      login,
      logout,
      handleMobileMenu,
      handleCurrencyChange,
      handleInfluencer,
    ]
  );
  return state.initialLoading ? (
    <LoadingPage />
  ) : (
    <AppContext.Provider value={providerValue} {...props} />
  );
};

export default AppContextProvider;
