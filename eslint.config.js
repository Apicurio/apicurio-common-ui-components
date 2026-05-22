import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
    {
        ignores: ["dist/**", ".eslintrc.cjs"]
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            "quotes": ["error", "double"],
            "semi": ["error", "always"],
            "indent": ["error", 4, {
                "FunctionDeclaration": {
                    "parameters": "first"
                },
                "SwitchCase": 1
            }],
            "key-spacing": ["error", {
                "afterColon": true
            }],
            "object-curly-spacing": ["error", "always"],
            "linebreak-style": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-inferrable-types": "off"
        }
    },
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
