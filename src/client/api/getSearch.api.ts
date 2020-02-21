import { AxiosResponse } from 'axios';
// import requestGet from './helpers/requestGet';
import externalApiPathConfig from './configs/externalApiPathConfig';
import { currentPhase } from '../setting';

const getSearchApi = (phase: string = currentPhase): Promise<string | AxiosResponse> => {
  const url = externalApiPathConfig.search[phase];

  return Promise.resolve(url);
  // TODO: real api call
  // return requestGet(url, { baseURL: '' });
};

export default getSearchApi;
