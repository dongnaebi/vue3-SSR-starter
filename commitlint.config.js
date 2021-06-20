module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 'refactor', 'perf',
      'test', 'build', 'ci', 'chore', 'revert'
    ]],
    'type-case': [0],
    'type-empty': [0],
    'scope-empty': [0],
    'scope-enum': [2, 'always', [
      'components', 'pages', 'utils', 'styles', 'deps', 'other', 'custom'
    ]],
    'scope-case': [0],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
    'header-max-length': [0, 'always', 100]
  }
}
