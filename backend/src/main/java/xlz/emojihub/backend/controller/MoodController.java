package xlz.emojihub.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import xlz.emojihub.backend.dto.MoodDto;
import xlz.emojihub.backend.dto.MoodMatchRequestDto;
import xlz.emojihub.backend.dto.MoodMatchResponseDto;
import xlz.emojihub.backend.service.MoodService;

@RestController
public class MoodController {
    private final MoodService moodService;

    public MoodController(MoodService moodService) {
        this.moodService = moodService;
    }

    @GetMapping("/api/mood/{slug}")
    public MoodDto getMood(@PathVariable String slug) {
        return moodService.getMood(slug);
    }

    @PostMapping("/api/mood-match")
    public MoodMatchResponseDto matchMood(@RequestBody MoodMatchRequestDto request) {
        return moodService.matchMood(request.text());
    }
}