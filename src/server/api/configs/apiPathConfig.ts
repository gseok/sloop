export interface ApiConfigValues {
  [index: string]: string;
}
export interface ApiConfig {
  [index: string]: ApiConfigValues;
}

const config: ApiConfig = {
  search: {
    local: 'http://search.local/',
    dev: 'http://search.dev/',
    test: 'http://search.test/',
    real: 'http://search.real/',
  },
  geocode: {
    local: 'http://geocode/local/',
    dev: 'http://geocode/dev/',
    test: 'http://geocode/test/',
    real: 'http://geocode/real/',
  },
};

export default config;
