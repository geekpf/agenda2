
import React from 'react';
import { BookingData } from './ClientView';
import { CheckIcon } from '../../components/icons/Icons';

interface ConfirmationProps {
    bookingData: BookingData;
    onNext: () => void;
}

const Confirmation: React.FC<ConfirmationProps> = ({ bookingData, onNext }) => {
    const { service, professional, date, time, clientName } = bookingData;

    return (
        <div className="text-center">
            <div className="mx-auto bg-green-100 rounded-full h-16 w-16 flex items-center justify-center">
                <CheckIcon className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-2">Agendamento Enviado!</h2>
            <p className="text-slate-600 mb-6">
                Obrigado, {clientName}! Seu pedido de agendamento foi enviado e está aguardando a confirmação do profissional. Você receberá uma notificação em breve.
            </p>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-left mb-8">
                <h3 className="font-bold text-lg text-slate-800 mb-2">Detalhes do Agendamento</h3>
                <p><span className="font-semibold">Serviço:</span> {service?.name}</p>
                <p><span className="font-semibold">Profissional:</span> {professional?.name}</p>
                <p><span className="font-semibold">Data:</span> {date?.toLocaleDateString('pt-BR')}</p>
                <p><span className="font-semibold">Hora:</span> {time}</p>
            </div>
            
            <button
                onClick={onNext}
                className="w-full px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:bg-slate-800 transition-colors"
            >
                Fazer Novo Agendamento
            </button>
        </div>
    );
};

export default Confirmation;
