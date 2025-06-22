const config = {
  plugins:
    process.env.NODE_ENV === 'test'
      ? [] // Pas de plugins PostCSS pour les tests
      : ['@tailwindcss/postcss'],
};

export default config;
