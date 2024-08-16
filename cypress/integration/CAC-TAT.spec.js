/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function () {
    beforeEach(function () {
        cy.visit('./src/index.html')
    })

    it('verifica o titulo da aplicação', function () {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatótios e envia o formulário', function () {
        const longText = 'Teste, teste, teste, teste, teste, teste, test, test, test, test, test, test, test, test, test, test, test, test, test, test, test, test, test, test, test, test, test'

        cy.get('#firstName').type('Cintia')
        cy.get('#lastName').type('Maas')
        cy.get('#email').type('cintia@gmail.com')
        cy.get('#open-text-area').type(longText, { delay: 0 })//subscreve a funcionalidade do delay pra zero , diminuindo o tempo de execução de teste
        cy.get('button[type="submit"]').click()

        cy.get('.success').should('be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function () {
        cy.get('#firstName').type('Cintia')
        cy.get('#lastName').type('Maas')
        cy.get('#email').type('cintia@gmail,com')
        cy.get('#open-text-area').type('Teste')
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')
    })

    it('campo telefone continua vazio quando preenchido com valor não numerico', function () {
        cy.get('#phone')
            .type('adcbvfvfd')
            .should('have.value', '') //vai ter uma valu vazio pq ele não deixa digitar se não for numero
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {
        cy.get('#firstName').type('Cintia')
        cy.get('#lastName').type('Maas')
        cy.get('#email').type('cintia@gmail.com')
        cy.get('#phone-checkbox').click() // quando marcado esse checkbox o campo telefone passa a ser obrigatório
        cy.get('#open-text-area').type('Teste')
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function () {
        cy.get('#firstName')
            .type('Cintia')
            .should('have.value', 'Cintia')
            .clear() //limpa o campo
            .should('have.value', '') // verifica se o campo etsá limpo
        cy.get('#lastName')
            .type('Maas')
            .should('have.value', 'Maas')
            .clear()
            .should('have.value', '')
        cy.get('#email')
            .type('cintia@gmail.com')
            .should('have.value', 'cintia@gmail.com')
            .clear()
            .should('have.value', '')
        cy.get('#open-text-area')
            .type('Teste')
            .should('have.value', 'Teste')
            .clear()
            .should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function () {
        cy.get('button[type="submit"]').click()
        cy.get('.error').should('be.visible', 'Valide os campos obrigatórios!')
    })

    it('envia o formuário com sucesso usando um comando customizado', function () {
        cy.fillMandatoryFieldsAndSubmit('Cintia', 'Maas', 'cintia@gmail.com', 'Teste')
        cy.get('button[type="submit"]').click()
        cy.get('.success').should('be.visible')
    })

    it('seleciona um produto (Youtube) por seu texto', function () {
        cy.get('#product').select('YouTube').should('have.value', 'youtube') //pega um elemento select e passa o valor texto que quer selecionar
    });

    it('seleciona um produto (Mentoria) por seu valor (value)', function () {
        cy.get('#product').select('mentoria').should('have.value', 'mentoria') //pega um elemento select e seleciona pelo seu valor passando o valor
    });

    it('seleciona um produto (Blog) por seu índice', function () {
        cy.get('#product').select(1).should('have.value', 'blog') //pega um Seleção pelo índice 1 do campo produto
    });

    it('marca o tipo radio button de atendimento "Feedback"', function () {
        // seletor input com type=radio e valur=Feedback
        cy.get('input[type="radio"][value="feedback"]')
            .check() //pega um elemento do tipo radio button e encadeia utilizando .check()
            .should('have.value', 'feedback') // verifica que o valor foi corretamente marcado
    });

    it('marca cada tipo de atendimento', function () {
        cy.get('input[type="radio"]')
            .should('have.length', 3)
            .each(function ($radio) { //recebe uma função de callback que recebe de argumento cada um dos elementos seleiconados
                cy.wrap($radio).check() // wrap empacota cada um desses radios e depois .check() pra marcar
                cy.wrap($radio).should('be.checked') // vai selecionado e checando cada radio
            })
    });

    it('marca ambos checkboxes, depois desmarca o último', function () {
        cy.get('input[type="checkbox"')
            .check() //marca cad um dos radio do tipo checkbox, primeiro 1 depois o outro
            .should('be.checked') // vai checar se estão todos marcados
            .last() //ele pega o ultimo marcado
            .uncheck() //desmarca o ultimo marcado (por causa da função .last()
            .should('not.be.checked')
    });

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.get('#firstName').type('Cintia')
        cy.get('#lastName').type('Maas')
        cy.get('#email').type('cintia@gmail.com')
        cy.get('#phone-checkbox').check() // quando marcado esse checkbox o campo telefone passa a ser obrigatório
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
    });

    it('seleciona um arquivo da pasta fixtures', function () {
        cy.get('input[type="file"]#file-upload') //pode misturar seletor e id do campo
            .should('not.have.value') //confere se tem algum valor, no caso arquivo
            .selectFile('./cypress/fixtures/example.json')
            .should(function ($input) { //quando tem esse $ é formato jQuery
                //console.log($input)
                expect($input[0].files[0].name).to.equal('example.json')
            })
    });

    // ele simula como se arrastasse o arquivo para dentro do campo file, por debaixo dos panos
    it('seleciona um arquivo simulando um drag-and-drop', function () {
        cy.get('input[type="file"]#file-upload') 
            .should('not.have.value') 
            .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop'}) // passa um objeto action com valor drag-drop
            .should(function ($input) { 
                expect($input[0].files[0].name).to.equal('example.json')
            })
    });

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function (){
        cy.fixture('example.json').as('sampleFile') //pega afixture example e dá um nome para ela de exampleFile,- isso é um alias
        cy.get('input[type="file"]')
          .selectFile('@sampleFile')
          .should(function ($input) {
            expect($input[0].files[0].name).to.equal('example.json')
          })
    });

    it('utilizar o contains ao invés do get para buscar o button', function () {
        cy.fillMandatoryFieldsAndSubmit('Cintia', 'Maas', 'cintia@gmail.com', 'Teste')
        cy.clicaBotao()
        cy.get('.success').should('be.visible')
    })

    it('seleciona uma arquivo da pasta fixtures', function () {
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json')
            .should(function ($input) {
                //console.log(input)
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })
})