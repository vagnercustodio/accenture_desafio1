
/**
 * DESAFIO 2 - ACCENTURE
 * Automação Frontend com Selenium WebDriver
 *
 * Arquivo: HomePage.js
 *
 * Objetivo:
 * Acessar o DemoQA e navegar até
 * Alerts, Frame & Windows.
 *
 * Padrão: Page Object Model (POM).
 */

// Importa os recursos necessários do Selenium.
const { By, until } = require('selenium-webdriver');

// Define a classe da página inicial.
class HomePage {

  // Recebe a sessão do navegador.
  constructor(driver) {

    // Armazena o navegador utilizado.
    this.driver = driver;

    // Define o endereço da aplicação.
    this.url = 'https://demoqa.com/';
  }

  // Acessa a página inicial.
  async acessar() {

    // Abre o site DemoQA.
    await this.driver.get(this.url);

    // Maximiza a janela para melhorar a área de visualização.
    await this.driver.manage().window().maximize();
  }

  // Acessa o menu Alerts, Frame & Windows.
  async acessarAlertsFrameWindows() {

    // Localiza o cartão correspondente ao menu.
    const menu = await this.driver.wait(
      until.elementLocated(
        By.xpath(
          "//h5[normalize-space()='Alerts, Frame & Windows']/ancestor::div[contains(@class,'card')][1]"
        )
      ),
      15000
    );

    // Aguarda o cartão estar visível.
    await this.driver.wait(
      until.elementIsVisible(menu),
      10000
    );

    // Centraliza o cartão na tela.
    await this.driver.executeScript(
      "arguments[0].scrollIntoView({block: 'center'});",
      menu
    );

    // Primeiro tenta executar o clique normal do Selenium.
    try {

      // Realiza o clique convencional.
      await menu.click();

      // Registra que o clique convencional funcionou.
      console.log('Menu acessado com clique Selenium.');

    } catch (erro) {

      // Somente trata erros de clique interceptado.
      if (erro.name !== 'ElementClickInterceptedError') {
        throw erro;
      }

      // Informa que o clique foi interceptado.
      console.log(
        'Clique interceptado. Aplicando alternativa JavaScript...'
      );

      // Executa o clique diretamente no elemento pelo JavaScript.
      await this.driver.executeScript(
        "arguments[0].click();",
        menu
      );

      // Registra o uso da alternativa.
      console.log('Clique JavaScript executado.');
    }

    // Confirma que a navegação ocorreu.
    await this.driver.wait(
      until.urlContains('alertsWindows'),
      15000
    );

    // Registra que a seção correta foi acessada.
    console.log('Navegação para Alerts, Frame & Windows confirmada.');
  }
}

// Exporta a classe para utilização nos testes.
module.exports = HomePage;
