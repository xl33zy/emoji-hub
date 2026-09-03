package xlz.emojihub.backend.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {
    private static final int LIMIT_PER_MINUTE = 10;

    private final ConcurrentHashMap<String, AtomicInteger> counters = new ConcurrentHashMap<>();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws java.io.IOException {
        String key = clientIp(request) + ":" + (Instant.now().getEpochSecond() / 60);
        int count = counters.computeIfAbsent(key, k -> new AtomicInteger()).incrementAndGet();

        if (count > LIMIT_PER_MINUTE) {
            response.sendError(HttpStatus.TOO_MANY_REQUESTS.value(), "Rate limit exceeded, try again in a minute");
            return false;
        }
        return true;
    }

    private String clientIp(HttpServletRequest request) {
        return request.getRemoteAddr();
    }
}