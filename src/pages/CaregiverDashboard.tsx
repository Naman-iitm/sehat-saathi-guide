import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { io, Socket } from 'socket.io-client';
import {
    ShieldAlert,
    UserPlus,
    Users,
    Heart,
    Activity,
    Phone,
    CheckCircle,
    XCircle,
    MapPin,
    HeartPulse
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // Using the sonner toast as per upstream

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const CaregiverDashboard: React.FC = () => {
    const { user, token } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);

    // State
    const [caregivers, setCaregivers] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteName, setInviteName] = useState('');
    const [relationship, setRelationship] = useState('Family Member');
    const [isSOSActive, setIsSOSActive] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // Initial Fetch
    useEffect(() => {
        if (token) {
            fetchCaregivers();
            fetchPatients();
        }
    }, [token]);

    // Socket Connection
    useEffect(() => {
        if (!token) return;

        const newSocket = io(`${SOCKET_URL}/caregivers`, {
            auth: { token },
            transports: ['websocket']
        });

        newSocket.on('connect', () => {
            console.log('Connected to Caregiver Namespace');
        });

        newSocket.on('sos_alert', (data) => {
            toast.error(`EMERGENCY ALERT: ${data.message}`, {
                description: `Location: ${data.location?.address || 'Unknown'}`,
                duration: 10000,
            });
            // Play alarm sound if needed
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [token]);

    // SOS Countdown Logic
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isSOSActive && countdown > 0) {
            timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        } else if (isSOSActive && countdown === 0) {
            triggerSOS();
        }
        return () => clearTimeout(timer);
    }, [isSOSActive, countdown]);

    const fetchCaregivers = async () => {
        try {
            const res = await fetch(`${API_URL}/caregivers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const json = await res.json();
            if (json.success) setCaregivers(json.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPatients = async () => {
        try {
            const res = await fetch(`${API_URL}/caregivers/patients`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const json = await res.json();
            if (json.success) setPatients(json.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleInvite = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inviteEmail) return;

        try {
            const res = await fetch(`${API_URL}/caregivers/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: inviteEmail,
                    name: inviteName,
                    relationship,
                    permissions: {
                        canViewSymptoms: true,
                        canViewMedicines: true,
                        canReceiveAlerts: true
                    }
                })
            });
            const json = await res.json();
            if (json.success) {
                toast.success("Invitation sent successfully!");
                fetchCaregivers();
                setInviteEmail('');
                setInviteName('');
            } else {
                toast.error(json.message);
            }
        } catch (error) {
            toast.error("Failed to send invitation");
        }
    };

    const triggerSOS = async () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported");
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                address: "Current Location (GPS)"
            };

            try {
                // Emit via Socket
                socket?.emit('trigger_sos', { patientId: user?.id, location });

                // Also call API for logging
                const res = await fetch(`${API_URL}/caregivers/sos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ location })
                });

                const json = await res.json();
                if (json.success) {
                    toast.error("SOS ACTIVATED! Help is on the way.");
                    setIsSOSActive(false);
                }
            } catch (err) {
                toast.error("Failed to send SOS alert");
            }
        }, (err) => {
            toast.error("Could not get location: " + err.message);
            // Fallback: Proceed with unknown location if critical
        });
    };

    const startSOSCountdown = () => {
        if (isSOSActive) return;
        setIsSOSActive(true);
        setCountdown(5);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* SOS Floating Button */}
            <div className="fixed bottom-24 right-4 z-50">
                {isSOSActive ? (
                    <div
                        className="bg-destructive text-destructive-foreground p-6 rounded-full w-32 h-32 flex flex-col items-center justify-center animate-pulse shadow-2xl border-4 border-white cursor-pointer"
                        onClick={() => setIsSOSActive(false)}
                    >
                        <span className="text-3xl font-bold">{countdown}</span>
                        <span className="text-xs font-bold uppercase text-center">Tap to Cancel</span>
                    </div>
                ) : (
                    <Button
                        variant="destructive"
                        size="icon"
                        className="w-16 h-16 rounded-full shadow-xl hover:scale-110 transition-transform"
                        onClick={startSOSCountdown}
                    >
                        <ShieldAlert className="w-8 h-8" />
                    </Button>
                )}
            </div>

            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <Heart className="w-8 h-8 text-red-500 fill-current" /> Care Circles
            </h1>

            <Tabs defaultValue="my-caregivers" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="my-caregivers">My Guardians</TabsTrigger>
                    <TabsTrigger value="patients">Patients I Care For</TabsTrigger>
                </TabsList>

                <TabsContent value="my-caregivers" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Invite Card */}
                        <Card className="bg-muted/30 border-dashed">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <UserPlus className="w-5 h-5" /> Add Guardian
                                </CardTitle>
                                <CardDescription>Invite family to monitor your health.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <form onSubmit={handleInvite} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Email Address</Label>
                                        <Input
                                            placeholder="family@example.com"
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Name (Optional)</Label>
                                        <Input
                                            placeholder="Name"
                                            value={inviteName}
                                            onChange={(e) => setInviteName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Relationship</Label>
                                        <select
                                            className="w-full border rounded px-3 py-2 bg-background"
                                            value={relationship}
                                            onChange={e => setRelationship(e.target.value)}
                                        >
                                            <option>Family Member</option>
                                            <option>Doctor</option>
                                            <option>Friend</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <Button type="submit" className="w-full gap-2">
                                        <UserPlus className="w-4 h-4" /> Send Invite
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Caregivers List */}
                        {caregivers.length === 0 ? (
                            <Card className="flex items-center justify-center p-12 col-span-2">
                                <div className="text-center text-muted-foreground">
                                    <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                    <p>No caregivers found. Use the form to invite one!</p>
                                </div>
                            </Card>
                        ) : (
                            caregivers.map((cg) => (
                                <Card key={cg._id}>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={cg.caregiverId?.profilePic} />
                                                    <AvatarFallback>{(cg.name || cg.caregiverEmail).charAt(0).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <CardTitle className="text-base">{cg.name || cg.caregiverEmail}</CardTitle>
                                                    <CardDescription className="capitalize">{cg.relationship}</CardDescription>
                                                </div>
                                            </div>
                                            <Badge variant={cg.status === 'active' ? 'default' : 'secondary'}>{cg.status}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex gap-2 text-sm text-muted-foreground mt-2 border-t pt-3">
                                            {cg.permissions?.canReceiveSOS && <ShieldAlert className="w-4 h-4 text-red-500" title="Receives SOS" />}
                                            {cg.permissions?.canViewVitals && <Activity className="w-4 h-4 text-blue-500" title="Views Vitals" />}
                                            {cg.permissions?.canViewMedicines && <HeartPulse className="w-4 h-4 text-pink-500" title="Views Meds" />}
                                            <Phone className="w-4 h-4 ml-auto" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="patients">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {patients.length === 0 ? (
                            <div className="col-span-full py-12 text-center text-muted-foreground">
                                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>You are not caring for anyone yet.</p>
                            </div>
                        ) : (
                            patients.map((p) => (
                                <Card key={p._id} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-12 h-12">
                                                <AvatarImage src={p.patientId?.profilePic} />
                                                <AvatarFallback>{p.patientId?.name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <CardTitle>{p.patientId?.name}</CardTitle>
                                                <CardDescription>Status: <span className="text-green-500 font-medium">Safe</span></CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            <Button variant="outline" size="sm" className="w-full text-xs gap-1">
                                                <Activity className="w-3 h-3" /> View Vitals
                                            </Button>
                                            <Button variant="outline" size="sm" className="w-full text-xs gap-1">
                                                <HeartPulse className="w-3 h-3" /> Meds Log
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Support section */}
            <div className="mt-12 bg-blue-50 dark:bg-blue-950/20 p-8 rounded-2xl border border-blue-100 dark:border-blue-900">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="bg-blue-100 dark:bg-blue-900/40 p-4 rounded-full">
                        <ShieldAlert className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-2">How Emergency SOS Works</h3>
                        <p className="text-blue-700 dark:text-blue-400">
                            In an emergency, click the red SOS floating button. You will have 5 seconds to cancel if it was a mistake.
                            Once confirmed, your GPS location and an emergency alert will be broadcasted <strong>instantly</strong> to all your active Guardians via real-time app notifications and backend logs.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaregiverDashboard;
