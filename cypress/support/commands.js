Cypress.Commands.add('token', (email, senha) => {
    cy.request({
        method: 'POST',
        url: 'login',
        body: {
            "email": email,
            "password": senha
        }
    }).then((response) => {
        expect(response.status).to.equal(200)
        return response.body.authorization
    })
})

Cypress.Commands.add('cadastrarProduto', (token, produto, preco, descricao, quantidade) => {
    cy.request({
        method: 'POST',
        url: 'produtos',
        headers: { authorization: token },
        body: {
            "nome": produto,
            "preco": preco,
            "descricao": descricao,
            "quantidade": quantidade
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('cadastrarUser', (user, email, password) => {
    cy.request({
        method: 'POST',
        url: 'usuarios',
        body: {
            "nome": user,
            "email": email,
            "password": password,
            "administrador": "true"
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('editarUser', (id, userEdit, emailEdit, password) => {
    cy.request({
        method: 'PUT',
        url: `usuarios/${id}`,
        body: {
            "nome": userEdit,
            "email": emailEdit,
            "password": password,
            "administrador": "true"
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('deletarUser', ( id ) => {
    cy.request({
        method: 'DELETE',
        url: `usuarios/${id}`,
        failOnStatusCode: false
    })
})