
import React from 'react';
import { AppView } from '../App';
import { CalendarIcon, CogIcon } from './icons/Icons';

interface HeaderProps {
    currentView: AppView;
    setView: (view: AppView) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
    
    const baseButtonClasses = "flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500";
    const activeButtonClasses = "bg-slate-700 text-white shadow-md";
    const inactiveButtonClasses = "bg-white text-slate-600 hover:bg-slate-200";

    return (
        <header className="bg-slate-800 text-white shadow-lg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
                <h1 className="text-2xl font-bold tracking-wider">Agendamento Pro</h1>
                <nav className="flex items-center gap-2 sm:gap-4 p-1 bg-slate-600 rounded-lg">
                    <button 
                        onClick={() => setView('client')}
                        className={`${baseButtonClasses} ${currentView === 'client' ? activeButtonClasses : inactiveButtonClasses}`}
                    >
                        <CalendarIcon className="h-5 w-5"/>
                        <span className="hidden sm:inline">Agendar</span>
                    </button>
                    <button 
                        onClick={() => setView('admin')}
                        className={`${baseButtonClasses} ${currentView === 'admin' ? activeButtonClasses : inactiveButtonClasses}`}
                    >
                         <CogIcon className="h-5 w-5"/>
                        <span className="hidden sm:inline">Admin</span>
                    </button>
                </nav>
            </div>
        </header>
    );
};
