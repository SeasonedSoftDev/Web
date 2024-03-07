import {
  TPatientsInfluenceClientParams,
  TPatientsInfluenceClientData,
} from 'utilities/api-client/types';

class PatientsInfluenceClient {
  baseUrl: string;

  withCredentials: boolean;

  constructor({
    baseUrl = '',
    withCredentials = false,
  }: TPatientsInfluenceClientParams) {
    this.baseUrl = baseUrl;
    this.withCredentials = withCredentials;
  }

  getRestOptions(
    options: Partial<
      Omit<Request, 'headers'> & {
        data?: TPatientsInfluenceClientData;
        headers: { [key: string]: any };
      }
    >
  ) {
    return {
      credentials: this.withCredentials ? 'include' : 'same-origin',
      body: options.data ? JSON.stringify(options.data) : undefined,
      headers: new Headers({
        'Content-Type': 'application/json',
        ...(options.headers ? options.headers : {}),
      }),
      ...options,
    };
  }

  async get(
    url: string,
    options: Partial<Request & { data: TPatientsInfluenceClientData }> = {}
  ) {
    const rest = this.getRestOptions(options);
    return fetch(this.baseUrl + url, {
      method: 'GET',
      ...(rest as Partial<Request & { data: TPatientsInfluenceClientData }>),
    }).then((res) => res.json());
  }

  async post(
    url: string,
    options: Partial<Request & { data: TPatientsInfluenceClientData }> = {}
  ) {
    const rest = this.getRestOptions(options);
    return fetch(this.baseUrl + url, {
      method: 'POST',
      ...(rest as Partial<Request & { data: TPatientsInfluenceClientData }>),
    }).then((res) => res.json());
  }

  async patch(
    url: string,
    options: Partial<Request & { data: TPatientsInfluenceClientData }> = {}
  ) {
    const rest = this.getRestOptions(options);
    return fetch(this.baseUrl + url, {
      method: 'PATCH',
      ...(rest as Partial<Request & { data: TPatientsInfluenceClientData }>),
    }).then((res) => res.json());
  }

  async delete(
    url: string,
    options: Partial<Request & { data: TPatientsInfluenceClientData }> = {}
  ) {
    const rest = this.getRestOptions(options);
    return fetch(this.baseUrl + url, {
      method: 'DELETE',
      ...(rest as Partial<Request & { data: TPatientsInfluenceClientData }>),
    }).then((res) => res.json());
  }
}

export default PatientsInfluenceClient;
