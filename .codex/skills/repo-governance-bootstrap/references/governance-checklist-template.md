# Governance Checklist Template

Use este checklist como `references/governance-checklist.md` quando o repo precisar de uma referencia operacional enxuta.

```markdown
# Governance Checklist

## Antes De Implementar

- [ ] Identifiquei a stack, package manager e comandos reais do repo.
- [ ] Li o `AGENTS.md` aplicavel, quando existir.
- [ ] Entendi quais camadas/pastas a mudanca toca.

## Durante A Implementacao

- [ ] Mantive responsabilidades nas camadas corretas.
- [ ] Evitei duplicar regra ja centralizada.
- [ ] Atualizei `AGENTS.md` ou `.codex/skills/**` se mudei convencoes ou arquitetura.
- [ ] Mantive a solucao proporcional ao tamanho do projeto.

## Antes De Entregar

- [ ] Rodei typecheck, lint, testes ou build conforme comandos existentes.
- [ ] Registrei validacoes que nao puderam ser executadas.
- [ ] Listei riscos, tradeoffs e arquivos de governanca alterados.
```
