Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function (nome, sobrenome, email, text) {
    cy.get('#firstName').type(nome)
    cy.get('#lastName').type(sobrenome)
    cy.get('#email').type(email)
    cy.get('#open-text-area').type(text)
})
Cypress.Commands.add('clicaBotao', function(){
    cy.contains('button', 'Enviar').click()
})