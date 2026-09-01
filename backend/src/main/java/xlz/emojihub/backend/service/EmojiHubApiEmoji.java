package xlz.emojihub.backend.service;

import java.util.List;

record EmojiHubApiEmoji(
        String name,
        String category,
        String group,
        List<String> htmlCode,
        List<String> unicode
) {
}