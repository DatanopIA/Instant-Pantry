import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Plus, Package, ShoppingCart, CheckCircle2, Archive,
    Sparkles, X, ChevronRight, AlertCircle, Loader2
} from 'lucide-react';
import { inventoryService } from '../services/inventoryService';

const InventoryList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('pantry'); // 'pantry' or 'shopping'
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, item: null });

    // Search master products state
    const [searchResults, setSearchResults] = useState([]);
    const [searchingMaster, setSearchingMaster] = useState(false);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await inventoryService.getInventory();
            setItems(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handle search master products
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (activeTab === 'shopping' && searchTerm.trim().length >= 2) {
                setSearchingMaster(true);
                try {
                    const results = await inventoryService.searchProductsMaster(searchTerm.trim());
                    setSearchResults(results);
                    setShowResults(true);
                } catch (err) {
                    console.error(err);
                } finally {
                    setSearchingMaster(false);
                }
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, activeTab]);

    const handleMarkConsumed = async (item) => {
        setConfirmModal({ isOpen: true, item });
    };

    const confirmConsume = async () => {
        if (!confirmModal.item) return;
        try {
            await inventoryService.updateItemStatus(confirmModal.item.id, 'consumed');
            setItems(prev => prev.map(i =>
                i.id === confirmModal.item.id ? { ...i, status: 'consumed' } : i
            ));
            setConfirmModal({ isOpen: false, item: null });
        } catch (err) {
            console.error(err);
        }
    };

    const handleRestoreItem = async (item) => {
        try {
            await inventoryService.updateItemStatus(item.id, 'active');
            setItems(prev => prev.map(i =>
                i.id === item.id ? { ...i, status: 'active' } : i
            ));
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddFromSearch = async (product) => {
        if (!product) return;
        try {
            const newItem = {
                product_id: product.id,
                quantity: 1,
                current_unit: product.base_unit || 'unidades',
                status: 'consumed'
            };

            const results = await inventoryService.addItems([newItem]);
            if (results && results[0]) {
                const itemWithMaster = { ...results[0], products_master: product };
                setItems(prev => [itemWithMaster, ...prev]); // Add to top
            } else {
                await fetchData();
            }

            setSearchTerm('');
            setShowResults(false);
        } catch (err) {
            console.error("Error adding from search:", err);
            throw err;
        }
    };

    const handleManualAdd = async (customName) => {
        if (customName && typeof customName === 'object' && customName.nativeEvent) {
            customName.stopPropagation();
            customName = searchTerm;
        }

        const nameToAdd = (typeof customName === 'string' ? customName : searchTerm).trim();
        if (!nameToAdd || nameToAdd.length < 2) return;

        try {
            setSearchingMaster(true);
            const product = await inventoryService.getOrCreateProduct(nameToAdd);
            await handleAddFromSearch(product);
        } catch (err) {
            console.error("Error in manual add:", err);
        } finally {
            setSearchingMaster(false);
        }
    };

    const pantryItems = items.filter(item =>
        item.status === 'active' &&
        item.products_master?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const shoppingListItems = items.filter(item =>
        item.status === 'consumed'
    );

    const filteredShoppingItems = shoppingListItems.filter(item =>
        item.products_master?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const recommendedItems = [
        { id: 'rec1', name: 'Huevos Bio', category: 'Lácteos', base_unit: 'docena' },
        { id: 'rec2', name: 'Leche de Almendra', category: 'Lácteos', base_unit: 'litros' },
        { id: 'rec3', name: 'Aguacate Robusto', category: 'Fruta', base_unit: 'unidades' },
        { id: 'rec4', name: 'Pan Integral', category: 'Panadería', base_unit: 'unidades' },
    ];

    const pantryTotal = items.filter(item => item.status === 'active').length;
    const shoppingTotal = items.filter(item => item.status === 'consumed').length;
    const currentTotal = activeTab === 'pantry' ? pantryTotal : shoppingTotal;

    return (
        <div className="px-5 pt-8 min-h-screen pb-40" onClick={() => setShowResults(false)}>
            <header className="mb-6 relative z-50">
                <div className="flex justify-between items-end mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {activeTab === 'pantry' ? 'Mi Despensa' : 'Lista Compra'}
                    </h1>
                    <motion.span
                        key={`${activeTab}-${currentTotal}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm border border-primary/20"
                    >
                        {currentTotal} {currentTotal === 1 ? 'Artículo' : 'Artículos'}
                    </motion.span>
                </div>

                <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl flex mb-6">
                    <button
                        onClick={() => setActiveTab('pantry')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'pantry'
                            ? 'bg-white dark:bg-gray-700 shadow-sm text-primary'
                            : 'text-gray-500'
                            }`}
                    >
                        <Archive className="w-4 h-4" />
                        Despensa
                    </button>
                    <button
                        onClick={() => setActiveTab('shopping')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'shopping'
                            ? 'bg-white dark:bg-gray-700 shadow-sm text-primary'
                            : 'text-gray-500'
                            }`}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        A comprar
                    </button>
                </div>

                <div className="flex gap-3 relative">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={activeTab === 'pantry' ? "Buscar en despensa..." : "Añadir a la compra..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => activeTab === 'shopping' && searchTerm.trim().length >= 2 && setShowResults(true)}
                            className="w-full bg-white dark:bg-gray-800 border-none rounded-2xl py-3 pl-10 pr-4 text-sm shadow-sm focus:ring-2 focus:ring-primary/50 transition-all dark:text-white"
                        />
                        {searchingMaster && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                            </div>
                        )}
                    </div>

                    <AnimatePresence>
                        {showResults && activeTab === 'shopping' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-14 left-0 right-0 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-[100]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {searchResults.length > 0 ? (
                                    <div className="p-2 max-h-60 overflow-y-auto hide-scrollbar">
                                        {searchResults.map(prod => (
                                            <button
                                                key={prod.id}
                                                onClick={() => handleAddFromSearch(prod)}
                                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-2xl transition-all text-left group"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{prod.name}</p>
                                                    <p className="text-[10px] text-gray-400">{prod.category || 'Varios'} • {prod.base_unit || 'unidades'}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center">
                                        <p className="text-sm text-gray-500">¿No lo encuentras?</p>
                                        <button
                                            type="button"
                                            onClick={handleManualAdd}
                                            className="w-full text-primary font-bold text-sm mt-2 flex items-center justify-center gap-1 mx-auto hover:scale-105 active:scale-95 transition-all p-2"
                                        >
                                            Añadir "{searchTerm}" manualmente <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            <div className="space-y-6 relative z-10">
                <AnimatePresence mode="wait">
                    {activeTab === 'pantry' ? (
                        <motion.div
                            key="panty-tab"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-4"
                        >
                            {loading ? (
                                [1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)
                            ) : pantryItems.length > 0 ? (
                                pantryItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layoutId={item.id}
                                        className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50 flex items-center gap-4 group"
                                    >
                                        <div className="w-16 h-16 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {item.products_master?.image_url ? (
                                                <img src={item.products_master.image_url} alt={item.products_master.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Package className="w-8 h-8 text-gray-300" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 dark:text-white truncate">{item.products_master?.name}</h3>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-xs font-medium text-primary bg-primary/5 px-2 py-0.5 rounded-lg">
                                                    {item.quantity} {item.current_unit}
                                                </span>
                                                <span className="text-[10px] text-gray-400">•</span>
                                                <span className={`text-[10px] font-medium ${item.expires_at ? 'text-orange-500' : 'text-gray-400'}`}>
                                                    {item.expires_at ? `Exp. ${new Date(item.expires_at).toLocaleDateString()}` : 'Sin fecha'}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleMarkConsumed(item); }}
                                            className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl text-gray-400 hover:text-red-500 active:scale-90 transition-all"
                                        >
                                            <CheckCircle2 className="w-5 h-5" />
                                        </button>
                                    </motion.div>
                                ))
                            ) : (
                                <EmptyState icon={Package} text="Tu despensa está vacía" subtext="Escanea o añade productos para empezar" />
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="shopping-tab"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-6"
                        >
                            {!searchTerm && (
                                <section>
                                    <div className="flex items-center gap-2 mb-4 px-1 text-primary">
                                        <Sparkles className="w-5 h-5 fill-primary" />
                                        <h2 className="text-sm font-bold uppercase tracking-wider">Recomendados</h2>
                                    </div>
                                    <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                                        {recommendedItems.map(rec => (
                                            <div
                                                key={rec.id}
                                                onClick={() => handleManualAdd(rec.name)}
                                                className="flex-none w-40 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm group cursor-pointer active:scale-95 transition-all"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                    <Plus className="w-5 h-5 text-primary" />
                                                </div>
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{rec.name}</h4>
                                                <p className="text-[10px] text-gray-500">{rec.category}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            <section>
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">A Comprar pronto</h2>
                                    <button className="text-xs font-bold text-primary flex items-center gap-1">Añadir todo <ChevronRight className="w-3 h-3" /></button>
                                </div>
                                <div className="space-y-3">
                                    {filteredShoppingItems.length > 0 ? (
                                        filteredShoppingItems.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                layoutId={item.id}
                                                className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-4 group"
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/10 flex items-center justify-center text-orange-500">
                                                    <AlertCircle className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">{item.products_master?.name}</h3>
                                                    <p className="text-[10px] text-gray-400">Status: Agotado</p>
                                                </div>
                                                <button
                                                    onClick={() => handleRestoreItem(item)}
                                                    className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                            <p className="text-sm text-gray-400">No hay items que coincidan</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {confirmModal.isOpen && (
                    <div className="fixed inset-0 z-[60] flex items-end justify-center px-4 pb-12 sm:items-center sm:p-0">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setConfirmModal({ isOpen: false, item: null })}
                            className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            className="relative bg-white dark:bg-gray-900 w-full max-w-[400px] rounded-[32px] p-8 shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
                        >
                            <div className="absolute top-0 right-0 p-6">
                                <button onClick={() => setConfirmModal({ isOpen: false, item: null })} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6">
                                    <ShoppingCart className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">¿Se ha agotado?</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                                    Vamos a marcar <span className="font-bold text-primary">{confirmModal.item?.products_master?.name}</span> como consumido y añadirlo a tu lista de la compra.
                                </p>

                                <div className="flex flex-col w-full gap-3">
                                    <button
                                        onClick={confirmConsume}
                                        className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                                    >
                                        Sí, añadir a la lista
                                    </button>
                                    <button
                                        onClick={() => setConfirmModal({ isOpen: false, item: null })}
                                        className="w-full bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                                    >
                                        Ahora mismo no
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const EmptyState = ({ icon: Icon, text, subtext }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 opacity-50 px-8"
        >
            <Icon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{text}</h3>
            <p className="text-sm text-gray-500 mt-1">{subtext}</p>
        </motion.div>
    );
};

export default InventoryList;
