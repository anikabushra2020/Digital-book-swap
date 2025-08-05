package com.example.bookswap.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "books")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Book {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @Column(nullable = false)
    private String subject;

    @Column(length = 2000)
    private String description;

    @Column(name = "contact_email", nullable = false)
    private String contactEmail;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    public enum Status {
        AVAILABLE, BORROWED
    }

    // Manual getters/setters for compatibility
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    
    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
    
    public static BookBuilder builder() { return new BookBuilder(); }
    
    public static class BookBuilder {
        private Long id;
        private String title;
        private String author;
        private String subject;
        private String description;
        private String contactEmail;
        private Status status;
        private User owner;
        
        public BookBuilder id(Long id) { this.id = id; return this; }
        public BookBuilder title(String title) { this.title = title; return this; }
        public BookBuilder author(String author) { this.author = author; return this; }
        public BookBuilder subject(String subject) { this.subject = subject; return this; }
        public BookBuilder description(String description) { this.description = description; return this; }
        public BookBuilder contactEmail(String contactEmail) { this.contactEmail = contactEmail; return this; }
        public BookBuilder status(Status status) { this.status = status; return this; }
        public BookBuilder owner(User owner) { this.owner = owner; return this; }
        
        public Book build() {
            Book book = new Book();
            book.setId(this.id);
            book.setTitle(this.title);
            book.setAuthor(this.author);
            book.setSubject(this.subject);
            book.setDescription(this.description);
            book.setContactEmail(this.contactEmail);
            book.setStatus(this.status);
            book.setOwner(this.owner);
            return book;
        }
    }
}