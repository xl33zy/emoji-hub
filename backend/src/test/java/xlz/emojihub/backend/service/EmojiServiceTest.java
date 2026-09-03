package xlz.emojihub.backend.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import xlz.emojihub.backend.dto.EmojiDto;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmojiServiceTest {
    @Mock
    private EmojiHubClient emojiHubClient;

    private static EmojiDto sampleEmoji(String slug) {
        return new EmojiDto(slug, "grinning face", "grinning face", "smileys and people", "face positive", "\uD83D\uDE00", "U+1F600");
    }

    @Test
    void returnsFreshDataOnSuccess() {
        List<EmojiDto> emojis = List.of(sampleEmoji("grinning-face-smileys-and-people"));
        when(emojiHubClient.getAllEmojis()).thenReturn(emojis);

        EmojiService service = new EmojiService(emojiHubClient);

        assertThat(service.getAll()).isEqualTo(emojis);
    }

    @Test
    void fallsBackToLastKnownGoodOnResourceAccessException() {
        List<EmojiDto> emojis = List.of(sampleEmoji("grinning-face-smileys-and-people"));
        when(emojiHubClient.getAllEmojis())
                .thenReturn(emojis)
                .thenThrow(new ResourceAccessException("connect timed out"));

        EmojiService service = new EmojiService(emojiHubClient);

        assertThat(service.getAll()).isEqualTo(emojis);
        assertThat(service.getAll()).isEqualTo(emojis);
    }

    @Test
    void fallsBackToLastKnownGoodOnServerError() {
        List<EmojiDto> emojis = List.of(sampleEmoji("grinning-face-smileys-and-people"));
        when(emojiHubClient.getAllEmojis())
                .thenReturn(emojis)
                .thenThrow(new HttpServerErrorException(HttpStatus.BAD_GATEWAY));

        EmojiService service = new EmojiService(emojiHubClient);

        assertThat(service.getAll()).isEqualTo(emojis);
        assertThat(service.getAll()).isEqualTo(emojis);
    }

    @Test
    void fallsBackToLastKnownGoodOnGenericRestClientException() {
        List<EmojiDto> emojis = List.of(sampleEmoji("grinning-face-smileys-and-people"));
        when(emojiHubClient.getAllEmojis())
                .thenReturn(emojis)
                .thenThrow(new RestClientException("Error while extracting response", new java.io.IOException("closed")));

        EmojiService service = new EmojiService(emojiHubClient);

        assertThat(service.getAll()).isEqualTo(emojis);
        assertThat(service.getAll()).isEqualTo(emojis);
    }

    @Test
    void throws503WhenNoSnapshotExistsYet() {
        when(emojiHubClient.getAllEmojis()).thenThrow(new ResourceAccessException("connect timed out"));

        EmojiService service = new EmojiService(emojiHubClient);

        assertThatThrownBy(service::getAll)
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode())
                        .isEqualTo(HttpStatus.SERVICE_UNAVAILABLE));
    }

    @Test
    void doesNotFallBackOnClientErrors() {
        List<EmojiDto> emojis = List.of(sampleEmoji("grinning-face-smileys-and-people"));
        HttpClientErrorException notFound = HttpClientErrorException.create(
                HttpStatus.NOT_FOUND, "Not Found", null, new byte[0], null);
        when(emojiHubClient.getAllEmojis())
                .thenReturn(emojis)
                .thenThrow(notFound);

        EmojiService service = new EmojiService(emojiHubClient);

        assertThat(service.getAll()).isEqualTo(emojis);
        assertThatThrownBy(service::getAll).isSameAs(notFound);
    }
}