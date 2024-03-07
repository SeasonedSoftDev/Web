import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import axios from 'axios';
import socialConfig from 'src/config/social.config';
import { IAccessToken } from './interfaces/access-token.interface';
import { formatAxiosErrorMessage } from 'src/utils/formatters/errors/axios-error-message.formatter';
import { IRefreshToken } from './interfaces/refresh-token.interface';

@Injectable()
export class InstagramService {
  private readonly logger = new Logger(InstagramService.name);

  constructor(
    @Inject(socialConfig.KEY)
    private readonly _socialConfig: ConfigType<typeof socialConfig>,
  ) {}

  async exchangeCodeForAccessToken(
    code: string,
    includeRefreshToken = true,
  ): Promise<
    IAccessToken & {
      refreshToken?: IRefreshToken;
    }
  > {
    try {
      const accessTokenResponse = await axios.post(
        'https://api.instagram.com/oauth/access_token',
        {
          client_id: this._socialConfig.instagram.clientId,
          client_secret: this._socialConfig.instagram.clientSecret,
          grant_type: 'authorization_code',
          redirect_uri: this._socialConfig.instagram.redirectURI,
          code,
        },
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );

      const userResponse = await axios.get(
        `https://graph.instagram.com/me?fields=username&access_token=${accessTokenResponse.data.access_token}`,
      );

      // * short-lived access token = access token
      const shortLivedAccessToken = accessTokenResponse.data.access_token;
      const userId = accessTokenResponse.data.user_id;
      const username = userResponse.data.username;
      // let result: IAccessToken & Partial<IUserData>;
      const result: IAccessToken & { refreshToken?: IRefreshToken } = {
        accessToken: shortLivedAccessToken,
        userId,
        username,
      };

      if (includeRefreshToken) {
        result.refreshToken = await this.getLongLivedAccessToken(
          shortLivedAccessToken,
        );
      }

      return result;
    } catch (err) {
      // * instagram returns detailed error message at `error.response.data.error_message`
      this.logger.error(
        `Error exchanging code for access token: ${
          formatAxiosErrorMessage(err).message
        }`,
      );
      throw err;
    }
  }

  private async getLongLivedAccessToken(
    shortLivedAccessToken: string,
  ): Promise<IRefreshToken> {
    try {
      const response = await axios.get(
        `https://graph.instagram.com/access_token`,
        {
          params: {
            grant_type: 'ig_exchange_token',
            client_secret: this._socialConfig.instagram.clientSecret,
            access_token: shortLivedAccessToken,
          },
        },
      );

      return {
        // * long-lived access token = refresh token
        accessToken: response.data.access_token,
        tokenType: response.data.token_type,
        expiresIn: response.data.expires_in,
      };
    } catch (err) {
      // * instagram returns detailed error message at `error.response.data.error_message`
      this.logger.error(
        `Error getting long-lived access token: ${
          formatAxiosErrorMessage(err).message
        }`,
      );
      throw err;
    }
  }

  // TODO fetch counts.followed_by
}
