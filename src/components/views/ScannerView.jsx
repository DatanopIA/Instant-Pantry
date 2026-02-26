import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { apiFetch } from '../../lib/api';
import { X, Camera, Receipt, Box, Sparkles, Check, Trash2, Plus, CookingPot, Loader2 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

const ScannerView = () => {
    const { goTo, prevView, addProductToInventory } = usePantry();
    const [isScanning, setIsScanning] = useState(false);
    const [scanMode, setScanMode] = useState('ticket'); // 'ticket' or 'fridge'
    const [detectedProducts, setDetectedProducts] = useState(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const scanInputRef = useRef(null);

    const resizeImage = (base64Str, maxWidth = 1024, maxHeight = 1024) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64Str;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
        });
    };

    const handleScanImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsScanning(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const originalBase64 = reader.result;
            try {
                const compressedBase64 = await resizeImage(originalBase64);
                const data = await apiFetch('/api/ai/analyze-image', {
                    method: 'POST',
                    body: JSON.stringify({ image: compressedBase64, mode: scanMode })
                });

                if (data.products && data.products.length > 0) {
                    setDetectedProducts(data.products.map(p => ({ ...p, selected: true })));
                } else {
                    alert('No se pudieron detectar productos. Inténtalo con otra foto.');
                }
            } catch (err) {
                console.error('Scan error:', err);
                alert('Error al procesar la imagen con la IA.');
            } finally {
                setIsScanning(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleConfirmProducts = async () => {
        if (isConfirming) return;
        setIsConfirming(true);
        try {
            const toAdd = detectedProducts.filter(p => p.selected);
            let addedCount = 0;
            for (const product of toAdd) {
                const success = await addProductToInventory({
                    name: product.name,
                    exp: product.exp || 7,
                    icon: product.icon || '📦',
                    status: (product.exp || 7) > 5 ? 'green' : (product.exp || 7) > 2 ? 'yellow' : 'red'
                });
                if (success) addedCount++;
            }
            if (addedCount > 0) {
                setDetectedProducts(null);
                goTo('inventory');
            }
        } finally {
            setIsConfirming(false);
        }
    };

    const toggleProductSelection = (index) => {
        const updated = [...detectedProducts];
        updated[index].selected = !updated[index].selected;
        setDetectedProducts(updated);
    };

    return (
        <div className="fixed inset-0 z-[1000] bg-zinc-950 text-white flex flex-col items-center overflow-hidden">
            {/* Top Navigation */}
            <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-50">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => goTo(prevView)}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white"
                >
                    <X size={24} />
                </motion.button>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full hidden md:flex items-center gap-3">
                    <Sparkles size={16} className="text-[#84A98C]" />
                    <span className="text-[10px] font-black tracking-widest uppercase">IA Gastronómica Activa</span>
                </div>

                <div className="w-12" /> {/* Spacer */}
            </div>

            {/* Mode Controls */}
            <div className="absolute top-28 z-50 flex gap-2 p-1 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10">
                <button
                    onClick={() => setScanMode('ticket')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${scanMode === 'ticket' ? 'bg-[#84A98C] text-zinc-950 shadow-lg' : 'text-zinc-400 hover:text-white'
                        }`}
                >
                    <Receipt size={16} /> Ticket
                </button>
                <button
                    onClick={() => setScanMode('fridge')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${scanMode === 'fridge' ? 'bg-[#84A98C] text-zinc-950 shadow-lg' : 'text-zinc-400 hover:text-white'
                        }`}
                >
                    <Box size={16} /> Nevera
                </button>
            </div>

            {/* Viewfinder Main */}
            <div className="flex-1 flex items-center justify-center relative w-full h-full p-4">
                <div className="relative w-full max-w-[340px] aspect-[3/4.5] group">
                    <AnimatePresence>
                        {isScanning && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-[100] bg-zinc-950/80 backdrop-blur-xl flex flex-col items-center justify-center rounded-[3rem] border-2 border-[#84A98C]/30"
                            >
                                <div className="relative">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                        className="w-24 h-24 border-4 border-[#84A98C]/20 border-t-[#84A98C] rounded-full"
                                    />
                                    <CookingPot size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#84A98C]" />
                                </div>
                                <motion.p
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="mt-8 text-xs font-black tracking-[0.4em] text-[#84A98C] uppercase"
                                >
                                    Procesando IA
                                </motion.p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Laser Line */}
                    {!isScanning && (
                        <motion.div
                            animate={{ top: ['10%', '90%', '10%'] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-[#84A98C] to-transparent shadow-[0_0_20px_#84A98C] z-20"
                        />
                    )}

                    {/* Corners */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none z-30">
                        <div className="flex justify-between">
                            <div className="w-12 h-12 border-t-4 border-l-4 border-[#84A98C] rounded-tl-3xl opacity-60" />
                            <div className="w-12 h-12 border-t-4 border-r-4 border-[#84A98C] rounded-tr-3xl opacity-60" />
                        </div>
                        <div className="flex justify-between">
                            <div className="w-12 h-12 border-b-4 border-l-4 border-[#84A98C] rounded-bl-3xl opacity-60" />
                            <div className="w-12 h-12 border-b-4 border-r-4 border-[#84A98C] rounded-br-3xl opacity-60" />
                        </div>
                    </div>

                    {/* Placeholder Content */}
                    <div className="absolute inset-0 rounded-[3rem] bg-zinc-900/40 border border-white/5 overflow-hidden flex flex-col items-center justify-center p-12 text-center">
                        <Camera size={64} className="text-zinc-800 mb-6" />
                        <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-2">
                            Modo {scanMode}
                        </h3>
                        <p className="text-[10px] font-bold text-zinc-600 leading-relaxed">
                            Ajusta el {scanMode === 'ticket' ? 'tíquet' : 'interior de la nevera'} al centro del visor para mejores resultados.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-16 md:bottom-24 z-50 flex flex-col items-center gap-6">
                {!detectedProducts && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => scanInputRef.current?.click()}
                        disabled={isScanning}
                        className="w-20 h-20 rounded-full border-[6px] border-white/10 p-1 bg-white/5 transition-all"
                    >
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-2xl">
                            <Camera size={32} className="text-zinc-950" />
                        </div>
                    </motion.button>
                )}
                <p className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">Toca para capturar</p>
            </div>

            <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={scanInputRef}
                onChange={handleScanImage}
                className="hidden"
            />

            {/* Results Modal */}
            <AnimatePresence>
                {detectedProducts && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="fixed inset-0 z-[1100] bg-zinc-950 flex flex-col p-8 md:p-12"
                    >
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h2 className="text-4xl font-black tracking-tighter text-white">Análisis IA</h2>
                                <p className="text-sm font-bold text-[#84A98C] uppercase tracking-widest mt-2">
                                    Hemos detectado {detectedProducts.length} productos
                                </p>
                            </div>
                            <button onClick={() => setDetectedProducts(null)} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 hide-scrollbar flex flex-col gap-4">
                            {detectedProducts.map((product, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20, delay: idx * 0.1 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    onClick={() => toggleProductSelection(idx)}
                                >
                                    <GlassCard
                                        className={`p-5 flex items-center gap-5 border-white/5 transition-all cursor-pointer ${product.selected ? 'bg-[#84A98C]/10 border-[#84A98C]/30 shadow-lg shadow-[#84A98C]/5' : 'opacity-40 grayscale'
                                            }`}
                                        hover={true}
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl">
                                            {product.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-lg font-black text-white">{product.name}</h4>
                                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-tighter">
                                                Vida media: {product.exp} días
                                            </p>
                                        </div>
                                        <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${product.selected ? 'bg-[#84A98C] border-[#84A98C]' : 'border-zinc-700'
                                            }`}>
                                            {product.selected && <Check size={18} className="text-zinc-950" />}
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-10 flex gap-4">
                            <button
                                onClick={() => setDetectedProducts(null)}
                                className="flex-1 py-5 rounded-2xl bg-white/5 text-zinc-400 font-black text-xs uppercase tracking-widest transition-all hover:bg-white/10"
                            >
                                Reintentar
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleConfirmProducts}
                                disabled={isConfirming || detectedProducts.filter(p => p.selected).length === 0}
                                className="flex-[2] py-5 rounded-2xl bg-[#84A98C] text-zinc-950 font-black text-xs uppercase tracking-widest shadow-xl shadow-[#84A98C]/20 flex items-center justify-center gap-3"
                            >
                                {isConfirming ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                                Añadir a Despensa ({detectedProducts.filter(p => p.selected).length})
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ScannerView;
