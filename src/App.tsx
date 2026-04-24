import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import ItemDetails from './pages/ItemDetails';
import ItemForm from './components/ItemForm';
import Profile from './pages/Profile';
import Search from './pages/Search';
import { motion, AnimatePresence } from 'motion/react';

function AppContent() {
  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Header />
      <main>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/items/:id" element={<ItemDetails />} />
            <Route path="/upload" element={<ItemForm />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<Search />} />
            {/* Fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </AnimatePresence>
      </main>
      
      <footer className="border-t border-gray-100 bg-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm font-medium">
            © 2026 Echo Share. Built with sustainable intentions for local communities.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
