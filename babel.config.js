/* eslint-disable func-style */
function isWebTarget(caller) {
  return Boolean(caller && caller.target === 'web');
}

module.exports = (api) => {
  const web = api.caller(isWebTarget);

  return {
    presets: [
      '@babel/preset-react',
      [
        '@babel/preset-env',
        {
          useBuiltIns: web ? 'entry' : undefined,
          targets: !web ? { node: 'current' } : undefined,
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: ['@babel/plugin-syntax-dynamic-import', '@loadable/babel-plugin'],
  };
};
