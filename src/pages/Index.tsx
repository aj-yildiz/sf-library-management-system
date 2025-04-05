
import { useState } from "react";
import BookCatalog from "../components/BookCatalog";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Dashboard from "../components/Dashboard";
import MemberManagement from "../components/MemberManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Member, Transaction } from "@/types/library";
import { sampleBooks, sampleMembers, sampleTransactions } from "@/data/sampleData";

const Index = () => {
  const [books, setBooks] = useState<Book[]>(sampleBooks);
  const [members, setMembers] = useState<Member[]>(sampleMembers);
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  
  const handleCheckout = (bookId: string, memberId: string) => {
    // Update book status
    setBooks(books.map(book => 
      book.id === bookId ? { ...book, status: 'checked-out' } : book
    ));
    
    // Create new transaction
    const newTransaction: Transaction = {
      id: `tr-${Date.now()}`,
      bookId,
      memberId,
      checkoutDate: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      status: 'active'
    };
    
    setTransactions([...transactions, newTransaction]);
  };
  
  const handleReturn = (bookId: string, transactionId: string) => {
    // Update book status
    setBooks(books.map(book => 
      book.id === bookId ? { ...book, status: 'available' } : book
    ));
    
    // Update transaction
    setTransactions(transactions.map(transaction => 
      transaction.id === transactionId ? 
        { ...transaction, returnDate: new Date(), status: 'completed' } : 
        transaction
    ));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">Salesforce Library Management System</h1>
        
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Quick Implementation Note</h2>
          <p className="text-gray-700 mb-2">
            This is a demonstration UI for a Salesforce library system. In a real Salesforce implementation:
          </p>
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            <li>Backend logic would be written in Apex classes</li>
            <li>UI components would be Lightning Web Components (LWC)</li>
            <li>Data would be stored in Salesforce custom objects</li>
            <li>Authorization would leverage Salesforce's permission system</li>
          </ul>
        </div>
        
        <Tabs defaultValue="catalog" className="bg-white rounded-lg shadow-md">
          <TabsList className="w-full border-b border-gray-200 bg-blue-50 rounded-t-lg">
            <TabsTrigger value="catalog" className="flex-1 py-3">Book Catalog</TabsTrigger>
            <TabsTrigger value="members" className="flex-1 py-3">Members</TabsTrigger>
            <TabsTrigger value="dashboard" className="flex-1 py-3">Admin Dashboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="catalog" className="p-6">
            <BookCatalog 
              books={books} 
              members={members}
              onCheckout={handleCheckout}
              onReturn={handleReturn}
              transactions={transactions}
            />
          </TabsContent>
          
          <TabsContent value="members" className="p-6">
            <MemberManagement 
              members={members} 
              setMembers={setMembers}
              transactions={transactions}
              books={books}
            />
          </TabsContent>
          
          <TabsContent value="dashboard" className="p-6">
            <Dashboard 
              books={books}
              members={members}
              transactions={transactions}
            />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
