
# language: pt

@accenture @parte3 @bonus
Funcionalidade: Gerenciamento dinamico de registros Web Tables
  Como profissional de Quality Assurance
  Quero automatizar o gerenciamento de funcionarios
  Para validar o cadastro e a exclusao de registros

  Cenario: Criar e excluir 12 registros dinamicamente
    Dado que acesso a pagina Web Tables do DemoQA
    E preparo 12 funcionarios com dados dinamicos
    Quando cadastro os 12 funcionarios na tabela
    Entao os 12 funcionarios devem estar cadastrados
    Quando excluo os 12 funcionarios cadastrados
    Entao nenhum dos 12 funcionarios deve permanecer na tabela
