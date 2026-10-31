module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['plugin:vue/vue3-essential'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: {
      js: 'espree',
      jsx: 'espree'
    }
  },
  rules: {
    'vue/no-v-model-argument': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/require-default-prop': 'off',
    'vue/no-unused-vars': 'warn',
    'no-unused-vars': 'warn',
    'no-undef': 'off'
  }
}
