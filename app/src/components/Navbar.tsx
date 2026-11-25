import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">Library System</span>
          </div>

          <div className="flex gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-blue-400 transition">Members</Link>
            <Link to="/books" className="hover:text-blue-400 transition">Books</Link>
            <Link to="/loans" className="hover:text-blue-400 transition">Loans</Link>
            <Link to="/archives" className="hover:text-blue-400 transition">Archives</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}