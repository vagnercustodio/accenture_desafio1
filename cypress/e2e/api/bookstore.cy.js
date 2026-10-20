describe('Accenture | Parte 1 - API BookStore', () => {
  it('cria usuário, autentica, reserva dois livros e valida o cadastro', () => {
    const userName = `qa_accenture_${Date.now()}`;
    const password = 'QaAccenture@2026!'; // Apenas para o ambiente público de demonstração
    const credentials = { userName, password };
    let userId;
    let token;
    let selectedBooks;

    // 1. Criar usuário
    cy.log('Passo 1: criar usuário');
    cy.request({
      method: 'POST',
      url: '/Account/v1/User',
      body: credentials,
    }).then(({ status, body }) => {
      expect(status).to.eq(201);
      userId = body.userID || body.userId;
      expect(userId, 'identificador do usuário').to.be.a('string').and.not.be.empty;
      expect(body.username || body.userName).to.eq(userName);

      // 2. Gerar token
      cy.log('Passo 2: gerar token');
      return cy.request({
        method: 'POST',
        url: '/Account/v1/GenerateToken',
        body: credentials,
      });
    }).then(({ status, body }) => {
      expect(status).to.eq(200);
      token = body.token;
      expect(token, 'token de autenticação').to.be.a('string').and.not.be.empty;

      // 3. Confirmar autorização
      cy.log('Passo 3: confirmar autorização');
      return cy.request({
        method: 'POST',
        url: '/Account/v1/Authorized',
        body: credentials,
      });
    }).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body, 'usuário autorizado').to.eq(true);

      // 4. Listar livros
      cy.log('Passo 4: listar catálogo');
      return cy.request({ method: 'GET', url: '/BookStore/v1/Books' });
    }).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.books, 'catálogo de livros').to.be.an('array');
      const uniqueBooks = [...new Map(body.books.filter(book => book.isbn).map(book => [book.isbn, book])).values()];
      expect(uniqueBooks.length, 'ISBNs distintos disponíveis').to.be.at.least(2);
      selectedBooks = uniqueBooks.slice(0, 2);

      // 5. Reservar dois livros
      cy.log('Passo 5: reservar dois livros');
      return cy.request({
        method: 'POST',
        url: '/BookStore/v1/Books',
        headers: { Authorization: `Bearer ${token}` },
        body: {
          userId,
          collectionOfIsbns: selectedBooks.map(book => ({ isbn: book.isbn })),
        },
      });
    }).then(({ status }) => {
      expect(status).to.eq(201);

      // 6. Consultar usuário e validar os dois livros
      cy.log('Passo 6: validar usuário e livros reservados');
      return cy.request({
        method: 'GET',
        url: `/Account/v1/User/${userId}`,
        headers: { Authorization: `Bearer ${token}` },
      });
    }).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.userId || body.userID).to.eq(userId);
      expect(body.username || body.userName).to.eq(userName);
      expect(body.books, 'livros do usuário').to.be.an('array').with.length(2);
      expect(body.books.map(book => book.isbn).sort()).to.deep.eq(selectedBooks.map(book => book.isbn).sort());
      cy.log(`Sucesso: usuário ${userName} associado a dois livros`);
    });
  });
});
