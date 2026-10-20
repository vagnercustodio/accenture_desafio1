
const { defineConfig } = require('cypress');

const createBundler = require(
  '@bahmutov/cypress-esbuild-preprocessor'
);

const {
  addCucumberPreprocessorPlugin
} = require(
  '@badeball/cypress-cucumber-preprocessor'
);

const {
  createEsbuildPlugin
} = require(
  '@badeball/cypress-cucumber-preprocessor/esbuild'
);

module.exports = defineConfig({

  e2e: {

    baseUrl: 'https://demoqa.com',

    specPattern: [
      'cypress/e2e/**/*.cy.js',
      'cypress/e2e/**/*.feature'
    ],

    viewportWidth: 1440,
    viewportHeight: 900,

    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,

    video: false,
    screenshotOnRunFailure: true,

    async setupNodeEvents(on, config) {

      await addCucumberPreprocessorPlugin(
        on,
        config
      );

      on(
        'file:preprocessor',
        createBundler({
          plugins: [
            createEsbuildPlugin(config)
          ]
        })
      );

      return config;
    }
  }
});
