
/**
 * DESAFIO 2 - ACCENTURE
 * Arquivo: BrowserWindowsPage.js
 *
 * Objetivo:
 * Navegar até Browser Windows, abrir uma nova
 * janela, validar a mensagem e fechar a janela.
 */

// Importa ferramentas do Selenium.
const { By, until } = require('selenium-webdriver');

// Cria a classe que representa a página Browser Windows.
class BrowserWindowsPage {

  // Recebe o navegador Selenium.
  constructor(driver) {

    // Armazena a referência ao navegador.
    this.driver = driver;
  }

  // Acessa o submenu Browser Windows.
  async acessarBrowserWindows() {

    // Localiza o submenu pelo texto.
    const submenu = await this.driver.wait(
      until.elementLocated(
        By.xpath("//span[text()='Browser Windows']")
      ),
      10000
    );

    // Posiciona o submenu na tela.
    await this.driver.executeScript(
      "arguments[0].scrollIntoView({block: 'center'});",
      submenu
    );

    // Aguarda o submenu ficar visível.
    await this.driver.wait(
      until.elementIsVisible(submenu),
      10000
    );

    // Clica no submenu.
    await submenu.click();
  }

  // Abre a nova janela.
  async abrirNovaJanela() {

    // Guarda o identificador da janela original.
    const janelaOriginal = await this.driver.getWindowHandle();

    // Obtém as janelas existentes antes do clique.
    const janelasAntes = await this.driver.getAllWindowHandles();

    // Localiza o botão New Window pelo ID.
    const botao = await this.driver.wait(
      until.elementLocated(By.id('windowButton')),
      10000
    );

    // Clica no botão para abrir outra janela.
    await botao.click();

    // Aguarda até existir uma nova janela.
    await this.driver.wait(
      async () => {
        const janelas = await this.driver.getAllWindowHandles();
        return janelas.length > janelasAntes.length;
      },
      10000
    );

    // Obtém a lista atualizada de janelas.
    const janelasDepois = await this.driver.getAllWindowHandles();

    // Identifica a janela que não existia antes.
    const novaJanela = janelasDepois.find(
      janela => !janelasAntes.includes(janela)
    );

    // Alterna o controle do Selenium para a nova janela.
    await this.driver.switchTo().window(novaJanela);

    // Retorna o identificador da janela original.
    return janelaOriginal;
  }

  // Obtém o texto exibido na nova janela.
  async obterMensagem() {

    // Aguarda o elemento com a mensagem aparecer.
    const mensagem = await this.driver.wait(
      until.elementLocated(By.id('sampleHeading')),
      10000
    );

    // Aguarda o texto estar visível.
    await this.driver.wait(
      until.elementIsVisible(mensagem),
      10000
    );

    // Retorna o texto encontrado.
    return await mensagem.getText();
  }

  // Fecha a janela secundária.
  async fecharNovaJanela(janelaOriginal) {

    // Fecha somente a janela atualmente selecionada.
    await this.driver.close();

    // Retorna o controle para a janela original.
    await this.driver.switchTo().window(janelaOriginal);
  }
}

// Permite utilizar esta classe em outros arquivos.
module.exports = BrowserWindowsPage;
