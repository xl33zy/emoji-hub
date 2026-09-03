package xlz.emojihub.backend.dto;

import java.util.List;

public record MoodMatchResponseDto(List<EmojiDto> matches) {
}