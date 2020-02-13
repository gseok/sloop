export interface ApiConfigValues {
  [index: string]: string;
}
export interface ApiConfig {
  [index: string]: ApiConfigValues;
}

const config: ApiConfig = {
  search: {
    // The following code will be stripped when real build time
    /* develblock:start */
    local: 'http://external/search/local',
    dev: 'http://external/search/dev',
    test: 'http://external/search/test',
    /* develblock:end */
    real: 'http://external/search/real',
  },
};

export default config;
