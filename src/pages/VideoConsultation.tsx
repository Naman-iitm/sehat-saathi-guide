import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, Settings, Maximize2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import VideoPlayer from '@/components/video/VideoPlayer';
import InCallChat from '@/components/video/InCallChat';
import { webRTCService } from '@/services/webRTCService';
import api from '@/lib/api'; // Assuming an axios instance exists

const VideoConsultation: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [userRole, setUserRole] = useState<'patient' | 'doctor' | null>(null);
    const [userName, setUserName] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);

    const initConsultation = useCallback(async () => {
        try {
            // 1. Verify Authorization
            const { data } = await api.get(`/api/appointments/${id}/video-access`);
            if (!data.authorized) {
                toast({ title: 'Unauthorized', description: 'You cannot join this call', variant: 'destructive' });
                navigate('/dashboard');
                return;
            }
            setUserRole(data.role);
            setIsAuthorized(true);

            // 2. Get User Media
            const stream = await webRTCService.getUserMedia();
            setLocalStream(stream);

            // 3. Connect to Signaling
            webRTCService.connect(id!, data.role);

            // 4. Handle signaling events
            webRTCService.onUserJoined(({ socketId, role }) => {
                toast({ title: 'User Joined', description: `A ${role} has joined the call` });
                // If I am doctor and patient joins, or vice versa, initiate peer connection
                // For simplicity: Doctor initiates
                if (data.role === 'doctor') {
                    // Initiate WebRTC
                    // This is a simplified logic. In real simple-peer usage, we'd need the target socketId.
                }
            });

            webRTCService.onReceiveMessage((msg) => {
                setMessages(prev => [...prev, msg]);
            });

        } catch (error) {
            console.error('Failed to start consultation:', error);
            toast({ title: 'Error', description: 'Could not access camera/microphone', variant: 'destructive' });
        }
    }, [id, navigate, toast]);

    useEffect(() => {
        initConsultation();
        return () => webRTCService.disconnect();
    }, [initConsultation]);

    const toggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
            setIsVideoOff(!isVideoOff);
        }
    };

    const endCall = () => {
        webRTCService.disconnect();
        toast({ title: 'Call Ended', description: 'Consultation completed' });
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-4 md:p-6 lg:p-8">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold font-serif">Sehat Saathi Telemedicine</h1>
                    <p className="text-slate-400 text-sm">Appointment ID: {id}</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-medium uppercase tracking-wider text-slate-300">
                        {userRole || 'Connecting...'}
                    </span>
                </div>
            </header>

            <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
                <div className="lg:col-span-3 flex flex-col gap-4">
                    <Card className="flex-1 relative bg-slate-900 border-none overflow-hidden shadow-2xl">
                        {/* Remote Video */}
                        <VideoPlayer stream={remoteStream} className="w-full h-full" />

                        {/* Local Video Overlay */}
                        <div className="absolute bottom-4 right-4 w-48 aspect-video rounded-lg overflow-hidden border-2 border-slate-700 shadow-xl z-20">
                            <VideoPlayer stream={localStream} muted className="w-full h-full" />
                        </div>

                        {!remoteStream && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
                                <div className="text-center">
                                    <div className="animate-pulse-slow mb-4 inline-block p-4 rounded-full bg-slate-800">
                                        <Video className="w-12 h-12 text-slate-600" />
                                    </div>
                                    <p className="text-slate-400 font-medium">Waiting for other participant to join...</p>
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Controls Bar */}
                    <div className="bg-slate-900/80 backdrop-blur-lg p-4 rounded-2xl flex justify-center items-center gap-4 md:gap-8 shadow-2xl border border-slate-800">
                        <Button
                            variant={isMuted ? 'destructive' : 'secondary'}
                            size="icon"
                            className="rounded-full w-12 h-12"
                            onClick={toggleMute}
                        >
                            {isMuted ? <MicOff /> : <Mic />}
                        </Button>

                        <Button
                            variant={isVideoOff ? 'destructive' : 'secondary'}
                            size="icon"
                            className="rounded-full w-12 h-12"
                            onClick={toggleVideo}
                        >
                            {isVideoOff ? <VideoOff /> : <Video />}
                        </Button>

                        <div className="w-px h-8 bg-slate-800 hidden md:block" />

                        <Button variant="secondary" size="icon" className="rounded-full w-12 h-12 hidden md:flex">
                            <Monitor />
                        </Button>

                        <Button
                            variant="destructive"
                            className="rounded-full px-8 h-12 font-semibold flex gap-2"
                            onClick={endCall}
                        >
                            <PhoneOff className="w-5 h-5" />
                            <span className="hidden md:inline">End Consultation</span>
                        </Button>

                        <div className="w-px h-8 bg-slate-800 hidden md:block" />

                        <Button variant="secondary" size="icon" className="rounded-full w-12 h-12 hidden md:flex">
                            <Settings />
                        </Button>
                    </div>
                </div>

                {/* Chat Sidebar */}
                <div className="lg:col-span-1 hidden lg:block">
                    <InCallChat
                        messages={messages}
                        userName={userName}
                        onSendMessage={(text) => id && webRTCService.sendMessage(id, text, userRole === 'doctor' ? 'Doctor' : 'Patient')}
                    />
                </div>
            </main>
        </div>
    );
};

export default VideoConsultation;
