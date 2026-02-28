import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Layout = ({ children }) => {
    const navigate = useNavigate();

    const navItems = [
        { icon: LucideIcons.Home, label: 'Hogar', path: '/' },
        { icon: LucideIcons.ClipboardList, label: 'Despensa', path: '/inventory' },
        { icon: LucideIcons.ChefHat, label: 'Recetas', path: '/recipes' },
        { icon: LucideIcons.Settings, label: 'Ajustes', path: '/profile' },
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-gray-800 dark:text-gray-100 flex justify-center font-display">
            <div className="w-full max-w-[430px] min-h-screen bg-white dark:bg-gray-900 shadow-2xl relative overflow-hidden flex flex-col">
                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto hide-scrollbar pb-32">
                    {children}
                </main>

                {/* Floating Action Button (Scanner) */}
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
                    <button
                        onClick={() => navigate('/scanner')}
                        className="w-16 h-16 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group border-4 border-white dark:border-gray-950 rotate-45 hover:rotate-[225deg]"
                    >
                        <div className="-rotate-45 group-hover:rotate-[-225deg] transition-all duration-300">
                            <LucideIcons.ScanLine className="w-8 h-8" />
                        </div>
                    </button>
                </div>

                {/* Bottom Navigation Bar */}
                <nav className="fixed bottom-0 w-full max-w-[430px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 pb-8 pt-4 px-6 z-40 rounded-t-[32px]">
                    <ul className="flex justify-between items-center px-2">
                        {navItems.map((item) => {
                            const Icon = item.icon || LucideIcons.HelpCircle;
                            return (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) => cn(
                                            "flex flex-col items-center transition-all duration-300",
                                            isActive ? "text-primary scale-110" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                        )}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <Icon className={cn("w-6 h-6 mb-1", isActive && "stroke-[2.5px]")} />
                                                <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
                                            </>
                                        )}
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Layout;
