package xlz.emojihub.backend.service;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import xlz.emojihub.backend.dto.EmojiDto;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class EmojiHubClient {
    private static final Pattern NUMERIC_ENTITY = Pattern.compile("&#(\\d+);");
    private static final Pattern NON_ALPHANUMERIC = Pattern.compile("[^a-z0-9]+");
    private static final Pattern EDGE_DASHES = Pattern.compile("^-+|-+$");

    private final RestClient emojiHubRestClient;

    public EmojiHubClient(RestClient emojiHubRestClient) {
        this.emojiHubRestClient = emojiHubRestClient;
    }

    @Cacheable("emojiList")
    public List<EmojiDto> getAllEmojis() {
        List<EmojiHubApiEmoji> raw = emojiHubRestClient.get()
                                                       .uri("/all")
                                                       .retrieve()
                                                       .body(new ParameterizedTypeReference<List<EmojiHubApiEmoji>>() {});
        return mapToDtos(raw);
    }

    static List<EmojiDto> mapToDtos(List<EmojiHubApiEmoji> raw) {
        Set<String> usedSlugs = new HashSet<>();
        List<EmojiDto> result = new ArrayList<>(raw.size());
        for (EmojiHubApiEmoji item : raw) {
            String slug = uniqueSlug(item.name(), item.category(), usedSlugs);
            String emoji = decodeHtmlCodes(item.htmlCode());
            String unicode = String.join(" ", item.unicode());
            result.add(new EmojiDto(slug, item.name(), item.category(), item.group(), emoji, unicode));
        }
        return result;
    }

    private static String uniqueSlug(String name, String category, Set<String> usedSlugs) {
        String base = slugify(name) + "-" + slugify(category);
        String candidate = base;
        int suffix = 2;
        while (!usedSlugs.add(candidate)) {
            candidate = base + "-" + suffix;
            suffix++;
        }
        return candidate;
    }

    private static String slugify(String value) {
        String lower = value.toLowerCase(Locale.ROOT);
        String replaced = NON_ALPHANUMERIC.matcher(lower).replaceAll("-");
        return EDGE_DASHES.matcher(replaced).replaceAll("");
    }

    private static String decodeHtmlCodes(List<String> htmlCodes) {
        StringBuilder sb = new StringBuilder();
        for (String code : htmlCodes) {
            Matcher matcher = NUMERIC_ENTITY.matcher(code);
            if (matcher.matches()) {
                sb.appendCodePoint(Integer.parseInt(matcher.group(1)));
            }
        }
        return sb.toString();
    }
}