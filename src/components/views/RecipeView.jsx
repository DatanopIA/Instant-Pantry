import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { Clock, Filter, Search, ChevronRight, AlertTriangle, CheckCircle2, Star, Flame } from 'lucide-react';

const RecipeView = () => {
    const { t, recipes, inventory, setSelectedRecipe, goTo } = usePantry();
    const [searchQuery, setSearchQuery] = useState('');

    const getMissingIngredients = (recipeIngredients) => {
        if (!recipeIngredients) return [];
        return recipeIngredients.filter(ing =>
            !inventory.some(item =>
                ing.toLowerCase().includes(item.name.toLowerCase()) ||
                item.name.toLowerCase().includes(ing.toLowerCase())
            )
        );
    };

    const filteredRecipes = recipes.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="container animate-fade-in">
            {/* Header */}
            <header className="pt-10 pb-6">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <span className="text-accent font-black tracking-[0.2em] text-[10px] uppercase block mb-1">Inspiración</span>
                        <h1 className="text-3xl font-black tracking-tighter text-main">{t('recetario')}</h1>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => goTo('diet')}
                        className="w-12 h-12 rounded-2xl bg-white border border-border-color flex items-center justify-center shadow-premium-sm text-primary"
                    >
                        <Filter size={20} />
                    </motion.button>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('buscar_recetas')}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-border-color shadow-sm focus:border-primary outline-none text-sm font-medium transition-all"
                    />
                </div>
            </header>

            {/* Recipes Grid */}
            <div className="grid gap-6 mt-4">
                <AnimatePresence mode="popLayout">
                    {filteredRecipes.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-20 text-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-200 mb-6">
                                <Search size={40} />
                            </div>
                            <h3 className="text-lg font-black text-main mb-2">No hay resultados</h3>
                            <p className="text-xs text-muted font-medium max-w-[200px] leading-relaxed mb-6">
                                Intenta con otros términos o ingredientes.
                            </p>
                            <button
                                onClick={() => setSearchQuery('')}
                                className="px-6 py-2.5 rounded-full bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest shadow-lg"
                            >
                                Limpiar búsqueda
                            </button>
                        </motion.div>
                    ) : (
                        filteredRecipes.map((recipe, index) => {
                            const missing = getMissingIngredients(recipe.ingredients);
                            const totalIng = recipe.ingredients?.length || 0;
                            const matchCount = totalIng - missing.length;
                            const matchPercentage = totalIng > 0 ? (matchCount / totalIng) * 100 : 0;
                            const isReady = missing.length === 0;

                            return (
                                <motion.div
                                    key={recipe.id || index}
                                    layout
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="premium-card overflow-hidden group cursor-pointer hover:border-primary/20 transition-all flex flex-col"
                                    onClick={() => {
                                        setSelectedRecipe(recipe);
                                        goTo('recipe-detail');
                                    }}
                                >
                                    <div className="h-48 relative overflow-hidden">
                                        <img
                                            src={recipe.img}
                                            alt={recipe.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => {
                                                e.target.src = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1000&auto=format&fit=crop";
                                            }}
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5 backdrop-blur-md ${isReady ? 'bg-status-green text-white' : 'bg-white/90 text-main'}`}>
                                                {isReady ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} className="text-accent" />}
                                                {isReady ? 'Para cocinar' : `${missing.length} faltan`}
                                            </span>
                                        </div>

                                        <div className="absolute bottom-4 right-4 py-1.5 px-3 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-white text-[10px] font-black tracking-widest">
                                            <span className="text-primary-bright font-black">{Math.round(matchPercentage)}%</span> MATCH
                                        </div>
                                    </div>

                                    <div className="p-6 bg-white">
                                        <div className="flex gap-1 mb-3">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Star key={s} size={10} fill={s <= (recipe.rating || 4) ? "#F49D1A" : "none"} color="#F49D1A" strokeWidth={2.5} />
                                            ))}
                                        </div>

                                        <h3 className="text-lg font-black text-main leading-tight mb-4 group-hover:text-primary transition-colors">
                                            {recipe.title}
                                        </h3>

                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-4">
                                                <div className="flex items-center gap-1.5 text-muted text-[10px] font-bold uppercase">
                                                    <Clock size={12} className="text-primary" /> {recipe.time}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-muted text-[10px] font-bold uppercase">
                                                    <Flame size={12} className="text-accent" /> {recipe.cal || '450 kcal'}
                                                </div>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-border-color flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                                                <ChevronRight size={18} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Match Progress Line */}
                                    <div className="h-1 bg-zinc-50 w-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${matchPercentage}%` }}
                                            className={`h-full ${isReady ? 'bg-status-green' : 'bg-primary'}`}
                                        />
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default RecipeView;
