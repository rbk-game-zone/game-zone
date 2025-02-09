import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
const API_URL = import.meta.env.VITE_API_URL;
const socket = io(API_URL);

const VoiceChat = ({ roomId }) => {
    const localStreamRef = useRef<MediaStream | null>(null);
    const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const constraints = { audio: true, video: false };

        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                localStreamRef.current = stream;
                if (localStreamRef.current) {
                    localStreamRef.current.getAudioTracks()[0].enabled = true;
                }
                socket.emit("joinRoom", roomId);
            })
            .catch((error) => {
                console.error("Error accessing microphone:", error);
            });

        socket.on("signal", async (data) => {
            if (!peerConnectionRef.current) return;

            if (data.signal?.sdp) {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.signal.sdp));
                const answer = await peerConnectionRef.current.createAnswer();
                await peerConnectionRef.current.setLocalDescription(answer);
                socket.emit("signal", { signal: answer, roomId });
            } else if (data.signal?.ice) {
                await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.signal.ice));
            }
        });

        peerConnectionRef.current = new RTCPeerConnection();
        peerConnectionRef.current.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("signal", { signal: { ice: event.candidate }, roomId });
            }
        };

        peerConnectionRef.current.ontrack = (event) => {
            if (remoteAudioRef.current) {
                remoteAudioRef.current.srcObject = event.streams[0];
            }
        };

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
                peerConnectionRef.current?.addTrack(track, localStreamRef.current);
            });
        }

        return () => {
            socket.off("signal");
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, [roomId]);

    const toggleMute = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsMuted(!audioTrack.enabled);
        }
    };

    return (
        <div>
            <h3>Voice Chat</h3>
            <button onClick={toggleMute}>{isMuted ? "Unmute" : "Mute"}</button>
            <audio ref={remoteAudioRef} autoPlay />
        </div>
    );
};

export default VoiceChat;
