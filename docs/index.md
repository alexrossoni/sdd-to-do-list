# SDD To-Do List

Uma aplicação de lista de tarefas simples construída com HTML5, CSS3 e JavaScript puro seguindo
o padrão Model-View-Controller (MVC). Este projeto foi desenvolvido como exercício de
Spec-Driven Development (SDD), aplicando práticas incrementais de especificação e planejamento
a um gerenciador de tarefas executado inteiramente no navegador.

## Tecnologias Utilizadas

| Tecnologia | Função |
|------------|--------|
| HTML5 | Estrutura semântica do documento e elementos de formulário |
| CSS3 | Estilização, layout responsivo e feedback visual de estado |
| JavaScript ES6+ | Lógica da aplicação usando módulos ES |
| localStorage | Persistência das tarefas no cliente entre sessões |

## Arquitetura

A aplicação segue uma separação estrita de Model-View-Controller. O **Model** (`js/model.js`)
gerencia todos os dados e regras de negócio como funções puras. A **View** (`js/view.js`)
cuida da renderização do DOM e da leitura de entradas do usuário sem manter estado. O
**Controller** (`js/controller.js`) conecta o model e a view, respondendo a eventos do usuário
e atualizando tanto o estado quanto a exibição.

## Funcionalidades

- [Lista de Tarefas Principal](features/001-todo-list-core.md) — Criação, conclusão e exclusão
  de tarefas com validação de entrada e persistência em localStorage.
- [Lembretes e Suporte Mobile](features/002-task-reminders-mobile.md) — Prazos opcionais,
  destaque de tarefas vencidas, notificações do navegador e layout adaptado para dispositivos móveis.
- [Documentação Viva com MkDocs](features/003-mkdocs-living-docs.md) — Este site de
  documentação, construído com MkDocs e publicado no GitHub Pages.

## Como Começar

Abra o `index.html` no navegador por meio de um servidor local (por exemplo,
`python -m http.server` ou a extensão Live Server do VS Code). O acesso direto via `file://`
suporta o gerenciamento básico de tarefas; as notificações do navegador requerem uma origem
servida por HTTP.

## Project layout

    mkdocs.yml    # The configuration file.
    docs/
        index.md  # The documentation homepage.
        ...       # Other markdown pages, images and other files.
