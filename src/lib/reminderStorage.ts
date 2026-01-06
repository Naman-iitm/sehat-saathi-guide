import { Reminder } from "@/types/reminder";

const KEY = "sehat-saathi-reminders";

export const getReminders = (): Reminder[] => {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
};

export const saveReminders = (reminders: Reminder[]) => {
  localStorage.setItem(KEY, JSON.stringify(reminders));
};
