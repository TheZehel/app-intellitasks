---
name: repo-governance-bootstrap
description: Create repo-local governance skills and lightweight AGENTS guidance for new repositories. Use when Codex needs to add a Prime Whitelabel Generator-inspired governance structure to a project, bootstrap `.codex/skills/**`, create or update `AGENTS.md`, define architecture guardrails, or prepare a reusable governance checklist without overbuilding hooks, OpenSpec, or CI.
---

# Repo Governance Bootstrap

## Objetivo

Implantar uma governanca repo-local leve, reutilizavel e adaptada ao projeto atual. Use o padrao do `prime-whitelabel-generator` como referencia de disciplina, nao como copia literal.

## Fluxo Obrigatorio

1. Inspecione o repo antes de criar arquivos:
   - stack, package manager, scripts, estrutura de pastas e idioma predominante;
   - existencia de `AGENTS.md`, `.codex/skills`, `.github`, OpenSpec, hooks ou checklists;
   - comandos reais de validacao em `package.json`, `pyproject.toml`, `Cargo.toml` ou equivalente.
2. Escolha uma governanca minima para o porte do repo:
   - projeto simples ou academico: skill local + `AGENTS.md` raiz opcional + checklist;
   - produto em evolucao: skill local + `AGENTS.md` raiz + referencias de arquitetura;
   - repo profissional com CI: adicionar scripts, hooks, OpenSpec ou PR template somente se o repo ja tiver maturidade para manter isso.
3. Crie uma skill local em `.codex/skills/<repo-or-project>-governance-orchestrator/`.
4. Mantenha o `SKILL.md` curto e operacional. Coloque templates e checklists em `references/`.
5. Se criar ou atualizar `AGENTS.md`, registre:
   - fronteiras arquiteturais;
   - precedencia de instrucoes;
   - comandos de qualidade;
   - criterio para atualizar a propria governanca.
6. Valide a skill com `quick_validate.py` quando o script estiver disponivel.
7. Finalize informando arquivos criados, validacoes executadas e qualquer decisao de escopo.

## Defaults Para Next.js E React

Para repos com Next.js/React, defina limites simples:

- `app` ou `pages`: rotas, composicao de paginas e handlers HTTP.
- `components`: UI, estado visual e interacao; sem acesso direto a banco ou infra.
- `lib`: dominio, validacao, controllers, repositorios, clients e integracoes.
- `prisma` ou `db`: schema, migrations, seed e persistencia.

Nao force `src/` se o repo usa pastas na raiz. A skill deve refletir a estrutura real.

## Regras De Escopo

- Nao criar hooks, OpenSpec, scripts de auditoria ou PR templates por padrao em repos pequenos.
- Nao copiar nomes PrimeSecure, tenant, Infisical, Vercel, Notion ou regras de negocio de outro repo.
- Nao criar documentacao auxiliar como README ou guia de instalacao dentro da skill.
- Preservar o idioma do repo; se o README e codigo estiverem em portugues, escreva a governanca em portugues.
- Preferir comandos existentes a novos scripts. Quando faltar validacao, sugerir o menor comando coerente com a stack.
- Atualizar governanca quando uma mudanca alterar arquitetura, convencoes, camadas ou fluxo operacional.

## Recursos

- Leia `references/governance-skill-template.md` ao criar a skill de governanca do repo alvo.
- Leia `references/governance-checklist-template.md` ao criar um checklist de governanca.
