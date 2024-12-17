const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"), // Utiliza react-native-svg-transformer
  };

  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"), // Elimina SVG de assetExts
    sourceExts: [...resolver.sourceExts, "svg"], // Agrega SVG a sourceExts
  };

  return config;
})();
