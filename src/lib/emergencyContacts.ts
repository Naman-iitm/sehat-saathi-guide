export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

const STORAGE_KEY = 'sehat-saathi-emergency-contacts';

export const getEmergencyContacts = (): EmergencyContact[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveEmergencyContacts = (contacts: EmergencyContact[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
};

export const addEmergencyContact = (contact: Omit<EmergencyContact, 'id'>): EmergencyContact => {
  const contacts = getEmergencyContacts();
  const newContact: EmergencyContact = {
    ...contact,
    id: Date.now().toString(),
  };
  contacts.push(newContact);
  saveEmergencyContacts(contacts);
  return newContact;
};

export const removeEmergencyContact = (id: string): void => {
  const contacts = getEmergencyContacts();
  saveEmergencyContacts(contacts.filter(c => c.id !== id));
};

export const updateEmergencyContact = (id: string, updates: Partial<EmergencyContact>): void => {
  const contacts = getEmergencyContacts();
  saveEmergencyContacts(contacts.map(c => c.id === id ? { ...c, ...updates } : c));
};

// Emergency service numbers for India
export const EMERGENCY_NUMBERS = {
  ambulance: '108',
  police: '100',
  fire: '101',
  women: '1091',
  national: '112',
};

// Generate SMS link with location
export const generateSOSMessage = (location?: { lat: number; lng: number }): string => {
  let message = 'EMERGENCY! I need help urgently.';
  if (location) {
    message += ` My location: https://maps.google.com/?q=${location.lat},${location.lng}`;
  }
  return encodeURIComponent(message);
};

// Generate SMS URI for multiple contacts
export const generateSMSLink = (phones: string[], message: string): string => {
  const phoneList = phones.join(',');
  return `sms:${phoneList}?body=${message}`;
};

// Generate tel link for emergency call
export const generateCallLink = (number: string): string => {
  return `tel:${number}`;
};
