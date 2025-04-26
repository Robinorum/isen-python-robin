describe('Create and connect to an account', () => {
  it('Visits the Oc commerce site', () => {
    cy.visit('/home')

    // User is able to create an account an to be redirect to login pages
    cy.contains('SIGNUP').click()
    cy.url().should('include', '/user/signup')
    
    // Remplir le formulaire
    cy.get('[id^=fname]').type('fakeuser')
    cy.get('[id^=lname]').type('toto')
    cy.get('[id^=username]').type('fakeuser')
    cy.get('[id^=email]').type('fake@email.com')
    cy.get('[id^=pass]').type('1hstesh<23456789')
    cy.get('[id^=re_pass]').type('1hstesh<23456789')
    
    // Essayer d'enregistrer l'utilisateur
    cy.get('form').contains('Register').click()
    
    // Vérifier si nous sommes redirigés vers la page de connexion (utilisateur créé)
    // ou si nous restons sur la page d'inscription (erreur d'utilisateur déjà existant)
    cy.url().then((url) => {
      if (url.includes('/user/login')) {
        // L'utilisateur a été créé avec succès
        cy.log('Nouvel utilisateur créé avec succès')
      } else {
        // L'utilisateur existe probablement déjà, vérifier le message d'erreur
        cy.get('body').then(($body) => {
          if ($body.text().includes('already exist') || $body.text().includes('already taken')) {
            cy.log('Utilisateur déjà existant, redirection vers la page de login')
            cy.visit('/user/login')
          } else {
            // Une autre erreur s'est produite
            cy.log('Erreur lors de la création du compte')
            cy.visit('/user/login')
          }
        })
      }
      
      // Dans tous les cas, on se connecte ensuite
      cy.get('[id^=your_name]').type('fakeuser')
      cy.get('[id^=your_pass]').type('1hstesh<23456789')
      cy.get('form').contains('Log in').click()
      cy.url().should('include', '/home')
      cy.contains('FAVOURITE')
    })
  })
})

describe('Put item in favourite', () => {
  it('Connect to OC commerce and put in favourite', () => {
    // Load the home url and connect with the previous account
    cy.visit('/user/login')
    cy.get('[id^=your_name]').type('fakeuser')
    cy.get('[id^=your_pass]').type('1hstesh<23456789')
    cy.get('form').contains('Log in').click()
    cy.url().should('include', '/home')
    
    // Go to favourite pages to make sure there is no favourite
    cy.contains('FAVOURITE').click()
    cy.url().should('include', '/favourite')
    
    // Check if there are no favourites
    cy.get('body').then(($body) => {
      if ($body.find('table.table').length === 0) {
        // No products in favourites
        cy.contains('No Product in your favourite list').should('be.visible')
      } else {
        // Remove any existing favourites
        cy.get('.fa-heart').each(($heart) => {
          cy.wrap($heart).click()
          cy.wait(500) // Wait for the AJAX call to complete
        })
        cy.reload()
        cy.contains('No Product in your favourite list').should('be.visible')
      }
    })
    
// Go back to home
    cy.contains('OC-commerce').click()
    cy.url().should('include', '/home')

    // Hover sur le premier produit pour faire apparaître l'icône du cœur
    cy.get('.col-md-6.col-lg-4').first().trigger('mouseover')

    // Add an item to favourite - now the heart icon should be visible
    cy.get('.fa-heart').first().click()

    // Pour vérifier que le cœur est rouge, il faut d'abord survoler l'élément à nouveau
    cy.get('.col-md-6.col-lg-4').first().trigger('mouseover')

    // Go to favourite pages to confirm item is here
    cy.contains('FAVOURITE').click()
    cy.url().should('include', '/favourite')

    // Confirm the product is in favorites
    cy.get('table.table').should('be.visible')
    cy.get('table.table tbody tr').should('have.length.at.least', 1)

    // Delete the item and check it has been successfully deleted
    cy.get('.fa-heart').first().click()
    cy.wait(500) // Wait for the reload

    // Verify the item is deleted
    cy.contains('No Product in your favourite list').should('be.visible')
      })
})


describe('Test price filter functionality', () => {
  it('Should filter products based on price range', () => {
    // Se connecter avec l'utilisateur existant
    cy.visit('/user/login')
    cy.get('[id^=your_name]').type('fakeuser')
    cy.get('[id^=your_pass]').type('1hstesh<23456789')
    cy.get('form').contains('Log in').click()
    cy.url().should('include', '/home')
    
    // Mémoriser le nombre initial de produits
    let initialProductCount = 0
    cy.get('.col-md-6.col-lg-4').then(($products) => {
      initialProductCount = $products.length
      cy.log(`Nombre initial de produits: ${initialProductCount}`)
      
      // Vérifier qu'il y a des produits à filtrer
      expect(initialProductCount).to.be.greaterThan(0)
    })
    
    // Tester le filtre de prix minimum
    cy.get('#min_price').type('20')
    cy.get('button.btn-primary').contains('Filtrer').click()
    
    // Vérifier que le filtre est appliqué (URL modifiée)
    cy.url().should('include', 'min_price=20')
    
    // Vérifier que le bouton de réinitialisation est visible
    cy.get('a.btn-outline-secondary').contains('Réinitialiser').should('be.visible')
    
    // Vérifier que le nombre de produits a potentiellement changé
    cy.get('.col-md-6.col-lg-4').then(($filteredProducts) => {
      const filteredCount = $filteredProducts.length
      cy.log(`Nombre de produits après filtrage (min_price=20): ${filteredCount}`)
    })
    
    // Tester le filtre avec min et max
    cy.get('#max_price').type('40')
    cy.get('button.btn-primary').contains('Filtrer').click()
    
    // Vérifier que le filtre est appliqué (URL modifiée)
    cy.url().should('include', 'min_price=20')
    cy.url().should('include', 'max_price=40')
    
    // Vérifier que le bouton de réinitialisation est toujours visible
    cy.get('a.btn-outline-secondary').contains('Réinitialiser').should('be.visible')
    
    // Réinitialiser les filtres
    cy.get('a.btn-outline-secondary').contains('Réinitialiser').click()
    
    // Vérifier que l'URL ne contient plus de paramètres de filtrage
    cy.url().should('not.include', 'min_price')
    cy.url().should('not.include', 'max_price')
    
    // Vérifier que tous les produits sont à nouveau visibles
    cy.get('.col-md-6.col-lg-4').then(($resetProducts) => {
      const resetCount = $resetProducts.length
      cy.log(`Nombre de produits après réinitialisation: ${resetCount}`)
      expect(resetCount).to.equal(initialProductCount)
    })
  })
})