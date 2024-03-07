const createPalette = () => ({
  primary: {
    dark: '#28316c',
    main: '#37428A',
    // 37428A
    light: '#364292',
    contrastText: '#ffffff',
  },
  secondary: {
    dark: '#367fbb',
    main: '#448DC9',
    light: '#5698ce',
    contrastText: '#ffffff',
  },
  default: {
    dark: '#e7ecff',
    main: '#F1F4FF',
    light: '#f2f5ff',
    contrastText: '#000000',
  },
  error: {
    dark: '#c62828',
    main: '#d32f2f',
    light: '#ef5350',
    contrastText: '#ffffff',
  },
  warning: {
    dark: '#e65100',
    main: '#FFA800',
    light: '#ff9800',
    contrastText: '#ffffff',
  },
  success: {
    dark: '#1b5e20',
    main: '#1DAC2B',
    light: '#4caf50',
    contrastText: '#ffffff',
  },
  info: {
    dark: '#0c51cf',
    main: '#0e5be7',
    light: '#1e69f1',
    contrastText: '#ffffff',
  },
  dark: {
    dark: '#0e0e0e',
    main: '#101010',
    light: '#272727',
    contrastText: '#ffffff',
  },
  common: {
    white: '#ffffff',
    black: '#000000',
    // background: '#F8F9FD',
    background: '#eeeff3',
    gray: [
      '#efefef',
      '#dfdfdf',
      '#cfcfcf',
      '#bfbfbf',
      '#afafaf',
      '#9f9f9f',
      '#8f8f8f',
      '#7f7f7f',
      '#6f6f6f',
      '#5f5f5f',
      '#4f4f4f',
      '#3f3f3f',
      '#2f2f2f',
      '#1f1f1f',
    ],
    stepper: '#C3DBEE',
  },
});

export type ColorType = keyof ReturnType<typeof createPalette>;

export default createPalette;
