# Accenture | Desafio Técnico — Automação Frontend

## 1. Visão Geral

Projeto de automação de testes End-to-End (E2E), desenvolvido utilizando **Cypress e JavaScript**, com o objetivo de validar o preenchimento, a submissão e a consistência dos dados do formulário *Student Registration Form*, disponível na plataforma DemoQA.

**Aplicação:** https://demoqa.com/automation-practice-form

## 2. Tecnologias Utilizadas

- Cypress 15.21.1
- JavaScript
- Node.js e NPM
- Google Chrome
- Git e GitHub para versionamento

## 3. Escopo da Automação

A solução contempla:

1. Acesso direto ao formulário Practice Form.
2. Geração dinâmica de dados de teste válidos.
3. Preenchimento de nome, sobrenome, e-mail e telefone.
4. Seleção de gênero e data de nascimento.
5. Preenchimento de disciplina e seleção de hobby.
6. Upload de arquivo `.txt` armazenado no projeto.
7. Preenchimento de endereço, estado e cidade.
8. Validação dos campos preenchidos.
9. Submissão do formulário.
10. Validação da abertura do popup de confirmação.
11. Verificação dos dez campos apresentados no popup.
12. Captura de evidências da execução.

O acesso é realizado diretamente pela URL do formulário.

## 4. Estrutura do Projeto

```text
parte3-formulario/
├── cypress/
│   ├── e2e/
│   │   └── practice-form.cy.js
│   ├── fixtures/
│   │   └── arquivo-upload.txt
│   └── screenshots/
├── cypress.config.js
├── package.json
├── package-lock.json
└── README.md
```

A pasta `screenshots` é criada quando existem capturas de evidências.

## 5. Instalação e Configuração

**Pré-requisitos:** Node.js, NPM e Google Chrome.

No terminal, acessar o diretório `parte3-formulario` e executar:

```powershell
npm ci
```

Verificar a instalação:

```powershell
npx cypress verify
```

## 6. Execução dos Testes

**Modo headless — execução pelo terminal:**

```powershell
npx cypress run --spec "cypress/e2e/practice-form.cy.js" --browser chrome
```

**Modo interativo — interface gráfica:**

```powershell
npx cypress open
```

## 7. Cenários de Teste

### CT-001 — Preenchimento, submissão e validação

**Objetivo:** validar o fluxo principal de preenchimento e submissão do formulário.

**Critérios de validação:**

- Dados preenchidos corretamente.
- Seleções realizadas conforme massa gerada.
- Arquivo `.txt` selecionado.
- Submissão efetuada.
- Popup de confirmação apresentado.
- Dez campos de retorno conferidos com os dados utilizados.

**Status:** Aprovado na última execução informada.

### CT-002 — Fechamento do popup

**Objetivo:** validar que o botão Close encerra a janela de confirmação.

**Status:** Pendente de reativação e validação automatizada.

O cenário está identificado no arquivo de testes com `it.skip`, não sendo contabilizado como aprovado.

## 8. Resultado da Execução

Resultado informado da última execução da versão atual:

| Indicador | Resultado |
|---|---|
| Testes aprovados | 1 |
| Testes pendentes | 1 |
| Testes com falha | 0 |

O fluxo principal foi concluído e validado, enquanto o cenário de fechamento permanece separado.

## 9. Evidências

O Cypress registra capturas de tela no diretório:

```text
cypress/screenshots/
```

O projeto inclui uma captura do popup após a validação dos dez campos.

## 10. Considerações Finais

A solução demonstra a aplicação de práticas de Quality Engineering, incluindo:

- Automação de testes End-to-End.
- Geração dinâmica de massa de testes.
- Validação de interface e dados.
- Automação de upload de arquivos.
- Verificações de consistência após submissão.
- Registro de evidências de execução.
- Separação e rastreabilidade dos cenários de teste.

O projeto foi estruturado para permitir manutenção, evolução da cobertura e integração com processos de execução automatizada.