package org.example.chatws.controller;

import org.example.chatws.entity.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Controller
public class ChatController {
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage enviarMensaje(ChatMessage mensaje) {
        logger.debug("Mensaje recibido en servidor: {}", mensaje);
        return mensaje;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage agregarUsuario(ChatMessage mensaje) {
        logger.debug("Usuario conectado: {}", mensaje.usuario());
        return mensaje;
    }
}
