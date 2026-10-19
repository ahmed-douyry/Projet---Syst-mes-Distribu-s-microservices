package org.example.ebankboot.cntrollers;

import jakarta.servlet.http.HttpSession;
import org.example.ebankboot.agents.EbankAIAgent;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
}
