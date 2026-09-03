package xlz.emojihub.backend.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.server.ResponseStatusException;
import xlz.emojihub.backend.dto.EmojiDto;
import xlz.emojihub.backend.dto.MoodMatchResultDto;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MoodServiceTest {
    @Mock
    private EmojiService emojiService;
    @Mock
    private GeminiClient geminiClient;

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

    @Test
    void getMoodThrows503WhenGeminiUnavailable() {
        EmojiDto emoji = new EmojiDto("grinning-face-smileys", "grinning face", "grinning face",
                "smileys and people", "face-positive", "\uD83D\uDE00", "U+1F600");
        when(emojiService.findBySlug("grinning-face-smileys")).thenReturn(emoji);
        when(geminiClient.describeMood("grinning face", "\uD83D\uDE00"))
                .thenThrow(new ResourceAccessException("read timed out"));

        MoodService service = new MoodService(emojiService, geminiClient);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.getMood("grinning-face-smileys"));
        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, ex.getStatusCode());
    }

    @Test
    void matchMoodThrows503WhenGeminiUnavailable() {
        when(emojiService.getCategories()).thenReturn(List.of("smileys and people"));
        when(geminiClient.findMoodMatches("stressed", List.of("smileys and people")))
                .thenThrow(new HttpServerErrorException(HttpStatus.BAD_GATEWAY));

        MoodService service = new MoodService(emojiService, geminiClient);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.matchMood("stressed"));
        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, ex.getStatusCode());
    }
}