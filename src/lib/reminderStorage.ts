import { Reminder } from "@/types/reminder";

const KEY = "sehat-saathi-reminders";

export const getReminders = (): Reminder[] => {
  const saved = localStorage.getItem(KEY);
  try {
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error parsing reminders from localStorage:', error);
    return [];
  }
};

export const saveReminders = (reminders: Reminder[]) => {
  localStorage.setItem(KEY, JSON.stringify(reminders));
};
