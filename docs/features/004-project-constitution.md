# 004 - Project Constitution

**Status**: Active  
**Branch**: `004-project-constitution`  
**Created**: 2026-05-17

Este documento explica, em linguagem simples, o porquê de cada regra definida na
Constitution do projeto. A Constitution é o arquivo `.specify/memory/constitution.md`
e funciona como o "contrato de qualidade" que todo desenvolvedor deve seguir ao
trabalhar neste repositório.

---

## Princípio I — Separação Rigorosa do MVC

### O que diz

Cada arquivo do projeto pertence a exatamente uma camada: **Model**, **View** ou
**Controller**. Os imports seguem uma única direção: o Controller importa do Model
e da View. A View pode ler funções auxiliares do Model (como `isOverdue`), mas
nunca pode alterar dados. O Model nunca importa da View ou do Controller.

### Por que essa regra existe

Imagine que você queira trocar o visual do app — trocar cores, fontes, ou até
reescrê-lo em React. Se o Model e o Controller estiverem misturados com código
de DOM, essa troca se torna um pesadelo. A separação rigorosa garante que:

- **Você entende cada arquivo isoladamente** — abre `model.js` e só vê lógica
  de dados; abre `view.js` e só vê manipulação de DOM.
- **Testar é fácil** — o Model pode ser testado sem navegador, sem DOM, sem
  nenhum ambiente especial.
- **Trocar uma camada não quebra as outras** — o visual muda sem mexer nos
  dados; a lógica muda sem mexer no visual.

### Como o projeto aplica isso hoje

| Arquivo | Camada | Responsabilidade |
|---------|--------|-----------------|
| `js/model.js` | Model | Tipos de dados, validação, CRUD, ordenação |
| `js/view.js` | View | Criação de elementos DOM, renderização, bindings |
| `js/controller.js` | Controller | Estado da aplicação, handlers de eventos, orquestração |

O único "cruzamento" permitido é o `view.js` importar `isOverdue` do Model —
uma função pura que apenas diz se uma tarefa está vencida, usada para decidir
qual classe CSS aplicar. Isso é leitura, não escrita.

---

## Princípio II — Fluxo de Dados Imutável

### O que diz

Toda função do Model que transforma dados **retorna um novo array ou objeto** —
nunca modifica o que recebeu como entrada. O Controller guarda o estado em
`state.tasks` e substitui o array inteiro a cada mudança.

### Por que essa regra existe

Quando você modifica um array diretamente (com `push`, `splice`, etc.), qualquer
parte do código que tenha uma referência para aquele array vê a mudança sem
aviso. Isso gera bugs difíceis de rastrear: "por que a tela não atualizou?",
"por que essa tarefa sumiu?".

Retornar um novo array a cada operação traz benefícios claros:

- **Debugging trivial** — você pode imprimir o estado antes e depois e ver
  exatamente o que mudou.
- **Undo/redo no futuro** — basta guardar um histórico dos arrays anteriores.
- **Sem surpresas** — nenhuma função esconde efeitos colaterários.

### Exemplo prático

```js
// ERRADO — muta o array original
function removeTask(tasks, id) {
  const index = tasks.findIndex(t => t.id === id);
  tasks.splice(index, 1);
  return tasks; // mesmo array, conteúdo alterado
}

// CORRETO — retorna um novo array
function removeTask(tasks, id) {
  return tasks.filter(task => task.id !== id);
}
```

O projeto usa o padrão correto em todas as funções: `addTask`, `removeTask`,
`toggleTask` e `sortTasksByDeadline`.

---

## Princípio III — Model Puro, Sem Efeitos Colaterais

### O que diz

Funções do Model devem ser **puras**: mesma entrada → mesma saída. Sem acesso
ao DOM, sem chamadas de rede, sem leitura de `localStorage` dentro de funções
de transformação. Efeitos colaterais (`loadTasks`, `saveTasks`) ficam isolados
nas bordas e têm nomes que deixam claro o que fazem.

### Por que essa regra existe

Funções puras são previsíveis. Se você chama `validateTaskText("  ")` dez vezes,
recebe o mesmo resultado dez vezes — independente do horário, do navegador, ou
do que está no `localStorage`. Isso permite:

- **Testar sem navegador** — rode os testes no Node.js, sem DOM, sem nada.
- **Raciocinar sobre o código** — você não precisa saber "o que mais está
  acontecendo" para entender o que uma função faz.
- **Migrar no futuro** — se quiser mover a lógica para um Web Worker ou um
  servidor, as funções puras funcionam sem alteração.

### Como o projeto aplica isso

- `validateTaskText(text)` → recebe uma string, retorna `{ valid, error }`.
  Ponto. Sem acesso a nada externo.
- `addTask(tasks, text, deadline)` → recebe dados, retorna um novo array com
  a tarefa adicionada. Sem salvar, sem renderizar.
- `loadTasks()` e `saveTasks()` são as únicas que tocam `localStorage` — e
  seus nomes deixam óbvio que fazem I/O.

---

## Princípio IV — Acessibilidade em Primeiro Lugar

### O que diz

Todos os elementos interativos devem ser botões ou inputs HTML nativos, com
`aria-label` explícito. Mensagens de erro usam `aria-live="polite"`. Navegação
por teclado deve funcionar sem mouse. Estados de foco devem ser visíveis.

### Por que essa regra existe

O app tem um visual de terminal escuro — mas isso é estética, não exclusão.
Pessoas que usam leitores de tela, navegam por teclado ou têm baixa visão
precisam usar o app tanto quanto qualquer outra pessoa.

Além disso, acessibilidade não é um "extra" que se adiciona depois — é mais
fácil construir certo desde o início do que refatorar dezenas de `<div>` com
`onclick` para se tornarem acessíveis.

### Como o projeto aplica isso hoje

- Botões de toggle e remoção são `<button>` reais, não `<div>` ou `<span>`
- Cada botão tem `aria-label` descritivo ("Mark as complete", "Remove task")
- O campo de erro usa `aria-live="polite"` e `role="alert"` — o leitor de tela
  anuncia a mensagem automaticamente
- A lista de tarefas tem `aria-label="Task list"`
- Foco visível via `outline: none` combinado com `:focus-visible` estilizado

---

## Princípio V — Zero Dependências, Vanilla Puro

### O que diz

O projeto usa apenas HTML5, CSS3 e JavaScript ES6+. Sem build tools, sem
frameworks, sem gerenciadores de pacotes para código de produção. Os únicos
recursos externos permitidos são: (a) uma importação do Google Fonts para
tipografia e (b) a API nativa `localStorage` do navegador.

### Por que essa regra existe

- **Simplicidade** — qualquer pessoa pode clonar o repositório, abrir o
  `index.html` e ver o app funcionando. Sem `npm install`, sem `build`,
  sem configuração.
- **Segurança** — sem dependências externas, não há risco de supply-chain
  attacks (pacotes comprometidos que instalam malware).
- **Aprendizado** — o projeto é um exercício de SDD com tecnologias
  fundamentais. Usar um framework esconderia os conceitos que queremos praticar.
- **Performance** — zero JavaScript de terceiros para baixar, parsear ou executar.

### O que isso significa na prática

Se uma funcionalidade exigir uma biblioteca (por exemplo, um date picker
avançado), temos duas opções:

1. Reimplementar a funcionalidade em vanilla JS
2. Adiar a funcionalidade até que uma solução simples seja viável

Nunca adicionamos uma dependência só por conveniência.

---

## Restrições de Arquitetura e Qualidade

### Organização de Arquivos

Cada arquivo tem uma responsabilidade clara e não se repete. Se você precisa
saber onde algo está, a resposta é previsível: dados vão no Model, visual vai
na View, lógica de aplicação vai no Controller.

### Convenções de Nomes

- **CSS**: BEM (`.block__element--modifier`) — qualquer pessoa que conhece BEM
  sabe onde procurar um estilo
- **`data-js`**: atributos em elementos interativos — o Controller usa esses
  atributos para encontrar elementos sem depender de classes CSS (que podem mudar)
- **JSDoc `@typedef`**: define a estrutura de dados (`Task`) em um único lugar,
  com documentação embutida

### Tratamento de Erros

- Erros de validação aparecem inline, como texto — nunca `alert()` que interrompe
  o fluxo do usuário
- `loadTasks` captura qualquer exceção e retorna `[]` — se o `localStorage`
  estiver corrompido, o app abre vazio em vez de travar
- Permissão de notificação é pedida apenas quando o usuário define um deadline —
  não ao abrir o app, o que seria invasivo

### Performance

- **Event delegation**: um único listener no container da lista, em vez de um
  listener por tarefa. Se você tem 100 tarefas, são 100 listeners a menos.
- **`setInterval` a cada 30s** para verificar deadlines — não a cada frame, o
  que consumiria bateria e CPU desnecessariamente.
- **Animações via CSS `@keyframes`** com `animationend` — o navegador otimiza
  as animções nativamente, sem JavaScript rodando a cada frame.

---

## Workflow de Spec-Driven Development

### Spec Antes de Código

Nenhuma feature começa com código. Começa com uma especificação em
`specs/[###-feature]/spec.md` que descreve cenários de usuário, requisitos e
critérios de sucesso. Isso força o time a pensar no "o quê" antes do "como".

### Plan Antes de Tasks

Depois da spec, cria-se um plano técnico (`plan.md`) com decisões de
implementação e uma verificação de conformidade com a Constitution. Só então
gera-se a lista de tarefas (`tasks.md`).

### Tasks Guiam a Implementação

Cada tarefa é uma unidade discreta e commitável. O desenvolvimento segue a
lista sequencialmente, garantindo que nada seja esquecido.

### Documentação Viva

A documentação gerada pelo MkDocs (`docs/`) reflete o estado atual do projeto.
Cada feature tem seu arquivo em `docs/features/`, espelhando a estrutura de
specs. Quando o código muda, a documentação muda junto.

---

## Governança

A Constitution não é uma sugestão — é o contrato de qualidade do projeto.
Qualquer desvio precisa ser justificado no `plan.md` da feature, na seção
"Complexity Tracking". Alterações na própria Constitution exigem:

1. Racional claro para a mudança
2. Análise de impacto no código e specs existentes
3. Bump de versão seguindo semver (MAJOR, MINOR, PATCH)
4. Atualização do Sync Impact Report no topo do arquivo
