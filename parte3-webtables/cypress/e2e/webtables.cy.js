
/**
 * ACCENTURE - DESAFIO TECNICO - PARTE 3
 * DEMOQA - WEB TABLES
 *
 * Cypress + JavaScript
 *
 * TESTE 1 - CRUD:
 * Criar, consultar, editar e excluir.
 *
 * TESTE 2 - BONUS FUNCIONAL:
 * Criar 12 registros dinamicamente.
 * Validar os 12 registros.
 * Excluir os 12 registros.
 * Confirmar todas as exclusoes.
 */

describe('Accenture - Parte 3 - Web Tables', () => {

  const URL = 'https://demoqa.com/webtables';

  // Identificador unico e curto por execucao.
  const EXECUCAO =
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 6);

  // ==========================================
  // PREPARACAO DO AMBIENTE
  // ==========================================

  beforeEach(() => {

    cy.visit(URL);

    cy.get('#addNewRecordButton', {
      timeout: 30000
    }).should('be.visible');

    controlarPublicidade();
    configurarPaginacao();
    limparPesquisa();

  });

  function controlarPublicidade() {

    cy.document().then((doc) => {

      const estilo = doc.createElement('style');

      estilo.id = 'qa-controle-publicidade';

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

  }

  // ==========================================
  // PAGINACAO
  // ==========================================

  function configurarPaginacao() {

    cy.get('select').then(($selects) => {

      const seletor = [...$selects].find((elemento) => {

        return [...elemento.options].some(
          (opcao) => Number(opcao.value) >= 20
        );

      });

      expect(
        seletor,
        'Seletor de paginacao com 20 ou mais linhas'
      ).to.exist;

      const tamanhos = [...seletor.options]
        .map((opcao) => Number(opcao.value))
        .filter((valor) => (
          Number.isInteger(valor) &&
          valor >= 20
        ));

      const maiorTamanho = Math.max(...tamanhos);

      cy.wrap(seletor)
        .select(String(maiorTamanho), {
          force: true
        })
        .should(
          'have.value',
          String(maiorTamanho)
        );

      cy.log(
        `Paginacao configurada: ${maiorTamanho}`
      );

    });

  }

  // ==========================================
  // PESQUISA
  // ==========================================

  function limparPesquisa() {

    cy.get('#searchBox')
      .clear({ force: true })
      .should('have.value', '');

  }

  function pesquisar(termo) {

    cy.get('#searchBox')
      .clear({ force: true })
      .type(termo, { force: true })
      .should('have.value', termo);

  }

  // ==========================================
  // GERACAO DINAMICA DE DADOS
  // ==========================================

  function gerarFuncionario(numero) {

    // Idade sempre entre 25 e 59.
    // Corrige o erro anterior de idade 125.

    const idade = 25 + (numero % 35);

    return {
      nome: `Funcionario${numero}`,
      sobrenome: `Accenture${numero}`,
      email: `qa${EXECUCAO}${numero}@example.com`,
      idade: String(idade),
      salario: String(5000 + numero * 100),
      departamento: 'Quality Assurance'
    };

  }

  // ==========================================
  // LOCALIZACAO DE REGISTROS
  // ==========================================

  function obterLinha(email) {

    return cy.contains('tbody td', email, {
      timeout: 15000
    }).closest('tr');

  }

  // ==========================================
  // CONTAGEM DOS REGISTROS DESTA EXECUCAO
  // ==========================================

  function validarQuantidade(prefixo, quantidade) {

    cy.get('table tbody', {
      timeout: 15000
    }).should(($tbody) => {

      const linhas = [
        ...$tbody[0].querySelectorAll('tr')
      ];

      const encontrados = linhas.filter((linha) => {

        const colunas = linha.querySelectorAll('td');

        if (colunas.length < 6) {
          return false;
        }

        const email = colunas[3].textContent.trim();

        return email.startsWith(prefixo);

      });

      expect(
        encontrados.length,
        `Quantidade esperada para ${prefixo}`
      ).to.equal(quantidade);

    });

  }

  // ==========================================
  // PREENCHIMENTO DO FORMULARIO
  // ==========================================

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

  // ==========================================
  // CREATE - CADASTRO
  // ==========================================

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

    cy.get('#registration-form-modal', {
      timeout: 15000
    }).should('not.exist');

    cy.log(
      `Cadastro enviado: ${funcionario.email}`
    );

  }

  // ==========================================
  // READ - VALIDACAO DO REGISTRO
  // ==========================================

  function validarFuncionario(funcionario) {

    pesquisar(funcionario.email);

    validarQuantidade(funcionario.email, 1);

    obterLinha(funcionario.email)
      .should('exist')
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

    limparPesquisa();

    cy.log(
      `Registro validado: ${funcionario.email}`
    );

  }

  // ==========================================
  // UPDATE - EDICAO
  // ==========================================

  function editarFuncionario(funcionario, atualizado) {

    pesquisar(funcionario.email);

    obterLinha(funcionario.email)
      .find('[id^="edit-record-"]')
      .should('exist')
      .click({ force: true });

    cy.get('#registration-form-modal')
      .should('be.visible');

    // Conferir que o formulario abriu
    // com os dados do registro correto.

    cy.get('#userEmail')
      .should('have.value', funcionario.email);

    cy.get('#salary')
      .clear()
      .type(atualizado.salario);

    cy.get('#department')
      .clear()
      .type(atualizado.departamento);

    cy.get('#submit')
      .should('be.enabled')
      .click({ force: true });

    cy.get('#registration-form-modal')
      .should('not.exist');

    // Validar novos valores.

    obterLinha(funcionario.email)
      .within(() => {

        cy.get('td').eq(4)
          .should('have.text', atualizado.salario);

        cy.get('td').eq(5)
          .should(
            'have.text',
            atualizado.departamento
          );

        // Garantir que os valores anteriores
        // foram substituidos.

        cy.get('td').eq(4)
          .should(
            'not.have.text',
            funcionario.salario
          );

        cy.get('td').eq(5)
          .should(
            'not.have.text',
            funcionario.departamento
          );

      });

    limparPesquisa();

    cy.log('Edicao validada');

  }

  // ==========================================
  // DELETE - EXCLUSAO
  // ==========================================

  function excluirFuncionario(email) {

    pesquisar(email);

    obterLinha(email)
      .find('[id^="delete-record-"]')
      .should('exist')
      .click({ force: true });

    validarQuantidade(email, 0);

    limparPesquisa();

    cy.log(`Exclusao validada: ${email}`);

  }

  // ==========================================
  // TESTE 1 - CRUD OBRIGATORIO
  // ==========================================

  it('CRUD - Criar, consultar, editar e excluir', () => {

    const funcionario = gerarFuncionario(100);

    const atualizado = {
      ...funcionario,
      salario: '18000',
      departamento: 'Technology'
    };

    // CREATE
    cadastrar(funcionario);

    // READ
    validarFuncionario(funcionario);

    // UPDATE
    editarFuncionario(funcionario, atualizado);

    // VALIDAR UPDATE
    validarFuncionario(atualizado);

    // DELETE
    excluirFuncionario(funcionario.email);

    // CONFIRMAR DELETE
    pesquisar(funcionario.email);

    validarQuantidade(funcionario.email, 0);

    limparPesquisa();

    cy.log('CRUD COMPLETO APROVADO');

  });

  // ==========================================
  // TESTE 2 - BONUS FUNCIONAL
  // ==========================================

  it('BONUS - Criar, validar e excluir 12 registros', () => {

    const TOTAL = 12;

    const funcionarios = Array.from(
      { length: TOTAL },
      (_, indice) => gerarFuncionario(indice + 1)
    );

    // Prefixo compartilhado pelos 12 emails.
    // Permite isolar somente os registros
    // criados nesta execucao.

    const prefixo = `qa${EXECUCAO}`;

    // ========================================
    // ETAPA 1 - CONFIRMAR ESTADO INICIAL
    // ========================================

    pesquisar(prefixo);

    validarQuantidade(prefixo, 0);

    limparPesquisa();

    // ========================================
    // ETAPA 2 - CADASTRAR OS 12 REGISTROS
    // ========================================

    cy.wrap(funcionarios).each(
      (funcionario, indice) => {

        const numero = indice + 1;

        cy.log(`CADASTRO ${numero}/${TOTAL}`);

        // Cadastrar sem filtro aplicado.
        cadastrar(funcionario);

        // Filtrar somente os registros
        // desta execucao.

        pesquisar(prefixo);

        // A quantidade deve aumentar em 1.
        validarQuantidade(prefixo, numero);

        // Confirmar o email recem-criado.
        obterLinha(funcionario.email)
          .should('exist');

        limparPesquisa();

      }
    );

    cy.log('12 CADASTROS CONFIRMADOS');

    // ========================================
    // ETAPA 3 - VALIDAR TODOS OS REGISTROS
    // ========================================

    cy.wrap(funcionarios).each(
      (funcionario, indice) => {

        cy.log(
          `VALIDACAO ${indice + 1}/${TOTAL}`
        );

        validarFuncionario(funcionario);

      }
    );

    // Confirmar novamente os 12 registros
    // usando o filtro exclusivo.

    pesquisar(prefixo);

    validarQuantidade(prefixo, TOTAL);

    limparPesquisa();

    cy.log('12 REGISTROS VALIDADOS');

    // ========================================
    // ETAPA 4 - EXCLUIR OS 12 REGISTROS
    // ========================================

    cy.wrap(funcionarios).each(
      (funcionario, indice) => {

        const numero = indice + 1;

        cy.log(
          `EXCLUSAO ${numero}/${TOTAL}`
        );

        excluirFuncionario(funcionario.email);

        // Conferir quantos registros
        // ainda restam desta execucao.

        pesquisar(prefixo);

        validarQuantidade(
          prefixo,
          TOTAL - numero
        );

        limparPesquisa();

      }
    );

    cy.log('12 EXCLUSOES CONFIRMADAS');

    // ========================================
    // ETAPA 5 - VALIDACAO FINAL
    // ========================================

    pesquisar(prefixo);

    validarQuantidade(prefixo, 0);

    limparPesquisa();

    // Confirmar individualmente que
    // nenhum email permanece na tabela.

    cy.wrap(funcionarios).each(
      (funcionario) => {

        pesquisar(funcionario.email);

        validarQuantidade(funcionario.email, 0);

        limparPesquisa();

      }
    );

    cy.log(
      'BONUS FUNCIONAL COMPLETO: 12 REGISTROS'
    );

  });

});
