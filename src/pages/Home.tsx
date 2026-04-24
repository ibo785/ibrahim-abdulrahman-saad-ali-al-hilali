import { useState, useEffect } from 'react';
import { getItems } from '../services/itemService';
import { Item } from '../types';
import ItemCard from '../components/ItemCard';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Loader2, Search } from 'lucide-react';
import { getRecommendations } from '../services/geminiService';

export default function Home() {
  const { user, profile } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiRecs, setAiRecs] = useState<string[]>([]);
  const [fetchingRecs, setFetchingRecs] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      const data = await getItems();
      setItems(data);
      setLoading(false);
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const fetchRecs = async () => {
      if (user) {
        setFetchingRecs(true);
        try {
          const res = await getRecommendations(['furniture', 'tools'], items.slice(0, 3).map(i => i.title));
          // Simple parsing of text response to array
          const recArray = res.split('\n').filter(l => l.trim()).map(l => l.replace(/^\d+\.\s*/, '').trim());
          setAiRecs(recArray.slice(0, 5));
        } catch (e) {
          console.error(e);
        } finally {
          setFetchingRecs(false);
        }
      }
    };
    if (items.length > 0) fetchRecs();
  }, [user, items.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-emerald-600 p-8 sm:p-16 overflow-hidden mb-16 shadow-2xl shadow-emerald-200">
        <div className="max-w-2xl relative z-10">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl sm:text-6xl font-black text-white leading-tight mb-6"
          >
            One person's clutter, <br />
            <span className="text-emerald-200">another's treasure.</span>
          </motion.h1>
          <p className="text-emerald-50 text-lg mb-8 opacity-90">
            Join your local community in reducing waste and sharing resources. 
            Borrowed, swapped, or gifted — it's all part of the Echo.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-emerald-700 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-emerald-50 transition-all">
              Browse Items
            </button>
            <div className="hidden sm:flex items-center gap-2 text-emerald-100 font-medium">
              <span className="w-10 h-1 bg-emerald-400 rounded-full" />
              Trusted by 2,000+ neighbors
            </div>
          </div>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-500/30 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-emerald-400/20 blur-3xl rounded-full" />
      </section>

      {/* AI Recommendations */}
      {user && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Sparkles size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Smart Discovery</h2>
                <p className="text-gray-500 text-sm">Personalized suggestion based on your activity</p>
              </div>
            </div>
            {fetchingRecs && <Loader2 className="animate-spin text-blue-500" size={20} />}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {aiRecs.map((rec, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-blue-50 to-emerald-50 p-6 rounded-2xl border border-blue-100 flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-all">
                  <Search size={20} className="text-blue-500" />
                </div>
                <span className="font-bold text-blue-900 text-sm leading-tight">{rec}</span>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Main Feed */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Recent Arrivals</h2>
          <button className="text-emerald-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">
            View all <ArrowRight size={18} />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-100 rounded-2xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
