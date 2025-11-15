
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { BookingData } from './ClientView';
import { AppointmentStatus } from '../../types';

interface DateTimeSelectionProps {
    bookingData: BookingData;
    onNext: (data: { date: Date, time: string }) => void;
    onBack: () => void;
}

const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({ bookingData, onNext, onBack }) => {
    const { availability, appointments } = useAppContext();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const today = new Date();
    today.setHours(0,0,0,0);

    const availableDates = useMemo(() => {
        const dates: Date[] = [];
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dayOfWeek = date.getDay();
            const dayAvailability = availability.find(d => d.dayOfWeek === dayOfWeek);
            if (dayAvailability?.enabled && dayAvailability.slots.length > 0) {
                dates.push(date);
            }
        }
        return dates;
    }, [availability, today]);

    const availableTimes = useMemo(() => {
        if (!selectedDate || !bookingData.professional) return [];

        const dayOfWeek = selectedDate.getDay();
        const dayAvailability = availability.find(d => d.dayOfWeek === dayOfWeek);
        if (!dayAvailability || !dayAvailability.enabled) return [];
        
        const dateString = selectedDate.toISOString().split('T')[0];
        const bookedTimes = appointments
            .filter(app => 
                app.professionalId === bookingData.professional!.id &&
                app.date === dateString &&
                app.status !== AppointmentStatus.Rejected
            )
            .map(app => app.time);
            
        return dayAvailability.slots.filter(slot => !bookedTimes.includes(slot));
    }, [selectedDate, bookingData.professional, availability, appointments]);

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setSelectedTime(null);
    };

    const handleNext = () => {
        if (selectedDate && selectedTime) {
            onNext({ date: selectedDate, time: selectedTime });
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Passo 3: Escolha Data e Hora</h2>

            <div className="mb-6">
                <h3 className="font-semibold text-slate-700 mb-3">Selecione uma data:</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {availableDates.map(date => (
                        <button
                            key={date.toISOString()}
                            onClick={() => handleDateSelect(date)}
                            className={`p-2 border rounded-lg text-center transition-colors ${
                                selectedDate?.getTime() === date.getTime()
                                    ? 'bg-slate-700 text-white font-bold'
                                    : 'bg-white hover:bg-slate-100'
                            }`}
                        >
                            <div className="text-xs">{date.toLocaleDateString('pt-BR', { weekday: 'short' })}</div>
                            <div className="font-semibold">{date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</div>
                        </button>
                    ))}
                </div>
            </div>

            {selectedDate && (
                <div>
                    <h3 className="font-semibold text-slate-700 mb-3">Selecione um horário:</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {availableTimes.length > 0 ? availableTimes.map(time => (
                            <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`p-2 border rounded-lg transition-colors ${
                                    selectedTime === time
                                        ? 'bg-slate-700 text-white font-bold'
                                        : 'bg-white hover:bg-slate-100'
                                }`}
                            >
                                {time}
                            </button>
                        )) : <p className="col-span-full text-center text-slate-500">Nenhum horário disponível para esta data.</p>}
                    </div>
                </div>
            )}
            
            <div className="mt-8 flex justify-between">
                <button onClick={onBack} className="px-6 py-3 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition-colors">
                    Voltar
                </button>
                <button
                    onClick={handleNext}
                    disabled={!selectedDate || !selectedTime}
                    className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                    Próximo
                </button>
            </div>
        </div>
    );
};

export default DateTimeSelection;
