package xlz.emojihub.backend.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
record GeminiInteractionResponse(List<GeminiStep> steps) {
}