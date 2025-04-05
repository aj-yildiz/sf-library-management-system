
import { useState } from "react";
import { Book, Member, SearchFilters, Transaction } from "@/types/library";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import BookDetail from "./BookDetail";
import { genres } from "@/data/sampleData";
import { Search, Filter } from "lucide-react";

interface BookCatalogProps {
  books: Book[];
  members: Member[];
  transactions: Transaction[];
  onCheckout: (bookId: string, memberId: string) => void;
  onReturn: (bookId: string, transactionId: string) => void;
}

const BookCatalog = ({ books, members, transactions, onCheckout, onReturn }: BookCatalogProps) => {
  const [filters, setFilters] = useState<SearchFilters>({ query: "" });
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  
  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };
  
  const filteredBooks = books.filter(book => {
    // Search query filter
    const matchesQuery = !filters.query || 
      book.title.toLowerCase().includes(filters.query.toLowerCase()) ||
      book.author.toLowerCase().includes(filters.query.toLowerCase()) ||
      book.isbn.includes(filters.query);
    
    // Genre filter
    const matchesGenre = !filters.genre || 
      filters.genre === "All Genres" || 
      book.genre === filters.genre;
    
    // Availability filter
    const matchesAvailability = !filters.availability || 
      (filters.availability === "available" && book.status === "available") ||
      (filters.availability === "checked-out" && book.status === "checked-out");
    
    return matchesQuery && matchesGenre && matchesAvailability;
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Book Catalog</h2>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={filters.query}
              onChange={(e) => handleFilterChange("query", e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:w-40">
              <Select 
                value={filters.genre || "All Genres"} 
                onValueChange={(value) => handleFilterChange("genre", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map(genre => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-40">
              <Select
                value={filters.availability || ""}
                onValueChange={(value) => handleFilterChange("availability", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="checked-out">Checked Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Book Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <Dialog key={book.id}>
                <DialogTrigger asChild>
                  <Card 
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedBook(book)}
                  >
                    <div className="h-56 overflow-hidden bg-gray-100">
                      <img 
                        src={book.coverImage} 
                        alt={book.title}
                        className="w-full h-full object-cover object-center hover:scale-105 transition-transform"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1">{book.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{book.author}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{book.genre}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          book.status === 'available' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {book.status === 'available' ? 'Available' : 'Checked Out'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Book Details</DialogTitle>
                  </DialogHeader>
                  {selectedBook && (
                    <BookDetail 
                      book={selectedBook} 
                      members={members}
                      transactions={transactions}
                      onCheckout={onCheckout}
                      onReturn={onReturn}
                    />
                  )}
                </DialogContent>
              </Dialog>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No books found matching your search criteria.</p>
            <Button onClick={() => setFilters({ query: "" })}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCatalog;
