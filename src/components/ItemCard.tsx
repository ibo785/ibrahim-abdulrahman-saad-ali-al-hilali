import { Link } from 'react-router-dom';
import { Item, ItemStatus } from '../types';
import { MapPin, Info, Tag } from 'lucide-react';
import { motion } from 'motion/react';

interface ItemCardProps {
  item: Item;
}

const statusColors = {
  [ItemStatus.AVAILABLE]: 'bg-emerald-100 text-emerald-800',
  [ItemStatus.PENDING]: 'bg-amber-100 text-amber-800',
  [ItemStatus.RESERVED]: 'bg-blue-100 text-blue-800',
  [ItemStatus.EXCHANGED]: 'bg-gray-100 text-gray-800',
};

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
    >
      <Link to={`/items/${item.id}`} className="block relative">
        <div className="aspect-[4/3] overflow-hidden bg-gray-50">
          {item.imageUrls?.[0] ? (
            <img 
              src={item.imageUrls[0]} 
              alt={item.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <Tag size={48} />
            </div>
          )}
        </div>
        <div className="absolute top-3 left-3">
          <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${statusColors[item.status]}`}>
            {item.status}
          </span>
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link to={`/items/${item.id}`} className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
            {item.title}
          </Link>
          <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded capitalize">
            {item.condition.replace('_', ' ')}
          </span>
        </div>
        
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">
          {item.description}
        </p>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Info size={14} />
            <span className="text-[12px] font-medium">{item.categoryId}</span>
          </div>
          
          <Link 
            to={`/items/${item.id}`}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
