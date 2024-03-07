import React, { useEffect, useState, useCallback } from 'react';
import {
  NavigationMain,
  NavigationRouteName,
  NavigationItems,
  NavigationProfileOuter,
  NavigationProfile,
  NavigationProfileName,
  NavigationProfileImage,
  // NavigationSearch,
  BalanceIcon,
  NavigationBalanceDropdown,
  NavigationCurrency,
  NavigationProfileDropdown,
  NavigationProvileIcon,
  NavigationMenu,
  NavigationMenuButton,
  NavigationNotification,
  NavigationSpan,
  NavigationTooltipContainer,
} from 'components/custom/navigation/styles';
import {
  NotificationModal,
  ProfilePicture,
} from 'components/custom/navigation/elements';
import { TNavigationProps } from 'components/custom/navigation/types';
import { useAppContext } from 'context';
import {
  ArrowDownIcon,
  BellIcon,
  InfoIcon,
  LogoutIcon,
  MenuIcon,
} from 'components/svg';
import { useMenu, useModal, useSnackbar } from 'hooks';
import { useRouter } from 'next/router';
import FinanceAPI from 'api/finance';
import { ClickAwayListener, Grow, Paper, Popper } from '@mui/material';
import { AxiosResponse } from 'axios';
import Tooltip from '../tooltip';

const handleCurrencyCalculation = (
  amount: number,
  currency: 'EUR' | 'USD' | 'CHF' = 'CHF'
): number => {
  let formattedAmount = 0;

  if (currency === 'EUR') {
    formattedAmount = amount * 1.03;
  }
  if (currency === 'USD') {
    formattedAmount = amount * 1.11;
  }

  if (currency === 'CHF') {
    formattedAmount = amount; // Assumes the amount is already in euros for other currencies
  }

  return +formattedAmount.toFixed(2);
};

const Navigation = ({ ...props }: TNavigationProps) => {
  const [menuRef, open, setOpen, buttonRef, position] = useMenu(false);
  const [currencyRef, openR, setOpenR, buttonRefC, positionC] = useMenu(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const currencyTargRef = React.useRef<HTMLDivElement>(null);
  const [
    balanceMenuButtonRef,
    openBalanceButton,
    setOpenBalanceButton,
    balanceButtonRef,
    positionBalanceButton,
  ] = useMenu(false);

  // const [search, setSearch] = useState('');

  const [ppModal, openPpModal, closePpModal] = useModal(false);
  const [nModal, openNModal, closeNModal] = useModal(false);

  const router = useRouter();

  // const handleEnter = () => {
  //   const q = search.trim();
  //   if (q) {
  //     router.push({
  //       pathname: `/search`,
  //       query: { q },
  //     });
  //   }
  // };

  const {
    logout,
    routeName,
    role,
    user,
    handleMobileMenu,
    showMobileMenu,
    handleCurrencyChange,
    currency,
  } = useAppContext();

  const [currencyValue, setCurrency] = useState(currency);

  const [balance, setBalance] = useState(0);
  const [formattedBalance, setFormattedBalance] = useState(0);

  const handleMenu = () => {
    setOpen(!open);
  };

  const { push } = useSnackbar();

  const getBalance = async () => {
    try {
      const response = await FinanceAPI.getBalance();

      if (response.availableAmounts) {
        setBalance(response.availableAmounts);
        setFormattedBalance(() =>
          handleCurrencyCalculation(response.availableAmounts, 'CHF')
        );
      }
    } catch (error) {
      push("Retrieving user's balance failed", { variant: 'error' });
    }
  };

  useEffect(() => {
    getBalance();
  }, []);

  const handleCurrencyChangeVal = useCallback(
    (currencyVal: 'EUR' | 'USD' | 'CHF') => {
      handleCurrencyChange(currencyVal);
      setOpenR(!openR);
      setFormattedBalance(() =>
        handleCurrencyCalculation(balance, currencyVal)
      );
    },
    [balance, openR]
  );

  const handleBalanceMenuClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      // eslint-disable-next-line no-useless-return
      return;
    }
    setOpenBalanceButton(false);
  };

  const handleCurrencyMenuClose = (event: Event) => {
    if (
      currencyTargRef.current &&
      currencyTargRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpenR(false);
  };

  const handleCurrencyAndBalanceChange = (
    currencyVal: 'EUR' | 'USD' | 'CHF'
  ) => {
    handleCurrencyChange(currencyVal);
    setOpenBalanceButton(false);

    setFormattedBalance(() => handleCurrencyCalculation(balance, currencyVal));
  };

  const hasAuthCookie = () => {
    const cookies = document.cookie; // Get all cookies as a single string
    const authCookieName = 'auth'; // Replace with your authentication cookie name

    // Split the cookies string into individual cookies
    const cookieArray = cookies.split('; ');

    // Iterate through the cookies and check if the authentication cookie exists
    // eslint-disable-next-line no-restricted-syntax
    for (const cookie of cookieArray) {
      const [name] = cookie.split('=');
      if (name === authCookieName) {
        return true; // Authentication cookie found
      }
    }

    return false; // Authentication cookie not found
  };

  const handleLogout = async () => {
    await logout()
      .then((res: AxiosResponse<any, any>) => {
        if (res.status === 200 && !hasAuthCookie()) {
          router.push('/login');
          setOpen(!open);
        }
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          router.push('/login');
        }
      });
  };

  const handleSidebar = () => {
    handleMobileMenu(!showMobileMenu);
  };

  return (
    <NavigationMain {...props}>
      <NavigationMenu>
        <NavigationMenuButton onClick={handleSidebar}>
          <MenuIcon />
        </NavigationMenuButton>
        <NavigationRouteName>
          {routeName}
          <NavigationSpan>
            early access
            <Tooltip
              title={
                <NavigationTooltipContainer>
                  Welcome to Patients Influence Early Access! We&apos;re so
                  excited to have you join us on this journey. This is a special
                  sneak peek at our platform, so you might find some features
                  are still under development. Your experience matters to us. As
                  we grow, we&apos;re eagerly collecting feedback to enhance our
                  service. Don&apos;t hesitate to share your insights and
                  suggestions at <span>support@patientsinfluence.com</span>.
                  Your input is key in shaping a better and more effective
                  platform. Thank you for being a vital part of our community!
                </NavigationTooltipContainer>
              }
            >
              <div>
                <InfoIcon />
              </div>
            </Tooltip>
          </NavigationSpan>
        </NavigationRouteName>
      </NavigationMenu>
      <NavigationItems>
        {['AMBASSADOR', 'INFLUENCER'].includes(role) && (
          <NavigationCurrency
            onClick={() => setOpenBalanceButton(!openBalanceButton)}
          >
            Balance: {currency} {formattedBalance.toFixed(2)}
            <BalanceIcon ref={balanceButtonRef} expanded={openBalanceButton}>
              {' '}
              <ArrowDownIcon />{' '}
            </BalanceIcon>{' '}
            <Popper
              open={openBalanceButton}
              anchorEl={anchorRef.current}
              role={undefined}
              style={{
                position: 'absolute',
                top: '45px',
                left: '45px',
              }}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === 'bottom' ? 'center top' : 'center bottom',
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleBalanceMenuClose}>
                      <NavigationBalanceDropdown
                        position={positionBalanceButton}
                        items={[
                          {
                            icon: '€',
                            label: 'EUR',
                            action: () => {
                              handleCurrencyAndBalanceChange('EUR');
                            },
                          },
                          {
                            icon: '$',
                            label: 'USD',
                            action: () => {
                              handleCurrencyAndBalanceChange('USD');
                            },
                          },
                          {
                            icon: 'Fr',
                            label: 'CHF',
                            action: () => {
                              handleCurrencyAndBalanceChange('CHF');
                            },
                          },
                        ]}
                        ref={menuRef}
                      />
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </NavigationCurrency>
        )}

        {['AMBASSADOR', 'CLIENT'].includes(role) && (
          <NavigationCurrency onClick={() => setOpenR(!openR)}>
            Currency: {currency}{' '}
            <BalanceIcon ref={buttonRefC} expanded={openR}>
              {' '}
              <ArrowDownIcon />{' '}
            </BalanceIcon>{' '}
            <Popper
              open={openR}
              anchorEl={currencyTargRef.current}
              role={undefined}
              style={{
                position: 'absolute',
                top: '45px',
                left: '25px',
              }}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === 'bottom' ? 'center top' : 'center bottom',
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleCurrencyMenuClose}>
                      <NavigationBalanceDropdown
                        position={positionC}
                        items={[
                          {
                            icon: '€',
                            label: 'EUR',
                            action: () => {
                              handleCurrencyChangeVal('EUR');
                            },
                          },
                          {
                            icon: '$',
                            label: 'USD',
                            action: () => {
                              handleCurrencyChangeVal('USD');
                            },
                          },
                          {
                            icon: 'Fr',
                            label: 'CHF',
                            action: () => {
                              handleCurrencyChangeVal('CHF');
                            },
                          },
                        ]}
                        ref={menuRef}
                      />
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </NavigationCurrency>
        )}
        <NavigationNotification onClick={openNModal}>
          <BellIcon />
        </NavigationNotification>
        <NavigationProfileOuter>
          <NavigationProfile onClick={handleMenu}>
            <NavigationProfileName>{`${user?.firstName} ${user?.lastName}`}</NavigationProfileName>
            {['ADMIN'].includes(role) && (
              <NavigationProfileImage image="https://static.intercomassets.com/avatars/5017590/square_128/NIX-1623671396.jpg">
                IJ
              </NavigationProfileImage>
            )}
            <NavigationProvileIcon ref={buttonRef} expanded={open}>
              <ArrowDownIcon />
            </NavigationProvileIcon>
          </NavigationProfile>
          {open && ['ADMIN', 'SUPERADMIN'].includes(role) && (
            <NavigationProfileDropdown
              items={[
                // {
                //   icon: <AccountIcon />,
                //   label: 'Account',
                //   action: () => {
                //     openPpModal();
                //     handleMenu();
                //   },
                // },
                {
                  icon: <LogoutIcon />,
                  label: 'Logout',
                  action: handleLogout,
                },
              ]}
              ref={menuRef}
            />
          )}
          {open && ['INFLUENCER', 'CLIENT', 'AMBASSADOR'].includes(role) && (
            <NavigationProfileDropdown
              items={[
                {
                  icon: <LogoutIcon />,
                  label: 'Logout',
                  action: handleLogout,
                },
              ]}
              ref={menuRef}
            />
          )}
        </NavigationProfileOuter>
      </NavigationItems>
      {ppModal && <ProfilePicture onClose={closePpModal} />}
      {nModal && <NotificationModal onClose={closeNModal} />}
    </NavigationMain>
  );
};

export default Navigation;
