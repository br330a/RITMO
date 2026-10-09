package com.ritmo.backend.category;

import com.ritmo.backend.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, length = 30)
    private String name;

    @Column(nullable = false, length = 20)
    private String color;

    @Column(nullable = false, length = 30)
    private String icon;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected Category() {
    }

    public Category(
            String name,
            String color,
            String icon,
            User user
    ) {
        this.name = name;
        this.color = color;
        this.icon = icon;
        this.user = user;
    }

    @PrePersist
    public void prePersist() {
        createdAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getColor() {
        return color;
    }

    public String getIcon() {
        return icon;
    }

    public User getUser() {
        return user;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}