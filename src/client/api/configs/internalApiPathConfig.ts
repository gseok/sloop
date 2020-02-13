export interface ApiConfigValues {
  [index: string]: string;
}
export interface ApiConfig {
  [index: string]: ApiConfigValues;
}

const config: ApiConfig = {
  geocode: {
    url: '/geocode',
  },
};

export default config;
