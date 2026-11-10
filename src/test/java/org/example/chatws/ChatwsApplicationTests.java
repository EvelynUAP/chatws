package org.example.chatws;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = "chat.rabbitmq.enabled=false")
class ChatwsApplicationTests {

    @Test
    void contextLoads() {
    }

}
