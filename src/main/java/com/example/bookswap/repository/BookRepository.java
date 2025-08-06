package com.example.bookswap.repository;

import com.example.bookswap.model.Book;
import com.example.bookswap.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {
    // Basic filters
    Page<Book> findAllByStatus(Book.Status status, Pageable pageable);
    Page<Book> findAllBySubject(String subject, Pageable pageable);
    Page<Book> findAllBySubjectAndStatus(String subject, Book.Status status, Pageable pageable);
    
    // User's books
    Page<Book> findAllByOwner(User owner, Pageable pageable);
}