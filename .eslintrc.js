module.exports = {
  extends: ['airbnb-typescript'],
  parserOptions: {
    project: './tsconfig.json',
  },
  'settings': {
    'import/resolver': {
      'typescript': {},
    },
  },
  rules:{
    "import/no-extraneous-dependencies": ["error", {"devDependencies": true}],
    "no-unused-expressions": 0,
    "import/prefer-default-export": 0,
  }
};