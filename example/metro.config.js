const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const libraryPackage = require('../package.json');
const path = require('path');
const defaultConfig = getDefaultConfig(__dirname);
const libraryRoot = path.resolve(__dirname, '..');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const modules = Object.keys({
  ...libraryPackage.peerDependencies,
});

const {
  resolver: {sourceExts, assetExts},
} = defaultConfig;

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
    blacklistRE: exclusionList(
      modules.map(
        m =>
          new RegExp(
            `^${path
              .join(libraryRoot, 'node_modules', m)
              .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\/.*$`,
          ),
      ),
    ),
    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);
      return acc;
    }, {}),
  },
  projectRoot: __dirname,
  watchFolders: [libraryRoot],
};

module.exports = mergeConfig(defaultConfig, config);
