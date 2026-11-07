package org.example.ebankboot.cntrollers;

import jakarta.servlet.http.HttpSession;
import org.example.ebankboot.agents.EbankAIAgent;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
public class EBankChatbootController {
    private EbankAIAgent ebankAIAgent;

    public EBankChatbootController(EbankAIAgent ebankAIAgent) {
        this.ebankAIAgent = ebankAIAgent;
    }


    @GetMapping("/chat")
    public String chat(@RequestParam("query") String query,
                       @RequestParam(value = "conversationId", required = false) String conversationId,
                       HttpSession session){
        String resolvedConversationId = conversationId != null && !conversationId.isBlank()
                ? conversationId
                : session.getId();
        return ebankAIAgent.chat(query, resolvedConversationId);
    }
    @GetMapping(value = "/chatStream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> chatStream(@RequestParam("query") String query,
                     @RequestParam(value = "conversationId", required = false) String conversationId,
                     HttpSession session){
        String resolvedConversationId = conversationId != null && !conversationId.isBlank()
                ? conversationId
                : session.getId();
        return ebankAIAgent.chatStream(new Prompt(query), resolvedConversationId);
    }
}
