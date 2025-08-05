package com.example.bookswap.controller;

import com.example.bookswap.model.Book;
import com.example.bookswap.model.User;
import com.example.bookswap.payload.BookRequest;
import com.example.bookswap.payload.BookStatusUpdateRequest;
import com.example.bookswap.security.UserDetailsImpl;
import com.example.bookswap.service.BookService;
import com.example.bookswap.service.UserService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class BookController {

    private final BookService bookService;
    private final UserService userService;
    
    public BookController(BookService bookService, UserService userService) {
        this.bookService = bookService;
        this.userService = userService;
    }

    // US3 + US4: Browse with pagination, search, and filter
    @GetMapping("/books")
    public ResponseEntity<?> getBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String subject
    ) {
        Page<Book> booksPage = bookService.listBooks(search, subject, page, size);
        return ResponseEntity.ok(booksPage);
    }

    // US2: Add new book
    @PostMapping("/books")
    public ResponseEntity<?> addBook(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody BookRequest bookRequest
    ) {
        User owner = userService.getUserByEmail(userDetails.getUsername());
        Book book = Book.builder()
                .title(bookRequest.title())
                .author(bookRequest.author())
                .subject(bookRequest.subject())
                .description(bookRequest.description())
                .contactEmail(bookRequest.contactEmail())
                .owner(owner)
                .status(Book.Status.AVAILABLE)
                .build();

        bookService.addBook(book);

        return ResponseEntity.status(HttpStatus.CREATED).body("Book listed successfully");
    }

    // US5: Mark book as borrowed/returned
    @PutMapping("/books/{id}/status")
    public ResponseEntity<?> updateBookStatus(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long id,
            @Valid @RequestBody BookStatusUpdateRequest request
    ) {
        Book.Status status;
        try {
            status = Book.Status.valueOf(request.status().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status value");
        }

        User user = userService.getUserByEmail(userDetails.getUsername());
        try {
            bookService.updateStatus(id, status, user);
            return ResponseEntity.ok("Book status updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    // US6: Get user’s own listings
    @GetMapping("/users/{id}/books")
    public ResponseEntity<?> getUserBooks(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        if (!id.equals(userDetails.getId()))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();

        User user = userService.getUserByEmail(userDetails.getUsername());
        Page<Book> books = bookService.getBooksByUser(user, page, size);

        return ResponseEntity.ok(books);
    }

    // US6 (edit): Update book details
    @PutMapping("/books/{id}")
    public ResponseEntity<?> updateBook(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long id,
            @Valid @RequestBody BookRequest bookRequest
    ) {
        User user = userService.getUserByEmail(userDetails.getUsername());

        try {
            Book updated = bookService.updateBook(id, bookRequest, user);
            return ResponseEntity.ok("Book updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    // US6 (delete)
    @DeleteMapping("/books/{id}")
    public ResponseEntity<?> deleteBook(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long id
    ) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        try {
            bookService.deleteBook(id, user);
            return ResponseEntity.ok("Book deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}