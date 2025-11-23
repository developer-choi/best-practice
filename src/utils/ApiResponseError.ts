import BaseError from '@/utils/BaseError';

export class ApiResponseError extends BaseError {
  readonly request: RequestInit | undefined;
  readonly response: Response;
  readonly name = 'ApiResponseError';

  constructor(request: RequestInit | undefined, response: Response) {
    super(`${request?.method ?? 'GET'} ${response.status} ${response.url}`, {
      level: 'warning',
    });
    this.request = request;
    this.response = response;
  }
}
