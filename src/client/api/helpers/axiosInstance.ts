import axios, { AxiosInstance } from 'axios';

const DEFAULT_OPTIONS = {
  // 기본 Option은 inner server로 api호출
  baseURL: 'http://127.0.0.1:3131/api/', // TODO: PR서버 nginx가 붙으면 해당 URL형태를 base로 바꿈
  timeout: 15000,
  maxRedirects: 0, // redirect는 하지 않는걸로
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
    'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.6,en;q=0.4',
  },
};

const axiosInstance: AxiosInstance = axios.create(DEFAULT_OPTIONS);

export default axiosInstance;
