
import React, { useState } from 'react';
import AppointmentsDashboard from './AppointmentsDashboard';
import ProfessionalsDashboard from './ProfessionalsDashboard';
import ServicesDashboard from './ServicesDashboard';
import AvailabilityDashboard from './AvailabilityDashboard';

type AdminTab = 'appointments' | 'professionals' | 'services' | 'availability';

const AdminView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('appointments');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'appointments':
                return <AppointmentsDashboard />;
            case 'professionals':
                return <ProfessionalsDashboard />;
            case 'services':
                return <ServicesDashboard />;
            case 'availability':
                return <AvailabilityDashboard />;
            default:
                return null;
        }
    };
    
    const TabButton: React.FC<{tab: AdminTab, label: string}> = ({ tab, label }) => {
        const isActive = activeTab === tab;
        return (
             <button
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-semibold transition-colors duration-200 border-b-4 ${
                    isActive
                        ? 'border-slate-700 text-slate-800'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
            >
                {label}
            </button>
        );
    }

    return (
        <div className="container mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Painel de Administração</h2>
            <div className="bg-white rounded-lg shadow-md">
                <div className="border-b border-slate-200">
                     <nav className="flex flex-wrap -mb-px">
                        <TabButton tab="appointments" label="Agendamentos" />
                        <TabButton tab="services" label="Serviços" />
                        <TabButton tab="professionals" label="Profissionais" />
                        <TabButton tab="availability" label="Disponibilidade" />
                    </nav>
                </div>
                <div className="p-6">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminView;
