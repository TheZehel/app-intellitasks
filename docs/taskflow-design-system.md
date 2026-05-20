# TaskFlow Design System

Documento de adaptacao do projeto Stitch `TaskFlow Design System` para o IntelliTasks.

## Fontes baixadas

- HTML Dashboard: `docs/stitch/taskflow/html/dashboard.html`
- HTML Lista de tarefas: `docs/stitch/taskflow/html/task-list.html`
- HTML Kanban: `docs/stitch/taskflow/html/kanban.html`
- HTML Calendario: `docs/stitch/taskflow/html/calendar.html`
- Screenshots de referencia: `docs/stitch/taskflow/screenshots/*.png`

## Principios visuais

- Interface escura, densa e profissional, focada em leitura rapida.
- Layout com navbar superior e navegacao lateral em desktop.
- Superficies em camadas: fundo escuro, containers levemente mais claros e bordas discretas.
- Raio conservador: 4px em controles e 8px em cards/modais.
- Interacao por mudanca sutil de cor, sem sombras pesadas.

## Tokens principais

| Token | Valor | Uso |
| --- | --- | --- |
| `background` | `#13121b` | Fundo principal |
| `surface-container-low` | `#1b1b24` | Sidebar e containers baixos |
| `surface-container` | `#1f1f28` | Cards e linhas |
| `surface-container-high` | `#2a2933` | Hover e destaque |
| `outline-variant` | `#464555` | Bordas discretas |
| `primary-container` | `#4f46e5` | Acoes primarias |
| `primary` | `#c3c0ff` | Texto/acento ativo |
| `secondary` | `#89ceff` | Informacao e status em andamento |
| `tertiary` | `#ffb695` | Avisos e pendencias |
| `on-surface` | `#e4e1ee` | Texto principal |
| `on-surface-variant` | `#c7c4d8` | Texto secundario |

## Tipografia

- Fonte base: Inter, com fallback para Arial/Helvetica.
- Titulos: peso 700, tamanhos moderados.
- Tabelas e cards: `text-sm` e `text-xs` para manter densidade.
- Sem escala por viewport; texto deve manter previsibilidade.

## Componentes adaptados

- Navbar superior: marca, links de navegacao e login/registro.
- Sidebar: navegacao de produto com item ativo em fundo azul claro e borda esquerda.
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
