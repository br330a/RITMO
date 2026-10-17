package com.ritmo.backend.task;

import com.ritmo.backend.category.Category;
import com.ritmo.backend.user.User;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "task_time")
    private LocalTime time;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TaskPriority priority;

    @Column(name = "estimated_minutes")
    private Integer estimatedMinutes;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private TaskSticker sticker;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "recurrence_frequency", length = 10)
    private RecurrenceFrequency recurrenceFrequency;

    @ElementCollection
    @CollectionTable(
            name = "task_recurrence_days",
            joinColumns = @JoinColumn(name = "task_id")
    )
    @Column(name = "day_of_week", nullable = false)
    private Set<Integer> recurrenceDaysOfWeek = new HashSet<>();

    @Column(name = "recurrence_end_date")
    private LocalDate recurrenceEndDate;

    @Column(nullable = false)
    private boolean completed;

    @Column(name = "completed_at")
    private Instant completedAt;

    @ElementCollection
    @CollectionTable(
            name = "task_completed_occurrences",
            joinColumns = @JoinColumn(name = "task_id")
    )
    @MapKeyColumn(name = "occurrence_date")
    @Column(name = "completed_at", nullable = false)
    private Map<LocalDate, Instant> completedOccurrences = new HashMap<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected Task() {
    }

    public Task(
            String title,
            String description,
            LocalDate dueDate,
            LocalTime time,
            TaskPriority priority,
            Integer estimatedMinutes,
            Category category,
            User user
    ) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.time = time;
        this.priority = priority;
        this.estimatedMinutes = estimatedMinutes;
        this.category = category;
        this.user = user;
        this.completed = false;
    }

    @PrePersist
    public void prePersist() {
        createdAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public LocalTime getTime() {
        return time;
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public Integer getEstimatedMinutes() {
        return estimatedMinutes;
    }

    public TaskSticker getSticker() {
        return sticker;
    }

    public Category getCategory() {
        return category;
    }

    public User getUser() {
        return user;
    }

    public RecurrenceFrequency getRecurrenceFrequency() {
        return recurrenceFrequency;
    }

    public Set<Integer> getRecurrenceDaysOfWeek() {
        return recurrenceDaysOfWeek;
    }

    public LocalDate getRecurrenceEndDate() {
        return recurrenceEndDate;
    }

    public boolean isCompleted() {
        return completed;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }

    public Map<LocalDate, Instant> getCompletedOccurrences() {
        return completedOccurrences;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }

    public void setEstimatedMinutes(Integer estimatedMinutes) {
        this.estimatedMinutes = estimatedMinutes;
    }

    public void setSticker(TaskSticker sticker) {
        this.sticker = sticker;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public void setRecurrenceFrequency(RecurrenceFrequency recurrenceFrequency) {
        this.recurrenceFrequency = recurrenceFrequency;
    }

    public void setRecurrenceDaysOfWeek(Set<Integer> days) {
        recurrenceDaysOfWeek.clear();
        recurrenceDaysOfWeek.addAll(days);
    }

    public void setRecurrenceEndDate(LocalDate recurrenceEndDate) {
        this.recurrenceEndDate = recurrenceEndDate;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public void setCompletedAt(Instant completedAt) {
        this.completedAt = completedAt;
    }
}