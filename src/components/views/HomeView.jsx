import React from 'react';
import { motion } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { Sparkles, Clock, Flame, ChevronRight, Apple, Zap, LayoutGrid, Calendar, ArrowUpRight, Plus } from 'lucide-react';

const HomeView = () => {
    const { t, goTo, profileImage, inventory, recipes, setSelectedRecipe, checkRecipeIngredients } = usePantry();

    const urgentItems = inventory
        .filter(item => item.exp <= 3)
        .sort((a, b) => a.exp - b.exp)
        .slice(0, 3);

    const recipesWithMatch = recipes.map(r => ({
        ...r,
        comparison: checkRecipeIngredients(r.ingredients)
    })).sort((a, b) => b.comparison.match - a.comparison.match);

    const suggestedRecipes = recipesWithMatch.slice(0, 5);

    return (
        <div className="container animate-fade-in group/container">
            <header className="pt-16 md:pt-20 pb-12 flex justify-between items-center transition-all">
                <div className="flex flex-col gap-1">
                    <span className="text-accent font-black tracking-[0.2em] text-[10px] uppercase">
                        {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                    <h1 className="text-3xl font-black tracking-tighter text-main">
                        {t('bienvenido')}, <span className="text-primary">Chef</span>
                    </h1>
                </div>
                <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => goTo('profile')}
                    className="w-14 h-14 rounded-2xl bg-white shadow-premium border border-border-color p-1 cursor-pointer overflow-hidden"
                >
                    {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary">
                            <LayoutGrid size={24} />
                        </div>
                    )}
                </motion.div>
            </header>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-2 gap-5 mb-10">
                {/* Status Card - Full Width */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="premium-card col-span-2 p-8 relative overflow-hidden group cursor-pointer"
                    onClick={() => goTo('inventory')}
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-colors" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-border-color shadow-sm">
                                <motion.div
                                    animate={{ opacity: [1, 0.4, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className={`w-2 h-2 rounded-full ${urgentItems.length > 0 ? 'bg-status-red' : 'bg-status-green'}`}
                                />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted">IA Status</span>
                            </div>
                        </div>

                        <h3 className="text-2xl font-black mb-4 text-main leading-tight max-w-[80%]">
                            {urgentItems.length > 0
                                ? `Tienes ${urgentItems.length} ingredientes en riesgo crítico.`
                                : 'Tu despensa está en perfecto equilibrio.'}
                        </h3>

                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                            {t('inspeccionar_despensa')} <ArrowUpRight size={14} />
                        </div>
                    </div>
                </motion.div>

                {/* Expiry Alert Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="premium-card p-6 bg-status-red/5 border-status-red/10 border"
                >
                    <div className="w-10 h-10 rounded-xl bg-status-red/10 flex items-center justify-center text-status-red mb-4">
                        <Clock size={20} />
                    </div>
                    <h4 className="text-sm font-black text-main mb-1">Caducidad</h4>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-wider">{urgentItems.length} Alertas hoy</p>
                </motion.div>

                {/* Efficiency Card */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="premium-card p-6 bg-primary/5 border-primary/10 border"
                >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                        <Zap size={20} />
                    </div>
                    <h4 className="text-sm font-black text-main mb-1">Eficiencia</h4>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Zero Waste Mode</p>
                </motion.div>
            </div>

            {/* Premium Recipe Carousel */}
            <section className="mb-12">
                <div className="flex justify-between items-center mb-6 px-2">
                    <h2 className="text-xl font-black text-main tracking-tight uppercase tracking-[0.1em]">Sugerencias Chef</h2>
                    <button
                        onClick={() => goTo('recipes')}
                        className="text-primary font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-1 hover:gap-2 transition-all"
                    >
                        Ver todas <ChevronRight size={14} />
                    </button>
                </div>

                <div className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar snap-x px-2">
                    {suggestedRecipes.map((recipe, index) => (
                        <motion.div
                            key={recipe.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (index * 0.1) }}
                            className="flex-shrink-0 w-72 snap-center group cursor-pointer"
                            onClick={() => {
                                setSelectedRecipe(recipe);
                                goTo('recipe-detail');
                            }}
                        >
                            <div className="premium-card overflow-hidden h-96 flex flex-col group-hover:shadow-glow transition-all">
                                <div className="h-[60%] relative">
                                    <img
                                        src={recipe.img}
                                        alt={recipe.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop";
                                        }}
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-md text-main px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                                            {recipe.tags?.[0] || 'Gourmet'}
                                        </span>
                                    </div>
                                    {recipe.comparison.match === 100 && (
                                        <div className="absolute top-4 right-4">
                                            <div className="w-8 h-8 rounded-full bg-status-green flex items-center justify-center text-white shadow-lg">
                                                <Zap size={14} fill="currentColor" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                                    <div>
                                        <h3 className="text-lg font-black text-main leading-tight mb-2 group-hover:text-primary transition-colors">
                                            {recipe.title}
                                        </h3>
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-1.5 text-muted text-[10px] font-bold uppercase">
                                                <Clock size={12} className="text-primary" /> {recipe.time}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-muted text-[10px] font-bold uppercase">
                                                <Flame size={12} className="text-accent" /> {recipe.cal || '450 kcal'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black uppercase text-zinc-300 tracking-widest leading-none mb-1">Coincidencia</span>
                                            <span className={`text-sm font-black ${recipe.comparison.match === 100 ? 'text-status-green' : 'text-main'}`}>
                                                {recipe.comparison.match === 100 ? 'LISTO' : `${Math.round(recipe.comparison.match)}%`}
                                            </span>
                                        </div>
                                        <div className="w-10 h-10 rounded-full border border-border-color flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                                            <ChevronRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    <motion.div
                        className="flex-shrink-0 w-48 snap-center flex items-center justify-center"
                        onClick={() => goTo('recipes')}
                    >
                        <div className="w-20 h-20 rounded-full border-2 border-dashed border-border-color flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-all cursor-pointer">
                            <Plus size={32} />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* AI Assistant Quick Access */}
            <motion.div
                whileHover={{ y: -4 }}
                onClick={() => goTo('chat')}
                className="bg-zinc-900 p-6 rounded-[2rem] flex items-center justify-between cursor-pointer shadow-premium relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/30 transition-colors" />

                <div className="relative z-10">
                    <h3 className="text-white text-lg font-black tracking-tight mb-1">{t('pregunta_chef')}</h3>
                    <p className="text-white/50 text-xs font-medium uppercase tracking-wider">{t('optimiza_ingredientes')}</p>
                </div>

                <div className="relative z-10 w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-primary-bright">
                    <Sparkles size={28} />
                </div>
            </motion.div>
        </div>
    );
};

export default HomeView;
