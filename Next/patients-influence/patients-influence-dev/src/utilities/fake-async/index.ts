const FakeAsync = (interval: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, interval);
  });

export default FakeAsync;
