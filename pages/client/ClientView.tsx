import React, { useState } from 'react';
import ServiceSelection from './ServiceSelection';
import ProfessionalSelection from './ProfessionalSelection';
import DateTimeSelection from './DateTimeSelection';
import Payment from './Payment';
import Confirmation from './Confirmation';
import { Service, Professional } from '../../types';

type BookingStep = 'service' | 'professional' | 'datetime' | 'payment' | 'confirmation';

export interface BookingData {
    service?: Service;
    professional?: Professional;
    date?: Date;
    time?: string;
    clientName?: string;
    clientContact?: string;
}

const ClientView: React.FC = () => {
    const [step, setStep] = useState<BookingStep>('service');
    const [bookingData, setBookingData] = useState<BookingData>({});

    const handleNext = (data: Partial<BookingData>) => {
        const newBookingData = { ...bookingData, ...data };
        setBookingData(newBookingData);

        switch (step) {
            case 'service':
                setStep('professional');
                break;
            case 'professional':
                setStep('datetime');
                break;
            case 'datetime':
                setStep('payment');
                break;
            case 'payment':
                setStep('confirmation');
                break;
            case 'confirmation':
                 setBookingData({});
                 setStep('service');
                 break;
        }
    };

    const handleBack = () => {
        switch (step) {
            case 'professional':
                setStep('service');
                break;
            case 'datetime':
                setStep('professional');
                break;
            case 'payment':
                setStep('datetime');
                break;
        }
    };
    
    const getStepComponent = () => {
        switch (step) {
            case 'service':
                return <ServiceSelection onNext={handleNext} />;
            case 'professional':
                return <ProfessionalSelection bookingData={bookingData} onNext={handleNext} onBack={handleBack} />;
            case 'datetime':
                return <DateTimeSelection bookingData={bookingData} onNext={handleNext} onBack={handleBack} />;
            case 'payment':
                return <Payment bookingData={bookingData} onNext={handleNext} onBack={handleBack} />;
            case 'confirmation':
                // FIX: The `handleNext` function requires an argument, but the `onNext` prop for `Confirmation`
                // expects a function with no arguments. Wrap `handleNext` in an arrow function to match the required signature.
                return <Confirmation bookingData={bookingData} onNext={() => handleNext({})} />;
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto max-w-2xl">
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                {getStepComponent()}
            </div>
        </div>
    );
};

export default ClientView;