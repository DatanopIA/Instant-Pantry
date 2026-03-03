import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, ChefHat, Users, Sun, Moon, Coffee } from 'lucide-react';
import { aiService } from '../services/aiService';
import { inventoryService } from '../services/inventoryService';

const FamilyMenuModal = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [menuData, setMenuData] = useState(null);
    const [members, setMembers] = useState(2);
    const [days, setDays] = useState(7);

    const generateMenu = async () => {
        setLoading(true);
        try {
            const currentInventory = await inventoryService.getInventory();
            const data = await aiService.generateFamilyMenu(currentInventory, days, members);
            setMenuData(data);
        } catch (error) {
            console.error('Error generando el menú familiar:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-0">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-gray-950/60 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.95 }}
                        className="relative bg-gray-50 dark:bg-gray-900 w-full sm:max-w-2xl sm:rounded-[40px] rounded-t-[40px] shadow-3xl overflow-hidden flex flex-col h-[85vh] sm:h-[80vh] border border-white/10"
                    >
                        {/* Header */}
                        <div className="relative shrink-0 bg-primary p-6 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black">{menuData ? menuData.title : 'Planificador Familiar'}</h2>
                                    <p className="text-white/80 text-sm">{menuData ? 'Generado con tu despensa' : 'Configura tu menú semanal'}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-black/30 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 h-full hide-scrollbar">
                            {!menuData && !loading && (
                                <div className="space-y-6 max-w-sm mx-auto mt-8">
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
                                        <div>
                                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                                <Users className="w-4 h-4 text-primary" /> Miembros de la familia
                                            </label>
                                            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900 rounded-2xl p-2">
                                                <button onClick={() => setMembers(Math.max(1, members - 1))} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-sm font-bold">-</button>
                                                <span className="flex-1 text-center font-black text-xl dark:text-white">{members}</span>
                                                <button onClick={() => setMembers(members + 1)} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-sm font-bold">+</button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-primary" /> Días a planificar
                                            </label>
                                            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900 rounded-2xl p-2">
                                                <button onClick={() => setDays(Math.max(1, days - 1))} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-sm font-bold">-</button>
                                                <span className="flex-1 text-center font-black text-xl dark:text-white">{days}</span>
                                                <button onClick={() => setDays(Math.min(14, days + 1))} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-sm font-bold">+</button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={generateMenu}
                                            className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                                        >
                                            <ChefHat className="w-5 h-5" />
                                            Generar Menú Mágico
                                        </button>
                                    </div>
                                </div>
                            )}

                            {loading && (
                                <div className="flex flex-col items-center justify-center h-full space-y-4">
                                    <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center animate-bounce">
                                        <ChefHat className="w-8 h-8" />
                                    </div>
                                    <p className="text-gray-500 font-bold animate-pulse text-center">El Chef Inteligente está creando<br />un menú perfecto para tu familia...</p>
                                </div>
                            )}

                            {menuData && !loading && (
                                <div className="space-y-8">
                                    {/* Shopping List Needed */}
                                    {menuData.shoppingListNeeded && menuData.shoppingListNeeded.length > 0 && (
                                        <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-3xl border border-amber-100 dark:border-amber-800/30">
                                            <h3 className="text-amber-800 dark:text-amber-500 font-bold mb-3 flex items-center gap-2 text-sm">
                                                <span className="text-xl">🛒</span> Necesitarás comprar:
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {menuData.shoppingListNeeded.map((item, idx) => (
                                                    <span key={idx} className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm border border-gray-100 dark:border-gray-700">
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Days List */}
                                    <div className="space-y-6 pb-8">
                                        {menuData.days.map((dayData, idx) => (
                                            <div key={idx} className="bg-white dark:bg-gray-800 rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">{idx + 1}</span>
                                                    {dayData.day}
                                                </h3>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="flex gap-4">
                                                        <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center shrink-0">
                                                            <Coffee className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Desayuno</p>
                                                            <p className="font-medium text-gray-800 dark:text-gray-200">{dayData.breakfast}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-4">
                                                        <div className="w-10 h-10 rounded-2xl bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500 flex items-center justify-center shrink-0">
                                                            <Sun className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Comida</p>
                                                            <p className="font-medium text-gray-800 dark:text-gray-200">{dayData.lunch}</p>
                                                        </div>
                                                    </div>

                                                    {dayData.snack && (
                                                        <div className="flex gap-4">
                                                            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center shrink-0">
                                                                <ChefHat className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Merienda</p>
                                                                <p className="font-medium text-gray-800 dark:text-gray-200">{dayData.snack}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="flex gap-4">
                                                        <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 flex items-center justify-center shrink-0">
                                                            <Moon className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Cena</p>
                                                            <p className="font-medium text-gray-800 dark:text-gray-200">{dayData.dinner}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default FamilyMenuModal;
