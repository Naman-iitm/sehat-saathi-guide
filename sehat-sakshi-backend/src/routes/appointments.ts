import { Router, Response } from 'express';
import { Appointment } from '../models/Appointment';
import { Doctor } from '../models/Doctor';
import { User } from '../models/User';
import { protect, AuthRequest } from '../middleware/auth';
import { sendAppointmentConfirmation, sendDoctorNotification } from '../services/emailService';
import { AppError } from '../utils/errors';
import mongoose from 'mongoose';

const router = Router();

// --- DOCTOR ROUTES ---

/**
 * @route   GET /api/doctors
 * @desc    Get all doctors (with search filters)
 */
router.get('/doctors', async (req, res) => {
    try {
        const { specializaion, search } = req.query;
        const query: any = {};

        if (specializaion) query.specialization = specializaion;
        if (search) {
            query.$text = { $search: search as string };
        }

        const doctors = await Doctor.find(query).populate('user', 'name profilePic');
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   GET /api/doctors/:id
 * @desc    Get single doctor profile
 */
router.get('/doctors/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate('user', 'name profilePic email');
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   GET /api/doctors/:id/slots
 * @desc    Get available slots for a specific date
 */
router.get('/doctors/:id/slots', async (req, res) => {
    try {
        const { date } = req.query;
        const doctorId = req.params.id;

        if (!date) return res.status(400).json({ message: 'Date is required' });

        const selectedDate = new Date(date as string);
        const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        // 1. Check doctor's schedule for that day
        const schedule = doctor.availability.find(s => s.day === dayName);

        if (!schedule || !schedule.isAvailable) {
            return res.json({ slots: [], message: 'Doctor is not available on this day' });
        }

        // 2. Generate all potential slots
        const slots = [];
        let currentTime = new Date(`2000-01-01T${schedule.startTime}`);
        const endTime = new Date(`2000-01-01T${schedule.endTime}`);

        while (currentTime < endTime) {
            const timeString = currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
            slots.push(timeString);
            // Increment by 30 mins (default slot duration)
            currentTime.setMinutes(currentTime.getMinutes() + 30);
        }

        // 3. Fetch existing appointments to exclude booked slots
        // We search for appointments on the selected date for this doctor
        const startOfDay = new Date(selectedDate); startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate); endOfDay.setHours(23, 59, 59, 999);

        const bookedAppointments = await Appointment.find({
            doctor: doctorId,
            date: { $gte: startOfDay, $lte: endOfDay },
            status: { $ne: 'cancelled' }
        }).select('startTime');

        const bookedTimes = new Set(bookedAppointments.map(a => a.startTime));

        // 4. Filter available slots
        const availableSlots = slots.filter(time => !bookedTimes.has(time));

        res.json({ date: selectedDate, slots: availableSlots });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});


// --- APPOINTMENT ROUTES ---

/**
 * @route   POST /api/appointments
 * @desc    Book an appointment
 */
router.post('/appointments', protect, async (req: AuthRequest, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { doctorId, date, startTime, symptoms, type } = req.body;
        const patientId = (req.user as any)._id;

        // 1. Basic validation
        const doctor = await Doctor.findById(doctorId).populate('user', 'email name');
        if (!doctor) throw new AppError('Doctor not found', 404);

        // 2. Check availability again (Double booking prevention)
        // We rely on the unique index in the model, but a manual check is also good UX
        const appointmentDate = new Date(date);
        appointmentDate.setHours(0, 0, 0, 0); // Normalize date part

        const existing = await Appointment.findOne({
            doctor: doctorId,
            date: appointmentDate,
            startTime: startTime,
            status: { $ne: 'cancelled' }
        }).session(session);

        if (existing) {
            throw new AppError('Slot already booked. Please choose another time.', 409);
        }

        // 3. Create Appointment
        // Calculate end time (assuming 30 mins)
        const [hours, mins] = startTime.split(':').map(Number);
        const endDate = new Date(appointmentDate);
        endDate.setHours(hours, mins + 30);
        const endTime = endDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

        const newAppointment = await Appointment.create([{
            patient: patientId,
            doctor: doctorId,
            date: appointmentDate,
            startTime,
            endTime,
            symptoms,
            type,
            status: 'confirmed'
        }], { session });

        await session.commitTransaction();
        session.endSession();

        // 4. Send Notifications (Async - don't block response)
        const patientEmail = (req.user as any).email;
        const doctorEmail = (doctor.user as any).email;

        // Send to Patient
        sendAppointmentConfirmation(patientEmail, {
            doctorName: (doctor.user as any).name,
            date: appointmentDate,
            time: startTime,
            clinicName: doctor.clinicName
        });

        // Send to Doctor
        if (doctorEmail) {
            sendDoctorNotification(doctorEmail, {
                patientName: (req.user as any).name,
                date: appointmentDate,
                time: startTime,
                symptoms
            });
        }

        res.status(201).json(newAppointment[0]);

    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();

        // Handle specific codes
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Slot already booked (Concurrency)' });
        }

        res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
    }
});

/**
 * @route   GET /api/appointments/my
 * @desc    Get appointments for the logged-in user (patient)
 */
router.get('/appointments/my', protect, async (req: AuthRequest, res: Response) => {
    try {
        const userId = (req.user as any)._id;
        const appointments = await Appointment.find({ patient: userId })
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name' }
            })
            .sort({ date: 1, startTime: 1 });

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   PUT /api/appointments/:id/cancel
 * @desc    Cancel an appointment
 */
router.put('/appointments/:id/cancel', protect, async (req: AuthRequest, res: Response) => {
    try {
        const { reason } = req.body;
        const appointment = await Appointment.findOneAndUpdate(
            { _id: req.params.id, patient: (req.user as any)._id },
            { status: 'cancelled', cancellationReason: reason },
            { new: true }
        );

        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   GET /api/appointments/:id/video-access
 * @desc    Verify if user can join video for appointment
 */
router.get('/appointments/:id/video-access', protect, async (req: AuthRequest, res: Response) => {
    try {
        const userId = (req.user as any)._id;
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check if user is either the patient or the doctor
        const patientId = appointment.patient.toString();
        const doctor = await Doctor.findById(appointment.doctor);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        const doctorUserId = doctor.user.toString();

        if (userId.toString() !== patientId && userId.toString() !== doctorUserId) {
            return res.status(403).json({ message: 'Not authorized to join this consultation' });
        }

        // Check if appointment is 'online'
        if (appointment.type !== 'online') {
            return res.status(400).json({ message: 'This is not an online appointment' });
        }

        // Check status
        if (appointment.status !== 'confirmed') {
            return res.status(400).json({ message: 'Appointment is not confirmed' });
        }

        res.json({
            authorized: true,
            role: userId.toString() === patientId ? 'patient' : 'doctor',
            appointmentId: appointment._id
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
