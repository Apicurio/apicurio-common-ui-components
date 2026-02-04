import apicurioConfig from "@apicurio/eslint-config";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
    {
        ignores: ["dist/**", ".eslintrc.cjs"]
    },
    ...apicurioConfig,
    {
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh
        },
        rules: {
            "indent": "off",
            "react-hooks/exhaustive-deps": "off",
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true }
            ]
        }
    }
];
