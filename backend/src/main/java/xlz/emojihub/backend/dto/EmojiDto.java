package xlz.emojihub.backend.dto;

public record EmojiDto(
        String slug,
        String name,
        String category,
        String group,
        String emoji,
        String unicode
) {
}