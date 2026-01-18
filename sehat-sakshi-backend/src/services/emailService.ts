import nodemailer from 'nodemailer';

// Configure transporter
// In production, use environment variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'ethereal_user',
        pass: process.env.SMTP_PASS || 'ethereal_pass',
    },
});

export const sendAppointmentConfirmation = async (to: string, appointmentDetails: any) => {
    try {
        const { doctorName, date, time, clinicName } = appointmentDetails;

        await transporter.sendMail({
            from: '"Sehat Saathi" <noreply@sehatsaathi.com>',
            to,
            subject: 'Appointment Confirmation - Sehat Saathi',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Appointment Confirmed</h2>
          <p>Dear Patient,</p>
          <p>Your appointment has been successfully booked.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Doctor:</strong> Dr. ${doctorName}</p>
            <p><strong>Clinic:</strong> ${clinicName}</p>
            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${time}</p>
          </div>
          
          <p>Please arrive 10 minutes before your scheduled time.</p>
          <p>Thank you for choosing Sehat Saathi.</p>
        </div>
      `,
        });
        console.log(`Confirmation email sent to ${to}`);
        return true;
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        return false;
    }
};

export const sendDoctorNotification = async (doctorEmail: string, appointmentDetails: any) => {
    try {
        const { patientName, date, time, symptoms } = appointmentDetails;

        await transporter.sendMail({
            from: '"Sehat Saathi System" <system@sehatsaathi.com>',
            to: doctorEmail,
            subject: 'New Appointment Booking',
            html: `
        <div style="font-family: Arial, sans-serif;">
          <h3>New Appointment Alert</h3>
          <p><strong>Patient:</strong> ${patientName}</p>
          <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Symptoms:</strong> ${symptoms || 'None specified'}</p>
        </div>
      `,
        });
        return true;
    } catch (error) {
        console.error('Error sending doctor notification:', error);
        return false;
    }
};
