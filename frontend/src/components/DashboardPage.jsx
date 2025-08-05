import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, BookOpen, Edit, Trash2, Eye, Star, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { Button } from "./ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import { Badge } from "./ui/badge.jsx";
import { useToast } from "../hooks/use-toast.js";
import { getUserBooks, deleteBook, updateBookStatus } from "../api/index.js";

export function DashboardPage({ user }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({ id: null, type: null });
  const [sortBy, setSortBy] = useState("newest"); // newest, title, status
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (location.state?.bookAdded) {
      toast({
        title: "Success",
        description: `"${location.state.bookTitle}" has been added successfully!`,
      });
      // Clear the state to prevent showing the toast again on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location, toast, navigate]);

  const loadMyBooks = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching books for user:', user.id);
      const res = await getUserBooks(user.id, { page: 0, size: 100 });
      console.log('API Response:', res.data);
      setBooks(res.data.content || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your books. Please try again.",
      });
    }
    setLoading(false);
  }, [user.id, toast]);

  useEffect(() => {
    loadMyBooks();
  }, [loadMyBooks]);

  const deleteMyBook = async (id, title) => {
    setActionLoading({ id, type: 'delete' });
    try {
      await deleteBook(id);
      setBooks(books.filter(book => book.id !== id));
      toast({
        title: "Book deleted",
        description: `"${title}" has been removed from your listings.`,
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete book. Please try again.",
      });
    } finally {
      setActionLoading({ id: null, type: null });
    }
  };

  const handleStatusUpdate = async (book) => {
    const newStatus = book.status === "AVAILABLE" ? "BORROWED" : "AVAILABLE";
    setActionLoading({ id: book.id, type: 'status' });
    try {
      await updateBookStatus(book.id, newStatus);
      setBooks(books.map(b => 
        b.id === book.id ? { ...b, status: newStatus } : b
      ));
      toast({
        title: "Status updated",
        description: `"${book.title}" is now ${newStatus.toLowerCase()}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update book status. Please try again.",
      });
    } finally {
      setActionLoading({ id: null, type: null });
    }
  };

  const confirmDelete = (book) => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"? This action cannot be undone.`)) {
      deleteMyBook(book.id, book.title);
    }
  };

  const sortedBooks = [...books].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "status":
        return a.status.localeCompare(b.status);
      case "newest":
      default:
        return b.id - a.id;
    }
  });

  const stats = {
    total: books.length,
    available: books.filter(book => book.status === "AVAILABLE").length,
    borrowed: books.filter(book => book.status === "BORROWED").length,
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Book Dashboard</h1>
          <p className="text-muted-foreground">Manage your book listings and track their status</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => navigate("/add")} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Book
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card shadow-soft border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Books in your collection</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-soft border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Star className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.available}</div>
            <p className="text-xs text-muted-foreground">Ready for borrowing</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-soft border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borrowed</CardTitle>
            <Eye className="h-4 w-4 text-primary-glow" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-glow">{stats.borrowed}</div>
            <p className="text-xs text-muted-foreground">Currently on loan</p>
          </CardContent>
        </Card>
      </div>

      {/* Books List */}
      <Card className="bg-gradient-card shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Your Book Listings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {books.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No books yet</h3>
              <p className="text-muted-foreground mb-6">Start sharing by adding your first book to the collection.</p>
              <Button onClick={() => navigate("/add")} className="flex items-center gap-2 mx-auto">
                <Plus className="h-4 w-4" />
                Add Your First Book
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedBooks.map((book) => (
                <div 
                  key={book.id} 
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-border rounded-lg bg-card hover:shadow-soft transition-smooth"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">by {book.author}</p>
                      </div>
                      <Badge 
                        variant={book.status === "AVAILABLE" ? "default" : "secondary"}
                        className={book.status === "AVAILABLE" ? "bg-success text-success-foreground" : ""}
                      >
                        {book.status === "AVAILABLE" ? "Available" : "Borrowed"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        {book.subject}
                      </span>
                      {book.description && (
                        <span className="hidden md:block truncate max-w-md">
                          {book.description}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(book)}
                      disabled={actionLoading.id === book.id}
                      className={`flex items-center gap-1 ${
                        book.status === "AVAILABLE" 
                          ? "text-warning hover:text-warning-foreground hover:bg-warning" 
                          : "text-success hover:text-success-foreground hover:bg-success"
                      }`}
                    >
                      {actionLoading.id === book.id && actionLoading.type === 'status' ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : null}
                      {book.status === "AVAILABLE" ? "Mark as Borrowed" : "Mark as Returned"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/edit/${book.id}`)}
                      disabled={actionLoading.id === book.id}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => confirmDelete(book)}
                      disabled={actionLoading.id === book.id}
                      className="flex items-center gap-1 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                    >
                      {actionLoading.id === book.id && actionLoading.type === 'delete' ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}