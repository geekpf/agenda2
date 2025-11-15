
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Service } from '../../types';
import { PencilIcon, TrashIcon, PlusCircleIcon } from '../../components/icons/Icons';

const ServiceModal: React.FC<{
    service: Service | null;
    onClose: () => void;
    onSave: (service: Service) => void;
}> = ({ service, onClose, onSave }) => {
    const [name, setName] = useState(service?.name || '');
    const [price, setPrice] = useState(service?.price || 0);
    const [duration, setDuration] = useState(service?.duration || 30);
    const [pixKey, setPixKey] = useState(service?.pixKey || '');
    const [pixQrCode, setPixQrCode] = useState<string | undefined>(service?.pixQrCode);


    const handleQrCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setPixQrCode(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };


    const handleSave = () => {
        if (name.trim() && price > 0 && duration > 0) {
            onSave({
                id: service?.id || '',
                name,
                price,
                duration,
                pixKey,
                pixQrCode
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">{service ? 'Editar' : 'Adicionar'} Serviço</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="service-name" className="block text-sm font-medium text-slate-700">Nome do Serviço</label>
                        <input type="text" id="service-name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"/>
                    </div>
                    <div>
                        <label htmlFor="service-price" className="block text-sm font-medium text-slate-700">Preço (R$)</label>
                        <input type="number" id="service-price" value={price} onChange={e => setPrice(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"/>
                    </div>
                    <div>
                        <label htmlFor="service-duration" className="block text-sm font-medium text-slate-700">Duração (minutos)</label>
                        <input type="number" id="service-duration" value={duration} onChange={e => setDuration(Number(e.target.value))} step="5" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"/>
                    </div>
                    <div>
                        <label htmlFor="service-pix-key" className="block text-sm font-medium text-slate-700">Chave PIX</label>
                        <input type="text" id="service-pix-key" value={pixKey} onChange={e => setPixKey(e.target.value)} placeholder="Email, CPF, Telefone, etc." className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"/>
                    </div>
                    <div>
                        <label htmlFor="service-pix-qr" className="block text-sm font-medium text-slate-700">QR Code PIX (Imagem)</label>
                        <div className="mt-1 flex items-center space-x-4">
                            {pixQrCode && <img src={pixQrCode} alt="QR Code Preview" className="h-16 w-16 object-contain border p-1 rounded-md bg-white" />}
                            <input type="file" id="service-pix-qr" accept="image/*" onChange={handleQrCodeChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"/>
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

const ServicesDashboard: React.FC = () => {
    const { services, addService, updateService, deleteService } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const handleSave = (service: Service) => {
        if (editingService) {
            updateService(service);
        } else {
            addService(service);
        }
        setIsModalOpen(false);
        setEditingService(null);
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setIsModalOpen(true);
    };
    
    const handleAddNew = () => {
        setEditingService(null);
        setIsModalOpen(true);
    }

    return (
        <div>
            {isModalOpen && <ServiceModal service={editingService} onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-slate-700">Gerenciar Serviços</h3>
                <button onClick={handleAddNew} className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition-colors">
                    <PlusCircleIcon className="h-5 w-5"/>
                    Adicionar
                </button>
            </div>
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <ul className="divide-y divide-slate-200">
                    {services.map(service => (
                        <li key={service.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                            <div>
                                <p className="text-lg font-medium text-slate-900">{service.name}</p>
                                <p className="text-sm text-slate-500">R$ {service.price.toFixed(2)} - {service.duration} min</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => handleEdit(service)} className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-full"><PencilIcon className="h-5 w-5"/></button>
                                <button onClick={() => deleteService(service.id)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full"><TrashIcon className="h-5 w-5"/></button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ServicesDashboard;