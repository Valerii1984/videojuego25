// metro.config.js
const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// --- монорепо: резолвим зависимости из корня
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, "node_modules")];
config.resolver.disableHierarchicalLookup = true;

// --- SVG как исходники (через transformer)
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);
config.resolver.sourceExts = Array.from(
  new Set([...config.resolver.sourceExts, "svg", "cjs"])
);

// --- (на всякий) явные модули, которые терялись
config.resolver.extraNodeModules = {
  expo: path.resolve(projectRoot, "node_modules/expo"),
  react: path.resolve(projectRoot, "node_modules/react"),
  "react-native": path.resolve(projectRoot, "node_modules/react-native"),
  "react-i18next": path.resolve(projectRoot, "node_modules/react-i18next"),
  i18next: path.resolve(projectRoot, "node_modules/i18next"),
};

module.exports = config;
