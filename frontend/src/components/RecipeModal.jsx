import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, ChefHat, Star, Users, Flame, Activity } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { aiService } from '../services/aiService';

const RecipeModal = ({ recipe, isOpen, onClose }) => {
    const { features } = useSubscription();
    const [nutritionData, setNutritionData] = useState(null);
    const [loadingNutrition, setLoadingNutrition] = useState(false);

    if (!recipe) return null;

    const imageUrl = recipe.image_url || recipe.image || 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&auto=format&fit=crop';

    // Process instructions which might be a string with newlines, or undefined for mocks
    let parsedInstructions = [];
    if (typeof recipe.instructions === 'string') {
        parsedInstructions = recipe.instructions.split('\n').filter(line => line.trim() !== '');
    } else if (Array.isArray(recipe.instructions)) {
        parsedInstructions = recipe.instructions;
    } else {
        parsedInstructions = [
            "1. Prepara todos los ingredientes indicados.",
            "2. Sigue los pasos de cocción adecuados según el plato.",
            "3. Mezcla bien y sazona al gusto.",
            "4. Sirve caliente y disfruta."
        ];
    }

    const handleAnalyzeNutrition = async () => {
        if (!features.canUseNutritionalAnalysis) return;
        setLoadingNutrition(true);
        try {
            const data = await aiService.analyzeNutrition(recipe.title, recipe.ingredients || []);
            setNutritionData(data);
        } catch (error) {
            console.error(error);
            // Mostrar error amigable o silenciar
        } finally {
            setLoadingNutrition(false);
        }
    };

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
                        className="relative bg-white dark:bg-gray-900 w-full sm:max-w-lg sm:rounded-[40px] rounded-t-[40px] shadow-3xl overflow-hidden flex flex-col h-[85vh] sm:h-[80vh] border border-white/10"
                    >
                        {/* Header Image */}
                        <div className="relative h-64 shrink-0 bg-gray-100 dark:bg-gray-800">
                            <img
                                src={imageUrl}
                                alt={recipe.title}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&auto=format&fit=crop'; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="absolute bottom-4 left-4 right-4">
                                {recipe.category && (
                                    <span className="inline-block px-3 py-1 bg-primary/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm mb-2">
                                        {recipe.category}
                                    </span>
                                )}
                                <h2 className="text-2xl font-black text-white leading-tight mb-2">
                                    {recipe.title}
                                </h2>
                                <div className="flex gap-4">
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-white/90">
                                        <Clock className="w-3.5 h-3.5" /> {recipe.time || '15 min'}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-white/90">
                                        <ChefHat className="w-3.5 h-3.5" /> {recipe.difficulty || 'Media'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 hide-scrollbar bg-gray-50/50 dark:bg-gray-950/50">

                            {/* Matches info if available (for personalized recipes) */}
                            {recipe.match && (
                                <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <Star className="w-4 h-4 text-primary fill-primary" />
                                            Tienes {recipe.match.count} de {recipe.match.total} ingredientes
                                        </h3>
                                        <span className="text-sm font-black text-primary">{recipe.match.matchPercent}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${recipe.match.matchPercent}%` }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                            className={`h-full rounded-full ${recipe.match.matchPercent === 100 ? 'bg-green-500' : 'bg-primary'}`}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Ingredients */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center">
                                        <Star className="w-4 h-4" />
                                    </span>
                                    Ingredientes
                                </h3>
                                <ul className="space-y-3">
                                    {(recipe.ingredients || []).map((ingredient, idx) => {
                                        const isMatched = recipe.match?.matchedList?.includes(ingredient);
                                        const isMissing = recipe.match?.missingList?.includes(ingredient);

                                        return (
                                            <li key={idx} className={`flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border ${isMissing ? 'border-red-100 dark:border-red-900/30' : isMatched ? 'border-green-100 dark:border-green-900/30' : 'border-gray-50 dark:border-gray-700'}`}>
                                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isMissing ? 'bg-red-400' : isMatched ? 'bg-green-400' : 'bg-primary/50'}`} />
                                                <span className={`text-sm font-medium ${isMissing ? 'text-red-600 dark:text-red-400' : isMatched ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                                    {ingredient}
                                                </span>
                                                {isMissing && <span className="ml-auto text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded uppercase">Falta</span>}
                                                {isMatched && <span className="ml-auto text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded uppercase">Lo tienes</span>}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            {/* Instructions */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                        <ChefHat className="w-4 h-4" />
                                    </span>
                                    Instrucciones
                                </h3>
                                <div className="space-y-4">
                                    {parsedInstructions.map((step, idx) => {
                                        // Try to extract the step number if it already has one (e.g. "1. Do something")
                                        const stepMatch = step.match(/^(\d+)[.-]\s*(.*)$/);
                                        const displayNum = stepMatch ? stepMatch[1] : (idx + 1);
                                        const displayText = stepMatch ? stepMatch[2] : step;

                                        return (
                                            <div key={idx} className="flex gap-4">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center font-bold text-gray-500 dark:text-gray-400 text-sm">
                                                    {displayNum}
                                                </div>
                                                <p className="pt-1 text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    {displayText}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Nutritional Analysis Section (Elite feature) */}
                            {features.canUseNutritionalAnalysis && (
                                <div className="mt-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-500 flex items-center justify-center">
                                                <Activity className="w-4 h-4" />
                                            </span>
                                            Análisis Nutricional (Chef Elite)
                                        </h3>
                                        {!nutritionData && !loadingNutrition && (
                                            <button
                                                onClick={handleAnalyzeNutrition}
                                                className="px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-xl shadow-lg hover:bg-amber-600 transition-colors"
                                            >
                                                Analizar Receta
                                            </button>
                                        )}
                                    </div>

                                    {loadingNutrition && (
                                        <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-gray-800 rounded-2xl animate-pulse">
                                            <Activity className="w-5 h-5 text-amber-500 animate-bounce" />
                                            <span className="text-sm font-bold text-amber-700 dark:text-amber-500">Calculando macros por la IA...</span>
                                        </div>
                                    )}

                                    {nutritionData && !loadingNutrition && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                                        >
                                            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 text-center">
                                                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mx-auto mb-2 text-[10px] font-black uppercase">KCAL</div>
                                                <p className="font-black text-gray-900 dark:text-white text-lg">{nutritionData.calories}</p>
                                            </div>
                                            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 text-center">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mx-auto mb-2 text-[10px] font-black uppercase">PROT</div>
                                                <p className="font-black text-gray-900 dark:text-white text-lg">{nutritionData.protein}</p>
                                            </div>
                                            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 text-center">
                                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-500 flex items-center justify-center mx-auto mb-2 text-[10px] font-black uppercase">CARB</div>
                                                <p className="font-black text-gray-900 dark:text-white text-lg">{nutritionData.carbs}</p>
                                            </div>
                                            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 text-center">
                                                <div className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-2 text-[10px] font-black uppercase">GRAS</div>
                                                <p className="font-black text-gray-900 dark:text-white text-lg">{nutritionData.fat}</p>
                                            </div>
                                            {nutritionData.tags && nutritionData.tags.map(tag => (
                                                <div key={tag} className="col-span-2 sm:col-span-4 bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-500 text-xs font-bold py-2 px-4 rounded-lg text-center border border-amber-200 dark:border-amber-800/50">
                                                    ✨ {tag}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>
                            )}

                            <div className="pb-8"></div> {/* Bottom padding */}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RecipeModal;
