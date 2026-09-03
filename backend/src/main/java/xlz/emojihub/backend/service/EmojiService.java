package xlz.emojihub.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;
import xlz.emojihub.backend.dto.EmojiDto;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.ThreadLocalRandom;

@Slf4j
@Service
public class EmojiService {
    private final EmojiHubClient emojiHubClient;

    private volatile List<EmojiDto> lastKnownGood;

    public EmojiService(EmojiHubClient emojiHubClient) {
        this.emojiHubClient = emojiHubClient;
    }

    private List<EmojiDto> allEmojis() {
        try {
            List<EmojiDto> emojis = emojiHubClient.getAllEmojis();
            lastKnownGood = emojis;
            return emojis;
        } catch (HttpClientErrorException e) {
            throw e;
        } catch (RestClientException e) {
            List<EmojiDto> fallback = lastKnownGood;
            if (fallback != null) {
                log.warn("EmojiHub unavailable, serving last known good snapshot ({} items): {}",
                        fallback.size(), e.getMessage());
                return fallback;
            }
            log.error("EmojiHub unavailable and no cached snapshot exists (cold start): {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Emoji catalog is temporarily unavailable, please try again shortly", e);
        }
    }

    public List<EmojiDto> findEmojis(String search, String category, String sort) {
        List<EmojiDto> emojis = allEmojis();

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
        return allEmojis().stream()
                          .filter(e -> e.slug().equals(slug))
                          .findFirst()
                          .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Emoji not found: " + slug));
    }

    public EmojiDto getRandom() {
        List<EmojiDto> emojis = allEmojis();
        int index = ThreadLocalRandom.current().nextInt(emojis.size());
        return emojis.get(index);
    }

    public List<String> getCategories() {
        return allEmojis().stream()
                          .map(EmojiDto::category)
                          .distinct()
                          .sorted()
                          .toList();
    }

    public List<EmojiDto> getAll() {
        return allEmojis();
    }
}