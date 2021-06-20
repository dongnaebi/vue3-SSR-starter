module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ['vue'],
  extends: ['plugin:vue/vue3-recommended', '@vue/standard'],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/script-indent': ['error', 2, { // script标签缩进设置
      baseIndent: 1,
      switchCase: 0,
      ignores: []
    }],
    'vue/max-attributes-per-line': 'off'
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        indent: 'off'
      }
    }
  ]
}
