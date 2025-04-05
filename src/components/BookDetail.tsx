
import { useState } from "react";
import { Book, Member, Transaction } from "@/types/library";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar, MapPin, User, Clock } from "lucide-react";

interface BookDetailProps {
  book: Book;
  members: Member[];
  transactions: Transaction[];
  onCheckout: (bookId: string, memberId: string) => void;
  onReturn: (bookId: string, transactionId: string) => void;
}

const BookDetail = ({ 
  book, 
  members, 
  transactions, 
  onCheckout, 
  onReturn 
}: BookDetailProps) => {
  const [selectedMemberId, setSelectedMemberId] = useState("");
  
  const activeTransaction = transactions.find(
    t => t.bookId === book.id && t.status === "active"
  );
  
  const borrowerInfo = activeTransaction 
    ? members.find(m => m.id === activeTransaction.memberId)
    : null;
    
  return (
    <div className="grid md:grid-cols-5 gap-6">
      <div className="md:col-span-2 flex justify-center md:justify-start">
        <img 
          src={book.coverImage} 
          alt={book.title} 
          className="w-full max-w-[250px] object-cover rounded-md shadow-md" 
        />
      </div>
      
      <div className="md:col-span-3">
        <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
        <p className="text-gray-700 mb-4">by {book.author}</p>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
          <div>
            <span className="text-sm text-gray-500">ISBN:</span>
            <p>{book.isbn}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Published:</span>
            <p>{book.publishedYear}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Genre:</span>
            <p>{book.genre}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Status:</span>
            <p className={`${
              book.status === 'available' ? 'text-green-600' : 'text-red-600'
            } font-medium`}>
              {book.status === 'available' ? 'Available' : 'Checked Out'}
            </p>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-700">{book.description}</p>
        </div>
        
        {book.location && (
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{book.location}</span>
          </div>
        )}
        
        {activeTransaction && borrowerInfo && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
            <h3 className="font-semibold flex items-center mb-2">
              <User className="h-4 w-4 mr-2" /> 
              Currently Borrowed By
            </h3>
            <p className="mb-1">
              <span className="font-medium">{borrowerInfo.name}</span> ({borrowerInfo.email})
            </p>
            <div className="flex items-center gap-4 text-sm mt-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                <span>Checked out: {format(new Date(activeTransaction.checkoutDate), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-gray-500" />
                <span>Due: {format(new Date(activeTransaction.dueDate), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          {book.status === 'available' ? (
            <>
              <Select onValueChange={setSelectedMemberId} value={selectedMemberId}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {members
                    .filter(member => member.status === 'active')
                    .map(member => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              
              <Button 
                onClick={() => onCheckout(book.id, selectedMemberId)}
                disabled={!selectedMemberId}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Check Out
              </Button>
            </>
          ) : (
            activeTransaction && (
              <Button 
                onClick={() => onReturn(book.id, activeTransaction.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                Return Book
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
