
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Professional, Service } from '../../types';
import { PencilIcon, TrashIcon, PlusCircleIcon } from '../../components/icons/Icons';

const ProfessionalModal: React.FC<{
    professional: Professional | null;
    onClose: () => void;
    onSave: (prof: Professional) => void;
    allServices: Service[];
}> = ({ professional, onClose, onSave, allServices }) => {
    const [name, setName] = useState(professional?.name || '');
    const [selectedServices, setSelectedServices] = useState<string[]>(professional?.services || []);

    const handleServiceToggle = (serviceId: string) => {
        setSelectedServices(prev => 
            prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]
        );
    };

    const handleSave = () => {
        if (name.trim()) {
            onSave({
                id: professional?.id || '',
                name,
                services: selectedServices,
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">{professional ? 'Editar' : 'Adicionar'} Profissional</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="prof-name" className="block text-sm font-medium text-slate-700">Nome</label>
                        <input type="text" id="prof-name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Serviços Oferecidos</label>
                        <div className="mt-2 space-y-2 max-h-48 overflow-y-auto p-2 border border-slate-300 rounded-md">
                            {allServices.map(service => (
                                <div key={service.id} className="flex items-center">
                                    <input
                                        id={`service-${service.id}`}
                                        type="checkbox"
                                        checked={selectedServices.includes(service.id)}
                                        onChange={() => handleServiceToggle(service.id)}
                                        className="h-4 w-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
                                    />
                                    <label htmlFor={`service-${service.id}`} className="ml-3 text-sm text-slate-600">{service.name}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-colors">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition-colors">Salvar</button>
                </div>
            </div>
        </div>
    );
};


const ProfessionalsDashboard: React.FC = () => {
    const { professionals, services, addProfessional, updateProfessional, deleteProfessional } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);

    const handleSave = (prof: Professional) => {
        if (editingProfessional) {
            updateProfessional(prof);
        } else {
            addProfessional(prof);
        }
        setIsModalOpen(false);
        setEditingProfessional(null);
    };

    const handleEdit = (prof: Professional) => {
        setEditingProfessional(prof);
        setIsModalOpen(true);
    };
    
    const handleAddNew = () => {
        setEditingProfessional(null);
        setIsModalOpen(true);
    }
    
    const getServiceNames = (serviceIds: string[]) => {
        return serviceIds.map(id => services.find(s => s.id === id)?.name).filter(Boolean).join(', ');
    };

    return (
        <div>
            {isModalOpen && <ProfessionalModal professional={editingProfessional} onClose={() => setIsModalOpen(false)} onSave={handleSave} allServices={services} />}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-slate-700">Gerenciar Profissionais</h3>
                <button onClick={handleAddNew} className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition-colors">
                    <PlusCircleIcon className="h-5 w-5"/>
                    Adicionar
                </button>
            </div>
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <ul className="divide-y divide-slate-200">
                    {professionals.map(prof => (
                        <li key={prof.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                            <div>
                                <p className="text-lg font-medium text-slate-900">{prof.name}</p>
                                <p className="text-sm text-slate-500">{getServiceNames(prof.services) || 'Nenhum serviço associado'}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => handleEdit(prof)} className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-full"><PencilIcon className="h-5 w-5"/></button>
                                <button onClick={() => deleteProfessional(prof.id)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full"><TrashIcon className="h-5 w-5"/></button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProfessionalsDashboard;
