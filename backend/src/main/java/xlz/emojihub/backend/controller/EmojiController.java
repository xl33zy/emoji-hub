package xlz.emojihub.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import xlz.emojihub.backend.dto.EmojiDto;
import xlz.emojihub.backend.service.EmojiService;
import java.util.List;

@RestController
public class EmojiController {
    private final EmojiService emojiService;

    public EmojiController(EmojiService emojiService) {
        this.emojiService = emojiService;
    }

    @GetMapping("/api/emojis")
    public List<EmojiDto> getEmojis(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String sort
    ) {
        return emojiService.findEmojis(search, category, sort);
    }

    @GetMapping("/api/categories")
    public List<String> getCategories() {
        return emojiService.getCategories();
    }
}