const createZIndexes = () => ({
  mobileStepper: 1000,
  speedDial: 1050,
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
  pageLoader: 1600,
});

export type zIndexesType = keyof ReturnType<typeof createZIndexes>;

export default createZIndexes;
