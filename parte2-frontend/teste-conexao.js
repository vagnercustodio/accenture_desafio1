
const { Builder } = require('selenium-webdriver');

async function testarConexao() {
  const driver = await new Builder()
    .forBrowser('chrome')
    .build();

  try {
    await driver.get('https://demoqa.com/');
    console.log('SUCESSO: Chrome aberto pelo Selenium!');
    console.log('Titulo da pagina:', await driver.getTitle());
  } finally {
    await driver.quit();
  }
}

testarConexao().catch(console.error);
