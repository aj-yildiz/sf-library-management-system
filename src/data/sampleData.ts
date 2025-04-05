
import { Book, Member, Transaction } from "@/types/library";

export const sampleBooks: Book[] = [
  {
    id: "b1",
    title: "The Lightning Thief",
    author: "Rick Riordan",
    isbn: "978-0786838653",
    publishedYear: 2005,
    genre: "Fantasy",
    description: "Percy Jackson discovers he's the son of Poseidon and must prevent a war between the Greek gods.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1400602609i/28187.jpg",
    status: "available",
    location: "Fiction - Row 3"
  },
  {
    id: "b2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0061120084",
    publishedYear: 1960,
    genre: "Classic",
    description: "The story of young Scout Finch and her father's defense of a Black man accused of rape in 1930s Alabama.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg",
    status: "available",
    location: "Fiction - Row 1"
  },
  {
    id: "b3",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    isbn: "978-0547928227",
    publishedYear: 1937,
    genre: "Fantasy",
    description: "Bilbo Baggins goes on an adventure with dwarves to reclaim their treasure from a dragon.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1546071216i/5907.jpg",
    status: "checked-out",
    location: "Fiction - Row 2"
  },
  {
    id: "b4",
    title: "1984",
    author: "George Orwell",
    isbn: "978-0451524935",
    publishedYear: 1949,
    genre: "Dystopian",
    description: "A chilling portrayal of a totalitarian society and one man's rebellion against it.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1657781256i/61439040.jpg",
    status: "available",
    location: "Fiction - Row 1"
  },
  {
    id: "b5",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    isbn: "978-0553380163",
    publishedYear: 1988,
    genre: "Science",
    description: "Hawking explains complex concepts of space and time in accessible language.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1333578746i/3869.jpg",
    status: "available",
    location: "Non-Fiction - Row 5"
  },
  {
    id: "b6",
    title: "Dune",
    author: "Frank Herbert",
    isbn: "978-0441172719",
    publishedYear: 1965,
    genre: "Science Fiction",
    description: "An epic adventure on the desert planet Arrakis, where water is scarce and giant sandworms roam.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1555447414i/44767458.jpg",
    status: "available",
    location: "Fiction - Row 4"
  },
  {
    id: "b7",
    title: "Becoming",
    author: "Michelle Obama",
    isbn: "978-1524763138",
    publishedYear: 2018,
    genre: "Biography",
    description: "The memoir of former First Lady Michelle Obama, detailing her life journey.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1528206996i/38746485.jpg",
    status: "checked-out",
    location: "Non-Fiction - Row 2"
  },
  {
    id: "b8",
    title: "The Alchemist",
    author: "Paulo Coelho",
    isbn: "978-0062315007",
    publishedYear: 1988,
    genre: "Fiction",
    description: "A shepherd boy's journey to find a worldly treasure leads him to discover the treasure within.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg",
    status: "available",
    location: "Fiction - Row 3"
  }
];

export const sampleMembers: Member[] = [
  {
    id: "m1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "555-123-4567",
    memberSince: new Date("2022-01-15"),
    status: "active",
    borrowedBooks: 1
  },
  {
    id: "m2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "555-987-6543",
    memberSince: new Date("2021-11-03"),
    status: "active",
    borrowedBooks: 0
  },
  {
    id: "m3",
    name: "Michael Johnson",
    email: "michael.j@example.com",
    phone: "555-555-5555",
    memberSince: new Date("2022-03-22"),
    status: "active",
    borrowedBooks: 1
  },
  {
    id: "m4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "555-222-3333",
    memberSince: new Date("2022-05-10"),
    status: "inactive",
    borrowedBooks: 0
  }
];

export const sampleTransactions: Transaction[] = [
  {
    id: "tr1",
    bookId: "b3",
    memberId: "m1",
    checkoutDate: new Date("2023-03-15"),
    dueDate: new Date("2023-03-29"),
    status: "active"
  },
  {
    id: "tr2",
    bookId: "b7",
    memberId: "m3",
    checkoutDate: new Date("2023-03-10"),
    dueDate: new Date("2023-03-24"),
    status: "active"
  },
  {
    id: "tr3",
    bookId: "b5",
    memberId: "m2",
    checkoutDate: new Date("2023-02-28"),
    dueDate: new Date("2023-03-14"),
    returnDate: new Date("2023-03-12"),
    status: "completed"
  }
];

export const genres = [
  "All Genres",
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Science Fiction", 
  "Fantasy",
  "Biography",
  "History",
  "Self-Help",
  "Business",
  "Dystopian",
  "Classic",
  "Science",
  "Romance"
];
