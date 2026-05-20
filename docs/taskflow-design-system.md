# IntelliTasks Design System

Documento de adaptacao do projeto Stitch `TaskFlow Design System` para o IntelliTasks.

## Fontes baixadas

- HTML Dashboard: `docs/stitch/taskflow/html/dashboard.html`
- HTML Lista de tarefas: `docs/stitch/taskflow/html/task-list.html`
- HTML Kanban: `docs/stitch/taskflow/html/kanban.html`
- HTML Calendario: `docs/stitch/taskflow/html/calendar.html`
- Screenshots de referencia: `docs/stitch/taskflow/screenshots/*.png`

## Principios visuais

- Interface escura, densa e profissional, focada em leitura rapida.
- Paleta Teal Trust: Navy como base, Teal para acoes e Mint para destaque positivo.
- Layout com navbar superior e navegacao lateral em desktop.
- Superficies em camadas: fundo Navy, containers em Navy clareado e bordas em Teal profundo.
- Raio conservador: 4px em controles e 8px em cards/modais.
- Interacao por mudanca sutil de Teal/Mint, sem sombras pesadas.

## Tokens principais

| Token | Valor | Uso |
| --- | --- | --- |
| `background` | `#021B2F` | Fundo principal Navy |
| `surface-container-low` | `#03263D` | Sidebar e containers baixos |
| `surface-container` | `#04324B` | Cards e linhas |
| `surface-container-high` | `#06415B` | Hover e destaque |
| `surface-container-highest` | `#075269` | Camada mais alta |
| `outline-variant` | `#0B5F6F` | Bordas discretas |
| `outline` | `#5AB8B6` | Bordas/indicadores secundarios |
| `primary-container` | `#028090` | Acoes primarias em Teal |
| `primary` | `#02C39A` | Texto/acento ativo em Mint |
| `secondary` | `#02C39A` | Informacao e status em andamento |
| `tertiary` | `#02C39A` | Pendencias e indicadores de atencao |
| `on-surface` | `#E8FFFA` | Texto principal |
| `on-surface-variant` | `#A7D8D2` | Texto secundario |

## Tipografia

- Fonte base: Inter, com fallback para Arial/Helvetica.
- Titulos: peso 700, tamanhos moderados.
- Tabelas e cards: `text-sm` e `text-xs` para manter densidade.
- Sem escala por viewport; texto deve manter previsibilidade.

## Componentes adaptados

- Navbar superior: marca, links de navegacao e login/registro.
- Sidebar: navegacao de produto com item ativo em Teal e borda Mint.
- Cards de metrica: fundo em camada, borda sutil e numero destacado.
- Tabela de tarefas: divisores horizontais, status em pill e categoria com marcador colorido.
- Kanban: colunas por status e cards densos.
- Calendario: grade mensal com tarefas posicionadas por dia de vencimento.

## Rotas implementadas no app

- `/`: painel principal.
- `/tarefas`: lista tabular de tarefas.
- `/kanban`: quadro por status.
- `/calendario`: calendario mensal.

O design system nao deve aparecer como secao navegavel no app. Este documento e os arquivos em `docs/stitch/taskflow/` sao referencias internas de implementacao.
