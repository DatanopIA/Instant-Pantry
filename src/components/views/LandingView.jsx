import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { ArrowRight, CookingPot, ShieldCheck, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AuroraBackground } from '../ui/AuroraBackground';

const LandingView = () => {
    const { loginGuest } = usePantry();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

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
        <AuroraBackground>
            <div className="relative z-10 w-full max-w-[1400px] mx-auto min-h-screen px-4 md:px-12 py-8 flex flex-col">

                {/* Header Section */}
                <header className="flex justify-between items-center mb-8 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                            <CookingPot size={22} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-xs uppercase tracking-[0.2em] text-main">Instant Pantry</span>
                            <span className="text-[9px] font-bold text-primary-light uppercase tracking-widest">Master 2026</span>
                        </div>
                    </motion.div>

                    <div className="hidden md:flex gap-8 items-center text-[10px] font-black uppercase tracking-widest text-muted">
                        <span className="cursor-pointer hover:text-primary transition-colors">Características</span>
                        <span className="cursor-pointer hover:text-primary transition-colors">Recetas Premium</span>
                        <span className="cursor-pointer hover:text-primary transition-colors">Club Gourmet</span>
                    </div>
                </header>

                <main className="flex-1 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">

                    {/* Visual Section - Circular Product Image */}
                    <div className="flex-1 w-full flex items-center justify-center lg:justify-start">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-full max-w-[500px] md:max-w-[700px] aspect-square flex items-center justify-center"
                        >
                            {/* Decorative element behind image */}
                            <div className="absolute inset-0 bg-primary-soft/30 rounded-full blur-[100px] -z-1" />

                            <div className="landing-image-circle">
                                <img
                                    src="/gourmet-landing.png"
                                    alt="Gourmet Ingredients"
                                />
                            </div>

                            {/* Floating Highlight Card */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-10 right-0 md:top-20 md:right-10 glass-panel p-6 rounded-3xl shadow-premium z-20 flex flex-col gap-2"
                            >
                                <div className="flex text-primary gap-1">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <span className="text-xs font-black uppercase text-main tracking-widest">Plan Maestro IA</span>
                                <span className="text-[10px] font-bold text-muted">Diseñado para tu salud.</span>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-8 md:gap-12 w-full max-w-[500px]">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 1 }}
                            className="flex flex-col gap-4 md:gap-6"
                        >
                            <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] md:text-xs">
                                Inteligencia Culinaria
                            </span>
                            <h1 className="text-5xl md:text-8xl font-black text-main leading-[0.95] tracking-tighter">
                                Tu cocina, <br />
                                <span className="text-primary-light italic">rediseñada.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-muted font-medium max-w-md mx-auto lg:mx-0 leading-relaxed pt-2">
                                Gestionamos tu despensa, diseñamos tus recetas y eliminamos el desperdicio. Todo con un toque Michelin.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="w-full flex flex-col gap-6"
                        >
                            {/* Auth Actions Area */}
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={loginGuest}
                                    className="btn-primary"
                                >
                                    Comenzar como Invitado
                                    <ArrowRight size={18} />
                                </button>

                                <div className="flex items-center gap-4 py-2">
                                    <div className="flex-1 h-px bg-border-color" />
                                    <span className="text-[9px] font-black uppercase text-zinc-300 tracking-widest">Acceso para profesionales</span>
                                    <div className="flex-1 h-px bg-border-color" />
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={handleGoogleLogin}
                                        disabled={loading}
                                        className="btn-secondary"
                                    >
                                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                                        Continuar con Google
                                    </button>

                                    <form onSubmit={handleLogin} className="flex flex-col gap-2">
                                        <input
                                            type="email"
                                            placeholder="Introduce tu Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full py-4 px-6 rounded-2xl bg-white border border-border-color focus:border-primary focus:outline-none text-sm font-bold placeholder:text-zinc-300 transition-all shadow-sm"
                                        />
                                        <button
                                            disabled={loading}
                                            type="submit"
                                            className="w-full py-4 rounded-2xl bg-zinc-900 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-colors"
                                        >
                                            {loading ? 'Preparando...' : 'Obtener Enlace Mágico'}
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <div className="flex items-center justify-center lg:justify-start gap-3 mt-4 text-muted pt-8 border-t border-border-color">
                                <ShieldCheck size={18} className="text-primary-light" />
                                <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Acceso seguro con encriptación de grado militar</span>
                            </div>
                        </motion.div>
                    </div>
                </main>

                <footer className="mt-auto py-12 flex flex-col md:flex-row justify-between items-center gap-4 text-muted border-t border-border-color">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em]">© 2026 DatanopIA. Hecho por chefs para el mundo.</p>
                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
                        <span className="cursor-pointer hover:text-primary">Términos</span>
                        <span className="cursor-pointer hover:text-primary">Privacidad</span>
                        <span className="cursor-pointer hover:text-primary">Soporte</span>
                    </div>
                </footer>
            </div>
        </AuroraBackground>
    );
};

export default LandingView;
