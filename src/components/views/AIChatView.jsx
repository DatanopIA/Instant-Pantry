import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { Send, Sparkles, Trash2, User, Bot, CookingPot, RotateCcw } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

const AIChatView = () => {
    const { t, inventory, recipes, dietSettings, language, pendingAiPrompt, setPendingAiPrompt } = usePantry();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                { id: 'initial', sender: 'bot', text: t('saludo_ia'), time: new Date() }
            ]);
        }

        if (pendingAiPrompt) {
            sendMessage(pendingAiPrompt);
            setPendingAiPrompt(null);
        }
    }, [language, t, messages.length, pendingAiPrompt]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isTyping]);

    const sendMessage = async (overrideText = null) => {
        const text = overrideText || inputText;
        if (!text.trim() || isTyping) return;

        const newMessage = { id: Date.now(), sender: 'user', text, time: new Date() };
        setMessages(prev => [...prev, newMessage]);
        if (!overrideText) setInputText('');
        setIsTyping(true);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    history: messages.map(m => ({ sender: m.sender, text: m.text })),
                    inventory: inventory || [],
                    recipes: recipes || [],
                    dietSettings: dietSettings,
                    language: language
                })
            });

            if (!response.ok) throw new Error('Servidor no responde');

            const data = await response.json();

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'bot',
                text: data.text || data.error || (language === 'en' ? "Culinary connection lost." : "Conexión culinaria perdida."),
                time: new Date()
            }]);
        } catch (err) {
            console.error('Chat error:', err);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'bot',
                text: "⚠️ Vaya, parece que he perdido la conexión con la cocina. ¿Puedes intentarlo de nuevo?",
                time: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="container" style={{
            paddingBottom: '20px',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '800px',
            margin: '0 auto'
        }}>
            <header className="pt-10 pb-6 flex justify-between items-center border-b border-zinc-100/50 mb-2">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#84A98C] flex items-center justify-center text-white shadow-lg shadow-[#84A98C]/20">
                        <CookingPot size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tighter text-zinc-900 uppercase">Chef Virtual</h1>
                        <div className="flex items-center gap-2">
                            <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-2 h-2 rounded-full bg-[#84A98C]"
                            />
                            <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Estatus: Gourmet AI</span>
                        </div>
                    </div>
                </div>
                <motion.button
                    whileHover={{ rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMessages([{ id: 1, sender: 'bot', text: t('saludo_ia'), time: new Date() }])}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-300 hover:text-zinc-600 transition-colors"
                >
                    <RotateCcw size={20} />
                </motion.button>
            </header>

            {/* Chat Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto py-6 px-1 flex flex-col gap-8 hide-scrollbar"
            >
                <AnimatePresence initial={false}>
                    {messages.map((m) => (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex gap-3 max-w-[85%] ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${m.sender === 'user' ? 'bg-zinc-900 text-white' : 'bg-[#84A98C] text-white'
                                    }`}>
                                    {m.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className={`px-5 py-4 rounded-2xl text-[0.95rem] leading-relaxed shadow-sm ${m.sender === 'user'
                                            ? 'bg-zinc-900 text-white rounded-tr-none'
                                            : 'bg-white border border-zinc-100 text-zinc-800 rounded-tl-none'
                                        }`}>
                                        {m.text}
                                    </div>
                                    <span className={`text-[9px] font-bold text-zinc-400 px-1 ${m.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                        {new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#84A98C] flex items-center justify-center text-white">
                            <Bot size={16} />
                        </div>
                        <div className="bg-white border border-zinc-100 px-5 py-3 rounded-2xl rounded-tl-none shadow-sm">
                            <div className="flex gap-1.5 items-center h-4">
                                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-1.5 bg-[#84A98C] rounded-full" />
                                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#84A98C] rounded-full" />
                                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#84A98C] rounded-full" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Sugerencias Rápidas */}
            <div className="flex gap-2 overflow-x-auto py-4 px-2 hide-scrollbar">
                {[
                    { text: "¿Qué cocino hoy?", icon: "🍳" },
                    { text: "¿Qué caduca pronto?", icon: "⏰" },
                    { text: "Receta exprés", icon: "⚡" },
                    { text: "Dieta semanal", icon: "📅" }
                ].map((chip) => (
                    <motion.button
                        key={chip.text}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => !isTyping && sendMessage(chip.text)}
                        disabled={isTyping}
                        className="px-5 py-2.5 rounded-full bg-white border border-zinc-100 text-[11px] font-black uppercase tracking-widest text-zinc-500 shadow-sm hover:border-[#84A98C] hover:text-[#84A98C] transition-all whitespace-nowrap flex items-center gap-2"
                    >
                        <span>{chip.icon}</span> {chip.text}
                    </motion.button>
                ))}
            </div>

            {/* Input Area */}
            <div className="pb-24 lg:pb-8">
                <GlassCard className="p-2 border-zinc-100 shadow-2xl shadow-zinc-900/5 group" hover={false}>
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder={isTyping ? "Preparando respuesta..." : t('preguntar_ia')}
                            disabled={isTyping}
                            className="flex-1 py-4 pl-6 pr-16 bg-transparent text-zinc-900 font-medium outline-none text-base"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => sendMessage()}
                            disabled={isTyping || !inputText.trim()}
                            className="absolute right-2 w-12 h-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-lg disabled:opacity-30 disabled:grayscale transition-all"
                        >
                            <Send size={20} />
                        </motion.button>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default AIChatView;
