import { AxiosRequestConfig } from 'axios';
import axiosInstance from './axiosInstance';

const requestGet = <T>(url: string, options?: AxiosRequestConfig): Promise<T> =>
  axiosInstance.get(url, options).then((res) => res.data);

export default requestGet;
