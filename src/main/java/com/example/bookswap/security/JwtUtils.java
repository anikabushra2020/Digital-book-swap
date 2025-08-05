package com.example.bookswap.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtils {

    private final SecretKey jwtSecretKey;
    private final long jwtExpirationMs;

    public JwtUtils(@Value("${jwt.secret}") String jwtSecret,
                    @Value("${jwt.expirationms}") long jwtExpirationMs) {
        this.jwtSecretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        this.jwtExpirationMs = jwtExpirationMs;
    }

    public String generateJwtToken(String email, Long id) {
        return Jwts.builder()
                .subject(email)
                .claim("id", id)
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(jwtSecretKey)
                .compact();
    }

    public String getEmailFromJwtToken(String token) {
        return Jwts.parser().verifyWith(jwtSecretKey).build()
                .parseSignedClaims(token).getPayload().getSubject();
    }

    public Long getUserIdFromJwtToken(String token) {
        return ((Number) Jwts.parser().verifyWith(jwtSecretKey).build()
                .parseSignedClaims(token).getPayload().get("id")).longValue();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().verifyWith(jwtSecretKey).build().parseSignedClaims(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // logger can be added here
        }
        return false;
    }
}