package xlz.emojihub.backend.service;

import org.junit.jupiter.api.Test;
import xlz.emojihub.backend.dto.EmojiDto;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;

class EmojiHubClientTest {
    @Test
    void decodesSingleHtmlCodeToEmoji() {
        EmojiHubApiEmoji raw = new EmojiHubApiEmoji(
                "grinning face", "smileys and people", "face positive",
                List.of("&#128512;"), List.of("U+1F600"));

        List<EmojiDto> result = EmojiHubClient.mapToDtos(List.of(raw));

        assertThat(result).hasSize(1);
        EmojiDto dto = result.get(0);
        assertThat(dto.emoji()).isEqualTo("😀");
        assertThat(dto.unicode()).isEqualTo("U+1F600");
        assertThat(dto.slug()).isEqualTo("grinning-face-smileys-and-people");
    }

    @Test
    void decodesMultipleHtmlCodesInOrder() {
        EmojiHubApiEmoji raw = new EmojiHubApiEmoji(
                "boy, type-1-2", "smileys and people", "person",
                List.of("&#128102;", "&#127995;"), List.of("U+1F466", "U+1F3FB"));

        EmojiDto dto = EmojiHubClient.mapToDtos(List.of(raw)).get(0);

        assertThat(dto.emoji()).isEqualTo("👦🏻");
        assertThat(dto.unicode()).isEqualTo("U+1F466 U+1F3FB");
    }

    @Test
    void generatesUniqueSlugsWhenNameAndCategoryCollide() {
        EmojiHubApiEmoji first = new EmojiHubApiEmoji(
                "turkey", "flags", "flags",
                List.of("&#127481;", "&#127479;"), List.of("U+1F1F9", "U+1F1F7"));
        EmojiHubApiEmoji duplicate = new EmojiHubApiEmoji(
                "turkey", "flags", "flags",
                List.of("&#127481;", "&#127479;"), List.of("U+1F1F9", "U+1F1F7"));

        List<EmojiDto> result = EmojiHubClient.mapToDtos(List.of(first, duplicate));

        assertThat(result).extracting(EmojiDto::slug)
                          .containsExactly("turkey-flags", "turkey-flags-2");
    }

    @Test
    void slugifyStripsNonAlphanumericCharacters() {
        EmojiHubApiEmoji raw = new EmojiHubApiEmoji(
                "airplane arriving \u224a airplane arrival", "travel and places", "travel and places",
                List.of("&#128747;"), List.of("U+1F6EC"));

        String slug = EmojiHubClient.mapToDtos(List.of(raw)).get(0).slug();

        assertThat(slug).isEqualTo("airplane-arriving-airplane-arrival-travel-and-places");
    }

    @Test
    void splitsDisplayNameFromAlternativeName() {
        EmojiHubApiEmoji raw = new EmojiHubApiEmoji(
                "aubergine \u224a eggplant", "food and drink", "food vegetable",
                List.of("&#127814;"), List.of("U+1F346"));
        EmojiDto dto = EmojiHubClient.mapToDtos(List.of(raw)).get(0);
        assertThat(dto.displayName()).isEqualTo("eggplant");
        assertThat(dto.name()).isEqualTo("aubergine \u224a eggplant");
    }

    @Test
    void displayNameEqualsNameWhenNoAlternative() {
        EmojiHubApiEmoji raw = new EmojiHubApiEmoji(
                "grinning face", "smileys and people", "face positive",
                List.of("&#128512;"), List.of("U+1F600"));
        EmojiDto dto = EmojiHubClient.mapToDtos(List.of(raw)).get(0);
        assertThat(dto.displayName()).isEqualTo("grinning face");
    }
}