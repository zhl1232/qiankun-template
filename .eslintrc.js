// @ts-check
const { defineConfig } = require("eslint-define-config")

module.exports = defineConfig({
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
      tsx: true
    }
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "./.eslintrc-auto-import.json"
    // 'vue-global-api' // unplugin-auto-import/vite 自动引用报错
  ],
  plugins: ["prettier"],
  globals: {
    // Ref sugar (take 2)
    $: "readonly",
    $$: "readonly",
    $ref: "readonly",
    $shallowRef: "readonly",
    $computed: "readonly"
  },
  rules: {
    /**
     * 代码错误
     */
    "no-console": 1,
    "no-debugger": 1,

    /**
     * 最佳实践
     */
    eqeqeq: 2, // 强制使用 === 和 !==
    "default-case": 1, // 要求 switch 语句中有 default 分支
    "no-else-return": 0, // 禁止 if 语句中 return 语句之后有 else 块
    "no-empty-function": 1, // 禁止出现空函数
    "no-multi-spaces": 1, // 禁止使用多个空格
    radix: 0, // 强制在parseInt()使用基数参数

    /**
     * ECMAScript6
     */
    "arrow-spacing": ["error", { before: true, after: true }], // 强制箭头函数的箭头前后使用空格
    "no-var": 2, // 禁止使用 var 声明变量
    "object-shorthand": 2, // 要求使用对象方法名和属性名简写
    "prefer-arrow-callback": 2, // 要求回调函数使用箭头函数
    "prefer-const": 2, // 使用 const 声明那些声明后不再被修改的变量
    "prefer-rest-params": 2, // 要求使用剩余参数而不是 arguments
    /**
     * typescript
     * https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/docs/rules
     */
    "@typescript-eslint/member-delimiter-style": [
      2,
      {
        multiline: {
          delimiter: "none",
          requireLast: true
        },
        singleline: {
          delimiter: "semi",
          requireLast: false
        }
      }
    ],
    "@typescript-eslint/ban-ts-ignore": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/interface-name-prefix": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/ban-ts-comment": 0,
    "@typescript-eslint/no-var-requires": "off",
    /** Vue */
    "vue/multi-word-component-names": 0,
    /** prettier */
    "prettier/prettier": "error"
  }
})
