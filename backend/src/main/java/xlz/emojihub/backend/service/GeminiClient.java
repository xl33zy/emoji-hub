package xlz.emojihub.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.List;
import java.util.Map;

@Service
public class GeminiClient {
    private static final String SYSTEM_INSTRUCTION = """
            You are a friendly assistant describing emoji for a public, all-ages emoji catalog.
            Describe the mood or vibe of the given emoji in one short, warm sentence (max ~20 words).
            Keep the tone light, neutral and family-friendly. Avoid any sexual, violent, or otherwise
            suggestive interpretation, even if the emoji has such connotations in casual usage.
            """;

    private final RestClient geminiRestClient;
    private final String model;

    public GeminiClient(RestClient geminiRestClient, @Value("${gemini.model}") String model) {
        this.geminiRestClient = geminiRestClient;
        this.model = model;
    }

    @Cacheable("moodDescription")
    public String describeMood(String displayName, String emoji) {
        String input = "Emoji: %s (%s)".formatted(displayName, emoji);

        GeminiInteractionResponse response = geminiRestClient.post()
                                                             .uri("/interactions")
                                                             .body(Map.of(
                                                                     "model", model,
                                                                     "store", false,
                                                                     "system_instruction", SYSTEM_INSTRUCTION,
                                                                     "input", input
                                                             ))
                                                             .retrieve()
                                                             .body(GeminiInteractionResponse.class);

        if (response == null) {
            throw new IllegalStateException("Gemini API returned an empty response body");
        }

        return extractText(response.steps());
    }

    static String extractText(List<GeminiStep> steps) {
        return steps.stream()
                    .filter(step -> "model_output".equals(step.type()))
                    .flatMap(step -> step.content().stream())
                    .map(GeminiStepContent::text)
                    .reduce((first, second) -> second)
                    .orElseThrow(() -> new IllegalStateException("Gemini response contained no model_output step"));
    }
}