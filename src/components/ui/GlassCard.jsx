import React from "react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

export const GlassCard = ({
    children,
    className,
    hover = true,
    glow = false,
    ...props
}) => {
    return (
        <motion.div
            whileHover={hover ? { y: -5, scale: 1.01 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
                "relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/40 backdrop-blur-xl dark:bg-black/40 dark:border-white/10",
                glow && "shadow-[0_0_20px_rgba(132,169,140,0.15)]",
                className
            )}
            {...props}
        >
            {/* Subtle inner highlight */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};
