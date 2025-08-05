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

    public Page<Book> listBooks(String search, String subject, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        if (search != null && !search.isBlank() && subject != null && !subject.isBlank()) {
            return bookRepository.findAllByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCaseAndSubject(search, search, subject, pageable);
        } else if (search != null && !search.isBlank()) {
            return bookRepository.findAllByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(search, search, pageable);
        } else if (subject != null && !subject.isBlank()) {
            return bookRepository.findAllBySubject(subject, pageable);
        } else {
            return bookRepository.findAll(pageable);
        }
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