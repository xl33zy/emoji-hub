package xlz.emojihub.backend.service;

import org.springframework.stereotype.Service;
import xlz.emojihub.backend.dto.EmojiDto;
import xlz.emojihub.backend.dto.MoodDto;

@Service
public class MoodService {
    private final EmojiService emojiService;
    private final GeminiClient geminiClient;

    public MoodService(EmojiService emojiService, GeminiClient geminiClient) {
        this.emojiService = emojiService;
        this.geminiClient = geminiClient;
    }

    public MoodDto getMood(String slug) {
        EmojiDto emoji = emojiService.findBySlug(slug);
        String mood = geminiClient.describeMood(emoji.displayName(), emoji.emoji());
        return new MoodDto(mood);
    }
}