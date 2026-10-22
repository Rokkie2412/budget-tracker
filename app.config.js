// This Config for build, api need build target as Server, but app build need static, so we need to set the build target based on the build type

export default ({ config }) => {
  const isWebBuild = process.env.BUILD_TARGET === 'web';

  return {
    ...config,
    web: {
      ...config.web,
      output: isWebBuild ? 'server' : 'static',
    },
  };
};