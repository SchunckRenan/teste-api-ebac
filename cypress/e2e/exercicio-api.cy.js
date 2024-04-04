/// <reference types="cypress" />
import contract from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {

    cy.request('usuarios').then(response => {
      return contract.validateAsync(response.body)
    })
  });

  it('Deve listar usuários cadastrados - GET', () => {

    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).should((response) => {
      expect(response.status).equal(200)
    })
  });

  it('Deve cadastrar um usuário com sucesso - POST', () => {

    let user = 'User Fictício ' + Math.floor(Math.random() * 10000)
    let email = 'emailfic' + Math.floor(Math.random() * 10000) + '@teste.com'
    cy.cadastrarUser(user, email, 'teste')
      .should((response) => {
        expect(response.status).equal(201)
        expect(response.body.message).equal('Cadastro realizado com sucesso')
      })
  });

  it('Deve validar um usuário com email inválido - POST', () => {

    let user = 'User Fictício ' + Math.floor(Math.random() * 10000)
    cy.cadastrarUser(user, 'beltranocom.br', 'teste')
      .should((response) => {
        expect(response.status).equal(400)
        expect(response.body.email).equal('email deve ser um email válido')
      })
  });

  it('Deve editar um usuário previamente cadastrado (Todas as hipóteses) - PUT', () => {

    let user = 'User Whatever ' + Math.floor(Math.random() * 10000)
    let email = 'emailfic' + Math.floor(Math.random() * 10000) + '@teste.com'
    let id = '0U2XnX2Sbwvu' + Math.floor(Math.random() * 10000)
    cy.editarUser(id, user, email, 'teste')
      .should((response) => {
        expect(response.status).equal(201)
        expect(response.body.message).equal('Cadastro realizado com sucesso')
      })
      .then(response => {
        let id = response.body._id
        let userEdit = 'User Edit ' + Math.floor(Math.random() * 10000)
        cy.editarUser(id, userEdit, email, 'teste')
        .should(response => {
          expect(response.body.message).equal('Registro alterado com sucesso')
          expect(response.status).to.equal(200)
        })
      })
      .then(response => {
        let id = response.body._id
        let userEdit = 'User Edit ' + Math.floor(Math.random() * 10000)
        cy.editarUser(id, userEdit, 'beltrano@qa.com.br', 'teste')
        .should(response => {
          expect(response.body.message).equal('Este email já está sendo usado')
          expect(response.status).to.equal(400)
        })
      })
  });

  it('Deve deletar um usuário previamente cadastrado - DELETE', () => {

    let user = 'Teste Delete ' + Math.floor(Math.random() * 10000)
    let email = 'emailfictional' + Math.floor(Math.random() * 10000) + '@teste.com'
    cy.cadastrarUser(user, email, 'teste')
      .should((response) => {
        expect(response.status).equal(201)
        expect(response.body.message).equal('Cadastro realizado com sucesso')
      })
      .then(response => {
        let id = response.body._id
        cy.deletarUser(id)
        .should((response) => {
          expect(response.status).equal(200)
        expect(response.body.message).to.be.oneOf(['Registro excluído com sucesso', 'Nenhum registro excluído'])
        })
      })
    .then( () => {
      cy.deletarUser('oUb7aGkMtSEPf6BZ')
      .should((response) => {
        expect(response.status).equal(400)
      expect(response.body.message).equal('Não é permitido excluir usuário com carrinho cadastrado')
      })
    })  
  });


});