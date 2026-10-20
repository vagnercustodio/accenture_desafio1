
/**
 * ACCENTURE - DESAFIO TECNICO - PARTE 3
 * BONUS - CYPRESS + CUCUMBER
 *
 * Objetivos:
 * 1. Gerar 12 funcionarios dinamicamente.
 * 2. Cadastrar todos os funcionarios.
 * 3. Validar os registros cadastrados.
 * 4. Excluir os 12 funcionarios.
 * 5. Confirmar todas as exclusoes.
 */

const {
  Given,
  When,
  Then
} = require(
  '@badeball/cypress-cucumber-preprocessor'
);

let funcionarios = [];
let prefixoExecucao = '';

// =============================================
// FUNCOES AUXILIARES
// =============================================

function limparPesquisa() {
  cy.get('#searchBox')
    .should('exist')
    .clear({ force: true })
    .should('have.value', '');
}

function pesquisar(termo) {
  cy.get('#searchBox')
    .clear({ force: true })
    .type(termo, { force: true })
    .should('have.value', termo);
}

function obterLinha(email) {
  return cy.contains('tbody td', email, {
    timeout: 15000
  }).closest('tr');
}

function configurarPaginacao() {

  cy.get('select').then(($selects) => {

    const seletor = [...$selects].find(
      (elemento) => [...elemento.options].some(
        (opcao) => Number(opcao.value) === 20
      )
    );

    expect(
      seletor,
      'Paginacao com opcao de 20 registros'
    ).to.exist;

    cy.wrap(seletor)
      .select('20', { force: true })
      .should('have.value', '20');

  });
}

function preencherFormulario(funcionario) {

  const campos = [
    ['#firstName', funcionario.nome],
    ['#lastName', funcionario.sobrenome],
    ['#userEmail', funcionario.email],
    ['#age', funcionario.idade],
    ['#salary', funcionario.salario],
    ['#department', funcionario.departamento]
  ];

  campos.forEach(([seletor, valor]) => {

    cy.get(seletor)
      .should('be.visible')
      .clear()
      .type(valor)
      .should('have.value', valor);

  });
}

function validarDados(funcionario) {

  obterLinha(funcionario.email)
    .should('be.visible')
    .within(() => {

      cy.get('td').eq(0)
        .should('have.text', funcionario.nome);

      cy.get('td').eq(1)
        .should('have.text', funcionario.sobrenome);

      cy.get('td').eq(2)
        .should('have.text', funcionario.idade);

      cy.get('td').eq(3)
        .should('have.text', funcionario.email);

      cy.get('td').eq(4)
        .should('have.text', funcionario.salario);

      cy.get('td').eq(5)
        .should(
          'have.text',
          funcionario.departamento
        );

    });
}

function cadastrar(funcionario) {

  limparPesquisa();

  cy.get('#addNewRecordButton')
    .should('exist')
    .click({ force: true });

  cy.get('#registration-form-modal')
    .should('be.visible');

  preencherFormulario(funcionario);

  cy.get('#submit')
    .should('be.enabled')
    .click({ force: true });

  cy.get('#registration-form-modal')
    .should('not.exist');

  // O cadastro somente sera considerado
  // valido quando o registro estiver na tabela.

  obterLinha(funcionario.email)
    .should('exist');

  cy.log(
    `CADASTRO CONFIRMADO: ${funcionario.email}`
  );
}

// =============================================
// DADO - ACESSAR A APLICACAO
// =============================================

Given(
  'que acesso a pagina Web Tables do DemoQA',
  () => {

    cy.visit('/webtables');

    cy.get('#addNewRecordButton', {
      timeout: 30000
    }).should('exist');

    // Oculta publicidade conhecida que pode
    // bloquear os controles do DemoQA.

    cy.document().then((doc) => {

      const estilo = doc.createElement('style');

      estilo.textContent = `
        iframe[src*="googlesyndication"],
        iframe[id^="google_ads"],
        ins.adsbygoogle,
        #fixedban,
        #adplus-anchor {
          display: none !important;
          pointer-events: none !important;
        }
      `;

      doc.head.appendChild(estilo);

    });

    configurarPaginacao();

    limparPesquisa();

    cy.log('WEB TABLES ACESSADA');

  }
);

// =============================================
// DADO - GERAR 12 FUNCIONARIOS
// =============================================

Given(
  'preparo {int} funcionarios com dados dinamicos',
  (quantidade) => {

    expect(quantidade).to.equal(12);

    prefixoExecucao =
      'qa' +
      Date.now().toString(36) +
      Math.random().toString(36).slice(2, 6);

    funcionarios = Array.from(
      { length: quantidade },
      (_, indice) => {

        const numero = indice + 1;

        return {
          nome: `Funcionario${numero}`,
          sobrenome: `Accenture${numero}`,
          email:
            `${prefixoExecucao}${numero}@example.com`,
          idade: String(25 + numero),
          salario: String(5000 + numero * 500),
          departamento: 'Quality Assurance'
        };

      }
    );

    expect(funcionarios).to.have.length(12);

    const emails = funcionarios.map(
      (funcionario) => funcionario.email
    );

    expect(new Set(emails).size).to.equal(12);

    // Comprovar que o conjunto de emails
    // ainda nao existe na tabela.

    pesquisar(prefixoExecucao);

    cy.get('tbody').should(($tbody) => {

      const conteudo = $tbody.text();

      expect(
        conteudo,
        'Registros desta execucao ainda inexistentes'
      ).not.to.include(prefixoExecucao);

    });

    limparPesquisa();

    cy.log('12 FUNCIONARIOS GERADOS');

  }
);

// =============================================
// QUANDO - CADASTRAR FUNCIONARIOS
// =============================================

When(
  'cadastro os {int} funcionarios na tabela',
  (quantidade) => {

    expect(funcionarios).to.have.length(
      quantidade
    );

    cy.wrap(funcionarios).each(
      (funcionario, indice) => {

        cy.log(
          `CADASTRO ${indice + 1}/${quantidade}`
        );

        cadastrar(funcionario);

        validarDados(funcionario);

      }
    );

  }
);

// =============================================
// ENTAO - VALIDAR OS 12 REGISTROS
// =============================================

Then(
  'os {int} funcionarios devem estar cadastrados',
  (quantidade) => {

    expect(funcionarios).to.have.length(
      quantidade
    );

    // Validar todos os registros
    // individualmente.

    cy.wrap(funcionarios).each((funcionario) => {

      limparPesquisa();

      pesquisar(funcionario.email);

      validarDados(funcionario);

    });

    // Validar a quantidade total criada.
    // A pesquisa isola apenas os registros
    // pertencentes a esta execucao.

    pesquisar(prefixoExecucao);

    cy.get('tbody tr').should(($linhas) => {

      const emailsEncontrados = [
        ...$linhas
      ].flatMap((linha) => {

        const colunas =
          linha.querySelectorAll('td');

        if (colunas.length < 6) {
          return [];
        }

        const email =
          colunas[3].textContent.trim();

        return email.startsWith(prefixoExecucao)
          ? [email]
          : [];

      });

      expect(
        emailsEncontrados.length,
        'Quantidade de funcionarios cadastrados'
      ).to.equal(quantidade);

    });

    limparPesquisa();

    cy.log('12 FUNCIONARIOS VALIDADOS');

  }
);

// =============================================
// QUANDO - EXCLUIR OS 12 REGISTROS
// =============================================

When(
  'excluo os {int} funcionarios cadastrados',
  (quantidade) => {

    expect(funcionarios).to.have.length(
      quantidade
    );

    cy.wrap(funcionarios).each(
      (funcionario, indice) => {

        limparPesquisa();

        pesquisar(funcionario.email);

        obterLinha(funcionario.email)
          .find('[id^="delete-record-"]')
          .should('exist')
          .click({ force: true });

        cy.contains('tbody td', funcionario.email)
          .should('not.exist');

        cy.log(
          `EXCLUSAO ${indice + 1}/${quantidade}`
        );

      }
    );

  }
);

// =============================================
// ENTAO - CONFIRMAR TODAS AS EXCLUSOES
// =============================================

Then(
  'nenhum dos {int} funcionarios deve permanecer na tabela',
  (quantidade) => {

    expect(funcionarios).to.have.length(
      quantidade
    );

    // Confirmar individualmente as exclusoes.

    cy.wrap(funcionarios).each((funcionario) => {

      limparPesquisa();

      pesquisar(funcionario.email);

      cy.contains('tbody td', funcionario.email)
        .should('not.exist');

    });

    // Validacao final pelo prefixo da execucao.

    pesquisar(prefixoExecucao);

    cy.get('tbody').should(($tbody) => {

      expect(
        $tbody.text(),
        'Nenhum funcionario da execucao'
      ).not.to.include(prefixoExecucao);

    });

    limparPesquisa();

    cy.log(
      'BONUS CUCUMBER: 12 EXCLUSOES CONFIRMADAS'
    );

  }
);
