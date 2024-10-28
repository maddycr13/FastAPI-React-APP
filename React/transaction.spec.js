// cypress/integration/transactions.spec.js
describe('Finance App', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000');
    });
  
    it('should load the app and display the form', () => {
      cy.get('form').should('be.visible');
      cy.contains('Submit Transaction').should('exist');
    });
  
    it('should add a new transaction', () => {
      cy.get('#amount').type('1500');
      cy.get('#category').type('Utilities');
      cy.get('#description').type('Electricity Bill');
      cy.get('#is_income').check();
      cy.get('#date').type('2024-10-27');
      cy.contains('Submit Transaction').click();
  
      // Verify that the new transaction appears in the table
      cy.contains('1500').should('be.visible');
      cy.contains('Utilities').should('be.visible');
      cy.contains('Electricity Bill').should('be.visible');
      cy.contains('Yes').should('be.visible');
    });
  
    it('should delete a transaction', () => {
      cy.contains('1500').parent('tr').within(() => {
        cy.contains('Delete').click();
      });
  
      // Verify that the transaction is deleted
      cy.contains('1500').should('not.exist');
    });
  });
  