package xlz.emojihub.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.core.JacksonException;
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
    private static final String MOOD_MATCH_SYSTEM_INSTRUCTION = """
        You are matching a user's described mood, feeling, or context to relevant emoji
        from a public, all-ages emoji catalog. Given the user's text and a list of available
        emoji categories, suggest 5 to 8 short, common emoji names in English (e.g. "grinning face",
        "red heart", "fire", "party popper") that best match the mood. Only suggest names you are
        reasonably confident correspond to real, well-known emoji — do not invent obscure or
        made-up names. Keep suggestions neutral and family-friendly, avoiding sexual, violent,
        or otherwise suggestive interpretations even if some emoji have such connotations
        in casual usage.
        """;

    private final RestClient geminiRestClient;
    private final String model;
    private final ObjectMapper objectMapper;

    public GeminiClient(RestClient geminiRestClient, @Value("${gemini.model}") String model, ObjectMapper objectMapper) {
        this.geminiRestClient = geminiRestClient;
        this.model = model;
        this.objectMapper = objectMapper;
    }

    public List<String> findMoodMatchNames(String text, List<String> categories) {
        String input = "User's mood/context: \"%s\"\nAvailable emoji categories: %s"
                .formatted(text, String.join(", ", categories));

        Map<String, Object> schema = Map.of(
                "type", "object",
                "properties", Map.of(
                        "names", Map.of(
                                "type", "array",
                                "items", Map.of("type", "string")
                        )
                ),
                "required", List.of("names")
        );

        GeminiInteractionResponse response = geminiRestClient.post()
                                                             .uri("/interactions")
                                                             .body(Map.of(
                                                                     "model", model,
                                                                     "store", false,
                                                                     "system_instruction", MOOD_MATCH_SYSTEM_INSTRUCTION,
                                                                     "input", input,
                                                                     "response_format", Map.of(
                                                                             "type", "text",
                                                                             "mime_type", "application/json",
                                                                             "schema", schema
                                                                     )
                                                             ))
                                                             .retrieve()
                                                             .body(GeminiInteractionResponse.class);

        if (response == null) {
            throw new IllegalStateException("Gemini API returned an empty response body");
        }

        String json = extractText(response.steps());
        try {
            return objectMapper.readValue(json, MoodMatchNames.class).names();
        } catch (JacksonException e) {
            throw new IllegalStateException("Failed to parse Gemini mood-match JSON response", e);
        }
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