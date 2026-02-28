import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Lock, Eye, ShieldCheck, Scale, FileText, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    const sections = [
        {
            title: "1. Responsable del Tratamiento",
            icon: Shield,
            content: "Instant Pantry es una plataforma propiedad de DatanopIA (en adelante, 'la Aplicación'), con domicilio en España. Somos los responsables del tratamiento de sus datos personales y nos comprometemos a proteger su privacidad conforme al Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD)."
        },
        {
            title: "2. Tratamiento de Imágenes mediante IA (Escáner)",
            icon: Camera,
            content: "Nuestra función de Escáner utiliza visión artificial para procesar imágenes de sus productos. La Aplicación captura la imagen, extrae metadatos relevantes (nombre del producto, fecha de vencimiento) y los integra en su inventario. Las imágenes se procesan de forma transitoria y segura para esta finalidad exclusiva."
        },
        {
            title: "3. Finalidad del Tratamiento",
            icon: Eye,
            content: "Tratamos sus datos para: (a) Automatizar su inventario mediante la identificación visual de productos. (b) Gestionar alertas de caducidad personalizadas. (c) Proponer recetas basadas en sus existencias reales. No compartimos sus datos ni sus hábitos de consumo con terceros con fines comerciales."
        },
        {
            title: "4. Base Legal y Consentimiento",
            icon: Scale,
            content: "La base legal es la ejecución del servicio suscrito. Al utilizar el escáner inteligente, usted otorga su consentimiento para el procesamiento de las imágenes capturadas con el único fin de mejorar la precisión de su inventario."
        },
        {
            title: "5. Conservación y Seguridad",
            icon: Lock,
            content: "Sus datos y registros se almacenan en servidores cifrados dentro de la Unión Europea. Las imágenes capturadas por el escáner no se almacenan de forma permanente una vez extraída la información necesaria, garantizando su derecho a la minimización de datos."
        },
        {
            title: "6. Sus Derechos (ARCO-POL)",
            icon: ShieldCheck,
            content: "Puede ejercer sus derechos de Acceso, Rectificación, Supresión, Oposición y Portabilidad en cualquier momento. Para ello, envíe una solicitud a info@artbymaeki.com adjuntando una prueba de identidad o solicitándolo desde su área de usuario."
        }
    ];

    return (
        <div className="min-h-screen bg-transparent pb-20">
            {/* Header */}
            <header className="sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 z-10">
                <div className="flex items-center gap-4 px-5 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors font-display"
                    >
                        <ArrowLeft className="w-5 h-5 dark:text-white" />
                    </button>
                    <h1 className="font-bold text-lg dark:text-white font-display uppercase tracking-widest">Privacidad y Seguridad</h1>
                </div>
            </header>

            <div className="px-5 pt-8 max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="bg-primary/10 w-16 h-16 rounded-3xl flex items-center justify-center mb-6">
                        <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-black dark:text-white mb-2 italic font-display">DatanopIA Trust System</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-display">
                        En Instant Pantry, por DatanopIA, protegemos cada bit de tu hogar.
                        Este documento detalla el tratamiento de tu información bajo la normativa española vigente.
                    </p>
                </motion.div>

                <div className="space-y-4">
                    {sections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <section.icon className="w-4 h-4 text-primary" />
                                </div>
                                <h3 className="font-bold text-sm dark:text-white font-display uppercase italic">{section.title}</h3>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
                                {section.content}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-10 p-6 bg-primary rounded-4xl text-white text-center relative overflow-hidden shadow-2xl shadow-primary/30"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <FileText className="w-24 h-24" />
                    </div>
                    <h4 className="font-bold mb-2 font-display uppercase">Canal de Transparencia</h4>
                    <p className="text-xs opacity-90 mb-4 font-sans">
                        ¿Tienes dudas sobre el procesamiento de tus imágenes?
                    </p>
                    <button
                        onClick={() => window.location.href = 'mailto:info@artbymaeki.com'}
                        className="bg-white text-primary px-6 py-3 rounded-2xl text-xs font-bold w-full transform active:scale-95 transition-all font-display uppercase tracking-widest"
                    >
                        Contactar DPD (DatanopIA)
                    </button>
                </motion.div>

                <p className="text-center text-[10px] text-gray-400 mt-10 mb-20 font-display">
                    Última actualización: 27 de febrero de 2026. <br />
                    DatanopIA - Instant Pantry Project - Barcelona, España.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
