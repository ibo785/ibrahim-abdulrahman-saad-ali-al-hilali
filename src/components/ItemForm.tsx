import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Upload, 
  Info, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight,
  Image as ImageIcon,
  Tag
} from 'lucide-react';
import { classifyItem } from '../services/geminiService';
import { createItem } from '../services/itemService';
import { ItemCondition, ItemStatus } from '../types';

export default function ItemForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    condition: ItemCondition.GOOD,
    categoryId: 'Others',
    imageUrl: '',
  });

  const [aiSuggestions, setAiSuggestions] = useState<{
    category: string;
    confidence: number;
    alternativeCategories: string[];
    suggestionNotes: string;
  } | null>(null);

  const handleClassify = async () => {
    if (!formData.title) return;
    setAiLoading(true);
    try {
      const suggestions = await classifyItem(formData.title, formData.description);
      setAiSuggestions(suggestions);
      if (suggestions.category) {
        setFormData(prev => ({ ...prev, categoryId: suggestions.category }));
      }
    } catch (error) {
      console.error("Classification failed", error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const itemId = await createItem({
        ...formData,
        imageUrls: formData.imageUrl ? [formData.imageUrl] : [],
        aiSuggestedCategory: aiSuggestions?.category,
        aiConfidence: aiSuggestions?.confidence,
        aiProcessed: !!aiSuggestions,
      });
      if (itemId) {
        navigate(`/items/${itemId}`);
      }
    } catch (error) {
      console.error("Submit failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Share an Item</h1>
        <p className="text-gray-500">List an object you no longer need and help your community.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Basic Info */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">1</div>
            <h2 className="font-bold text-lg text-gray-800">Basic Information</h2>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. Vintage Oak Chair"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all min-h-[100px]"
              placeholder="Describe its features, history, and why you're giving it away..."
            />
          </div>
        </div>

        {/* Step 2: Media & Condition */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">2</div>
            <h2 className="font-bold text-lg text-gray-800">Media & Condition</h2>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <ImageIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={e => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Condition</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {Object.values(ItemCondition).map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, condition: c }))}
                  className={`px-2 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg border transition-all ${
                    formData.condition === c 
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100' 
                    : 'bg-white border-gray-100 text-gray-500 hover:border-emerald-200'
                  }`}
                >
                  {c.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Classification Block */}
        <div className="bg-gradient-to-br from-emerald-50 to-blue-50 p-6 rounded-2xl border border-emerald-100 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div className="flex gap-3">
              <div className="p-2 bg-white rounded-xl shadow-sm text-emerald-600">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-bold text-emerald-900">AI Category Suggestion</h3>
                <p className="text-sm text-emerald-700 mb-4">Let Gemini classify your item automatically.</p>
                
                {aiSuggestions ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className="bg-white/80 backdrop-blur p-3 rounded-xl border border-emerald-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Suggested Category</span>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          {Math.round(aiSuggestions.confidence * 100)}% Match
                        </span>
                      </div>
                      <div className="text-emerald-900 font-bold text-lg flex items-center gap-2">
                        <Tag size={18} />
                        {aiSuggestions.category}
                      </div>
                      <p className="text-xs text-emerald-600 mt-2 italic">"{aiSuggestions.suggestionNotes}"</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setAiSuggestions(null)}
                        className="text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <button
                    type="button"
                    onClick={handleClassify}
                    disabled={aiLoading || !formData.title}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {aiLoading ? "Classifying..." : "Auto-Categorize"}
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* Decorative shapes */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-gray-200 hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish to Community"}
            <CheckCircle2 size={22} />
          </button>
        </div>
      </form>
    </div>
  );
}
