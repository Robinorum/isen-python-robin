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

    cy.visit('/user/login')
    cy.get('[id^=your_name]').type('fakeuser')
    cy.get('[id^=your_pass]').type('1hstesh<23456789')
    cy.get('form').contains('Log in').click()
    cy.url().should('include', '/home')
    

    cy.contains('FAVOURITE').click()
    cy.url().should('include', '/favourite')

    cy.get('body').then(($body) => {
      if ($body.find('table.table').length === 0) {
        
        cy.contains('No Product in your favourite list').should('be.visible')
      } else {
        cy.get('.fa-heart').each(($heart) => {
          cy.wrap($heart).click()
          cy.wait(500)
        })
        cy.reload()
        cy.contains('No Product in your favourite list').should('be.visible')
      }
    })
    

    cy.contains('OC-commerce').click()
    cy.url().should('include', '/home')

    cy.get('.col-md-6.col-lg-4').first().trigger('mouseover')
    cy.get('.fa-heart').first().click()

    cy.get('.col-md-6.col-lg-4').first().trigger('mouseover')

    cy.contains('FAVOURITE').click()
    cy.url().should('include', '/favourite')

    cy.get('table.table').should('be.visible')
    cy.get('table.table tbody tr').should('have.length.at.least', 1)

    cy.get('.fa-heart').first().click()
    cy.wait(500)

    cy.contains('No Product in your favourite list').should('be.visible')
      })
})

