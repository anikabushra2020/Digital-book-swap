import { useState, useEffect, useCallback } from "react";
import { getBooks } from "../api/index.js";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Badge } from "./ui/badge.jsx";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "../hooks/use-toast.js";

export function BrowseBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 12
  });
  const { toast } = useToast();

  const loadBooks = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const response = await getBooks({ 
        page, 
        size: pagination.size 
      });
      setBooks(response.data.content);
      setPagination(prev => ({
        ...prev,
        currentPage: response.data.number,
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
        size: response.data.size
      }));
    } catch (error) {
      console.error('Error loading books:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load books. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.size, toast]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      loadBooks(newPage);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Available Books</h1>
        <p className="text-muted-foreground">Browse through our collection of shared books</p>
      </div>

      {/* Books Grid */}
      {books.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No books available</h3>
          <p className="text-muted-foreground">Check back later for new additions to our library.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <Card key={book.id} className="flex flex-col h-full bg-gradient-card shadow-soft border-border/50">
                <CardHeader>
                  <CardTitle className="line-clamp-1">{book.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">by {book.author}</p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10">
                      {book.subject}
                    </Badge>
                    <Badge 
                      variant={book.status === "AVAILABLE" ? "default" : "secondary"}
                      className={book.status === "AVAILABLE" ? "bg-success text-success-foreground" : ""}
                    >
                      {book.status === "AVAILABLE" ? "Available" : "Borrowed"}
                    </Badge>
                  </div>
                  
                  {book.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {book.description}
                    </p>
                  )}

                  <div className="mt-auto pt-4 text-sm text-muted-foreground">
                    <p>Contact: {book.contactEmail}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-border/50 pt-4">
            <div className="text-sm text-muted-foreground">
              Showing {books.length} of {pagination.totalElements} books
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm">
                Page {pagination.currentPage + 1} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages - 1}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}