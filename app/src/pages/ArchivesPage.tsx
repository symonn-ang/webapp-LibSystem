import { useEffect, useState } from "react";
import api from "../api/axios";
import type { BookArchive } from "../types";

export default function ArchivesPage() {
  const [archives, setArchives] = useState<BookArchive[]>([]);

  const loadArchives = async () => {
    try {
      const res = await api.get("/BookArchives");
      setArchives(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load archives");
    }
  };

  useEffect(() => {
    loadArchives();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Book Archives</h1>
        <p className="text-gray-500 mt-1">
          Books that were deleted (filled automatically by trigger)
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-3 font-medium">Archive ID</th>
              <th className="px-6 py-3 font-medium">Book ID</th>
              <th className="px-6 py-3 font-medium">Title</th>
              <th className="px-6 py-3 font-medium">Author</th>
              <th className="px-6 py-3 font-medium">Deleted At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {archives.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No archived books yet
                </td>
              </tr>
            ) : (
              archives.map((a) => (
                <tr key={a.archiveID} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-500">{a.archiveID}</td>
                  <td className="px-6 py-4">{a.bookID}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{a.title}</td>
                  <td className="px-6 py-4 text-gray-600">{a.author}</td>
                  <td className="px-6 py-4 text-gray-500">{a.deletedAt}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}