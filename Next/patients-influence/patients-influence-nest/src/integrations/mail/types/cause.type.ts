// type to extract the real error from the HttpException, which has private response object
export type Cause = {
  response: {
    body: {
      errors: [message: any];
    };
  };
};
