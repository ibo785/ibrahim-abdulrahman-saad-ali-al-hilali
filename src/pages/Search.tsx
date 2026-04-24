import { useState, useEffect } from 'react';
import { getItems } from '../services/itemService';
import { Item, ItemStatus } from '../types';
import ItemCard from '../components/ItemCard';
import { Search as SearchIcon, Filter, X } from 'lucide-react';

const CATEGORIES = ["Furniture", "Electronics", "Tools", "Kitchenware", "Clothing", "Books", "Toys", "Others"];

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      const data = await getItems();
      setItems(data);
      setLoading(false);
    };
    fetchItems();
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-gray-900 mb-6">Explore the Community</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for furniture, tools, books..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                className={`flex-shrink-0 px-6 py-4 rounded-2xl font-bold text-sm transition-all border ${
                  selectedCategory === cat
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100'
                  : 'bg-white border-gray-100 text-gray-500 hover:border-emerald-200'
                }`}
              >
                {cat}
              </button>
            ))}
            {selectedCategory && (
              <button 
                onClick={() => setSelectedCategory(null)}
                className="p-4 rounded-2xl bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-500 font-medium">Found {filteredItems.length} items</p>
          <button className="flex items-center gap-2 text-gray-900 font-bold text-sm">
            <Filter size={18} /> Filters
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-gray-50 rounded-2xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
        
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 shadow-sm">
              <SearchIcon size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
