
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Service } from '../../types';

interface ServiceSelectionProps {
    onNext: (data: { service: Service }) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ onNext }) => {
    const { services } = useAppContext();
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

    const handleNext = () => {
        const service = services.find(s => s.id === selectedServiceId);
        if (service) {
            onNext({ service });
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Passo 1: Escolha um Serviço</h2>
            <div className="space-y-3">
                {services.map(service => (
                    <div
                        key={service.id}
                        onClick={() => setSelectedServiceId(service.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedServiceId === service.id 
                                ? 'border-slate-700 bg-slate-100 ring-2 ring-slate-700' 
                                : 'border-slate-300 bg-white hover:border-slate-500'
                        }`}
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-slate-700">{service.name}</span>
                            <span className="text-slate-600">R$ {service.price.toFixed(2)}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleNext}
                    disabled={!selectedServiceId}
                    className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                    Próximo
                </button>
            </div>
        </div>
    );
};

export default ServiceSelection;
