package xlz.emojihub.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {
    @Bean
    RestClient emojiHubRestClient(RestClient.Builder builder,
                                  @Value("${emojihub.base-url}") String baseUrl) {
        return builder.baseUrl(baseUrl).build();
    }

    @Bean
    RestClient geminiRestClient(RestClient.Builder builder,
                                @Value("${gemini.base-url}") String baseUrl,
                                @Value("${gemini.api-key}") String apiKey) {
        return builder.baseUrl(baseUrl)
                      .defaultHeader("x-goog-api-key", apiKey)
                      .build();
    }
}