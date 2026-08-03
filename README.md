# Videochat App Backend

[English](#english) · [Español](#español)

---

<a id="english"></a>

## English

Signaling backend for the Videochat App, built with **Express**, **Socket.IO**, and **TypeScript**. It coordinates room membership and WebRTC negotiation while keeping track of connected usernames in memory.

The server does not process or relay audio and video. It only exchanges the signaling messages required for browsers to create their peer-to-peer WebRTC connections.

### Features

- Room-based Socket.IO connections.
- Username availability validation through an HTTP endpoint.
- Routing of SDP offers and answers between specific users.
- ICE candidate forwarding during WebRTC negotiation.
- Camera and microphone state updates within each room.
- Automatic user removal and disconnection notifications.
- Layered organization with routes, controllers, services, and repositories.
- Unit and integration tests with Vitest and Supertest.

### Tech stack

- [Node.js](https://nodejs.org/) and [TypeScript](https://www.typescriptlang.org/)
- [Express 4](https://expressjs.com/)
- [Socket.IO](https://socket.io/)
- [Vitest](https://vitest.dev/)
- [Supertest](https://github.com/ladjs/supertest)
- [tsx](https://tsx.is/) for development mode

### How it works

When a client joins a room, the server associates its Socket.IO connection ID with its chosen username. It then notifies the other room members so they can begin WebRTC negotiation. Offers, answers, and ICE candidates are routed to the target user's socket; media state updates are broadcast to the room.

```text
Frontend A ──┐                                  ┌── Frontend B
             ├── HTTP + Socket.IO signaling ───┤
Frontend C ──┘                                  └── Frontend D

Audio and video travel directly between peers through WebRTC.
```

Connected users are stored in memory. Restarting the server clears the user registry.

### Prerequisites

- Node.js 20 or later.
- [pnpm](https://pnpm.io/), matching the package manager declared by the project.
- The Videochat App frontend or another compatible Socket.IO client.

### Installation

1. Clone the repository and enter the backend directory:

   ```bash
   git clone <REPOSITORY_URL>
   cd backend/Videochat-App-Backend
   ```

2. Install the dependencies:

   ```bash
   pnpm install
   ```

3. Create a `.env` file in the project root:

   ```env
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ```

The server listens on all network interfaces (`0.0.0.0`). With the example configuration, it is available at `http://localhost:3000`.

### Environment variables

| Variable | Required | Description | Default |
| --- | --- | --- | --- |
| `PORT` | Recommended | Port used by the HTTP and Socket.IO server. | `0` (an available ephemeral port) |
| `FRONTEND_URL` | No | Allowed CORS origin for HTTP and Socket.IO requests. | `*` |
| `NODE_ENV` | No | Set to `test` to prevent the HTTP server from listening during tests. | Not set |

For local development with the provided frontend, use port `3000` and configure its `VITE_BACKEND_URL` as `http://localhost:3000/`.

### HTTP API

#### Health check

```http
GET /ping
```

Returns `200 OK` with the plain-text response `pong`.

#### Check username availability

```http
GET /userExists/:userName
```

Available username — `200 OK`:

```json
{
  "exists": false,
  "message": "This user name can be used!"
}
```

Username already connected — `409 Conflict`:

```json
{
  "exists": true,
  "message": "This user name cannot be used..."
}
```

### Socket.IO events

| Event | Direction | Payload | Purpose |
| --- | --- | --- | --- |
| `join-room` | Client → server | `{ room, userId }` | Join a room and register the username. |
| `user-joined` | Server → room | `{ userId }` | Ask existing participants to start WebRTC negotiation. |
| `offer` | Bidirectional | `{ room, offer, from, to }` | Route an SDP offer to a user. |
| `answer` | Bidirectional | `{ room, answer, from, to }` | Route an SDP answer to a user. |
| `ice-candidate` | Bidirectional | `{ room, candidate, from, to }` | Route an ICE candidate to a user. |
| `media-update` | Bidirectional | `{ room, user, state }` | Broadcast microphone and camera state changes. |
| `remove-user` | Server → clients | `{ user }` | Announce that a user disconnected. |

The `state` object used by `media-update` is expected to follow this shape:

```json
{
  "audio": true,
  "video": true
}
```

### Available scripts

```bash
pnpm dev      # run the server in watch mode with tsx
pnpm test     # run the Vitest test suite in watch mode
pnpm build    # compile TypeScript into dist/
pnpm start    # run the compiled server
```

> The current `start` script points to `dist/app.js`. Because `app.ts` avoids listening when `NODE_ENV=test`, make sure this variable is not set to `test` when starting the server normally.

### Project structure

```text
src/
├── controller/              # HTTP request handlers
├── repositories/            # in-memory user storage
├── routes/                  # Express route definitions
├── services/                # user-related business logic
├── sockets/
│   ├── events/              # individual Socket.IO event handlers
│   └── socketHandler.ts     # event registration
├── tests/                   # unit and HTTP integration tests
├── types/                   # repository, service, and socket contracts
└── app.ts                   # Express, HTTP, and Socket.IO bootstrap
```

`src/index.ts` contains an earlier monolithic implementation. The scripts and tests currently use the modular entry point in `src/app.ts`.

### Testing

Run the test suite with:

```bash
pnpm test
```

The existing tests cover:

- Adding, finding, listing, and removing users from the in-memory repository.
- User service behavior.
- Username availability responses and the `/ping` endpoint.

### Production considerations

- User data is kept in a local `Map`, so it is lost on restart and is not shared across multiple server instances.
- Horizontal scaling requires shared presence storage and a compatible Socket.IO adapter, such as Redis.
- Validate and sanitize HTTP parameters and Socket.IO payloads before exposing the service publicly.
- Restrict `FRONTEND_URL` to the deployed frontend instead of using the `*` fallback.
- Serve production traffic over HTTPS/WSS.
- The backend provides signaling only; reliable WebRTC connectivity on restrictive networks also requires a TURN server configured in the frontend.

### Project status

This is an educational backend focused on WebRTC signaling and real-time event handling. It does not include authentication, persistent storage, rate limiting, or production-grade observability.

---

<a id="español"></a>

## Español

Backend de señalización para Videochat App, desarrollado con **Express**, **Socket.IO** y **TypeScript**. Coordina el acceso a salas y la negociación WebRTC, mientras mantiene en memoria los nombres de los usuarios conectados.

El servidor no procesa ni retransmite el audio o el video. Solamente intercambia los mensajes de señalización necesarios para que los navegadores establezcan sus conexiones WebRTC peer-to-peer.

### Funcionalidades

- Conexiones de Socket.IO organizadas por salas.
- Validación de disponibilidad del nombre de usuario mediante HTTP.
- Enrutamiento de ofertas y respuestas SDP entre usuarios específicos.
- Reenvío de candidatos ICE durante la negociación WebRTC.
- Sincronización del estado de la cámara y el micrófono dentro de cada sala.
- Eliminación automática y notificación cuando un usuario se desconecta.
- Organización por capas con rutas, controladores, servicios y repositorios.
- Pruebas unitarias y de integración con Vitest y Supertest.

### Tecnologías

- [Node.js](https://nodejs.org/) y [TypeScript](https://www.typescriptlang.org/)
- [Express 4](https://expressjs.com/)
- [Socket.IO](https://socket.io/)
- [Vitest](https://vitest.dev/)
- [Supertest](https://github.com/ladjs/supertest)
- [tsx](https://tsx.is/) para el modo de desarrollo

### Cómo funciona

Cuando un cliente entra a una sala, el servidor asocia el ID de su conexión Socket.IO con el nombre de usuario elegido. Luego notifica a los demás integrantes para que comiencen la negociación WebRTC. Las ofertas, respuestas y candidatos ICE se enrutan al socket del destinatario, mientras que los cambios en el estado multimedia se difunden dentro de la sala.

```text
Frontend A ──┐                                   ┌── Frontend B
             ├── señalización HTTP + Socket.IO ──┤
Frontend C ──┘                                   └── Frontend D

El audio y el video viajan directamente entre pares mediante WebRTC.
```

Los usuarios conectados se almacenan en memoria. Al reiniciar el servidor, el registro se pierde.

### Requisitos previos

- Node.js 20 o posterior.
- [pnpm](https://pnpm.io/), coincidiendo con el gestor declarado por el proyecto.
- El frontend de Videochat App u otro cliente Socket.IO compatible.

### Instalación

1. Cloná el repositorio y entrá al directorio del backend:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd backend/Videochat-App-Backend
   ```

2. Instalá las dependencias:

   ```bash
   pnpm install
   ```

3. Creá un archivo `.env` en la raíz del proyecto:

   ```env
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   ```

4. Iniciá el servidor de desarrollo:

   ```bash
   pnpm dev
   ```

El servidor escucha en todas las interfaces de red (`0.0.0.0`). Con la configuración de ejemplo queda disponible en `http://localhost:3000`.

### Variables de entorno

| Variable | Requerida | Descripción | Valor predeterminado |
| --- | --- | --- | --- |
| `PORT` | Recomendada | Puerto utilizado por el servidor HTTP y Socket.IO. | `0` (un puerto efímero disponible) |
| `FRONTEND_URL` | No | Origen permitido por CORS para HTTP y Socket.IO. | `*` |
| `NODE_ENV` | No | Usá `test` para evitar que el servidor HTTP escuche durante las pruebas. | Sin definir |

Para desarrollar localmente con el frontend incluido, usá el puerto `3000` y configurá su `VITE_BACKEND_URL` como `http://localhost:3000/`.

### API HTTP

#### Comprobación de estado

```http
GET /ping
```

Devuelve `200 OK` con la respuesta de texto plano `pong`.

#### Comprobar disponibilidad de usuario

```http
GET /userExists/:userName
```

Nombre disponible — `200 OK`:

```json
{
  "exists": false,
  "message": "This user name can be used!"
}
```

Nombre ya conectado — `409 Conflict`:

```json
{
  "exists": true,
  "message": "This user name cannot be used..."
}
```

### Eventos de Socket.IO

| Evento | Dirección | Datos | Propósito |
| --- | --- | --- | --- |
| `join-room` | Cliente → servidor | `{ room, userId }` | Entrar a una sala y registrar el usuario. |
| `user-joined` | Servidor → sala | `{ userId }` | Solicitar a los participantes existentes que inicien la negociación WebRTC. |
| `offer` | Bidireccional | `{ room, offer, from, to }` | Enrutar una oferta SDP a un usuario. |
| `answer` | Bidireccional | `{ room, answer, from, to }` | Enrutar una respuesta SDP a un usuario. |
| `ice-candidate` | Bidireccional | `{ room, candidate, from, to }` | Enrutar un candidato ICE a un usuario. |
| `media-update` | Bidireccional | `{ room, user, state }` | Difundir cambios del micrófono y la cámara. |
| `remove-user` | Servidor → clientes | `{ user }` | Avisar que un usuario se desconectó. |

El objeto `state` utilizado por `media-update` debe tener esta forma:

```json
{
  "audio": true,
  "video": true
}
```

### Scripts disponibles

```bash
pnpm dev      # ejecutar el servidor en modo watch con tsx
pnpm test     # ejecutar las pruebas de Vitest en modo watch
pnpm build    # compilar TypeScript dentro de dist/
pnpm start    # ejecutar el servidor compilado
```

> El script `start` actual apunta a `dist/app.js`. Como `app.ts` evita escuchar cuando `NODE_ENV=test`, verificá que esta variable no tenga el valor `test` al iniciar el servidor normalmente.

### Estructura del proyecto

```text
src/
├── controller/              # controladores de solicitudes HTTP
├── repositories/            # almacenamiento de usuarios en memoria
├── routes/                  # definición de rutas de Express
├── services/                # lógica de usuarios
├── sockets/
│   ├── events/              # manejadores individuales de Socket.IO
│   └── socketHandler.ts     # registro de eventos
├── tests/                   # pruebas unitarias y de integración HTTP
├── types/                   # contratos de repositorios, servicios y sockets
└── app.ts                   # arranque de Express, HTTP y Socket.IO
```

`src/index.ts` contiene una implementación monolítica anterior. Los scripts y las pruebas actuales utilizan el punto de entrada modular ubicado en `src/app.ts`.

### Pruebas

Ejecutá las pruebas con:

```bash
pnpm test
```

Las pruebas existentes cubren:

- Creación, búsqueda, listado y eliminación de usuarios en el repositorio en memoria.
- Comportamiento del servicio de usuarios.
- Respuestas de disponibilidad de nombres y el endpoint `/ping`.

### Consideraciones para producción

- Los usuarios se guardan en un `Map` local, por lo que se pierden al reiniciar y no se comparten entre múltiples instancias.
- El escalado horizontal requiere un almacenamiento de presencia compartido y un adaptador compatible con Socket.IO, como Redis.
- Validá y sanitizá los parámetros HTTP y los mensajes de Socket.IO antes de exponer el servicio públicamente.
- Restringí `FRONTEND_URL` al frontend desplegado en lugar de utilizar el valor alternativo `*`.
- Serví el tráfico de producción mediante HTTPS/WSS.
- El backend solamente brinda señalización; para conectar WebRTC en redes restrictivas también hace falta configurar un servidor TURN en el frontend.

### Estado del proyecto

Este es un backend educativo centrado en la señalización WebRTC y el manejo de eventos en tiempo real. No incluye autenticación, persistencia de datos, limitación de solicitudes ni observabilidad para producción.
