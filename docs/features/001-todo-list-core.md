# Lista de Tarefas Principal

## Visão Geral

A Lista de Tarefas Principal é a funcionalidade central da aplicação SDD To-Do List. Ela permite
que os usuários criem, concluam e excluam tarefas inteiramente no navegador, sem necessidade de
servidor ou conta. Todos os dados são preservados no localStorage do navegador, fazendo com que
a lista sobreviva a atualizações de página e reinicializações do navegador.

## Comportamentos Principais

- **Criação de tarefa** — O usuário digita uma descrição no campo de entrada e envia o
  formulário. A nova tarefa aparece imediatamente no final da lista.
- **Alternância de conclusão** — Clicar no botão de alternância em qualquer tarefa muda seu
  estado entre *pendente* e *concluída*. Tarefas concluídas recebem um estilo visual distinto
  (texto tachado).
- **Exclusão de tarefa** — Clicar no botão de remoção exclui permanentemente a tarefa da lista
  e do armazenamento.
- **Validação de entrada** — A aplicação rejeita envios vazios e descrições com mais de 120
  caracteres, exibindo uma mensagem de erro inline sem apagar a entrada válida.
- **Persistência em localStorage** — A lista completa de tarefas é serializada em JSON e
  armazenada sob a chave `sdd-todo-tasks` no localStorage. As tarefas são restauradas
  automaticamente ao carregar a página, sem perda de dados entre sessões.

## Interface do Usuário

A aplicação utiliza uma estética de terminal retrô: fundo escuro, tipografia monoespaçada e
acentos verdes de alto contraste inspirados nas interfaces de linha de comando clássicas. O
layout é responsivo e se adapta a diferentes tamanhos de tela, garantindo que a lista de
tarefas, o campo de entrada e os botões de ação permaneçam utilizáveis tanto em desktops
quanto em dispositivos móveis.
