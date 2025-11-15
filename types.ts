
export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
  pixKey?: string;
  pixQrCode?: string; // base64 image data
}

export interface Professional {
  id: string;
  name: string;
  services: string[]; // array of service IDs
  photoUrl?: string; // base64 image data
}

export enum AppointmentStatus {
  Pending = 'Pendente',
  Confirmed = 'Confirmado',
  Rejected = 'Rejeitado',
}

export interface Appointment {
  id:string;
  clientName: string;
  clientContact: string;
  serviceId: string;
  professionalId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: AppointmentStatus;
  price: number;
}

export interface DayAvailability {
  dayOfWeek: number; // 0 for Sunday, 1 for Monday, etc.
  enabled: boolean;
  slots: string[]; // e.g., ["09:00", "10:00", ...]
}