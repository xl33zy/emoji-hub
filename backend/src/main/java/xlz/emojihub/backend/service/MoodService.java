package xlz.emojihub.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.server.ResponseStatusException;
import xlz.emojihub.backend.dto.EmojiDto;
import xlz.emojihub.backend.dto.MoodDto;
import xlz.emojihub.backend.dto.MoodMatchResponseDto;
import xlz.emojihub.backend.dto.MoodMatchResultDto;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
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
        try {
            String mood = geminiClient.describeMood(emoji.displayName(), emoji.emoji());
            return new MoodDto(mood);
        } catch (ResourceAccessException | HttpServerErrorException e) {
            log.warn("Gemini unavailable while describing mood for slug={}: {}", slug, e.getMessage());
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Mood description is temporarily unavailable, please try again shortly", e);
        }
    }

    public MoodMatchResponseDto matchMood(String text) {
        if (text == null || text.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "text must not be blank");
        }
        if (text.length() > 300) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "text must be at most 300 characters");
        }

        List<MoodMatchSuggestion> suggestions;
        try {
            suggestions = geminiClient.findMoodMatches(text, emojiService.getCategories());
        } catch (ResourceAccessException | HttpServerErrorException e) {
            log.warn("Gemini unavailable while matching mood: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Mood matching is temporarily unavailable, please try again shortly", e);
        }

        List<MoodMatchResultDto> matches = matchSuggestionsToEmojis(suggestions, emojiService.getAll());
        return new MoodMatchResponseDto(matches);
    }

    static List<MoodMatchResultDto> matchSuggestionsToEmojis(List<MoodMatchSuggestion> suggestions, List<EmojiDto> allEmojis) {
        Map<String, List<EmojiDto>> byDisplayName = allEmojis.stream()
                                                             .collect(Collectors.groupingBy(e -> e.displayName().toLowerCase(Locale.ROOT)));
        Map<String, MoodMatchResultDto> matches = new LinkedHashMap<>();
        for (MoodMatchSuggestion suggestion : suggestions) {
            List<EmojiDto> found = byDisplayName.get(suggestion.name().trim().toLowerCase(Locale.ROOT));
            if (found != null) {
                for (EmojiDto emoji : found) {
                    matches.putIfAbsent(emoji.slug(), new MoodMatchResultDto(emoji, suggestion.reason()));
                }
            }
        }
        return new ArrayList<>(matches.values());
    }
}