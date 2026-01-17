import React, { useEffect, useRef } from 'react';

interface VideoPlayerProps {
    stream: MediaStream | null;
    muted?: boolean;
    className?: string;
    autoPlay?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ stream, muted, className, autoPlay = true }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <video
            ref={videoRef}
            muted={muted}
            autoPlay={autoPlay}
            playsInline
            className={`rounded-lg bg-black object-cover ${className}`}
        />
    );
};

export default VideoPlayer;
