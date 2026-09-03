package xlz.emojihub.backend.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.time.Duration;
import java.util.List;

@Configuration
@EnableCaching
public class CacheConfig {
    @Bean
    public CacheManager cacheManager() {
        CaffeineCache emojiListCache = new CaffeineCache("emojiList",
                Caffeine.newBuilder()
                        .expireAfterWrite(Duration.ofSeconds(10))
                        .build());
        CaffeineCache moodDescriptionCache = new CaffeineCache("moodDescription",
                Caffeine.newBuilder()
                        .expireAfterWrite(Duration.ofDays(7))
                        .build());
        SimpleCacheManager manager = new SimpleCacheManager();
        manager.setCaches(List.of(emojiListCache, moodDescriptionCache));
        return manager;
    }
}