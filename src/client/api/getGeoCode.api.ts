import { AxiosResponse } from 'axios';
import requestGet from './helpers/requestGet';
import internalApiPathConfig from './configs/internalApiPathConfig';

const getGeoCodeApi = (phase?: string): Promise<AxiosResponse> => {
  const { url } = internalApiPathConfig.geocode;
  const phaseQuery = phase ? `?phase=${phase}` : '';

  return requestGet(`${url}${phaseQuery}`);
};

export default getGeoCodeApi;
