
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Service, Professional, Appointment, DayAvailability, AppointmentStatus } from '../types';
import { DAYS_OF_WEEK, TIME_SLOTS } from '../constants';

// --- INITIAL DATA ---
const initialServices: Service[] = [
    { id: '1', name: 'Corte de Cabelo', price: 50, duration: 30, pixKey: 'email@exemplo.com', pixQrCode: '' },
    { id: '2', name: 'Manicure', price: 30, duration: 45, pixKey: '123.456.789-00', pixQrCode: '' },
    { id: '3', name: 'Pedicure', price: 40, duration: 45, pixKey: '(11) 99999-9999', pixQrCode: '' },
    { id: '4', name: 'Barba', price: 35, duration: 30, pixKey: 'chave-aleatoria-123', pixQrCode: '' },
    { id: '5', name: 'Design de Sobrancelha', price: 25, duration: 20, pixKey: '', pixQrCode: '' },
];

const initialProfessionals: Professional[] = [
    { id: '1', name: 'Ana Silva', services: ['1', '5'], photoUrl: '' },
    { id: '2', name: 'Carlos Souza', services: ['1', '4'], photoUrl: '' },
    { id: '3', name: 'Mariana Costa', services: ['2', '3'], photoUrl: '' },
];

const initialAvailability: DayAvailability[] = DAYS_OF_WEEK.map((_, index) => ({
    dayOfWeek: index,
    enabled: index > 0 && index < 6, // Monday to Friday
    slots: index > 0 && index < 6 ? TIME_SLOTS.slice(2, 19) : [], // 9:00 to 17:30 for Mon-Fri
}));


interface AppContextType {
    services: Service[];
    professionals: Professional[];
    appointments: Appointment[];
    availability: DayAvailability[];
    addService: (service: Omit<Service, 'id'>) => void;
    updateService: (service: Service) => void;
    deleteService: (id: string) => void;
    addProfessional: (professional: Omit<Professional, 'id'>) => void;
    updateProfessional: (professional: Professional) => void;
    deleteProfessional: (id: string) => void;
    addAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
    updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
    updateAvailability: (day: DayAvailability) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            const valueToStore = JSON.stringify(storedValue);
            window.localStorage.setItem(key, valueToStore);
        } catch (error) {
            console.error(error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
};


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [services, setServices] = useLocalStorage<Service[]>('services', initialServices);
    const [professionals, setProfessionals] = useLocalStorage<Professional[]>('professionals', initialProfessionals);
    const [appointments, setAppointments] = useLocalStorage<Appointment[]>('appointments', []);
    const [availability, setAvailability] = useLocalStorage<DayAvailability[]>('availability', initialAvailability);

    const addService = useCallback((service: Omit<Service, 'id'>) => {
        setServices(prev => [...prev, { ...service, id: new Date().toISOString() }]);
    }, [setServices]);

    const updateService = useCallback((updatedService: Service) => {
        setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
    }, [setServices]);

    const deleteService = useCallback((id: string) => {
        setServices(prev => prev.filter(s => s.id !== id));
    }, [setServices]);

    const addProfessional = useCallback((prof: Omit<Professional, 'id'>) => {
        setProfessionals(prev => [...prev, { ...prof, id: new Date().toISOString() }]);
    }, [setProfessionals]);

    const updateProfessional = useCallback((updatedProf: Professional) => {
        setProfessionals(prev => prev.map(p => p.id === updatedProf.id ? updatedProf : p));
    }, [setProfessionals]);

    const deleteProfessional = useCallback((id: string) => {
        setProfessionals(prev => prev.filter(p => p.id !== id));
    }, [setProfessionals]);


    const addAppointment = useCallback((appointment: Omit<Appointment, 'id' | 'status'>) => {
        const newAppointment: Appointment = {
            ...appointment,
            id: new Date().toISOString(),
            status: AppointmentStatus.Pending
        };
        setAppointments(prev => [...prev, newAppointment]);
    }, [setAppointments]);

    const updateAppointmentStatus = useCallback((id: string, status: AppointmentStatus) => {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    }, [setAppointments]);
    
    const updateAvailability = useCallback((dayUpdate: DayAvailability) => {
        setAvailability(prev => prev.map(day => day.dayOfWeek === dayUpdate.dayOfWeek ? dayUpdate : day));
    }, [setAvailability]);

    return (
        <AppContext.Provider value={{
            services, professionals, appointments, availability,
            addService, updateService, deleteService,
            addProfessional, updateProfessional, deleteProfessional,
            addAppointment, updateAppointmentStatus,
            updateAvailability
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};