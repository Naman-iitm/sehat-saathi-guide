import React, { useState, useEffect } from "react";
import {
    Users,
    ShieldAlert,
    UserPlus,
    Phone,
    MapPin,
    Activity,
    CheckCircle,
    XCircle,
    Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Label } from "@/components/ui/label";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CaregiverDashboard: React.FC = () => {
    const { user, token } = useAuth();
    const [caregivers, setCaregivers] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]); // Patients I care for
    const [inviteEmail, setInviteEmail] = useState("");
    const [isSOSActive, setIsSOSActive] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        fetchCaregivers();
        fetchPatients();
    }, []);

    const fetchCaregivers = async () => {
        try {
            const res = await fetch(`${API_URL}/api/caregivers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setCaregivers(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchPatients = async () => {
        try {
            const res = await fetch(`${API_URL}/api/caregivers/patients`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setPatients(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleInvite = async () => {
        if (!inviteEmail) return;
        try {
            const res = await fetch(`${API_URL}/api/caregivers/invite`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: inviteEmail,
                    relationship: "Family", // Simplification
                    permissions: {
                        canViewSymptoms: true,
                        canViewMedicines: true,
                        canReceiveAlerts: true
                    }
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Invitation sent!");
                setInviteEmail("");
                fetchCaregivers();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Failed to invite");
        }
    };

    const triggerSOS = async () => {
        // 1. Get Location
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported");
            return;
        }

        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;

            try {
                const res = await fetch(`${API_URL}/api/caregivers/sos`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ location: { latitude, longitude } })
                });

                const data = await res.json();
                if (data.success) {
                    toast.success("SOS Alert Sent! Help is on the way.");
                    setIsSOSActive(false);
                }
            } catch (err) {
                toast.error("Failed to send SOS");
            }
        }, (err) => {
            toast.error("Could not get location: " + err.message);
        });
    };

    const startSOSCountdown = () => {
        if (isSOSActive) return;
        setIsSOSActive(true);
        setCountdown(5);
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isSOSActive && countdown > 0) {
            timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        } else if (isSOSActive && countdown === 0) {
            triggerSOS();
        }
        return () => clearTimeout(timer);
    }, [isSOSActive, countdown]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            {/* SOS Floating Button (If hidden, logic needs to be global, but for demo here) */}
            <div className="fixed bottom-24 right-4 z-50">
                {isSOSActive ? (
                    <div className="bg-destructive text-destructive-foreground p-6 rounded-full w-32 h-32 flex flex-col items-center justify-center animate-pulse shadow-2xl border-4 border-white cursor-pointer" onClick={() => setIsSOSActive(false)}>
                        <span className="text-3xl font-bold">{countdown}</span>
                        <span className="text-xs font-bold uppercase">Cancel</span>
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
                <Heart className="text-red-500 fill-current" /> Care Circles
            </h1>

            <Tabs defaultValue="my-caregivers" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="my-caregivers">My Guardians</TabsTrigger>
                    <TabsTrigger value="patients">I am Caring For</TabsTrigger>
                </TabsList>

                {/* My Caregivers Tab */}
                <TabsContent value="my-caregivers" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Invite Card */}
                        <Card className="bg-muted/30 border-dashed">
                            <CardHeader>
                                <CardTitle className="text-lg">Add Guardian</CardTitle>
                                <CardDescription>Invite family to monitor your health.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Label>Email Address</Label>
                                <Input
                                    placeholder="family@example.com"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                />
                                <Button className="w-full gap-2" onClick={handleInvite}>
                                    <UserPlus className="w-4 h-4" /> Send Invite
                                </Button>
                            </CardContent>
                        </Card>

                        {/* List */}
                        {caregivers.map((c) => (
                            <Card key={c._id}>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={c.caregiverId.profilePic} />
                                                <AvatarFallback>{c.caregiverId.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <CardTitle className="text-base">{c.caregiverId.name}</CardTitle>
                                                <CardDescription className="capitalize">{c.relationship}</CardDescription>
                                            </div>
                                        </div>
                                        <Badge variant={c.status === 'active' ? 'default' : 'secondary'}>{c.status}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-2 text-sm text-muted-foreground mt-2">
                                        {c.permissions.canReceiveAlerts && <ShieldAlert className="w-4 h-4 text-destructive" title="Receives SOS" />}
                                        {c.permissions.canViewSymptoms && <Activity className="w-4 h-4 text-blue-500" title="Views Symptoms" />}
                                        <Phone className="w-4 h-4 ml-auto" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Patients Tab */}
                <TabsContent value="patients">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {patients.length === 0 && (
                            <div className="col-span-full py-12 text-center text-muted-foreground">
                                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>You are not caring for anyone yet.</p>
                            </div>
                        )}
                        {patients.map((p) => (
                            <Card key={p._id} className="border-l-4 border-l-primary">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={p.patientId.profilePic} />
                                            <AvatarFallback>{p.patientId.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle>{p.patientId.name}</CardTitle>
                                            <CardDescription>Status: Normal</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <Button variant="outline" size="sm" className="w-full text-xs">View Vitals</Button>
                                        <Button variant="outline" size="sm" className="w-full text-xs">Meds Log</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Explanation / Trusted Contacts */}
            <div className="mt-12 bg-blue-50 dark:bg-blue-950/20 p-6 rounded-xl border border-blue-100 dark:border-blue-900">
                <h3 className="flex items-center gap-2 font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    <ShieldAlert className="w-5 h-5" /> How SOS Works
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                    In an emergency, holding the red SOS button for 5 seconds will instantly send your GPS location and an emergency alert to all your active Guardians via SMS and App Notification.
                </p>
            </div>
        </div>
    );
};

export default CaregiverDashboard;
