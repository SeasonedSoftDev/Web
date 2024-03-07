export interface IRefreshToken {
  // * refresh token is long-lived access token
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}
