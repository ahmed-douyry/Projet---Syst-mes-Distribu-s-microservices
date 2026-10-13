package org.example.ebankboot.cntrollers;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EBankChatbootController {
    private ChatClient chatClient;

    public EBankChatbootController(ChatClient.Builder chatClient) {
        this.chatClient = chatClient.build();
    }
    @GetMapping("/chat")
    public String chat(@RequestParam("query") String query){
        return chatClient.prompt(query).call().content();
    }
}
