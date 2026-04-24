import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTransactions } from '../services/transactionService';
import { getItems } from '../services/itemService';
import { Transaction, Item, TransactionStatus } from '../types';
import { Coins, Package, Repeat, Shield, Settings, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Profile() {
  const { profile } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (profile) {
        const [myItems, myTrans] = await Promise.all([
          getItems(), // Filtered later or we should have a specific service
          getTransactions('receiver')
        ]);
        setItems(myItems.filter(i => i.ownerId === profile.uid));
        setTransactions(myTrans);
      }
      setLoading(false);
    };
    fetchData();
  }, [profile]);

  if (!profile) return <div className="p-20 text-center">Please sign in to view your profile.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar: Profile Info */}
        <section className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="w-24 h-24 bg-emerald-50 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                < Shield size={40} className="text-emerald-500" />
              )}
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{profile.name}</h2>
            <p className="text-gray-400 text-sm mb-6">{profile.email}</p>
            
            <div className="flex justify-center gap-4 py-6 border-y border-gray-50 mb-6">
              <div className="text-center">
                <div className="text-emerald-600 font-black text-xl">{profile.points}</div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Points</div>
              </div>
              <div className="w-px bg-gray-100" />
              <div className="text-center">
                <div className="text-emerald-600 font-black text-xl">{profile.trustLevel}</div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Trust</div>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 text-gray-500 font-bold hover:text-emerald-600 transition-colors text-sm">
              <Settings size={16} /> Edit Profile
            </button>
          </div>

          <div className="bg-emerald-900 rounded-3xl p-6 text-white overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2">Become a Super Sharer</h3>
              <p className="text-emerald-200 text-sm mb-4 opacity-80">Donate 5 more items to unlock the Community Hero badge.</p>
              <div className="w-full bg-emerald-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-300 h-full w-2/3" />
              </div>
            </div>
            <Coins className="absolute -right-4 -bottom-4 text-emerald-800 opacity-30" size={120} />
          </div>
        </section>

        {/* Main: Items & Activity */}
        <section className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Package size={22} className="text-emerald-500" /> My Sharings
              </h2>
              <span className="text-xs font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-full">{items.length} items</span>
            </div>
            <div className="divide-y divide-gray-50">
              {items.length === 0 ? (
                <div className="p-12 text-center text-gray-400">You haven't shared any items yet.</div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group cursor-pointer">
                    <img src={item.imageUrls?.[0]} className="w-16 h-16 rounded-xl object-cover bg-gray-100" alt="" />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.categoryId}</p>
                    </div>
                    <div className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest ${
                      item.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {item.status}
                    </div>
                    <ChevronRight size={20} className="text-gray-300 group-hover:text-emerald-500" />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Repeat size={22} className="text-blue-500" /> Recent Requests
              </h2>
            </div>
            <div className="divide-y divide-gray-50">
              {transactions.length === 0 ? (
                <div className="p-12 text-center text-gray-400">No active requests.</div>
              ) : (
                transactions.map(t => (
                  <div key={t.id} className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                      <Repeat size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900">Request for Item</h4>
                        <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold uppercase">{t.status}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{new Date(t.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
