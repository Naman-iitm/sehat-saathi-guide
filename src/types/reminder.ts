export type ReminderType = "medicine" | "appointment";
export type RecurrenceType = "once" | "daily" | "weekly" | "monthly";

export interface Reminder {
  id: string;
  type: ReminderType;
  title: string;
  date: string;
  time: string;
  notes?: string;
  notified?: boolean;
  recurrence: RecurrenceType;
  dosage?: string;
  enabled: boolean;
  lastNotified?: string;
  snoozedUntil?: string;
  takenAt?: string;
}
