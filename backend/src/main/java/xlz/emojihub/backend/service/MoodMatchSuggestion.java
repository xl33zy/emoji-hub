package xlz.emojihub.backend.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
record MoodMatchSuggestion(String name, String reason) {
}