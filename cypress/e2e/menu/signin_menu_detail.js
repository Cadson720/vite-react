describe('Complete Flow: Signin, Menu, and MenuItemDetail', () => {

    it('should sign in, navigate to menu, and navigate to item detail', () => {
        // Visit the sign-in page
        cy.visit('/signin');

        // Input valid email and phone number
        cy.get('input[name="email"]').type('test@example.com');
        cy.get('input[name="phone"]').type('1234567890');

        // Submit the sign-in form
        cy.get('button[type="submit"]').click();

        // Ensure we are redirected to the menu page after login
        cy.url().should('include', '/menu');
        cy.get('.menu-object').should('be.visible');

        // Ensure that menu items are visible
        cy.get('.menu-item').should('have.length.greaterThan', 0);

        // Click on the first menu item
        cy.get('.menu-item-button').first().click();

        // Check if the detail page is loaded
        cy.url().should('include', '/menu/');
        cy.get('.menu-item-detail-container').should('be.visible');

        // Verify the presence of item details
        cy.get('.item-names').should('exist');
        cy.get('.item-description').should('exist');
        cy.get('.item-price').should('exist');

        // Go back to the menu page
        cy.get('.back-button').click();
        cy.url().should('include', '/menu');
    });
});
