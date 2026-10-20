
/**
 * DESAFIO 2 - ACCENTURE
 * Teste automatizado Frontend
 *
 * Cenário: Abrir uma nova janela no DemoQA,
 * validar sua mensagem e fechá-la.
 */

// Importa a ferramenta de validação do Node.js.
const assert = require('node:assert/strict');

// Importa o Selenium para controlar o Chrome.
const { Builder } = require('selenium-webdriver');

// Importa a classe responsável pela página inicial.
const HomePage = require('../pages/HomePage');

// Importa a classe responsável pelo Browser Windows.
const BrowserWindowsPage = require('../pages/BrowserWindowsPage');

// Função principal que executa o teste.
async function executarTeste() {

  // Cria a sessão de automação no Chrome.
  const driver = await new Builder()
    .forBrowser('chrome')
    .build();

  // Inicia o bloco de execução protegida.
  try {

    // Cria o objeto da página inicial.
    const homePage = new HomePage(driver);

    // Cria o objeto da página Browser Windows.
    const browserPage = new BrowserWindowsPage(driver);

    // REQUISITO 1: Acessar o DemoQA.
    await homePage.acessar();
    console.log('PASSO 1: DemoQA acessado.');

    // REQUISITO 2: Selecionar Alerts, Frame & Windows.
    await homePage.acessarAlertsFrameWindows();
    console.log('PASSO 2: Menu selecionado.');

    // REQUISITO 3: Acessar Browser Windows.
    await browserPage.acessarBrowserWindows();
    console.log('PASSO 3: Browser Windows acessado.');

    // REQUISITO 4: Abrir uma nova janela.
    // Guarda o identificador da janela original.
    const janelaOriginal = await browserPage.abrirNovaJanela();
    console.log('PASSO 4: Nova janela aberta.');

    // REQUISITO 5: Obter a mensagem da nova janela.
    const mensagem = await browserPage.obterMensagem();

    // Compara o texto encontrado com o esperado.
    assert.strictEqual(
      mensagem,
      'This is a sample page',
      'A mensagem da nova janela está incorreta.'
    );

    // Se a comparação passou, registra o sucesso.
    console.log('PASSO 5: Mensagem validada:', mensagem);

    // REQUISITO 6: Fechar a janela secundária.
    await browserPage.fecharNovaJanela(janelaOriginal);
    console.log('PASSO 6: Nova janela fechada.');

    // Registra que todos os passos passaram.
    console.log('TESTE APROVADO: Todos os requisitos atendidos.');

  } finally {

    // Encerra a sessão do Selenium mesmo se ocorrer erro.
    await driver.quit();
  }
}

// Executa a função principal.
executarTeste().catch(erro => {

  // Exibe o erro se o teste falhar.
  console.error('TESTE REPROVADO:', erro);

  // Informa ao sistema operacional que ocorreu falha.
  process.exitCode = 1;
});
