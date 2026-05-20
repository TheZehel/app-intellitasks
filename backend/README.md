# IntelliTasks Java MVC Backend

Backend Java 17 sem dependencias externas, criado para demonstrar uma arquitetura MVC/POO no mesmo repositorio do frontend Next.js.

## Camadas

- `model`: entidades e enums de dominio.
- `repository`: persistencia em memoria para execucao local.
- `service`: regras de negocio.
- `controller`: endpoints REST.
- `http`: servidor, roteamento, CORS, cookies e JSON.

## Executar

```bash
./backend/scripts/dev.sh
```

O servidor sobe em:

```text
http://localhost:8080
```

## Integrar com o Next.js

Para fazer os componentes client-side do Next enviarem chamadas para o backend Java:

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:8080"
```

Sem essa variavel, o frontend continua usando as API Routes atuais do Next em `/api`.

## Endpoints principais

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `POST /api/auth/logout-all`
- `GET /api/categories`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/{id}`
- `DELETE /api/tasks/{id}`
- `PATCH /api/tasks/{id}/toggle`
- `PATCH /api/profile`
- `POST /api/profile/password`
- `GET /api/users`
- `PATCH /api/users/{id}`
