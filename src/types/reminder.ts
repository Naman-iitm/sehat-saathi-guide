export type ReminderType = "medicine" | "appointment";

export interface Reminder {
  id: string;
  type: ReminderType;
  title: string;
  date: string;
  time: string;
  notes?: string;
  notified?:boolean;
}




