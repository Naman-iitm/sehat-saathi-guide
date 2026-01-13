import { Appointment, TimeSlot } from '@/types/appointment';

const STORAGE_KEY = 'sehat-saathi-appointments';

export const getAppointments = (): Appointment[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveAppointment = (appointment: Appointment): void => {
  const appointments = getAppointments();
  appointments.push(appointment);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
};

export const cancelAppointment = (id: string): void => {
  const appointments = getAppointments();
  const updated = appointments.map(a => 
    a.id === id ? { ...a, status: 'cancelled' as const } : a
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getUpcomingAppointments = (): Appointment[] => {
  const appointments = getAppointments();
  const now = new Date();
  return appointments
    .filter(a => {
      const appointmentDate = new Date(`${a.date}T${a.time}`);
      return appointmentDate > now && a.status !== 'cancelled';
    })
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
};

// Generate available time slots for a given date
export const getAvailableSlots = (date: string, hospitalId: string): TimeSlot[] => {
  const appointments = getAppointments();
  const bookedTimes = appointments
    .filter(a => a.date === date && a.hospitalId === hospitalId && a.status !== 'cancelled')
    .map(a => a.time);

  const slots: TimeSlot[] = [];
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM

  for (let hour = startHour; hour < endHour; hour++) {
    for (const minute of ['00', '30']) {
      const time = `${hour.toString().padStart(2, '0')}:${minute}`;
      slots.push({
        time,
        available: !bookedTimes.includes(time),
      });
    }
  }

  return slots;
};

// Add appointment to calendar (generates .ics file)
export const downloadCalendarEvent = (appointment: Appointment): void => {
  const startDate = new Date(`${appointment.date}T${appointment.time}`);
  const endDate = new Date(startDate.getTime() + 30 * 60000); // 30 min duration

  const formatDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Sehat Saathi//Appointment//EN
BEGIN:VEVENT
UID:${appointment.id}@sehat-saathi
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:Hospital Appointment - ${appointment.hospitalName}
DESCRIPTION:Reason: ${appointment.reason}
LOCATION:${appointment.hospitalName}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `appointment-${appointment.date}.ics`;
  a.click();
  URL.revokeObjectURL(url);
};
