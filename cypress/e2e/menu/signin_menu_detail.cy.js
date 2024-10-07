describe('Complete Flow: Signin, Menu, and MenuItemDetail', () => {
    it('should sign in, navigate to menu, and navigate to item detail', () => {
        // Visit the sign-in page
        cy.visit('/');

        // Input valid email and phone number using the placeholder attribute
        cy.get('input[placeholder="Enter your email"]').type('test@example.com');
        cy.get('input[placeholder="Enter your phone number"]').type('1234567890');

        // Submit the sign-in form
        cy.get('button[type="submit"]').click();

        cy.wait(2000);

        // Wait for the page to navigate to /Menu
        cy.url().should('eq', 'http://localhost:3000/Menu');  // Check for exact URL

        // Ensure that menu items are visible
        cy.get('.menu-item').should('have.length.greaterThan', 0);

        // Click on the first menu item
        cy.get('.menu-item-button').first().click();

        // Check if the detail page is loaded
        cy.url().should('eq', 'http://localhost:3000/menu/1');   // Check URL for item detail page
        cy.get('.menu-item-detail-container').should('be.visible');

        // Verify the presence of item details
        cy.get('.item-names').should('exist');
        cy.get('.item-description').should('exist');
        cy.get('.item-price').should('exist');

        // Go back to the menu page
        cy.get('.back-button').click();
        cy.url().should('eq', 'http://localhost:3000/Menu');  // Verify return to menu page
    });
});
