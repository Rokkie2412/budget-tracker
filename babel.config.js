module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo", "nativewind/babel"],

    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],

          alias: {
            "lucide-react-native": "lucide-react",
            "@/components/ui": "./components/ui",
            "@": "./src",
            "tailwind.config": "./tailwind.config.js",
          },
        },
      ],
      "react-native-worklets/plugin",
    ],
  };
};
