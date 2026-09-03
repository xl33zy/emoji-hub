package xlz.emojihub.backend.service;

import org.junit.jupiter.api.Test;
import xlz.emojihub.backend.dto.EmojiDto;
import xlz.emojihub.backend.dto.MoodMatchResultDto;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class MoodServiceTest {
    @Test
    void matchesByDisplayNameCaseInsensitive() {
        List<EmojiDto> all = List.of(
                new EmojiDto("grinning-face-smileys", "grinning face", "grinning face", "smileys and people", "face-positive", "\uD83D\uDE00", "U+1F600")
        );

        List<MoodMatchResultDto> result = MoodService.matchSuggestionsToEmojis(
                List.of(new MoodMatchSuggestion("Grinning Face", "a cheerful greeting")), all);

        assertEquals(1, result.size());
        assertEquals("grinning-face-smileys", result.getFirst().emoji().slug());
        assertEquals("a cheerful greeting", result.getFirst().reason());
    }

    @Test
    void unknownNameIsSilentlyDropped() {
        List<EmojiDto> all = List.of(
                new EmojiDto("grinning-face-smileys", "grinning face", "grinning face", "smileys and people", "face-positive", "\uD83D\uDE00", "U+1F600")
        );

        List<MoodMatchResultDto> result = MoodService.matchSuggestionsToEmojis(
                List.of(new MoodMatchSuggestion("some made up emoji name", "n/a")), all);

        assertTrue(result.isEmpty());
    }

    @Test
    void collisionReturnsBothEmojisWithSameDisplayName() {
        List<EmojiDto> all = List.of(
                new EmojiDto("turkey-animals-and-nature", "turkey", "turkey", "animals and nature", "bird", "\uD83E\uDD83", "U+1F983"),
                new EmojiDto("turkey-flags", "turkey", "turkey", "flags", "country-flag", "\uD83C\uDDF9\uD83C\uDDF7", "U+1F1F9 U+1F1F7")
        );

        List<MoodMatchResultDto> result = MoodService.matchSuggestionsToEmojis(
                List.of(new MoodMatchSuggestion("turkey", "n/a")), all);

        assertEquals(2, result.size());
    }

    @Test
    void duplicateNamesFromModelAreDeduped() {
        List<EmojiDto> all = List.of(
                new EmojiDto("fire-nature", "fire", "fire", "animals and nature", "elements", "\uD83D\uDD25", "U+1F525")
        );

        List<MoodMatchResultDto> result = MoodService.matchSuggestionsToEmojis(
                List.of(new MoodMatchSuggestion("fire", "first"), new MoodMatchSuggestion("Fire", "second"), new MoodMatchSuggestion(" fire ", "third")),
                all);

        assertEquals(1, result.size());
        assertEquals("first", result.getFirst().reason());
    }
}