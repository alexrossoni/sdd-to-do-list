# Lembretes de Tarefas e Melhorias Mobile

## Visão Geral

Esta funcionalidade estende a lista de tarefas principal com suporte a prazos opcionais,
indicadores visuais de atraso, notificações push do navegador e um layout otimizado para
dispositivos móveis. Os usuários podem, opcionalmente, associar uma data e hora a qualquer
tarefa; a aplicação então monitora esses prazos e alerta o usuário quando eles expiram.

## Comportamentos Principais

- **Campo de prazo opcional** — Um campo de entrada `datetime-local` ao lado do texto da tarefa
  permite que o usuário associe um prazo a ela. O campo é totalmente opcional; tarefas sem prazo
  se comportam de forma idêntica às da funcionalidade principal.
- **Destaque visual de atraso** — Tarefas com prazo expirado que ainda não foram concluídas
  recebem uma classe CSS distinta (`todo-item--overdue`), que aplica borda vermelha e fundo
  tingido, tornando os itens atrasados imediatamente visíveis sem necessidade de ler o horário.
- **Notificações do navegador** — Quando uma tarefa se torna atrasada e o usuário concedeu
  permissão de notificação, a aplicação dispara uma notificação do navegador (Web Notifications
  API) com o texto da tarefa e a mensagem "Task is overdue." Cada tarefa dispara no máximo uma
  notificação por sessão.
- **Ordenação por prazo** — A lista de tarefas é exibida ordenada por prazo de forma crescente,
  com tarefas sem prazo posicionadas ao final. Empates de prazo são desempatados pela data de
  criação.
- **Alvos de toque para mobile** — Todos os botões interativos (alternância e remoção)
  atendem a um tamanho mínimo de área de toque de 44 × 44 px, garantindo uso confortável em
  dispositivos com tela sensível ao toque.

## Permissões

A Web Notifications API requer permissão explícita do usuário. A aplicação solicita a permissão
no momento em que o primeiro prazo é definido. Caso o usuário negue a permissão, os prazos e o
estilo de atraso continuam funcionando normalmente — apenas a notificação push é suprimida.

## Suporte Mobile

O layout se adapta para viewports com até 768 px de largura. Espaçamentos, tamanhos de fonte e
dimensões dos botões são ajustados para que a aplicação seja totalmente utilizável em smartphones
sem necessidade de zoom ou rolagem horizontal.
