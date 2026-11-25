import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Loan, Book, Member } from "../types";

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [bookID, setBookID] = useState<number | "">("");
  const [memberID, setMemberID] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const [loansRes, booksRes, membersRes] = await Promise.all([
        api.get("/Loans"),
        api.get("/Books/GetAllBooks"),
        api.get("/Members/GetAllMembers"),
      ]);
      setLoans(loansRes.data);
      setBooks(booksRes.data);
      setMembers(membersRes.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookID || !memberID) return;

    setLoading(true);
    try {
      await api.post("/Loans", {
        bookID,
        memberID,
      });
      setBookID("");
      setMemberID("");
      await loadData();
    } catch (err: any) {
      alert(err.response?.data || "Failed to create loan");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (loan: Loan) => {
    if (!confirm("Mark this book as returned?")) return;

    try {
      await api.put(`/Loans/${loan.loanID}`, {
        ...loan,
        returnDate: new Date().toISOString().split("T")[0],
      });
      await loadData();
    } catch (err) {
      alert("Failed to return book");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this loan record?")) return;

    try {
      await api.delete(`/Loans/${id}`);
      await loadData();
    } catch (err) {
      alert("Failed to delete loan");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Loans</h1>
        <p className="text-gray-500 mt-1">Borrow and return books</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Borrow a Book</h2>

        <form onSubmit={handleBorrow} className="flex flex-col sm:flex-row gap-4">
          <select
            value={bookID}
            onChange={(e) => setBookID(Number(e.target.value))}
            required
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Book</option>
            {books.map((b) => (
              <option key={b.bookID} value={b.bookID}>
                {b.title} (Available: {b.availableCopies})
              </option>
            ))}
          </select>

          <select
            value={memberID}
            onChange={(e) => setMemberID(Number(e.target.value))}
            required
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Member</option>
            {members.map((m) => (
              <option key={m.memberID} value={m.memberID}>
                {m.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Borrow"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-3 font-medium">ID</th>
              <th className="px-6 py-3 font-medium">Book</th>
              <th className="px-6 py-3 font-medium">Member</th>
              <th className="px-6 py-3 font-medium">Loan Date</th>
              <th className="px-6 py-3 font-medium">Return Date</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loans.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No loans found
                </td>
              </tr>
            ) : (
              loans.map((loan) => (
                <tr key={loan.loanID} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-500">{loan.loanID}</td>
                  <td className="px-6 py-4 font-medium">{loan.book?.title || loan.bookID}</td>
                  <td className="px-6 py-4">{loan.member?.name || loan.memberID}</td>
                  <td className="px-6 py-4">{loan.loanDate}</td>
                  <td className="px-6 py-4">
                    {loan.returnDate ? (
                      <span className="text-green-600">{loan.returnDate}</span>
                    ) : (
                      <span className="text-orange-600">Not returned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {!loan.returnDate && (
                        <button
                          onClick={() => handleReturn(loan)}
                          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition"
                        >
                          Return
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(loan.loanID)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}