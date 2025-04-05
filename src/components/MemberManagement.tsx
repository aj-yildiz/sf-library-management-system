
import { useState } from "react";
import { Member, Book, Transaction } from "@/types/library";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Search, BookOpen, Calendar, Plus, Edit2, UserCheck } from "lucide-react";

interface MemberManagementProps {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  transactions: Transaction[];
  books: Book[];
}

const MemberManagement = ({ 
  members, 
  setMembers, 
  transactions, 
  books 
}: MemberManagementProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: ""
  });
  
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.phone && member.phone.includes(searchQuery))
  );
  
  const getMemberBorrowedBooks = (memberId: string) => {
    return transactions.filter(t => 
      t.memberId === memberId && t.status === "active"
    );
  };
  
  const handleAddMember = () => {
    const member: Member = {
      id: `m${Date.now()}`,
      name: newMember.name,
      email: newMember.email,
      phone: newMember.phone,
      memberSince: new Date(),
      status: "active",
      borrowedBooks: 0
    };
    
    setMembers([...members, member]);
    setNewMember({ name: "", email: "", phone: "" });
  };
  
  const getBookDetails = (bookId: string) => {
    return books.find(b => b.id === bookId);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">Member Management</h2>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  value={newMember.phone}
                  onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleAddMember}
                disabled={!newMember.name || !newMember.email}
              >
                Add Member
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Member Since</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Books</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map(member => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(member.memberSince), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getMemberBorrowedBooks(member.id).length}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedMember(member)}
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Member Details</DialogTitle>
                        </DialogHeader>
                        {selectedMember && (
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                              <div className="space-y-3">
                                <div>
                                  <Label className="text-sm text-gray-500">Name</Label>
                                  <p className="font-medium">{selectedMember.name}</p>
                                </div>
                                <div>
                                  <Label className="text-sm text-gray-500">Email</Label>
                                  <p>{selectedMember.email}</p>
                                </div>
                                {selectedMember.phone && (
                                  <div>
                                    <Label className="text-sm text-gray-500">Phone</Label>
                                    <p>{selectedMember.phone}</p>
                                  </div>
                                )}
                                <div>
                                  <Label className="text-sm text-gray-500">Member Since</Label>
                                  <p className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                    {format(new Date(selectedMember.memberSince), 'MMM d, yyyy')}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm text-gray-500">Status</Label>
                                  <p className="flex items-center">
                                    <UserCheck className="h-4 w-4 mr-2 text-gray-500" />
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      selectedMember.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {selectedMember.status}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center mb-4">
                                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                                <h3 className="text-lg font-semibold">Borrowed Books</h3>
                              </div>
                              
                              {getMemberBorrowedBooks(selectedMember.id).length > 0 ? (
                                <div className="space-y-4">
                                  {getMemberBorrowedBooks(selectedMember.id).map(transaction => {
                                    const book = getBookDetails(transaction.bookId);
                                    return book ? (
                                      <div key={transaction.id} className="flex p-3 border rounded-md">
                                        <div className="w-16 h-24 mr-4 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                                          <img 
                                            src={book.coverImage} 
                                            alt={book.title}
                                            className="w-full h-full object-cover object-center"
                                          />
                                        </div>
                                        <div>
                                          <h4 className="font-medium">{book.title}</h4>
                                          <p className="text-sm text-gray-600">{book.author}</p>
                                          <div className="mt-2 flex flex-col text-xs text-gray-500">
                                            <span>Checked out: {format(new Date(transaction.checkoutDate), 'MMM d, yyyy')}</span>
                                            <span>Due: {format(new Date(transaction.dueDate), 'MMM d, yyyy')}</span>
                                          </div>
                                        </div>
                                      </div>
                                    ) : null;
                                  })}
                                </div>
                              ) : (
                                <p className="text-gray-500">No books currently borrowed.</p>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No members found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MemberManagement;
