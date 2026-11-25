export interface Member {
  memberID: number;
  name: string;
  email: string;
}

export interface Book {
  bookID: number;
  title: string;
  author: string;
  description?: string;
  availableCopies: number;
}

export interface Loan {
  loanID: number;
  bookID: number;
  memberID: number;
  loanDate: string;
  returnDate?: string | null;
  book?: Book;
  member?: Member;
}

export interface BookArchive {
  archiveID: number;
  bookID: number;
  title: string;
  author: string;
  description?: string;
  deletedAt: string;
}