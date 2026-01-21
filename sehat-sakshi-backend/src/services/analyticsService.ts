import mongoose from 'mongoose';
import { SymptomLog } from '../models/SymptomLog';
import { Reminder } from '../models/Reminder';
import { Appointment } from '../models/Appointment';
import { ReminderLog } from '../models/ReminderLog';

export const getHealthTrends = async (userId: string, timeframe: 'week' | 'month' | 'year' = 'month') => {
    const endDate = new Date();
    let startDate = new Date();

    if (timeframe === 'week') {
        startDate.setDate(endDate.getDate() - 7);
    } else if (timeframe === 'month') {
        startDate.setMonth(endDate.getMonth() - 1);
    } else if (timeframe === 'year') {
        startDate.setFullYear(endDate.getFullYear() - 1);
    }

    const objectId = new mongoose.Types.ObjectId(userId);

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

    const activeReminders = await Reminder.countDocuments({ userId: objectId, enabled: true });

    const appointmentStats = await Appointment.aggregate([
        { $match: { patient: objectId, date: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Added: Medication adherence calculation from logs
    const adherenceLogs = await ReminderLog.aggregate([
        { $match: { userId: objectId, takenAt: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const taken = adherenceLogs.find(l => l._id === 'taken')?.count || 0;
    const skipped = adherenceLogs.find(l => l._id === 'skipped')?.count || 0;
    const adherenceRate = taken + skipped > 0 ? (taken / (taken + skipped)) * 100 : 0;

    return {
        timeframe,
        startDate,
        endDate,
        symptomFrequency,
        severityTrend,
        activeReminders,
        appointmentStats,
        adherenceRate
    };
};

export const getSymptomAnalytics = async (userId: string, timeframe: string) => {
    const endDate = new Date();
    let startDate = new Date();
    if (timeframe === 'week') startDate.setDate(endDate.getDate() - 7);
    else if (timeframe === 'month') startDate.setMonth(endDate.getMonth() - 1);
    else startDate.setFullYear(endDate.getFullYear() - 1);

    const objectId = new mongoose.Types.ObjectId(userId);

    const trends = await SymptomLog.aggregate([
        { $match: { userId: objectId, createdAt: { $gte: startDate, $lte: endDate } } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                severity: {
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
                logs: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    const commonSymptoms = await SymptomLog.aggregate([
        { $match: { userId: objectId, createdAt: { $gte: startDate, $lte: endDate } } },
        { $unwind: '$symptoms' },
        { $group: { _id: '$symptoms', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
    ]);

    return { trends, commonSymptoms };
};

export const getAdherenceAnalytics = async (userId: string, timeframe: string) => {
    const endDate = new Date();
    let startDate = new Date();
    if (timeframe === 'week') startDate.setDate(endDate.getDate() - 7);
    else if (timeframe === 'month') startDate.setMonth(endDate.getMonth() - 1);
    else startDate.setFullYear(endDate.getFullYear() - 1);

    const objectId = new mongoose.Types.ObjectId(userId);

    const logs = await ReminderLog.aggregate([
        { $match: { userId: objectId, takenAt: { $gte: startDate, $lte: endDate } } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$takenAt' } },
                taken: { $sum: { $cond: [{ $eq: ['$status', 'taken'] }, 1, 0] } },
                skipped: { $sum: { $cond: [{ $eq: ['$status', 'skipped'] }, 1, 0] } }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    const summary = await ReminderLog.aggregate([
        { $match: { userId: objectId, takenAt: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    return { logs, summary };
};

export const getHealthScore = async (userId: string) => {
    const objectId = new mongoose.Types.ObjectId(userId);
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    // 1. Adherence Score (40%)
    const adherenceLogs = await ReminderLog.aggregate([
        { $match: { userId: objectId, takenAt: { $gte: last30Days } } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const taken = adherenceLogs.find(l => l._id === 'taken')?.count || 0;
    const total = adherenceLogs.reduce((acc, curr) => acc + curr.count, 0);
    const adherenceScore = total > 0 ? (taken / total) * 40 : 40; // Default to 40 if no logs

    // 2. Symptom Score (40%) - Lower severity is better
    const symptoms = await SymptomLog.aggregate([
        { $match: { userId: objectId, createdAt: { $gte: last30Days } } },
        {
            $group: {
                _id: null,
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
                }
            }
        }
    ]);
    const avgSeverity = symptoms[0]?.avgSeverity || 0;
    const symptomScore = Math.max(0, 40 - (avgSeverity * 10));

    // 3. Activity Score (20%) - Regular logging is better
    const uniqueDaysLogged = await SymptomLog.distinct('createdAt', {
        userId: objectId,
        createdAt: { $gte: last30Days }
    }).then(dates => new Set(dates.map(d => new Date(d).toDateString())).size);

    const activityScore = Math.min(20, (uniqueDaysLogged / 15) * 20); // Max 20 if logged 15+ days

    const totalScore = Math.round(adherenceScore + symptomScore + activityScore);

    return {
        score: totalScore,
        breakdown: {
            adherence: Math.round(adherenceScore),
            symptom: Math.round(symptomScore),
            activity: Math.round(activityScore)
        }
    };
};

export const generateHealthReportData = async (userId: string) => {
    const analytics = await getHealthTrends(userId, 'month');
    const healthScore = await getHealthScore(userId);

    return {
        reportDate: new Date(),
        healthScore,
        ...analytics
    };
};
