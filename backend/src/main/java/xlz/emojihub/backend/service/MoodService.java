package xlz.emojihub.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import xlz.emojihub.backend.dto.EmojiDto;
import xlz.emojihub.backend.dto.MoodDto;
import xlz.emojihub.backend.dto.MoodMatchResponseDto;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

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

    public MoodMatchResponseDto matchMood(String text) {
        if (text == null || text.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "text must not be blank");
        }
        if (text.length() > 300) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "text must be at most 300 characters");
        }

        List<String> names = geminiClient.findMoodMatchNames(text, emojiService.getCategories());
        List<EmojiDto> matches = matchNamesToEmojis(names, emojiService.getAll());
        return new MoodMatchResponseDto(matches);
    }

    static List<EmojiDto> matchNamesToEmojis(List<String> names, List<EmojiDto> allEmojis) {
        Map<String, List<EmojiDto>> byDisplayName = allEmojis.stream()
                                                             .collect(Collectors.groupingBy(e -> e.displayName().toLowerCase(Locale.ROOT)));
        Map<String, EmojiDto> matches = new LinkedHashMap<>();
        for (String name : names) {
            List<EmojiDto> found = byDisplayName.get(name.trim().toLowerCase(Locale.ROOT));
            if (found != null) {
                for (EmojiDto emoji : found) {
                    matches.putIfAbsent(emoji.slug(), emoji);
                }
            }
        }
        return new ArrayList<>(matches.values());
    }
}