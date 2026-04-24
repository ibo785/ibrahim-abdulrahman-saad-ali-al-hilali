import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItem } from '../services/itemService';
import { requestItem } from '../services/transactionService';
import { Item, ItemStatus, TransactionType } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  ChevronLeft, 
  MessageCircle, 
  ShoppingBag, 
  Clock, 
  ShieldCheck, 
  User,
  Share2,
  Heart,
  Tag,
  Image as ImageIcon
} from 'lucide-react';
import { motion } from 'motion/react';

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      if (id) {
        const data = await getItem(id);
        setItem(data);
      }
      setLoading(false);
    };
    fetchItem();
  }, [id]);

  const handleRequest = async () => {
    if (!user || !item || !id) return;
    setRequesting(true);
    try {
      await requestItem(id, item.ownerId, message, TransactionType.REQUEST);
      alert("Request sent successfully!");
    } catch (e) {
      console.error(e);
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-gray-500">Loading item...</div>;
  if (!item) return <div className="p-20 text-center text-gray-500">Item not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors font-medium"
      >
        <ChevronLeft size={20} /> Back to browsing
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Images */}
        <section className="space-y-4">
          <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative">
            {item.imageUrls?.[0] ? (
              <img 
                src={item.imageUrls[0]} 
                alt={item.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <ImageIcon size={64} />
              </div>
            )}
            
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-700 shadow-lg hover:bg-white transition-all">
                <Heart size={20} />
              </button>
              <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-700 shadow-lg hover:bg-white transition-all">
                <Share2 size={20} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {item.imageUrls?.map((url, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>

        {/* Right: Info */}
        <section className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] bg-emerald-600 text-white px-3 py-1 rounded-full">
                {item.categoryId}
              </span>
              <span className="text-[11px] font-bold text-gray-500 uppercase px-3 py-1 bg-gray-100 rounded-full">
                {item.condition.replace('_', ' ')}
              </span>
            </div>
            
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">{item.title}</h1>
            
            <p className="text-gray-600 text-lg leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-gray-400 shadow-sm">
              <User size={32} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Offered by</p>
              <h3 className="font-bold text-gray-900 text-lg">Neighbor</h3>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                  <ShieldCheck size={16} /> 4.9 Trust
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="text-gray-500 text-sm">Active today</span>
              </div>
            </div>
          </div>

          {user?.uid !== item.ownerId && item.status === ItemStatus.AVAILABLE && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Add a message (Optional)</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none h-24"
                  placeholder="Tell the owner why you're interested..."
                />
              </div>
              
              <button
                onClick={handleRequest}
                disabled={requesting}
                className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black text-xl shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <ShoppingBag size={24} />
                {requesting ? "Sending Request..." : "Request this Item"}
              </button>
              
              <p className="text-center text-gray-400 text-sm flex items-center justify-center gap-2">
                <Clock size={16} /> Fast response usually within 1 hour
              </p>
            </div>
          )}

          {user?.uid === item.ownerId && (
            <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl">
              <h3 className="font-bold text-blue-900 mb-2">You own this item</h3>
              <p className="text-blue-700 text-sm">You can manage this item from your dashboard.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
