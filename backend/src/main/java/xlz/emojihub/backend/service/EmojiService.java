package xlz.emojihub.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import xlz.emojihub.backend.dto.EmojiDto;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class EmojiService {
    private final EmojiHubClient emojiHubClient;

    public EmojiService(EmojiHubClient emojiHubClient) {
        this.emojiHubClient = emojiHubClient;
    }

    public List<EmojiDto> findEmojis(String search, String category, String sort) {
        List<EmojiDto> emojis = emojiHubClient.getAllEmojis();

        if (search != null && !search.isBlank()) {
            String needle = search.toLowerCase(Locale.ROOT);
            emojis = emojis.stream()
                           .filter(e -> e.name().toLowerCase(Locale.ROOT).contains(needle))
                           .toList();
        }

        if (category != null && !category.isBlank()) {
            emojis = emojis.stream()
                           .filter(e -> e.category().equalsIgnoreCase(category))
                           .toList();
        }

        Comparator<EmojiDto> comparator = "category".equalsIgnoreCase(sort)
                ? Comparator.comparing(EmojiDto::category).thenComparing(EmojiDto::name)
                : Comparator.comparing(EmojiDto::name);

        return emojis.stream().sorted(comparator).toList();
    }

    public EmojiDto findBySlug(String slug) {
        return emojiHubClient.getAllEmojis().stream()
                             .filter(e -> e.slug().equals(slug))
                             .findFirst()
                             .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Emoji not found: " + slug));
    }

    public EmojiDto getRandom() {
        List<EmojiDto> emojis = emojiHubClient.getAllEmojis();
        int index = ThreadLocalRandom.current().nextInt(emojis.size());
        return emojis.get(index);
    }

    public List<String> getCategories() {
        return emojiHubClient.getAllEmojis().stream()
                             .map(EmojiDto::category)
                             .distinct()
                             .sorted()
                             .toList();
    }
}