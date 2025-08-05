package com.example.bookswap.repository;

import com.example.bookswap.model.Book;
import com.example.bookswap.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {

    Page<Book> findAllByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(String title, String author, Pageable pageable);

    Page<Book> findAllBySubject(String subject, Pageable pageable);

    Page<Book> findAllByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCaseAndSubject(
            String title, String author, String subject, Pageable pageable);

    Page<Book> findAllByOwner(User owner, Pageable pageable);

}