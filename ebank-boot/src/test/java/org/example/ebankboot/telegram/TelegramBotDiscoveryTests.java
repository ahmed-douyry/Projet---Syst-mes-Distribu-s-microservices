package org.example.ebankboot.telegram;

import org.example.ebankboot.EbankBootApplication;
import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;

import static org.junit.jupiter.api.Assertions.assertTrue;

class TelegramBotDiscoveryTests {

    @Test
    void applicationComponentScanFindsTelegramBot() {
        var scanner = new ClassPathScanningCandidateComponentProvider(true);

        var components = scanner.findCandidateComponents(EbankBootApplication.class.getPackageName());

        assertTrue(components.stream().anyMatch(component ->
                TelegramBot.class.getName().equals(component.getBeanClassName())),
                "Telegram bot must be discovered by the application's default component scan");
    }
}
