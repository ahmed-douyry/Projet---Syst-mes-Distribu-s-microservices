package discord;

import com.zgamelogic.discord.annotations.DiscordController;
import com.zgamelogic.discord.annotations.DiscordMapping;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import org.example.ebankboot.agents.EbankAIAgent;

@DiscordController
public class DiscordBot {
    private EbankAIAgent ebankAIAgent ;

    public DiscordBot(EbankAIAgent ebankAIAgent) {
        this.ebankAIAgent = ebankAIAgent;
    }

    @DiscordMapping
    private void perform(MessageReceivedEvent event) {
        if (event.getAuthor().isBot()) return;

        String query = event.getMessage().getContentRaw();
        String conversation_id = event.getAuthor().getId();
        String response = ebankAIAgent.chat(query, conversation_id);
        event.getChannel().sendMessage(response).queue();
    }

}
