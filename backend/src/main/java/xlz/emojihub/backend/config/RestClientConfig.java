package xlz.emojihub.backend.config;

import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.http.client.ClientHttpRequestFactoryBuilder;
import org.springframework.boot.http.client.HttpClientSettings;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {
    @Bean
    RestClient emojiHubRestClient(
            RestClient.Builder builder,
            @Value("${emojihub.base-url}") String baseUrl,
            @Value("${emojihub.connect-timeout}") Duration connectTimeout,
            @Value("${emojihub.read-timeout}") Duration readTimeout
    ) {
        return builder.baseUrl(baseUrl)
                      .requestFactory(timeoutRequestFactory(connectTimeout, readTimeout))
                      .build();
    }

    @Bean
    RestClient geminiRestClient(
            RestClient.Builder builder,
            @Value("${gemini.base-url}") String baseUrl,
            @Value("${gemini.api-key}") String apiKey,
            @Value("${gemini.connect-timeout}") Duration connectTimeout,
            @Value("${gemini.read-timeout}") Duration readTimeout
    ) {
        return builder.baseUrl(baseUrl)
                      .defaultHeader("x-goog-api-key", apiKey)
                      .requestFactory(timeoutRequestFactory(connectTimeout, readTimeout))
                      .build();
    }

    private static ClientHttpRequestFactory timeoutRequestFactory(Duration connectTimeout, Duration readTimeout) {
        HttpClientSettings settings = HttpClientSettings.defaults()
                                                        .withConnectTimeout(connectTimeout)
                                                        .withReadTimeout(readTimeout);
        return ClientHttpRequestFactoryBuilder.detect().build(settings);
    }
}