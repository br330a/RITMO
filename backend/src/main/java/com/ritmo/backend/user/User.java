package com.ritmo.backend.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(length = 10)
    private String theme;

    @Column(name = "accent_color", length = 10)
    private String accentColor;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected User() {
    }

    public User(
            String name,
            String email,
            String passwordHash
    ) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.theme = "light";
        this.accentColor = "green";
    }

    @PrePersist
    public void prePersist() {
        createdAt = Instant.now();

        if (theme == null) {
            theme = "light";
        }

        if (accentColor == null) {
            accentColor = "green";
        }
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getTheme() {
        return theme;
    }

    public String getAccentColor() {
        return accentColor;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public void setAccentColor(String accentColor) {
        this.accentColor = accentColor;
    }
}