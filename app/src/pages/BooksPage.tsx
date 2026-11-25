import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Book } from "../types";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [availableCopies, setAvailableCopies] = useState(1);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const loadBooks = async () => {
    try {
      const res = await api.get("/Books/GetAllBooks");
      setBooks(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load books");
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setDescription("");
    setAvailableCopies(1);
    setEditId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      bookID: editId ?? 0,
      title,
      author,
      description,
      availableCopies,
    };

    try {
      if (editId) {
        await api.put(`/Books/EditBook/${editId}`, payload);
      } else {
        await api.post("/Books/AddBook", payload);
      }

      resetForm();
      await loadBooks();
    } catch (err: any) {
      alert(err.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book: Book) => {
    setEditId(book.bookID);
    setTitle(book.title);
    setAuthor(book.author);
    setDescription(book.description || "");
    setAvailableCopies(book.availableCopies);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this book?")) return;

    try {
      await api.delete(`/Books/DeleteBook/${id}`);
      await loadBooks();
    } catch (err) {
      alert("Failed to delete book");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Books</h1>
        <p className="text-gray-500 mt-1">Manage library books</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          {editId ? "Edit Book" : "Add New Book"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex items-center gap-4">
            <input
              type="number"
              min={0}
              value={availableCopies}
              onChange={(e) => setAvailableCopies(Number(e.target.value))}
              required
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-600 text-sm">Available Copies</span>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : editId ? "Update Book" : "Add Book"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-3 font-medium">ID</th>
              <th className="px-6 py-3 font-medium">Title</th>
              <th className="px-6 py-3 font-medium">Author</th>
              <th className="px-6 py-3 font-medium">Copies</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {books.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No books found
                </td>
              </tr>
            ) : (
              books.map((b) => (
                <tr key={b.bookID} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-500">{b.bookID}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{b.title}</td>
                  <td className="px-6 py-4 text-gray-600">{b.author}</td>
                  <td className="px-6 py-4">{b.availableCopies}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(b)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(b.bookID)}
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