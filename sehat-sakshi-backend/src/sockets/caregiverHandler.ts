import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";

export class CaregiverSocketHandler {
    private io: Server;

    constructor(server: HttpServer) {
        this.io = new Server(server, {
            cors: {
                origin: "*", // Configure properly in production
                methods: ["GET", "POST"]
            }
        });

        this.io.on("connection", (socket: Socket) => {
            console.log("Client connected:", socket.id);

            socket.on("join_patient_room", (patientId: string) => {
                socket.join(`patient_${patientId}`);
                console.log(`Socket ${socket.id} joined room patient_${patientId}`);
            });

            socket.on("leave_patient_room", (patientId: string) => {
                socket.leave(`patient_${patientId}`);
            });

            socket.on("send_sos", (data: { patientId: string, location: any }) => {
                this.io.to(`patient_${data.patientId}`).emit("sos_alert", data);
                console.log(`SOS Alert sent for patient ${data.patientId}`);
            });

            socket.on("medication_taken", (data: { patientId: string, medicine: string }) => {
                this.io.to(`patient_${data.patientId}`).emit("medication_update", data);
            });

            socket.on("disconnect", () => {
                console.log("Client disconnected:", socket.id);
            });
        });
    }

    public emitToCaregivers(patientId: string, event: string, data: any) {
        this.io.to(`patient_${patientId}`).emit(event, data);
    }
}
