
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { DayAvailability } from '../../types';
import { DAYS_OF_WEEK, TIME_SLOTS } from '../../constants';

const AvailabilityDashboard: React.FC = () => {
    const { availability, updateAvailability } = useAppContext();

    const handleDayToggle = (day: DayAvailability) => {
        updateAvailability({ ...day, enabled: !day.enabled });
    };

    const handleSlotToggle = (day: DayAvailability, slot: string) => {
        const newSlots = day.slots.includes(slot)
            ? day.slots.filter(s => s !== slot)
            : [...day.slots, slot];
        newSlots.sort();
        updateAvailability({ ...day, slots: newSlots });
    };

    return (
        <div>
            <h3 className="text-2xl font-semibold text-slate-700 mb-4">Disponibilidade Semanal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availability.map(day => (
                    <div key={day.dayOfWeek} className="bg-white rounded-lg shadow p-4 border-t-4 border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-bold text-slate-800">{DAYS_OF_WEEK[day.dayOfWeek]}</h4>
                            <div className="flex items-center">
                                <label htmlFor={`toggle-${day.dayOfWeek}`} className="flex items-center cursor-pointer">
                                    <div className="relative">
                                        <input type="checkbox" id={`toggle-${day.dayOfWeek}`} className="sr-only" checked={day.enabled} onChange={() => handleDayToggle(day)} />
                                        <div className={`block w-14 h-8 rounded-full ${day.enabled ? 'bg-slate-600' : 'bg-slate-300'}`}></div>
                                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${day.enabled ? 'transform translate-x-6' : ''}`}></div>
                                    </div>
                                </label>
                            </div>
                        </div>
                        {day.enabled && (
                             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-2">
                                {TIME_SLOTS.map(slot => (
                                    <div key={slot}>
                                        <label className={`flex items-center space-x-2 p-2 rounded-md transition-colors cursor-pointer ${day.slots.includes(slot) ? 'bg-slate-200' : 'bg-slate-50 hover:bg-slate-100'}`}>
                                            <input
                                                type="checkbox"
                                                checked={day.slots.includes(slot)}
                                                onChange={() => handleSlotToggle(day, slot)}
                                                className="h-4 w-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
                                            />
                                            <span className="text-sm font-medium text-slate-700">{slot}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                         {!day.enabled && (
                            <div className="text-center py-10 text-slate-400">
                                Fechado
                            </div>
                         )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AvailabilityDashboard;
