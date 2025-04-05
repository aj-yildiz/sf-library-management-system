
import { Book, Member, Transaction } from "@/types/library";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from "recharts";
import { Book as BookIcon, Users, BookOpenCheck, BookUp } from "lucide-react";
import { format, differenceInDays } from "date-fns";

interface DashboardProps {
  books: Book[];
  members: Member[];
  transactions: Transaction[];
}

const Dashboard = ({ books, members, transactions }: DashboardProps) => {
  const totalBooks = books.length;
  const availableBooks = books.filter(book => book.status === "available").length;
  const checkedOutBooks = books.filter(book => book.status === "checked-out").length;
  const activeMembers = members.filter(member => member.status === "active").length;
  
  // Get books that are due soon (in the next 7 days)
  const today = new Date();
  const booksNearingDue = transactions
    .filter(t => {
      if (t.status !== "active") return false;
      const daysUntilDue = differenceInDays(new Date(t.dueDate), today);
      return daysUntilDue >= 0 && daysUntilDue <= 7;
    })
    .sort((a, b) => {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  
  // Get books that are overdue
  const overdueBooks = transactions
    .filter(t => {
      if (t.status !== "active") return false;
      return new Date(t.dueDate) < today;
    })
    .sort((a, b) => {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
    
  // Data for books by genre chart
  const genreCounts: Record<string, number> = {};
  books.forEach(book => {
    genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
  });
  
  const genreData = Object.entries(genreCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
    
  // Data for monthly checkouts chart
  const currentYear = new Date().getFullYear();
  const monthlyCheckouts = [
    { name: "Jan", checkouts: 12 },
    { name: "Feb", checkouts: 19 },
    { name: "Mar", checkouts: 25 },
    { name: "Apr", checkouts: 9 },
    { name: "May", checkouts: 0 },
    { name: "Jun", checkouts: 0 },
    { name: "Jul", checkouts: 0 },
    { name: "Aug", checkouts: 0 },
    { name: "Sep", checkouts: 0 },
    { name: "Oct", checkouts: 0 },
    { name: "Nov", checkouts: 0 },
    { name: "Dec", checkouts: 0 },
  ];
  
  // Color scheme for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const getBookById = (id: string) => books.find(book => book.id === id);
  const getMemberById = (id: string) => members.find(member => member.id === id);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Books</CardTitle>
            <BookIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooks}</div>
            <p className="text-xs text-gray-500 mt-1">
              {availableBooks} available, {checkedOutBooks} checked out
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Members</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMembers}</div>
            <p className="text-xs text-gray-500 mt-1">
              {members.length - activeMembers} inactive members
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Books Due Soon</CardTitle>
            <BookOpenCheck className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{booksNearingDue.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              Due in the next 7 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Overdue Books</CardTitle>
            <BookUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueBooks.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Genres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genreData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {genreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Checkouts - {currentYear}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyCheckouts}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="checkouts" fill="#3b82f6" name="Books Checked Out" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...overdueBooks, ...booksNearingDue].slice(0, 5).map(transaction => {
                  const book = getBookById(transaction.bookId);
                  const member = getMemberById(transaction.memberId);
                  const isOverdue = new Date(transaction.dueDate) < today;
                  
                  return (book && member) ? (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isOverdue 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isOverdue ? 'Overdue' : 'Due Soon'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {format(new Date(transaction.dueDate), 'MMM d, yyyy')}
                      </TableCell>
                    </TableRow>
                  ) : null;
                })}
                {[...overdueBooks, ...booksNearingDue].length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                      No books due soon or overdue.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">Note on Salesforce Implementation</h3>
        <p className="text-sm text-blue-700">
          In a real Salesforce environment, this dashboard would integrate with Salesforce reports and analytics, 
          using Lightning components to display charts and metrics from your custom objects data.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
