Cypress._.times(5, function() { // 5 times é a quantidade de vezes que deseja executar
    it('testa a página da política de privacidade de forma independente', function(){
        cy.visit('./src/privacy.html')
        cy.contains('Talking About Testing').should('be.visible')
    })
})