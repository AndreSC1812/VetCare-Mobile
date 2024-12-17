module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"], // Asegúrate de usar el preset adecuado para tu proyecto
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
        },
      ],
    ],
  };
};
