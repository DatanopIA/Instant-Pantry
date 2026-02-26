import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { Trash2, AlertCircle, Plus, Search, Filter, Calendar } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

const InventoryView = () => {
    const { t, inventory, deleteProduct, goTo } = usePantry();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('Todos');

    const filteredInventory = inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        if (activeFilter === 'Urgentes') return matchesSearch && item.exp <= 3;
        // Mock filters for demo
        return matchesSearch;
    });

    return (
        <div className="container" style={{ paddingBottom: '120px' }}>
            <header className="pt-10 pb-8">
                <div className="flex justify-between items-center mb-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-3xl font-black tracking-tighter text-zinc-900">{t('despensa')}</h1>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
                            {inventory.length} PRODUCTOS DISPONIBLES
                        </p>
                    </motion.div>
                </div>

                <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-[#84A98C] transition-colors">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar en tu inventario..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white border border-zinc-100 shadow-sm focus:border-[#84A98C] focus:ring-4 focus:ring-[#84A98C]/5 transition-all outline-none font-medium text-zinc-900"
                    />
                </div>
            </header>

            {/* Premium Filter Chips */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-4 hide-scrollbar -mx-2 px-2">
                {['Todos', 'Urgentes', 'Recientes', 'Favoritos'].map((cat) => (
                    <motion.button
                        key={cat}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveFilter(cat)}
                        className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 border ${activeFilter === cat
                                ? 'bg-zinc-900 text-white border-zinc-900 shadow-xl shadow-zinc-900/10'
                                : 'bg-white text-zinc-400 border-zinc-100 hover:border-zinc-200'
                            }`}
                    >
                        {cat}
                    </motion.button>
                ))}
            </div>

            {/* Inventory List - Grid Layout */}
            <div className="flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredInventory.map((item, index) => (
                        <motion.div
                            key={item.id || index}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <GlassCard className="p-5 flex items-center gap-5 border-zinc-100/50 hover:shadow-xl hover:shadow-zinc-900/5 transition-all group">
                                {/* Product Icon/Emoji with specialized background */}
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner transition-transform group-hover:scale-110 duration-500 ${item.exp <= 3 ? 'bg-red-50 text-red-500' : 'bg-[#84A98C]/10 text-[#84A98C]'
                                    }`}>
                                    {item.icon || '📦'}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-lg font-black text-zinc-900 group-hover:text-[#84A98C] transition-colors">{item.name}</h4>
                                        {item.exp <= 3 && (
                                            <div className="flex items-center gap-1 text-[8px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse uppercase">
                                                <AlertCircle size={8} /> URGENTE
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.max(10, 100 - (item.exp * 10))}%` }}
                                                    className={`h-full rounded-full ${item.exp <= 3 ? 'bg-red-500' : item.exp <= 7 ? 'bg-amber-400' : 'bg-[#84A98C]'
                                                        }`}
                                                />
                                            </div>
                                            <span className="text-[11px] font-bold text-zinc-400">
                                                {t('caduca_en').replace('{count}', item.exp)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: -10 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => deleteProduct(item.id)}
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </motion.button>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredInventory.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-24 text-center"
                    >
                        <div className="w-24 h-24 rounded-[2rem] bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-200 mb-6">
                            <AlertCircle size={40} />
                        </div>
                        <h3 className="text-xl font-black text-zinc-900 mb-2">Inventario Vacío</h3>
                        <p className="text-zinc-500 font-medium max-w-xs mx-auto">
                            No hemos encontrado lo que buscas. ¿Quieres añadir algo nuevo?
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Floating Action Button - Premium FAB */}
            <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => goTo('add-product')}
                className="fixed bottom-[110px] right-6 md:right-12 w-16 h-16 rounded-[1.5rem] bg-zinc-950 text-white flex items-center justify-center shadow-2xl shadow-zinc-950/20 z-50 group border border-white/10"
            >
                <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-tr from-[#84A98C]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Plus size={28} className="relative z-10" />
            </motion.button>
        </div>
    );
};

export default InventoryView;
