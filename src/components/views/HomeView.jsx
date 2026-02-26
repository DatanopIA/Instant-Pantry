import React from 'react';
import { motion } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { Sparkles, Clock, Flame, ChevronRight, Apple, Zap, CookingPot } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

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
        <div className="container" style={{ paddingBottom: '120px' }}>
            <header className="pt-10 pb-8 flex justify-between items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col"
                >
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40 mb-1">
                        {t('hoy')}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-zinc-900 leading-none">
                        {t('bienvenido')}<br />
                        <span className="text-[#84A98C]">PANTRY PRO</span>
                    </h1>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => goTo('profile')}
                    className="w-14 h-14 rounded-2xl bg-white shadow-xl border border-zinc-100 p-1 cursor-pointer overflow-hidden"
                >
                    {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                        <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                            <span className="material-icons-round">person</span>
                        </div>
                    )}
                </motion.div>
            </header>

            {/* Bento Grid Layout - Premium Transformation */}
            <div className="grid grid-cols-2 gap-5 mb-12">

                {/* Status Hero Card */}
                <GlassCard
                    className="col-span-2 p-8 bg-zinc-900 text-white dark:bg-zinc-900 overflow-hidden group"
                    glow
                >
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#84A98C]/20 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-[#84A98C]/30 transition-colors duration-700" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <motion.div
                                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className={`w-3 h-3 rounded-full ${urgentItems.length > 0 ? 'bg-red-400 shadow-[0_0_10px_#f87171]' : 'bg-[#84A98C] shadow-[0_0_10px_#84A98C]'}`}
                            />
                            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[#84A98C]">
                                {t('analisis_vanguard')}
                            </span>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-black mb-8 leading-tight max-w-xs">
                            {urgentItems.length > 0
                                ? t('protocolo_rescate', { count: urgentItems.length })
                                : t('ecosistema_equilibrio')}
                        </h3>

                        <motion.button
                            whileHover={{ x: 5 }}
                            onClick={() => goTo('inventory')}
                            className="bg-[#84A98C] text-zinc-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-[#84A98C]/20"
                        >
                            {t('inspeccionar_despensa')}
                            <ChevronRight size={16} />
                        </motion.button>
                    </div>
                </GlassCard>

                {/* Micro Stats */}
                <GlassCard className="p-6 bg-red-50/10 border-red-100/20">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
                        <Clock size={20} />
                    </div>
                    <h4 className="text-sm font-black mb-1 text-zinc-800">{t('caducidad')}</h4>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
                        {t('alertas_hoy', { count: urgentItems.length })}
                    </p>
                </GlassCard>

                <GlassCard className="p-6 bg-[#84A98C]/10 border-[#84A98C]/20">
                    <div className="w-10 h-10 rounded-xl bg-[#84A98C]/20 flex items-center justify-center text-[#84A98C] mb-4">
                        <Zap size={20} />
                    </div>
                    <h4 className="text-sm font-black mb-1 text-zinc-800">{t('eficiencia')}</h4>
                    <p className="text-[10px] font-bold text-[#84A98C] uppercase tracking-tighter">
                        {t('zero_waste')}
                    </p>
                </GlassCard>
            </div>

            {/* Premium Recipe Carousel */}
            <section className="mb-12">
                <div className="flex justify-between items-end mb-6 px-2">
                    <h2 className="text-2xl font-black tracking-tight text-zinc-900">
                        {t('cocinar_ahora')}
                    </h2>
                    <button
                        onClick={() => goTo('recipes')}
                        className="text-[10px] font-black uppercase tracking-widest text-[#84A98C] hover:text-[#D88C51] transition-colors flex items-center gap-1"
                    >
                        {t('explorar')} <ChevronRight size={14} />
                    </button>
                </div>

                <div className="carousel-container hide-scrollbar gap-5">
                    {suggestedRecipes.map((recipe, index) => (
                        <motion.div
                            key={recipe.id}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="carousel-item flex-shrink-0 w-[280px]"
                            onClick={() => {
                                setSelectedRecipe(recipe);
                                goTo('recipe-detail');
                            }}
                        >
                            <GlassCard className="h-[360px] p-0 border-zinc-100 hover:border-[#84A98C]/30 transition-all duration-500">
                                <div className="h-48 relative overflow-hidden">
                                    <img
                                        src={recipe.img}
                                        alt={recipe.title}
                                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop";
                                        }}
                                    />
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[9px] font-black text-white uppercase tracking-widest">
                                        {recipe.tags?.[0] || 'Gourmet'}
                                    </div>

                                    {/* Match Badge */}
                                    <div className={`absolute bottom-4 right-4 px-3 py-1 rounded-full text-[10px] font-black border backdrop-blur-md shadow-lg ${recipe.comparison.match === 100
                                            ? 'bg-[#84A98C]/20 border-[#84A98C] text-[#84A98C]'
                                            : 'bg-white/10 border-white/20 text-white'
                                        }`}>
                                        {recipe.comparison.match === 100 ? 'READY' : `${Math.round(recipe.comparison.match)}% MATCH`}
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col justify-between h-[calc(360px-192px)]">
                                    <h3 className="text-lg font-black leading-tight text-zinc-900 group-hover:text-[#84A98C] transition-colors">{recipe.title}</h3>

                                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                                        <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-400">
                                            <span className="flex items-center gap-1.5"><Clock size={14} className="text-zinc-300" /> {recipe.time}</span>
                                            <span className="flex items-center gap-1.5"><Flame size={14} className="text-zinc-300" /> {recipe.cal || '450'}</span>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}

                    {/* View All Card */}
                    <motion.div
                        className="carousel-item flex-shrink-0 w-[180px]"
                        onClick={() => goTo('recipes')}
                    >
                        <GlassCard className="h-[360px] flex flex-col items-center justify-center border-dashed border-zinc-200 bg-zinc-50/50">
                            <div className="w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 mb-4 group-hover:bg-[#84A98C] group-hover:text-white transition-all">
                                <ChevronRight size={24} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-zinc-400">{t('ver_todo')}</span>
                        </GlassCard>
                    </motion.div>
                </div>
            </section>

            {/* AI Assistant Quick Access - High End Upgrade */}
            <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                onClick={() => goTo('chat')}
                className="relative p-8 rounded-[2.5rem] bg-zinc-900 text-white overflow-hidden shadow-2xl shadow-zinc-900/40 cursor-pointer"
            >
                {/* Glowing AI Ring */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-[#84A98C]/20 rounded-full animate-pulse" />

                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={16} className="text-[#84A98C]" />
                            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-[#84A98C]">{t('inteligencia_artificial')}</span>
                        </div>
                        <h3 className="text-xl font-black md:text-2xl">{t('pregunta_chef')}</h3>
                        <p className="text-sm text-zinc-400 font-medium opacity-80">{t('optimiza_ingredientes')}</p>
                    </div>

                    <div className="w-16 h-16 rounded-2xl bg-[#84A98C]/10 border border-[#84A98C]/20 flex items-center justify-center shadow-inner">
                        <CookingPot size={32} className="text-[#84A98C]" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default HomeView;
