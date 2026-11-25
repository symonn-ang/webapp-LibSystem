import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Member } from "../types";

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const loadMembers = async () => {
    try {
      const res = await api.get("/Members/GetAllMembers");
      setMembers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load members");
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editId) {
        await api.put(`/Members/EditMember/${editId}`, {
          memberID: editId,
          name,
          email,
        });
      } else {
        await api.post("/Members/AddMember", { name, email });
      }

      setName("");
      setEmail("");
      setEditId(null);
      await loadMembers();
    } catch (err: any) {
      alert(err.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member: Member) => {
    setEditId(member.memberID);
    setName(member.name);
    setEmail(member.email);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    try {
      await api.delete(`/Members/DeleteMember/${id}`);
      await loadMembers();
    } catch (err) {
      alert("Failed to delete member");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Members</h1>
        <p className="text-gray-500 mt-1">Manage library members</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          {editId ? "Edit Member" : "Add New Member"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : editId ? "Update" : "Add Member"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setName("");
                  setEmail("");
                }}
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
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {members.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No members found
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m.memberID} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-500">{m.memberID}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{m.name}</td>
                  <td className="px-6 py-4 text-gray-600">{m.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(m)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(m.memberID)}
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