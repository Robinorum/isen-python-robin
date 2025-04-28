
describe('Test price filter functionality', () => {
    it('Should filter products based on price range', () => {

      cy.visit('/user/login')
      cy.get('[id^=your_name]').type('fakeuser')
      cy.get('[id^=your_pass]').type('1hstesh<23456789')
      cy.get('form').contains('Log in').click()
      cy.url().should('include', '/home')
      
      let initialProductCount = 0
      cy.get('.col-md-6.col-lg-4').then(($products) => {
        initialProductCount = $products.length
        cy.log(`Nombre initial de produits: ${initialProductCount}`)
        
        
        expect(initialProductCount).to.be.greaterThan(0)
      })
      
      cy.get('#min_price').type('20')
      cy.get('button.btn-primary').contains('Filtrer').click()
      
      cy.url().should('include', 'min_price=20')
      
      cy.get('a.btn-outline-secondary').contains('Réinitialiser').should('be.visible')
      
      cy.get('.col-md-6.col-lg-4').then(($filteredProducts) => {
        const filteredCount = $filteredProducts.length
        cy.log(`Nombre de produits après filtrage (min_price=20): ${filteredCount}`)
      })
      
      
      cy.get('#max_price').type('40')
      cy.get('button.btn-primary').contains('Filtrer').click()
      
      
      cy.url().should('include', 'min_price=20')
      cy.url().should('include', 'max_price=40')
      
      
      cy.get('a.btn-outline-secondary').contains('Réinitialiser').should('be.visible')
      
      
      cy.get('a.btn-outline-secondary').contains('Réinitialiser').click()
      
      
      cy.url().should('not.include', 'min_price')
      cy.url().should('not.include', 'max_price')
      
  
      cy.get('.col-md-6.col-lg-4').then(($resetProducts) => {
        const resetCount = $resetProducts.length
        cy.log(`Nombre de produits après réinitialisation: ${resetCount}`)
        expect(resetCount).to.equal(initialProductCount)
      })
    })
  })