package xlz.emojihub.backend.dto;

public record EmojiDto(
        String slug,
        String name,
        String displayName,
        String category,
        String group,
        String emoji,
        String unicode
) {
}