import * as cron from 'node-cron';
import { Reminder } from '../models/Reminder';
import { Notification } from '../models/Notification';
import { getIO } from '../config/socket';
import logger from '../config/logger';

/**
 * Reminder Worker Service
 * Scans for upcoming reminders and sends notifications
 */
class ReminderWorker {
  private cronJob: cron.ScheduledTask | null = null;
  private isRunning = false;


  /**
   * Check if reminder should recur based on recurrence pattern
   */
  private shouldRecur(reminder: any, lastNotificationDate: Date): boolean {
    const now = new Date();
    
    switch (reminder.recurrence) {
      case 'daily':
        return true; // Always recur daily
      case 'weekly':
        const daysSinceLast = Math.floor((now.getTime() - lastNotificationDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceLast >= 7;
      case 'monthly':
        const monthsSinceLast = (now.getFullYear() - lastNotificationDate.getFullYear()) * 12 + 
                               (now.getMonth() - lastNotificationDate.getMonth());
        return monthsSinceLast >= 1;
      case 'once':
      default:
        return false;
    }
  }

  /**
   * Create notification message based on reminder type
   */
  private createNotificationMessage(reminder: any): { title: string; message: string } {
    const time = reminder.time;
    
    switch (reminder.type) {
      case 'medicine':
        return {
          title: '💊 Medication Reminder',
          message: `Time to take ${reminder.title}${reminder.dosage ? ` (${reminder.dosage})` : ''} at ${time}`,
        };
      case 'appointment':
        return {
          title: '📅 Appointment Reminder',
          message: `You have an appointment: ${reminder.title} at ${time}`,
        };
      case 'checkup':
        return {
          title: '🏥 Checkup Reminder',
          message: `Time for your checkup: ${reminder.title} at ${time}`,
        };
      default:
        return {
          title: '⏰ Reminder',
          message: `${reminder.title} at ${time}`,
        };
    }
  }

  /**
   * Process a single reminder and create notification if needed
   */
  private async processReminder(reminder: any): Promise<void> {
    try {
      if (!reminder.enabled) {
        return;
      }

      const now = new Date();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if notification already sent for this reminder today
      const existingNotification = await Notification.findOne({
        reminderId: reminder._id,
        scheduledFor: { $gte: today },
        status: { $in: ['sent', 'read'] },
      });

      if (existingNotification) {
        // For one-time reminders, don't send again
        if (reminder.recurrence === 'once') {
          return;
        }

        // For recurring reminders, check if enough time has passed
        if (reminder.recurrence !== 'once') {
          const lastNotification = await Notification.findOne({
            reminderId: reminder._id,
          }).sort({ scheduledFor: -1 });

          if (lastNotification && !this.shouldRecur(reminder, lastNotification.scheduledFor)) {
            return;
          }
        }
      }

      // Create notification
      const { title, message } = this.createNotificationMessage(reminder);
      const scheduledFor = new Date(`${reminder.date}T${reminder.time}`);
      
      // Adjust scheduledFor for recurring reminders to current date
      if (reminder.recurrence !== 'once') {
        scheduledFor.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
      }

      const notification = await Notification.create({
        userId: reminder.userId,
        reminderId: reminder._id,
        title,
        message,
        type: reminder.type,
        status: 'sent',
        priority: reminder.type === 'medicine' ? 'high' : 'medium',
        scheduledFor,
        sentAt: new Date(),
        soundEnabled: reminder.type === 'medicine',
      });

      // Emit real-time notification via Socket.io
      const io = getIO();
      io.to(`user:${reminder.userId}`).emit('notification', {
        id: notification._id.toString(),
        userId: reminder.userId.toString(),
        reminderId: reminder._id.toString(),
        title: notification.title,
        message: notification.message,
        type: notification.type,
        status: notification.status,
        priority: notification.priority,
        soundEnabled: notification.soundEnabled,
        scheduledFor: notification.scheduledFor.toISOString(),
        createdAt: notification.createdAt.toISOString(),
        updatedAt: notification.updatedAt.toISOString(),
      });

      logger.info(`Notification sent for reminder ${reminder._id} to user ${reminder.userId}`);
    } catch (error) {
      logger.error(`Error processing reminder ${reminder._id}:`, error);
    }
  }

  /**
   * Scan for upcoming reminders and process them
   */
  private async scanAndProcessReminders(): Promise<void> {
    try {
      const now = new Date();
      // Use local date and time consistently (not UTC)
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const currentDate = `${year}-${month}-${day}`;
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;

      // Find all enabled reminders
      const reminders = await Reminder.find({
        enabled: true,
      }).populate('userId', '_id');

      logger.info(`Found ${reminders.length} reminders to check`);

      // Process each reminder
      for (const reminder of reminders) {
        // For one-time reminders, check exact date match
        if (reminder.recurrence === 'once') {
          if (reminder.date === currentDate && reminder.time === currentTime) {
            await this.processReminder(reminder);
          }
        } else {
          // For recurring reminders, check if time matches
          if (reminder.time === currentTime) {
            await this.processReminder(reminder);
          }
        }
      }
    } catch (error) {
      logger.error('Error scanning reminders:', error);
    }
  }

  /**
   * Start the reminder worker
   */
  public start(): void {
    if (this.isRunning) {
      logger.warn('Reminder worker is already running');
      return;
    }

    // Run every minute to check for reminders
    this.cronJob = cron.schedule('* * * * *', async () => {
      await this.scanAndProcessReminders();
    });

    this.isRunning = true;
    logger.info('Reminder worker started - scanning every minute');
  }

  /**
   * Stop the reminder worker
   */
  public stop(): void {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
    }
    this.isRunning = false;
    logger.info('Reminder worker stopped');
  }

  /**
   * Get worker status
   */
  public getStatus(): { isRunning: boolean } {
    return { isRunning: this.isRunning };
  }
}

// Export singleton instance
export const reminderWorker = new ReminderWorker();
