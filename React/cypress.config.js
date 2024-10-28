// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000', // Set your base URL
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', // Set the pattern for test files
  },
});
