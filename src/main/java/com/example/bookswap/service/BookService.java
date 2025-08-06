package com.example.bookswap.service;

import com.example.bookswap.model.Book;
import com.example.bookswap.model.User;
import com.example.bookswap.payload.BookRequest;
import com.example.bookswap.repository.BookRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class BookService {

    private final BookRepository bookRepository;
    
    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public Page<Book> listBooks(String search, String subject, String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Book.Status bookStatus = null;
        
        // Convert status string to enum if provided
        if (status != null && !status.isBlank() && !status.equalsIgnoreCase("all")) {
            try {
                bookStatus = Book.Status.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Invalid status, will be ignored
            }
        }

        // If only status filter is provided
        if (bookStatus != null && (subject == null || subject.isBlank()) && (search == null || search.isBlank())) {
            return bookRepository.findAllByStatus(bookStatus, pageable);
        }
        
        // If only subject filter is provided
        if ((status == null || status.isBlank() || status.equalsIgnoreCase("all")) && 
            subject != null && !subject.isBlank() && 
            (search == null || search.isBlank())) {
            return bookRepository.findAllBySubject(subject, pageable);
        }
        
        // If both subject and status filters are provided
        if (bookStatus != null && subject != null && !subject.isBlank()) {
            return bookRepository.findAllBySubjectAndStatus(subject, bookStatus, pageable);
        }

        // If no filters are provided
        return bookRepository.findAll(pageable);
    }

    public Book addBook(Book book){
        book.setStatus(Book.Status.AVAILABLE);
        return bookRepository.save(book);
    }

    public Optional<Book> findById(Long id) {
        return bookRepository.findById(id);
    }

    public Page<Book> getBooksByUser(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return bookRepository.findAllByOwner(user, pageable);
    }

    @Transactional
    public Book updateStatus(Long bookId, Book.Status status, User user){
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new RuntimeException("Book not found"));
        if (!book.getOwner().getId().equals(user.getId()))
            throw new RuntimeException("Unauthorized");
        book.setStatus(status);
        return book;
    }

    @Transactional
    public Book updateBook(Long bookId, BookRequest payload, User user){
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new RuntimeException("Book not found"));
        if (!book.getOwner().getId().equals(user.getId()))
            throw new RuntimeException("Unauthorized");
        book.setTitle(payload.title());
        book.setAuthor(payload.author());
        book.setSubject(payload.subject());
        book.setDescription(payload.description());
        book.setContactEmail(payload.contactEmail());
        return bookRepository.save(book);
    }

    @Transactional
    public void deleteBook(Long bookId, User user){
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new RuntimeException("Book not found"));
        if (!book.getOwner().getId().equals(user.getId()))
            throw new RuntimeException("Unauthorized");
        bookRepository.delete(book);
    }
}