
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  genre: string;
  description: string;
  coverImage: string;
  status: 'available' | 'checked-out' | 'reserved' | 'processing';
  location?: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  memberSince: Date;
  status: 'active' | 'inactive' | 'suspended';
  borrowedBooks?: number;
}

export interface Transaction {
  id: string;
  bookId: string;
  memberId: string;
  checkoutDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'active' | 'completed' | 'overdue';
}

export interface SearchFilters {
  query: string;
  genre?: string;
  status?: string;
  availability?: string;
}
