import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { ArrowRight, Scan, Utensils, Zap, Globe, CookingPot, ChefHat, Sparkles, Box, ShieldCheck, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AuroraBackground } from '../ui/AuroraBackground';

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
            icon: <Scan size={20} />,
        },
        {
            title: "¿Qué cocinamos hoy?",
            subtitle: "TU CHEF PERSONAL",
            desc: "Imagina un chef con Michelin que conoce cada rincón de tu despensa. Eso es Instant Pantry.",
            icon: <ChefHat size={20} />,
        },
        {
            title: "Despensa Inteligente",
            subtitle: "MÁXIMA EFICIENCIA",
            desc: "Organización de nivel industrial en la palma de tu mano. Ahorra tiempo, dinero y el planeta.",
            icon: <Box size={20} />,
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % steps.length);
        }, 8000);
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
            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 py-8 flex flex-col min-h-screen">

                {/* Header Superior */}
                <header className="flex justify-between items-center mb-12 lg:mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 group cursor-pointer"
                    >
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-premium">
                            <CookingPot size={22} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black tracking-[0.2em] text-xs uppercase text-main">Instant Pantry</span>
                            <span className="text-[9px] font-bold text-accent tracking-[0.1em] uppercase">Inteligencia Gourmet</span>
                        </div>
                    </motion.div>

                    <div className="hidden md:flex items-center gap-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted">V 2.0 Pro</span>
                        <div className="w-px h-4 bg-border-color" />
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-100 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                                </div>
                            ))}
                        </div>
                        <span className="text-[10px] font-bold text-muted">+10k Chefs</span>
                    </div>
                </header>

                <main className="flex-1 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Hero Content */}
                    <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="flex flex-col gap-6"
                            >
                                <div className="flex items-center gap-3 self-center lg:self-start">
                                    <span className="w-8 h-px bg-accent" />
                                    <span className="text-accent font-black tracking-[0.3em] text-[10px] uppercase">
                                        {steps[activeStep].subtitle}
                                    </span>
                                </div>

                                <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] text-main max-w-2xl">
                                    {steps[activeStep].title}
                                </h1>

                                <p className="text-lg md:text-xl text-muted font-medium max-w-xl leading-relaxed">
                                    {steps[activeStep].desc}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        {/* Controls */}
                        <div className="flex gap-3 mt-12 bg-white/40 p-2 rounded-3xl backdrop-blur-sm border border-white/50">
                            {steps.map((step, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveStep(i)}
                                    className={`relative flex items-center justify-center p-3 rounded-2xl transition-all ${i === activeStep
                                            ? 'bg-primary text-white shadow-premium w-12 md:w-32'
                                            : 'bg-transparent text-primary/40 hover:bg-white/60 w-12'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {step.icon}
                                        <span className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap overflow-hidden transition-all ${i === activeStep ? 'max-w-[80px] opacity-1' : 'max-w-0 opacity-0'}`}>
                                            Paso {i + 1}
                                        </span>
                                    </div>
                                    {i === activeStep && (
                                        <motion.div
                                            layoutId="active-step"
                                            className="absolute inset-0 bg-primary rounded-2xl -z-1"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Auth Card */}
                    <div className="w-full max-w-[460px]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="premium-card p-8 md:p-12 relative overflow-hidden"
                        >
                            {/* Decorative Sparkle */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/5 blur-3xl rounded-full" />

                            <div className="relative z-10 flex flex-col gap-8">
                                <div className="text-center lg:text-left">
                                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-main mb-2">Comienza ahora</h2>
                                    <p className="text-xs font-bold text-muted uppercase tracking-widest">Experiencia culinaria inteligente</p>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <motion.button
                                        whileHover={{ y: -3, boxShadow: '0 20px 40px rgba(30, 47, 35, 0.2)' }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={loginGuest}
                                        className="btn-primary w-full py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-premium transition-all"
                                    >
                                        Acceso Invitado
                                        <ArrowRight size={16} />
                                    </motion.button>

                                    <div className="flex items-center gap-4 py-2">
                                        <div className="flex-1 h-px bg-border-color" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-300">pro chef login</span>
                                        <div className="flex-1 h-px bg-border-color" />
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={handleGoogleLogin}
                                            disabled={loading}
                                            className="flex items-center justify-center gap-4 py-3.5 rounded-2xl bg-white border border-border-color hover:bg-zinc-50 transition-all font-bold text-xs text-main"
                                        >
                                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
                                            Continuar con Google
                                        </button>

                                        <form onSubmit={handleLogin} className="flex flex-col gap-2">
                                            <input
                                                type="email"
                                                placeholder="Email Gourmet"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="w-full py-4 px-6 rounded-2xl bg-white/60 border border-border-color focus:border-primary focus:bg-white outline-none transition-all text-xs font-bold placeholder:text-zinc-300"
                                            />
                                            <button
                                                disabled={loading}
                                                type="submit"
                                                className="w-full py-3.5 rounded-2xl bg-zinc-900 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all"
                                            >
                                                {loading ? 'Preparando...' : 'Obtener Enlace de Acceso'}
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                <footer className="pt-6 border-t border-border-color flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex text-accent">
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill="currentColor" />)}
                                        </div>
                                        <span className="text-[9px] font-black uppercase text-muted">4.9 Apple Store</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={14} className="text-primary/40" />
                                        <span className="text-[9px] font-bold text-muted uppercase">Seguridad SSL</span>
                                    </div>
                                </footer>
                            </div>
                        </motion.div>
                    </div>
                </main>

                <footer className="mt-auto py-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest">© 2026 DatanopIA Labs. Todos los derechos reservados.</p>
                    <div className="flex gap-8">
                        {['Privacidad', 'Términos', 'Gourmet Club'].map(item => (
                            <button key={item} className="text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-colors">{item}</button>
                        ))}
                    </div>
                </footer>
            </div>
        </AuroraBackground>
    );
};

export default LandingView;

