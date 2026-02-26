import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { ArrowRight, Scan, Utensils, Zap, Globe, CookingPot, ChefHat, Sparkles, Box, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AuroraBackground } from '../ui/AuroraBackground';
import { MagneticText } from '../ui/MagneticText';

const LandingView = () => {
    const { loginGuest } = usePantry();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            title: "¿Harto de tirar comida?",
            subtitle: "REVOLUCIÓN GOURMET",
            desc: "Nuestra IA de vanguardia detecta lo que tienes y diseña un plan maestro para tu alimentación.",
            icon: <Scan size={24} />,
            color: "var(--primary)"
        },
        {
            title: "¿Qué cocinamos hoy?",
            subtitle: "TU CHEF PERSONAL",
            desc: "Imagina un chef con Michelin que conoce cada rincón de tu despensa. Eso es Instant Pantry.",
            icon: <ChefHat size={24} />,
            color: "var(--accent)"
        },
        {
            title: "Despensa Inteligente",
            subtitle: "MÁXIMA EFICIENCIA",
            desc: "Organización de nivel industrial en la palma de tu mano. Ahorra tiempo, dinero y el planeta.",
            icon: <Box size={24} />,
            color: "var(--primary-bright)"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % steps.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [steps.length]);

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOTP({
                email,
                options: { emailRedirectTo: window.location.origin },
            });
            if (error) throw error;
            alert('¡Revisa tu email para el enlace de acceso gourmet!');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: window.location.origin }
            });
            if (error) throw error;
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuroraBackground className="min-h-screen">
            <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 py-12 lg:py-0 min-h-screen flex flex-col justify-center gap-12 lg:gap-20">

                {/* Header Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center lg:justify-start"
                >
                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-premium group-hover:scale-110 transition-transform">
                            <CookingPot size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black tracking-[0.3em] text-sm uppercase text-main">Instant Pantry</span>
                            <span className="text-[10px] font-bold text-accent tracking-widest uppercase">Inteligencia Gourmet</span>
                        </div>
                    </div>
                </motion.div>

                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">

                    {/* Hero Side */}
                    <div className="flex-1 text-center lg:text-left">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className="flex flex-col gap-6"
                            >
                                <span className="text-accent font-black tracking-[0.2em] text-xs md:text-sm uppercase bg-accent/10 px-4 py-2 rounded-full self-center lg:self-start">
                                    {steps[activeStep].subtitle}
                                </span>

                                <div className="relative">
                                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-main mb-4">
                                        {steps[activeStep].title.split(' ').map((word, i) => (
                                            <span key={i} className={i === 1 ? 'text-primary' : ''}>
                                                {word}{' '}
                                            </span>
                                        ))}
                                    </h1>
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ delay: 0.4, duration: 0.8 }}
                                        className="h-2 w-24 bg-accent rounded-full absolute -bottom-2 lg:left-0 left-1/2 -translate-x-1/2 lg:translate-x-0"
                                    />
                                </div>

                                <p className="text-lg md:text-2xl text-muted font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed mt-6">
                                    {steps[activeStep].desc}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex justify-center lg:justify-start gap-4 mt-12">
                            {steps.map((step, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveStep(i)}
                                    className={`group flex items-center gap-3 p-2 rounded-2xl transition-all ${i === activeStep
                                        ? 'bg-primary text-white px-6 shadow-premium'
                                        : 'bg-white/50 text-muted hover:bg-white'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${i === activeStep ? 'bg-white/20' : 'bg-primary/10'}`}>
                                        {step.icon}
                                    </div>
                                    <span className={`text-xs font-bold uppercase tracking-widest overflow-hidden transition-all ${i === activeStep ? 'w-auto' : 'w-0 opacity-0'}`}>
                                        Paso {i + 1}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="w-full max-w-[500px]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="premium-card p-10 md:p-14 relative"
                        >
                            <div className="absolute top-8 right-8 text-primary/20">
                                <Sparkles size={40} />
                            </div>

                            <div className="flex flex-col gap-10">
                                <div className="text-center lg:text-left">
                                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-main mb-2">Comienza ahora</h2>
                                    <p className="text-muted font-medium">Únete a la élite de la cocina inteligente.</p>
                                </div>

                                <div className="flex flex-col gap-5">
                                    <motion.button
                                        whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(var(--primary-rgb), 0.2)' }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={loginGuest}
                                        className="w-full py-5 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-premium"
                                    >
                                        Explorar como Invitado
                                        <ArrowRight size={20} />
                                    </motion.button>

                                    <div className="flex items-center gap-4 py-2">
                                        <div className="flex-1 h-px bg-border-color" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">identifícate</span>
                                        <div className="flex-1 h-px bg-border-color" />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <motion.button
                                            whileHover={{ y: -2, backgroundColor: '#f9fafb' }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleGoogleLogin}
                                            disabled={loading}
                                            className="flex items-center justify-center gap-4 py-4 rounded-2xl bg-white border border-border-color shadow-sm transition-all font-bold text-main"
                                        >
                                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                                            Acceder con Google
                                        </motion.button>
                                    </div>

                                    <form onSubmit={handleLogin} className="flex flex-col gap-3">
                                        <div className="relative group">
                                            <input
                                                type="email"
                                                placeholder="Tu email gourmet"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="w-full py-5 px-6 rounded-2xl bg-white/50 border border-border-color focus:border-primary focus:bg-white outline-none transition-all text-main font-bold placeholder:text-zinc-300"
                                            />
                                        </div>
                                        <motion.button
                                            whileHover={{ y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            disabled={loading}
                                            type="submit"
                                            className="w-full py-4 rounded-2xl bg-zinc-900 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl"
                                        >
                                            {loading ? 'Preparando...' : 'Email Mágico'}
                                        </motion.button>
                                    </form>
                                </div>

                                <div className="flex items-center justify-between pt-8 border-t border-border-color">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={16} className="text-status-green" />
                                        <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Acceso Seguro</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-black text-main">4.9/5</span>
                                            <span className="text-[8px] font-bold text-muted uppercase">App Rating</span>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                            <Globe size={18} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-bg-color to-transparent pointer-events-none z-1" />
        </AuroraBackground>
    );
};

export default LandingView;

