package xlz.emojihub.backend.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
record GeminiStep(String type, List<GeminiStepContent> content) {
}