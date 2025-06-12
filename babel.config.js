module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
      },
      modules: false,
      useBuiltIns: 'usage',
      corejs: 3
    }],
    ['@babel/preset-react', {
      runtime: 'automatic',
      development: process.env.NODE_ENV === 'development'
    }],
    '@babel/preset-typescript'
  ],
  plugins: [
    // Add any additional Babel plugins here if needed
  ],
  env: {
    development: {
      plugins: [
        // Development-specific plugins
      ]
    },
    production: {
      plugins: [
        // Production-specific plugins for optimization
      ]
    }
  }
};