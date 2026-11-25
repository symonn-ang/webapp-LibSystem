import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import MembersPage from "./pages/MembersPage";
import BooksPage from "./pages/BooksPage";
import LoansPage from "./pages/LoansPage";
import ArchivesPage from "./pages/ArchivesPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<MembersPage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/loans" element={<LoansPage />} />
            <Route path="/archives" element={<ArchivesPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;