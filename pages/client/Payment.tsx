
import React, { useState } from 'react';
import { BookingData } from './ClientView';
import { useAppContext } from '../../context/AppContext';

interface PaymentProps {
    bookingData: BookingData;
    onNext: (data: { clientName: string, clientContact: string }) => void;
    onBack: () => void;
}

const Payment: React.FC<PaymentProps> = ({ bookingData, onNext, onBack }) => {
    const { addAppointment } = useAppContext();
    const [clientName, setClientName] = useState('');
    const [clientContact, setClientContact] = useState('');
    const [isPaid, setIsPaid] = useState(false);
    
    const { service, professional, date, time } = bookingData;
    const paymentValue = service ? service.price * 0.5 : 0;

    if (!service || !professional || !date || !time) {
        return <p>Informações do agendamento incompletas. Por favor, volte e tente novamente.</p>;
    }
    
    const handleConfirmBooking = () => {
        if (clientName.trim() && clientContact.trim()) {
             addAppointment({
                clientName: clientName.trim(),
                clientContact: clientContact.trim(),
                serviceId: service.id,
                professionalId: professional.id,
                date: date.toISOString().split('T')[0],
                time,
                price: service.price,
            });
            onNext({ clientName, clientContact });
        } else {
            alert('Por favor, preencha seu nome e contato.');
        }
    };
    
    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Passo 4: Pagamento e Confirmação</h2>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                <h3 className="font-bold text-lg text-slate-800 mb-2">Resumo do Agendamento</h3>
                <p><span className="font-semibold">Serviço:</span> {service.name}</p>
                <p><span className="font-semibold">Profissional:</span> {professional.name}</p>
                <p><span className="font-semibold">Data:</span> {date.toLocaleDateString('pt-BR')}</p>
                <p><span className="font-semibold">Hora:</span> {time}</p>
                <p className="mt-2 text-xl font-bold text-slate-900">
                    Total: R$ {service.price.toFixed(2)}
                </p>
            </div>

            <div className="mb-6 space-y-4">
                 <div>
                    <label htmlFor="client-name" className="block text-sm font-medium text-slate-700">Seu nome completo</label>
                    <input type="text" id="client-name" value={clientName} onChange={e => setClientName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500" required/>
                </div>
                 <div>
                    <label htmlFor="client-contact" className="block text-sm font-medium text-slate-700">Seu WhatsApp ou E-mail</label>
                    <input type="text" id="client-contact" value={clientContact} onChange={e => setClientContact(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500" required/>
                </div>
            </div>

            <div className="border-t pt-6">
                 <h3 className="font-bold text-lg text-slate-800 mb-2">Pagamento de Sinal (50%)</h3>
                 <p className="text-2xl font-bold text-green-600 mb-4">Valor: R$ {paymentValue.toFixed(2)}</p>

                {!isPaid ? (
                    <div className="text-center">
                        {service.pixKey || service.pixQrCode ? (
                            <>
                                <p className="mb-4">Para confirmar seu agendamento, pague o sinal via PIX.</p>
                                {service.pixQrCode && (
                                    <img src={service.pixQrCode} alt="QR Code PIX" className="mx-auto border p-2 rounded-lg max-w-[200px] h-auto bg-white" />
                                )}
                                {service.pixKey && (
                                     <button onClick={() => navigator.clipboard.writeText(service.pixKey!)} className="mt-4 px-4 py-2 bg-slate-200 text-slate-800 rounded-lg w-full text-left truncate">
                                        <span className="font-semibold">Copiar Chave PIX:</span> {service.pixKey}
                                     </button>
                                )}
                                <button onClick={() => setIsPaid(true)} className="mt-4 w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors">
                                    Já Efetuei o Pagamento
                                </button>
                            </>
                        ) : (
                            <div className="text-center text-slate-500 p-4 bg-slate-100 rounded-md">
                                <p>As informações de pagamento para este serviço não estão disponíveis no momento.</p>
                                <p>Por favor, prossiga para enviar o agendamento e combine o pagamento com o profissional.</p>
                                 <button onClick={() => setIsPaid(true)} className="mt-4 w-full px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:bg-slate-800 transition-colors">
                                    Agendar sem Sinal
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="text-green-600 font-semibold mb-4">Pagamento recebido! Clique abaixo para finalizar.</p>
                        <button onClick={handleConfirmBooking} className="w-full px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
                            Confirmar Agendamento
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-8 flex justify-start">
                <button onClick={onBack} className="px-6 py-3 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition-colors">
                    Voltar
                </button>
            </div>
        </div>
    );
};

export default Payment;