import cron from 'node-cron';
import { Reminder } from '../models/Reminder';
import { Notification } from '../models/Notification';
import { sendRealTimeNotification } from '../config/socket';

export const startReminderWorker = () => {
    // Schedule task to run every minute
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();

            // Format time as HH:MM (24h) to match schema "time" field
            const currentTime = now.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });

            // Get current date string YYYY-MM-DD
            const currentDate = now.toISOString().split('T')[0];

            // Get current day name for weekly check
            // Note: Schema doesn't store day name, but "date" implies specific date?
            // For "weekly", we usually need a specific start date to check day-of-week logic.
            // Assuming naive check for now.

            console.log(`[ReminderWorker] Checking for reminders at ${currentTime}...`);

            // Find potential reminders
            const reminders = await Reminder.find({
                enabled: true,
                time: currentTime,
            });

            for (const reminder of reminders) {
                let shouldTrigger = false;

                if (reminder.recurrence === 'daily') {
                    shouldTrigger = true;
                } else if (reminder.recurrence === 'once') {
                    if (reminder.date === currentDate) {
                        shouldTrigger = true;
                        // Optionally disable "once" reminders after triggering
                        // reminder.enabled = false;
                        // await reminder.save(); 
                    }
                } else if (reminder.recurrence === 'weekly') {
                    // Check if today matches the day of the week of the start date
                    const startDate = new Date(reminder.date);
                    if (startDate.getDay() === now.getDay()) {
                        shouldTrigger = true;
                    }
                } else if (reminder.recurrence === 'monthly') {
                    const startDate = new Date(reminder.date);
                    if (startDate.getDate() === now.getDate()) {
                        shouldTrigger = true;
                    }
                }

                if (shouldTrigger) {
                    await triggerNotification(reminder);
                }
            }
        } catch (error) {
            console.error('[ReminderWorker] Error processing reminders:', error);
        }
    });

    console.log('[ReminderWorker] Worker started.');
};

const triggerNotification = async (reminder: any) => {
    try {
        const userId = reminder.userId.toString();
        const title = 'Health Reminder';
        const message = `It's time for: ${reminder.title}` + (reminder.dosage ? ` (${reminder.dosage})` : '');

        // Map reminder type to notification type
        let notificationType: 'medication' | 'appointment' | 'reminder' = 'reminder';
        if (reminder.type === 'medicine') notificationType = 'medication';
        else if (reminder.type === 'appointment') notificationType = 'appointment';

        // 1. Save to Database
        const notification = await Notification.create({
            user: reminder.userId,
            title,
            message,
            type: notificationType,
            priority: 'high',
            metadata: { reminderId: reminder._id }
        });

        // 2. Send Real-time Alert
        sendRealTimeNotification(userId, notification);

        console.log(`[ReminderWorker] Notification sent to user ${userId} for reminder ${reminder.title}`);
    } catch (error) {
        console.error(`[ReminderWorker] Failed to trigger notification for ${reminder._id}:`, error);
    }
};
