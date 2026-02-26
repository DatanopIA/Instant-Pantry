import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { ArrowRight, CookingPot, Mail, Globe, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const LandingView = () => {
    const { loginGuest } = usePantry();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        if (!email) return;
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOTP({
                email,
                options: { emailRedirectTo: window.location.origin },
            });
            if (error) throw error;
            alert('¡Revisa tu email para el enlace de acceso gourmet!');
        } catch (error) {
            console.error("Login Error:", error);
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
            console.error("Google Login Error:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden selection:bg-primary/20">
            {/* Background Layer */}
            <div className="landing-hero-bg" />
            <div className="landing-overlay" />

            {/* Content Layer */}
            <div className="relative z-10 w-full max-w-[1400px] mx-auto min-h-screen flex flex-col px-10 md:px-20 lg:px-32">

                {/* Header: More space from top and sides */}
                <header className="pt-24 md:pt-32 pb-16 flex justify-between items-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-5"
                    >
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-[1.2rem] bg-primary flex items-center justify-center text-white shadow-premium">
                            <CookingPot size={30} />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="font-black text-xs md:text-sm uppercase tracking-[0.5em] text-main leading-none">Instant Pantry</h1>
                            <span className="text-[9px] font-bold text-primary tracking-[0.3em] mt-2 opacity-70">MASTER EDITION 2026</span>
                        </div>
                    </motion.div>
                </header>

                {/* Main Content */}
                <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-32 py-16">

                    {/* Left Side: Hero Text */}
                    <div className="w-full lg:flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 mb-10 shadow-sm">
                                <Star size={14} className="text-primary fill-primary" />
                                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-main">Top 1 Innovación Culinaria</span>
                            </div>

                            <h2 className="text-5xl md:text-[6.5rem] lg:text-[7.5rem] font-black text-main leading-[0.85] tracking-tighter mb-10">
                                Tu cocina, <br />
                                <span className="text-primary italic font-serif opacity-90">rediseñada.</span>
                            </h2>

                            <p className="text-sm md:text-lg text-main/70 font-medium max-w-sm mx-auto lg:mx-0 leading-relaxed">
                                Transforma tus ingredientes cotidianos en experiencias gourmet asistidas por IA. El futuro de la gastronomía en tu despensa.
                            </p>
                        </motion.div>
                    </div>

                    {/* Right Side: Auth Card with more padding */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="w-full max-w-[440px]"
                    >
                        <div className="premium-glass p-10 md:p-12 rounded-[3rem] relative overflow-hidden group">
                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />

                            <div className="relative z-10 flex flex-col gap-10">
                                <div className="text-center md:text-left">
                                    <h3 className="text-2xl font-black text-main">Bienvenido Chef</h3>
                                    <p className="text-sm text-muted font-medium mt-1">Selecciona tu método de acceso</p>
                                </div>

                                {/* Guest Action */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        console.log("Guest Login Initiated");
                                        loginGuest();
                                    }}
                                    className="btn-primary w-full group relative z-50 overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-4 py-1.5 text-[12px]">
                                        MODO INVITADO
                                        <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                                    </span>
                                </button>

                                <div className="relative flex items-center gap-6 py-1">
                                    <div className="flex-1 h-px bg-main/10" />
                                    <span className="text-[10px] font-black text-muted uppercase tracking-widest">O con tu cuenta</span>
                                    <div className="flex-1 h-px bg-main/10" />
                                </div>

                                {/* Auth Options */}
                                <div className="flex flex-col gap-5">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleGoogleLogin();
                                        }}
                                        disabled={loading}
                                        className="btn-secondary w-full relative z-50 py-4 text-[12px]"
                                    >
                                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                                        Continuar con Google
                                    </button>

                                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-muted" />
                                            <input
                                                type="email"
                                                placeholder="Email del Chef"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="w-full py-5 pl-14 pr-6 rounded-[1.5rem] bg-white/50 backdrop-blur-sm border border-white/80 focus:border-primary focus:bg-white/80 outline-none text-[13px] font-medium shadow-sm transition-all text-main"
                                            />
                                        </div>
                                        <button
                                            disabled={loading || !email}
                                            type="submit"
                                            className="w-full py-5 rounded-[1.5rem] bg-main text-white font-black text-[11px] uppercase tracking-[0.25em] hover:bg-primary transition-all duration-300 disabled:opacity-50 relative z-50"
                                        >
                                            {loading ? 'Preparando...' : 'Acceso por Email'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </main>

                {/* Footer: More space from bottom and content */}
                <footer className="pt-20 pb-20 md:pb-28 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 w-full">
                    <div className="flex items-center gap-3 opacity-50">
                        <Globe size={16} />
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Global Master Access 2026</span>
                    </div>

                    <div className="flex gap-10 text-[11px] font-black uppercase tracking-[0.25em] text-main/50">
                        <span className="cursor-pointer hover:text-primary transition-colors">Privacidad</span>
                        <span className="cursor-pointer hover:text-primary transition-colors">Club</span>
                        <span className="cursor-pointer hover:text-primary transition-colors">IA Lab</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingView;
