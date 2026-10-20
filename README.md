# Accenture - Desafio QA Automation (Parte 1: API)

Automação end-to-end das seis etapas propostas pela Accenture, usando **JavaScript e Cypress** sobre a API pública BookStore DemoQA.

## Fluxo automatizado
1. `POST /Account/v1/User` - cria um usuário único.
2. `POST /Account/v1/GenerateToken` - gera um token.
3. `POST /Account/v1/Authorized` - verifica autorização.
4. `GET /BookStore/v1/Books` - consulta catálogo.
5. `POST /BookStore/v1/Books` - associa dois livros ao usuário.
6. `GET /Account/v1/User/{userId}` - confirma usuário e os dois ISBNs.

## Pré-requisitos
- Node.js LTS com npm instalado.
- Conexão com a internet para utilizar a API pública.

## Como executar
```bash
npm install
npm run test:api
```

Para abrir a interface do Cypress:
```bash
npm run cypress:open
```
Escolha E2E Testing e o teste `bookstore.cy.js`.

## Estratégia de qualidade
- Requisições executadas sequencialmente em um único cenário.
- Verificações dos status HTTP e dos campos essenciais da resposta.
- Uso de dados dinâmicos (usuário com timestamp), evitando colisões entre execuções.
- Dois ISBNs diferentes selecionados do catálogo real, sem valores fixos.
- Conferência final de identidade e correspondência dos ISBNs.

## Observações
A API pública pode sofrer indisponibilidade ou alterações sem aviso. O cenário depende de conectividade e do funcionamento da DemoQA. A senha no teste é exclusivamente fictícia e usada para a API de demonstração; não a reutilize em sistemas reais. A operação de reserva corresponde à associação de livros à coleção do usuário na DemoQA.

Documentação: https://demoqa.com/swagger/

## Status
Código preparado para execução local. A execução real e o resultado devem ser validados no ambiente com Node.js e Cypress instalados antes da entrega.
