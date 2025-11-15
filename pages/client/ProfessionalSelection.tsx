
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Professional } from '../../types';
import { BookingData } from './ClientView';

interface ProfessionalSelectionProps {
    bookingData: BookingData;
    onNext: (data: { professional: Professional }) => void;
    onBack: () => void;
}

const ProfessionalSelection: React.FC<ProfessionalSelectionProps> = ({ bookingData, onNext, onBack }) => {
    const { professionals } = useAppContext();
    const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);

    const availableProfessionals = useMemo(() => {
        if (!bookingData.service) return [];
        return professionals.filter(p => p.services.includes(bookingData.service!.id));
    }, [bookingData.service, professionals]);

    const handleNext = () => {
        const professional = professionals.find(p => p.id === selectedProfessionalId);
        if (professional) {
            onNext({ professional });
        }
    };
    
    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Passo 2: Escolha um Profissional</h2>
            <p className="text-center text-slate-500 mb-6">Para o serviço: <span className="font-semibold">{bookingData.service?.name}</span></p>

            <div className="space-y-3">
                {availableProfessionals.length > 0 ? availableProfessionals.map(prof => (
                    <div
                        key={prof.id}
                        onClick={() => setSelectedProfessionalId(prof.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 flex items-center space-x-4 ${
                            selectedProfessionalId === prof.id
                                ? 'border-slate-700 bg-slate-100 ring-2 ring-slate-700'
                                : 'border-slate-300 bg-white hover:border-slate-500'
                        }`}
                    >
                         <img src={`https://i.pravatar.cc/150?u=${prof.id}`} alt={prof.name} className="h-12 w-12 rounded-full"/>
                         <span className="font-semibold text-slate-700">{prof.name}</span>
                    </div>
                )) : (
                    <p className="text-center text-slate-500 py-4">Nenhum profissional disponível para este serviço.</p>
                )}
            </div>

            <div className="mt-8 flex justify-between">
                <button onClick={onBack} className="px-6 py-3 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition-colors">
                    Voltar
                </button>
                <button
                    onClick={handleNext}
                    disabled={!selectedProfessionalId}
                    className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                    Próximo
                </button>
            </div>
        </div>
    );
};

export default ProfessionalSelection;
