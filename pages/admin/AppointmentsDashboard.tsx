
import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { AppointmentStatus } from '../../types';
import { CheckIcon, XCircleIcon } from '../../components/icons/Icons';

const AppointmentsDashboard: React.FC = () => {
    const { appointments, services, professionals, updateAppointmentStatus } = useAppContext();

    const populatedAppointments = useMemo(() => {
        return appointments.map(app => ({
            ...app,
            serviceName: services.find(s => s.id === app.serviceId)?.name || 'Serviço não encontrado',
            professionalName: professionals.find(p => p.id === app.professionalId)?.name || 'Profissional não encontrado',
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.time.localeCompare(b.time));
    }, [appointments, services, professionals]);
    
    const getStatusBadge = (status: AppointmentStatus) => {
        switch (status) {
            case AppointmentStatus.Pending:
                return 'bg-yellow-100 text-yellow-800';
            case AppointmentStatus.Confirmed:
                return 'bg-green-100 text-green-800';
            case AppointmentStatus.Rejected:
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (appointments.length === 0) {
        return <p className="text-center text-slate-500">Nenhum agendamento encontrado.</p>;
    }

    return (
        <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-slate-700">Próximos Agendamentos</h3>
             <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cliente</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data & Hora</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Serviço</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Profissional</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {populatedAppointments.map((app) => (
                            <tr key={app.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-slate-900">{app.clientName}</div>
                                    <div className="text-sm text-slate-500">{app.clientContact}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(app.date + 'T00:00:00-03:00').toLocaleDateString('pt-BR')} às {app.time}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{app.serviceName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{app.professionalName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(app.status)}`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {app.status === AppointmentStatus.Pending && (
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => updateAppointmentStatus(app.id, AppointmentStatus.Confirmed)} className="p-1 text-green-600 hover:text-green-900 hover:bg-green-100 rounded-full transition-colors">
                                                <CheckIcon className="h-6 w-6" />
                                            </button>
                                            <button onClick={() => updateAppointmentStatus(app.id, AppointmentStatus.Rejected)} className="p-1 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full transition-colors">
                                                <XCircleIcon className="h-6 w-6" />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AppointmentsDashboard;
