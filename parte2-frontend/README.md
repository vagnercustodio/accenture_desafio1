
# Accenture QA Automation — Desafio 2

## 1. Objetivo

Implementar um teste automatizado de interface web
utilizando Selenium WebDriver e JavaScript.

O cenário contempla a navegação no DemoQA,
a abertura de uma nova janela, a validação de
seu conteúdo e o fechamento da janela.

## 2. Tecnologias utilizadas

- JavaScript
- Node.js
- Selenium WebDriver 4
- Google Chrome
- npm
- Git / GitHub

## 3. Padrão de arquitetura

O projeto utiliza Page Object Model (POM).

Esse padrão separa a lógica de interação
com as páginas dos cenários de teste,
favorecendo manutenção, organização
e reutilização de código.

## 4. Estrutura do projeto

accenture-qa-automation-parte2/
|
|-- pages/
|   |-- HomePage.js
|   |-- BrowserWindowsPage.js
|
|-- tests/
|   |-- browserWindows.test.js
|
|-- utils/
|
|-- teste-conexao.js
|-- package.json
|-- package-lock.json
|-- .gitignore
|-- README.md

## 5. Cenário automatizado

Site: https://demoqa.com/

Passos:

1. Acessar o site DemoQA.
2. Selecionar Alerts, Frame & Windows.
3. Acessar Browser Windows.
4. Clicar em New Window.
5. Verificar a mensagem "This is a sample page".
6. Fechar a nova janela.

Resultado esperado:

A mensagem apresentada na janela secundária
deve corresponder exatamente ao texto esperado,
e a janela deve ser fechada após a validação.

## 6. Pré-requisitos

- Node.js 22 ou superior
- npm
- Google Chrome instalado
- Acesso à internet

O Selenium Manager normalmente gerencia
o driver compatível com o navegador.

## 7. Instalação

No terminal, dentro da pasta do projeto:

npm ci

## 8. Execução

Para executar o cenário completo:

npm test

Para validar a comunicação Selenium/Chrome:

npm run test:connection

## 9. Validação

A validação utiliza assert.strictEqual()
do Node.js para comparar a mensagem obtida
com o resultado esperado.

Se os valores forem diferentes,
o teste será reprovado.

O código também utiliza tratamento de
exceções e encerramento da sessão
do navegador em bloco finally.

## 10. Tratamento de clique interceptado

O DemoQA apresentou interceptação de clique
durante a navegação pelo menu inicial.

A implementação prioriza o clique convencional
do Selenium.

Caso ocorra ElementClickInterceptedError,
é utilizado um clique JavaScript como alternativa.

Essa estratégia contorna a interceptação,
mas não comprova que o elemento estava
livre de sobreposições para um usuário real.

## 11. Resultado da execução local

O cenário foi executado com sucesso
utilizando npm test.

Os seis passos foram concluídos,
incluindo a validação do texto e o
fechamento da janela secundária.

## 12. Considerações técnicas

A solução prioriza:

- Cobertura do fluxo solicitado.
- Separação de responsabilidades.
- Organização com Page Object Model.
- Esperas explícitas.
- Validação automatizada.
- Gerenciamento de múltiplas janelas.
- Tratamento de exceções.
- Facilidade de execução e manutenção.
