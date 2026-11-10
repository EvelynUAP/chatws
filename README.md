# Chat WebSocket - Guía para Alumnos

Este proyecto implementa un sistema de chat en tiempo real utilizando **WebSocket** y el protocolo **STOMP** con Spring Boot. A continuación se explica el flujo completo de funcionamiento y los conceptos clave.

## 📝 Descripción del Proyecto

ChatWS es una aplicación de chat en tiempo real que permite a múltiples usuarios conectarse, enviar mensajes y recibir actualizaciones instantáneas sin necesidad de recargar la página. Utiliza una arquitectura basada en eventos donde los mensajes se propagan automáticamente a todos los clientes conectados.

**Tecnologías principales:**
- Spring Boot 4.1.1
- WebSocket para comunicación bidireccional
- STOMP como protocolo de mensajería
- SockJS para compatibilidad con navegadores antiguos
- Jackson para serialización JSON

---

## 🏗️ Arquitectura y Flujo

### Diagrama de Arquitectura

```
┌─────────────────┐         WebSocket          ┌──────────────────┐
│   Cliente Web   │ ◄──────── WebSocket ─────► │   Servidor       │
│  (Navegador)    │                            │   Spring Boot    │
└─────────────────┘                            └────────┬─────────┘
                                                        │ STOMP relay
                                                        ▼
                                               ┌──────────────────┐
                                               │    RabbitMQ       │
                                               │  (STOMP plugin)   │
                                               └──────────────────┘
       │                                                 │
       │ 1. Conexión WebSocket                          │
       │ 2. Suscripción a /topic/public                 │
       │ 3. Envío a /app/chat.sendMessage               │
       │                                                 │
       │                                                 │
       │ 4. Recepción de mensajes                       │
       │    (broadcast desde /topic/public)             │
```

### Flujo Completo de un Mensaje

1. **Conexión:** El cliente web establece una conexión WebSocket con el servidor
2. **Suscripción:** El cliente se suscribe al canal `/topic/public` para recibir mensajes
3. **Envío:** El cliente envía un mensaje a `/app/chat.sendMessage`
4. **Procesamiento:** El `ChatController` recibe el mensaje
5. **Broadcast:** El mensaje se reenvía a todos los suscriptores de `/topic/public`
6. **Recepción:** Todos los clientes conectados reciben el mensaje simultáneamente

## RabbitMQ

El broker STOMP del chat se delega a RabbitMQ mediante `enableStompBrokerRelay`.
Para ejecutar la aplicación se necesita RabbitMQ en `localhost:5672`, con el
plugin STOMP habilitado en `localhost:61613`:

```bash
rabbitmq-plugins enable rabbitmq_stomp
```

Las credenciales por defecto configuradas son `guest` / `guest`. Se pueden
reemplazar mediante las variables `RABBITMQ_HOST`, `RABBITMQ_PORT`,
`RABBITMQ_USERNAME` y `RABBITMQ_PASSWORD`.

### Ejecutar con Docker

Con Docker Desktop iniciado, levantar RabbitMQ:

```bash
docker compose up -d
```

Luego iniciar la aplicación:

```bash
./mvnw spring-boot:run
```

En Windows también se puede utilizar:

```powershell
.\mvnw.cmd spring-boot:run
```

Abrir `http://localhost:8080`. La consola de administración de RabbitMQ queda
disponible en `http://localhost:15672` con `guest` / `guest`.

Para detener RabbitMQ:

```bash
docker compose down
```
