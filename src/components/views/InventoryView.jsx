import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { Trash2, AlertCircle, Plus, Search, SlidersHorizontal } from 'lucide-react';

const InventoryView = () => {
    const { t, inventory, deleteProduct, goTo } = usePantry();

    const getStatusColor = (exp) => {
        if (exp <= 2) return 'bg-status-red text-status-red';
        if (exp <= 5) return 'bg-status-yellow text-status-yellow';
        return 'bg-status-green text-status-green';
    };

    return (
        <div className="container animate-fade-in">
            <header className="pt-16 md:pt-20 pb-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <span className="text-accent font-black tracking-[0.2em] text-[10px] uppercase block mb-1">Tu Colección</span>
                        <h1 className="text-3xl font-black tracking-tighter text-main">{t('despensa')}</h1>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => goTo('add-product')}
                        className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20"
                    >
                        <Plus size={24} />
                    </motion.button>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex gap-3 mb-8">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                        <input
                            type="text"
                            placeholder="Buscar ingredientes..."
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-border-color shadow-sm focus:border-primary outline-none text-sm font-medium transition-all"
                        />
                    </div>
                    <button className="w-14 h-14 rounded-2xl border border-border-color flex items-center justify-center text-main hover:bg-zinc-50 transition-colors">
                        <SlidersHorizontal size={20} />
                    </button>
                </div>

                {/* Expiry Categories */}
                <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar snap-x">
                    {['Todos', 'Urgentes', 'Frescos', 'Secos'].map((cat, i) => (
                        <button
                            key={cat}
                            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] whitespace-nowrap border transition-all snap-start ${i === 0
                                ? 'bg-zinc-900 border-zinc-900 text-white shadow-md'
                                : 'bg-white border-border-color text-muted hover:border-primary/30'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            {/* Inventory List */}
            <div className="grid gap-4 mt-2">
                <AnimatePresence>
                    {inventory.map((item, index) => (
                        <motion.div
                            key={item.id || index}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.05 }}
                            className="premium-card p-5 group flex items-center gap-5 hover:border-primary/20 transition-all"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white border border-border-color flex items-center justify-center text-3xl shadow-sm group-hover:scale-105 transition-transform">
                                {item.icon || '📦'}
                            </div>

                            <div className="flex-1">
                                <h4 className="text-base font-black text-main mb-1 group-hover:text-primary transition-colors">
                                    {item.name}
                                </h4>
                                <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(item.exp).split(' ')[0]}`} />
                                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                                        {t('caduca_en').replace('{count}', item.exp)}
                                    </span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.1, color: '#ef4444' }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => deleteProduct(item.id)}
                                className="w-10 h-10 rounded-xl bg-zinc-50 text-muted/50 flex items-center justify-center hover:bg-red-50 transition-colors"
                            >
                                <Trash2 size={18} />
                            </motion.button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {inventory.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-200 mb-6">
                            <AlertCircle size={40} />
                        </div>
                        <h3 className="text-lg font-black text-main mb-2">Despensa vacía</h3>
                        <p className="text-xs text-muted font-medium max-w-[200px] leading-relaxed">
                            Añade algunos ingredientes para empezar a crear recetas inteligentes.
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default InventoryView;
