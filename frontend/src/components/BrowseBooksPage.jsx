import { useState, useEffect, useCallback } from "react";
import { getBooks } from "../api/index.js";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Badge } from "./ui/badge.jsx";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "../hooks/use-toast.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select.jsx";
import { BOOK_SUBJECTS } from "../lib/constants.js";

export function BrowseBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
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
      const params = {
        page,
        size: pagination.size
      };

      // Only add filters if they're not set to 'all'
      if (selectedSubject !== "all") {
        params.subject = selectedSubject;
      }
      if (selectedStatus !== "all") {
        params.status = selectedStatus;
      }

      const response = await getBooks(params);
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
  }, [pagination.size, toast, selectedSubject, selectedStatus]);

  useEffect(() => {
    loadBooks(0); // Reset to first page when filters change
  }, [loadBooks, selectedSubject, selectedStatus]);

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
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-3">Digital Book Swap</h1>
        <div className="space-y-4 text-muted-foreground">
          <p className="text-lg">
            Welcome to our student book sharing community! This platform helps students share textbooks and reference materials with their peers, making education more accessible for everyone.
          </p>
          <div className="bg-card p-4 rounded-lg border border-border/50">
            <h2 className="font-semibold text-foreground mb-2">How it works:</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Browse available books by subject</li>
              <li>Contact book owners directly to arrange borrowing</li>
              <li>Share your own books when you're not using them</li>
              <li>Help fellow students access educational resources</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mt-8 border-b border-border/50 pb-4">
        <h2 className="text-xl font-semibold text-foreground">Available Books</h2>
        <div className="flex gap-4">
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent 
              position="popper" 
              sideOffset={4}
              align="end"
              className="bg-white z-50 max-h-[300px] overflow-y-auto"
            >
              <SelectItem value="all" className="hover:bg-gray-100">All Subjects</SelectItem>
              {BOOK_SUBJECTS.map((subject) => (
                <SelectItem 
                  key={subject} 
                  value={subject}
                  className="hover:bg-gray-100"
                >
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent 
              position="popper" 
              sideOffset={4}
              align="end"
              className="bg-white z-50"
            >
              <SelectItem value="all" className="hover:bg-gray-100">All Status</SelectItem>
              <SelectItem value="AVAILABLE" className="hover:bg-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success"></span>
                  Available
                </div>
              </SelectItem>
              <SelectItem value="BORROWED" className="hover:bg-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  Borrowed
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Books Grid */}
      {books.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No books found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or check back later for new additions.</p>
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