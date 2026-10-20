
describe('Accenture - Desafio Frontend - Practice Form', () => {

  // ==========================================
  // FUNCOES AUXILIARES
  // ==========================================

  const escolher = (lista) =>
    lista[Math.floor(Math.random() * lista.length)];

  const validarLinha = (campo, valor) => {
    cy.contains('.table-responsive tbody tr', campo)
      .find('td')
      .eq(1)
      .should('have.text', valor);
  };

  // ==========================================
  // CENARIO 01 - FLUXO PRINCIPAL
  // ==========================================

  it('CT-001 - Deve preencher, enviar e validar o formulario', () => {

    // ------------------------------------------
    // 1. GERAR MASSA DE DADOS ALEATORIA
    // ------------------------------------------

    const primeiroNome = escolher([
      'Carlos', 'Mariana', 'Pedro', 'Fernanda'
    ]);

    const sobrenome = escolher([
      'Silva', 'Oliveira', 'Santos', 'Costa'
    ]);

    const email = `teste${Date.now()}@example.com`;

    const telefone = '9' +
      Math.floor(Math.random() * 1000000000)
        .toString()
        .padStart(9, '0');

    const genero = escolher([
      { id: 1, nome: 'Male' },
      { id: 2, nome: 'Female' },
      { id: 3, nome: 'Other' }
    ]);

    const disciplina = escolher([
      'Maths', 'English', 'Physics'
    ]);

    const hobby = escolher([
      { id: 1, nome: 'Sports' },
      { id: 2, nome: 'Reading' },
      { id: 3, nome: 'Music' }
    ]);

    const endereco = escolher([
      'Rua das Flores, 123',
      'Avenida Central, 456',
      'Rua da Tecnologia, 789'
    ]);

    const localidade = escolher([
      { estado: 'NCR', cidade: 'Delhi' },
      { estado: 'Uttar Pradesh', cidade: 'Agra' },
      { estado: 'Haryana', cidade: 'Karnal' },
      { estado: 'Rajasthan', cidade: 'Jaipur' }
    ]);

    const meses = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];

    const mesesCurtos = [
      'Jan', 'Feb', 'Mar', 'Apr',
      'May', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const ano = 1985 + Math.floor(Math.random() * 16);
    const indiceMes = Math.floor(Math.random() * 12);
    const dia = 1 + Math.floor(Math.random() * 28);

    const diaFormatado = String(dia).padStart(2, '0');

    const dataCampo =
      `${diaFormatado} ${mesesCurtos[indiceMes]} ${ano}`;

    const dataPopup =
      `${diaFormatado} ${meses[indiceMes]},${ano}`;

    const arquivo = 'arquivo-upload.txt';

    // ------------------------------------------
    // 2. ACESSAR O FORMULARIO
    // ------------------------------------------

    cy.visit('https://demoqa.com/automation-practice-form');

    cy.get('.practice-form-wrapper h5')
      .should('be.visible')
      .and('contain.text', 'Student Registration Form');

    // ------------------------------------------
    // 3. PREENCHER DADOS PESSOAIS
    // ------------------------------------------

    cy.get('#firstName').type(primeiroNome);
    cy.get('#lastName').type(sobrenome);
    cy.get('#userEmail').type(email);

    cy.get(`label[for="gender-radio-${genero.id}"]`)
      .click();

    cy.get('#userNumber').type(telefone);

    // ------------------------------------------
    // 4. SELECIONAR DATA DE NASCIMENTO
    // ------------------------------------------

    cy.get('#dateOfBirthInput').click();

    cy.get('.react-datepicker__month-select')
      .select(meses[indiceMes]);

    cy.get('.react-datepicker__year-select')
      .select(String(ano));

    cy.get(`.react-datepicker__day--0${diaFormatado}`)
      .not('.react-datepicker__day--outside-month')
      .click();

    // ------------------------------------------
    // 5. SELECIONAR DISCIPLINA
    // ------------------------------------------

    cy.get('#subjectsInput').type(disciplina);

    cy.get('.subjects-auto-complete__option')
      .contains(disciplina)
      .click();

    // ------------------------------------------
    // 6. SELECIONAR HOBBY
    // ------------------------------------------

    cy.get(`label[for="hobbies-checkbox-${hobby.id}"]`)
      .click();

    // ------------------------------------------
    // 7. REALIZAR UPLOAD DO ARQUIVO TXT
    // ------------------------------------------

    cy.get('#uploadPicture')
      .selectFile('cypress/fixtures/arquivo-upload.txt');

    cy.get('#uploadPicture').should(($input) => {
      expect($input[0].files[0].name)
        .to.eq(arquivo);
    });

    // ------------------------------------------
    // 8. PREENCHER ENDERECO
    // ------------------------------------------

    cy.get('#currentAddress').type(endereco);

    // ------------------------------------------
    // 9. SELECIONAR ESTADO E CIDADE
    // ------------------------------------------

    cy.get('#state').click();

    cy.get('[id^="react-select-3-option-"]')
      .contains(new RegExp(`^${localidade.estado}$`))
      .click();

    cy.get('#city').click();

    cy.get('[id^="react-select-4-option-"]')
      .contains(new RegExp(`^${localidade.cidade}$`))
      .click();

    // ------------------------------------------
    // 10. VALIDAR O PREENCHIMENTO
    // ------------------------------------------

    cy.get('#firstName')
      .should('have.value', primeiroNome);

    cy.get('#lastName')
      .should('have.value', sobrenome);

    cy.get('#userEmail')
      .should('have.value', email);

    cy.get('#userNumber')
      .should('have.value', telefone);

    cy.get('#dateOfBirthInput')
      .should('have.value', dataCampo);

    cy.get('#subjectsContainer')
      .should('contain.text', disciplina);

    cy.get(`#hobbies-checkbox-${hobby.id}`)
      .should('be.checked');

    cy.get('#currentAddress')
      .should('have.value', endereco);

    cy.get('#state')
      .should('contain.text', localidade.estado);

    cy.get('#city')
      .should('contain.text', localidade.cidade);

    // ------------------------------------------
    // 11. SUBMETER O FORMULARIO
    // ------------------------------------------

    cy.get('#submit')
      .scrollIntoView()
      .click({ force: true });

    // ------------------------------------------
    // 12. VALIDAR ABERTURA DO POPUP
    // ------------------------------------------

    cy.get('.modal-content')
      .should('be.visible');

    cy.get('#example-modal-sizes-title-lg')
      .should(
        'contain.text',
        'Thanks for submitting the form'
      );

    // ------------------------------------------
    // 13. VALIDAR OS DEZ CAMPOS DO POPUP
    // ------------------------------------------

    validarLinha(
      'Student Name',
      `${primeiroNome} ${sobrenome}`
    );

    validarLinha('Student Email', email);
    validarLinha('Gender', genero.nome);
    validarLinha('Mobile', telefone);
    validarLinha('Date of Birth', dataPopup);
    validarLinha('Subjects', disciplina);
    validarLinha('Hobbies', hobby.nome);
    validarLinha('Picture', arquivo);
    validarLinha('Address', endereco);

    validarLinha(
      'State and City',
      `${localidade.estado} ${localidade.cidade}`
    );

    // ------------------------------------------
    // 14. REGISTRAR EVIDENCIAS
    // ------------------------------------------

    cy.screenshot('CT-001-popup-validado');

    cy.log('CT-001: formulario submetido com sucesso');
    cy.log('CT-001: dez campos do popup validados');

  });

  // ==========================================
  // CENARIO 02 - DEFEITO CONHECIDO
  // ==========================================

  // BUG-FE-001
  //
  // Comportamento esperado:
  // O botao Close deve fechar o popup.
  //
  // Comportamento observado:
  // O popup permanece aberto e a aplicacao
  // apresenta a excecao:
  //
  // TypeError: Lr.findDOMNode is not a function
  //
  // Defeito reproduzido manualmente no Chrome
  // e durante a automacao com Cypress.
  //
  // O teste permanece pendente ate que o
  // comportamento seja corrigido na aplicacao.
  //
  // Evidencias e detalhes documentados no README.

  it.skip('CT-002 - Deve fechar o popup apos o envio', () => {

    cy.visit('https://demoqa.com/automation-practice-form');

    // Cenario pendente por defeito BUG-FE-001.
    // A reativacao exigira preparar um formulario
    // valido, submeter e confirmar o fechamento.

    cy.get('#closeLargeModal')
      .click();

    cy.get('.modal-content')
      .should('not.be.visible');

  });

});
