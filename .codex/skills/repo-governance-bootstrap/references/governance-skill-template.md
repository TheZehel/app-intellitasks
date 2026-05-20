# Governance Skill Template

Use este template para criar `.codex/skills/<project>-governance-orchestrator/SKILL.md` no repo alvo. Adapte nomes, pastas e comandos ao que foi descoberto no projeto.

```markdown
---
name: <project>-governance-orchestrator
description: Guide repository-local governance, architecture boundaries, validation, and delivery discipline for <project>. Use when implementing, refactoring, reviewing, or changing conventions, folder responsibilities, AGENTS.md, `.codex/skills/**`, or project validation flow.
---

# <Project> Governance Orchestrator

## Objetivo

Garantir que cada alteracao respeite a arquitetura real do repo, mantenha documentacao operacional sincronizada e rode as validacoes adequadas antes da entrega.

## Fluxo Obrigatorio

1. Ler o `AGENTS.md` mais especifico aplicavel, quando existir.
2. Identificar os arquivos alterados e as camadas impactadas.
3. Validar limites de arquitetura definidos para este repo.
4. Atualizar `AGENTS.md` ou esta skill quando a mudanca alterar padroes, convencoes ou responsabilidades.
5. Rodar os comandos de qualidade existentes no repo.
6. Reportar validacoes, riscos e arquivos de governanca atualizados.

## Fronteiras Arquiteturais

- `<area-1>`: `<responsabilidade>`.
- `<area-2>`: `<responsabilidade>`.
- `<area-3>`: `<responsabilidade>`.

## Comandos De Validacao

- `<command-1>`
- `<command-2>`
- `<command-3>`

## Regras De Decisao

- Em conflito, prevalece o `AGENTS.md` mais especifico.
- Nao mover regra de negocio para UI se existir camada de dominio ou servico.
- Nao introduzir dependencias novas sem necessidade real.
- Manter mudancas de governanca proporcionais ao tamanho do repo.
```
