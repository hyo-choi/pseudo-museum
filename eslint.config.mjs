import config from "@hyo-choi/eslint-config";
import reactRefreshEslintPlugin from "eslint-plugin-react-refresh";

export default [
  config,
  {
    ignores: ["public/**/*", "dist"],
  },
  {
    plugins: {
      "react-refresh": reactRefreshEslintPlugin,
    },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
];
