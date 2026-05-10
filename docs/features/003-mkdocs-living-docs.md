# Documentação Viva com MkDocs

## Visão Geral

Documentação Viva é o Princípio VI da Constituição deste projeto. Ele exige que toda
funcionalidade concluída seja documentada em formato legível por humanos e mantida em sincronia
com o código-fonte. O MkDocs foi escolhido como ferramenta de documentação por converter
arquivos Markdown em um site estático navegável sem impacto no bundle da aplicação, e seu
comando `gh-deploy` publica o resultado no GitHub Pages em uma única etapa.

## Comportamentos Principais

- **Build local** — Executar `mkdocs build` na raiz do repositório gera o site estático
  completo no diretório `site/`. O comando finaliza com código 0 e zero avisos quando todas
  as páginas e links de navegação são válidos.
- **Publicação no GitHub Pages** — Executar `mkdocs gh-deploy` constrói o site e faz push
  para o branch `gh-pages` do remote `origin`. O GitHub Pages serve o site publicamente na
  URL de Pages do repositório.
- **Modo estrito** — O `mkdocs.yml` é configurado com `strict: true`, o que faz o build falhar
  imediatamente caso alguma entrada de navegação referencie um arquivo inexistente ou algum
  link interno esteja quebrado. Isso impede que links mortos cheguem ao site publicado.
- **Páginas por funcionalidade** — Cada funcionalidade concluída possui sua própria página
  Markdown em `docs/features/`, vinculada à navegação do site. Adicionar uma nova
  funcionalidade requer apenas criar um novo arquivo Markdown e registrá-lo no `mkdocs.yml`.

## Comandos

```bash
# Construir o site de documentação localmente
mkdocs build

# Publicar o site de documentação no GitHub Pages
mkdocs gh-deploy
```

## Adicionando uma Nova Página de Funcionalidade

1. Crie um novo arquivo Markdown em `docs/features/<NNN>-<slug-da-funcionalidade>.md`
   seguindo a convenção de nomenclatura das páginas existentes (número de três dígitos com
   zeros à esquerda, slug em letras minúsculas separado por hífens).
2. Adicione a página ao bloco `nav:` no `mkdocs.yml` sob a seção `Features:`, usando o
   mesmo caminho relativo (ex.: `features/004-nova-funcionalidade.md`).
3. Execute `mkdocs build` para verificar que o build passa com zero erros e avisos antes
   de fazer o commit.
