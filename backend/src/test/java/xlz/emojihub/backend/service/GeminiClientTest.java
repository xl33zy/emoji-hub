package xlz.emojihub.backend.service;

import org.junit.jupiter.api.Test;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class GeminiClientTest {
    @Test
    void extractsTextFromModelOutputStep() {
        List<GeminiStep> steps = List.of(
                new GeminiStep("model_output", List.of(new GeminiStepContent("text", "A calm and friendly vibe.")))
        );
        String result = GeminiClient.extractText(steps);
        assertThat(result).isEqualTo("A calm and friendly vibe.");
    }

    @Test
    void skipsThoughtStepsBeforeModelOutput() {
        List<GeminiStep> steps = List.of(
                new GeminiStep("thought", null),
                new GeminiStep("model_output", List.of(new GeminiStepContent("text", "Bright and cheerful.")))
        );
        String result = GeminiClient.extractText(steps);
        assertThat(result).isEqualTo("Bright and cheerful.");
    }

    @Test
    void throwsWhenNoModelOutputStepPresent() {
        List<GeminiStep> steps = List.of(new GeminiStep("thought", null));
        assertThatThrownBy(() -> GeminiClient.extractText(steps))
                .isInstanceOf(IllegalStateException.class);
    }
}