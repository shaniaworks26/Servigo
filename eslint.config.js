import globals from 'globals';

export default [
  {
    files: ['**/*.{js,mjs,jsx}'],
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      'mobile-app/**',
      'backend/tests/frontend.*.test.js',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
      },
    },
    rules: {},
  },
];
