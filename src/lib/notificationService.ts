import { Reminder } from '@/types/reminder';
import { getReminders, saveReminders } from './reminderStorage';

export interface NotificationPermissionState {
  permission: NotificationPermission;
  supported: boolean;
}

// Check if notifications are supported and get permission state
export const getNotificationState = (): NotificationPermissionState => {
  if (!('Notification' in window)) {
    return { permission: 'denied', supported: false };
  }
  return { permission: Notification.permission, supported: true };
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    return 'denied';
  }
  
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  
  const permission = await Notification.requestPermission();
  return permission;
};

// Show a notification
export const showNotification = (
  title: string,
  options?: NotificationOptions
): Notification | null => {
  if (Notification.permission !== 'granted') {
    return null;
  }

  const notification = new Notification(title, {
    icon: '/health-care.png',
    badge: '/health-care.png',
    tag: options?.tag || 'sehat-saathi',
    requireInteraction: true,
    ...options,
  });

  return notification;
};

// Show medicine reminder notification with actions
export const showMedicineReminder = (reminder: Reminder): Notification | null => {
  const notification = showNotification(
    reminder.type === 'medicine' ? '💊 Medicine Reminder' : '📅 Appointment Reminder',
    {
      body: `${reminder.title}${reminder.dosage ? ` - ${reminder.dosage}` : ''}\nTime: ${reminder.time}`,
      tag: `reminder-${reminder.id}`,
    }
  );

  if (notification) {
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }

  return notification;
};

// Calculate next reminder time for recurring reminders
export const getNextReminderDate = (reminder: Reminder): Date | null => {
  const now = new Date();
  const [hours, minutes] = reminder.time.split(':').map(Number);
  
  let nextDate = new Date(reminder.date);
  nextDate.setHours(hours, minutes, 0, 0);

  // If the reminder time has passed today
  if (nextDate <= now) {
    switch (reminder.recurrence) {
      case 'daily':
        nextDate = new Date(now);
        nextDate.setHours(hours, minutes, 0, 0);
        if (nextDate <= now) {
          nextDate.setDate(nextDate.getDate() + 1);
        }
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        while (nextDate <= now) {
          nextDate.setDate(nextDate.getDate() + 7);
        }
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        while (nextDate <= now) {
          nextDate.setMonth(nextDate.getMonth() + 1);
        }
        break;
      case 'once':
      default:
        return null; // One-time reminder has passed
    }
  }

  return nextDate;
};

// Check if a reminder should trigger now
export const shouldTriggerReminder = (reminder: Reminder): boolean => {
  if (!reminder.enabled) return false;
  
  const now = new Date();
  
  // Check if snoozed
  if (reminder.snoozedUntil) {
    const snoozeEnd = new Date(reminder.snoozedUntil);
    if (now < snoozeEnd) return false;
  }

  // Check if already taken today (for recurring)
  if (reminder.takenAt) {
    const takenDate = new Date(reminder.takenAt);
    const today = new Date();
    if (
      takenDate.toDateString() === today.toDateString() &&
      reminder.recurrence !== 'once'
    ) {
      return false;
    }
  }

  // Check if already notified for one-time reminders
  if (reminder.recurrence === 'once' && reminder.notified) {
    return false;
  }

  const nextDate = getNextReminderDate(reminder);
  if (!nextDate) return false;

  // Trigger if within 1 minute of scheduled time
  const diff = Math.abs(now.getTime() - nextDate.getTime());
  return diff < 60000; // 1 minute window
};

// Mark reminder as taken
export const markReminderTaken = (reminderId: string): void => {
  const reminders = getReminders();
  const updated = reminders.map(r => 
    r.id === reminderId 
      ? { ...r, takenAt: new Date().toISOString(), notified: true }
      : r
  );
  saveReminders(updated);
};

// Snooze reminder
export const snoozeReminder = (reminderId: string, minutes: number = 10): void => {
  const reminders = getReminders();
  const snoozeUntil = new Date(Date.now() + minutes * 60000).toISOString();
  const updated = reminders.map(r => 
    r.id === reminderId 
      ? { ...r, snoozedUntil: snoozeUntil }
      : r
  );
  saveReminders(updated);
};

// Start the reminder checker interval
let checkerInterval: number | null = null;

export const startReminderChecker = (
  onReminder: (reminder: Reminder) => void
): void => {
  if (checkerInterval) return;

  const checkReminders = () => {
    const reminders = getReminders();
    
    reminders.forEach(reminder => {
      if (shouldTriggerReminder(reminder)) {
        onReminder(reminder);
        
        // Update notified status
        const updated = reminders.map(r => 
          r.id === reminder.id 
            ? { ...r, notified: true, lastNotified: new Date().toISOString() }
            : r
        );
        saveReminders(updated);
      }
    });
  };

  // Check immediately
  checkReminders();
  
  // Then check every 30 seconds
  checkerInterval = window.setInterval(checkReminders, 30000);
};

export const stopReminderChecker = (): void => {
  if (checkerInterval) {
    clearInterval(checkerInterval);
    checkerInterval = null;
  }
};

// Reset daily reminders at midnight
export const resetDailyReminders = (): void => {
  const reminders = getReminders();
  const today = new Date().toDateString();
  
  const updated = reminders.map(r => {
    if (r.recurrence !== 'once' && r.takenAt) {
      const takenDate = new Date(r.takenAt).toDateString();
      if (takenDate !== today) {
        return { ...r, takenAt: undefined, notified: false, snoozedUntil: undefined };
      }
    }
    return r;
  });
  
  saveReminders(updated);
};
