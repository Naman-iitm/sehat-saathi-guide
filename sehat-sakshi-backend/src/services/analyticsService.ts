import mongoose from 'mongoose';
import { SymptomLog } from '../models/SymptomLog';
import { Reminder } from '../models/Reminder';
import { Appointment } from '../models/Appointment';

export const getHealthTrends = async (userId: string, timeframe: 'week' | 'month' | 'year' = 'month') => {
    const endDate = new Date();
    let startDate = new Date();

    // Determine date range
    if (timeframe === 'week') {
        startDate.setDate(endDate.getDate() - 7);
    } else if (timeframe === 'month') {
        startDate.setMonth(endDate.getMonth() - 1);
    } else if (timeframe === 'year') {
        startDate.setFullYear(endDate.getFullYear() - 1);
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    // 1. Symptom Frequency Analysis
    const symptomFrequency = await SymptomLog.aggregate([
        { $match: { userId: objectId, createdAt: { $gte: startDate, $lte: endDate } } },
        { $unwind: '$symptoms' },
        {
            $group: {
                _id: '$symptoms', count: { $sum: 1 }, avgSeverity: {
                    $avg: {
                        $switch: {
                            branches: [
                                { case: { $eq: ['$severity', 'severe'] }, then: 3 },
                                { case: { $eq: ['$severity', 'moderate'] }, then: 2 },
                                { case: { $eq: ['$severity', 'mild'] }, then: 1 }
                            ],
                            default: 0
                        }
                    }
                }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ]);

    // 2. Severity Over Time (Daily)
    const severityTrend = await SymptomLog.aggregate([
        { $match: { userId: objectId, createdAt: { $gte: startDate, $lte: endDate } } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                avgSeverity: {
                    $avg: {
                        $switch: {
                            branches: [
                                { case: { $eq: ['$severity', 'severe'] }, then: 3 },
                                { case: { $eq: ['$severity', 'moderate'] }, then: 2 },
                                { case: { $eq: ['$severity', 'mild'] }, then: 1 }
                            ],
                            default: 0
                        }
                    }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // 3. Reminder Adherence (Mock calculation since Reminder model usually tracks 'configuration', not 'logs')
    // Ideally, we'd have a 'ReminderLog' collection tracking each completion.
    // For now, let's assume we return configured reminders stats.
    const activeReminders = await Reminder.countDocuments({ userId: objectId, enabled: true });

    // Note: Without a 'ReminderLog' (history of taken meds), we can't calculate real adherence %.
    // This would require a new model. For now, returning summary of active routines.

    // 4. Appointment History Summary
    const appointmentStats = await Appointment.aggregate([
        { $match: { patient: objectId, date: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    return {
        timeframe,
        startDate,
        endDate,
        symptomFrequency,
        severityTrend,
        activeReminders,
        appointmentStats
    };
};

export const generateHealthReportData = async (userId: string) => {
    // Collect all data needed for the PDF report
    const analytics = await getHealthTrends(userId, 'month');

    // Potentially fetch user profile, recent vitals, etc.
    // For now, just return the analytics payload which the frontend can render into a PDF.
    return {
        reportDate: new Date(),
        ...analytics
    };
};
