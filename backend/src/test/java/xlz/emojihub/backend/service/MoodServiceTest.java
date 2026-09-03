package xlz.emojihub.backend.service;

import org.junit.jupiter.api.Test;
import xlz.emojihub.backend.dto.EmojiDto;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class MoodServiceTest {
    @Test
    void matchesByDisplayNameCaseInsensitive() {
        List<EmojiDto> all = List.of(
                new EmojiDto("grinning-face-smileys", "grinning face", "grinning face", "smileys and people", "face-positive", "\uD83D\uDE00", "U+1F600")
        );

        List<EmojiDto> result = MoodService.matchNamesToEmojis(List.of("Grinning Face"), all);

        assertEquals(1, result.size());
        assertEquals("grinning-face-smileys", result.getFirst().slug());
    }

    @Test
    void unknownNameIsSilentlyDropped() {
        List<EmojiDto> all = List.of(
                new EmojiDto("grinning-face-smileys", "grinning face", "grinning face", "smileys and people", "face-positive", "\uD83D\uDE00", "U+1F600")
        );

        List<EmojiDto> result = MoodService.matchNamesToEmojis(List.of("some made up emoji name"), all);

        assertTrue(result.isEmpty());
    }

    @Test
    void collisionReturnsBothEmojisWithSameDisplayName() {
        List<EmojiDto> all = List.of(
                new EmojiDto("turkey-animals-and-nature", "turkey", "turkey", "animals and nature", "bird", "\uD83E\uDD83", "U+1F983"),
                new EmojiDto("turkey-flags", "turkey", "turkey", "flags", "country-flag", "\uD83C\uDDF9\uD83C\uDDF7", "U+1F1F9 U+1F1F7")
        );

        List<EmojiDto> result = MoodService.matchNamesToEmojis(List.of("turkey"), all);

        assertEquals(2, result.size());
    }

    @Test
    void duplicateNamesFromModelAreDeduped() {
        List<EmojiDto> all = List.of(
                new EmojiDto("fire-nature", "fire", "fire", "animals and nature", "elements", "\uD83D\uDD25", "U+1F525")
        );

        List<EmojiDto> result = MoodService.matchNamesToEmojis(List.of("fire", "Fire", " fire "), all);

        assertEquals(1, result.size());
    }
}