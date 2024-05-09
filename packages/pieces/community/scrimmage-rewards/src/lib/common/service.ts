import { httpClient, HttpRequest, HttpResponse } from '@activepieces/pieces-common';

const determineService = (url: string) => {
  if (url.startsWith('/nbc')) {
    return 'nbc';
  }
  if (url.startsWith('/p2e')) {
    return 'p2e';
  }
  return '';
};

const makeRequest = async <Response = any, Body = any>(auth: any, request: HttpRequest<Body>): Promise<HttpResponse<Response>> => {
  const service = determineService(request.url);
  const url = request.url.replace(`/${service}`, '');
  return await httpClient.sendRequest<Response>({
    ...request,
    url: `${auth.baseUrl}/${service}/${url}`,
    headers: {
      'Content-Type': 'application/json',
      ...(service === 'nbc' && {
        'Authorization': 'Token ' + auth.nbcToken,
      }),
      ...(service === 'p2e' && {
        'Authorization': 'Token ' + auth.p2eToken,
      }),
      'Scrimmage-Namespace': auth.namespace,
      ...request.headers,
    },
  });
};

export const scrimmageService = {
  makeRequest,
  determineService,
};
