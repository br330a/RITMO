package com.ritmo.backend.auth.jwt;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;
    private final long expirationSeconds;

    public JwtService(
            JwtEncoder jwtEncoder,
            @Value("${app.jwt.expiration-seconds}") long expirationSeconds
    ) {
        this.jwtEncoder = jwtEncoder;
        this.expirationSeconds = expirationSeconds;
    }

    public String generateToken(Long userId, String email, String name) {
        Instant now = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("ritmo-api")
                .subject(userId.toString())
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expirationSeconds))
                .claim("email", email)
                .claim("name", name)
                .build();

        return jwtEncoder
                .encode(JwtEncoderParameters.from(claims))
                .getTokenValue();
    }

    public long getExpirationSeconds() {
        return expirationSeconds;
    }
}
