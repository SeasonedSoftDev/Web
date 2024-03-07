import { AxiosError } from 'axios';

export function formatAxiosErrorMessage(error: AxiosError) {
  if (!error.response) return { message: error.message, stack: error.stack };

  const responseDataMessageKey = Object.keys(error.response.data).find(
    (responseDataKey) =>
      responseDataKey.includes('message') ||
      responseDataKey.includes('msg') ||
      responseDataKey.includes('text') ||
      responseDataKey.includes('txt'),
  );
  const message =
    responseDataMessageKey !== undefined
      ? error.response.data[responseDataMessageKey]
      : error.response.statusText;

  return { message, stack: undefined };
}
