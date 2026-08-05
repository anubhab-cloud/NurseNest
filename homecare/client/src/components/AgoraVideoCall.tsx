import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IAgoraRTCRemoteUser
} from 'agora-rtc-sdk-ng';
import { Mic, MicOff, Video, VideoOff, PhoneOff, User } from 'lucide-react';
import { api } from '../context/AuthContext';

interface AgoraVideoCallProps {
  bookingId?: string;
  onEndCall: () => void;
}

export const AgoraVideoCall: React.FC<AgoraVideoCallProps> = ({ bookingId = 'quick', onEndCall }) => {
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [remoteUser, setRemoteUser] = useState<IAgoraRTCRemoteUser | null>(null);

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localAudioTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const localVideoTrackRef = useRef<ICameraVideoTrack | null>(null);

  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const startCall = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch token and credentials from backend with fallback endpoint check
        let res;
        try {
          res = await api.get(`/agora/${bookingId}/token`);
        } catch (tokenErr) {
          res = await api.get(`/agora/token/${bookingId}`);
        }
        const { token, channelName, appId } = res.data.data;

        if (!isMounted) return;

        // Create Agora client
        const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        clientRef.current = client;

        // Handle remote user publication
        client.on('user-published', async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          if (!isMounted) return;

          if (mediaType === 'video') {
            setRemoteUser(user);
            setTimeout(() => {
              if (remoteVideoRef.current) {
                user.videoTrack?.play(remoteVideoRef.current);
              }
            }, 100);
          }
          if (mediaType === 'audio') {
            user.audioTrack?.play();
          }
        });

        client.on('user-unpublished', (user) => {
          setRemoteUser(prev => (prev?.uid === user.uid ? null : prev));
        });

        // Join channel
        await client.join(appId || 'f5cc87b307fe4202b165ff7cde4197e5', channelName, token || null, null);

        // Try creating local microphone and camera tracks
        try {
          const [micTrack, camTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
          localAudioTrackRef.current = micTrack;
          localVideoTrackRef.current = camTrack;

          if (localVideoRef.current) {
            camTrack.play(localVideoRef.current);
          }

          await client.publish([micTrack, camTrack]);
        } catch (mediaErr: any) {
          console.warn('Camera/Microphone access limited or unavailable:', mediaErr);
          // Try publishing audio-only if camera is unavailable
          try {
            const micTrack = await AgoraRTC.createMicrophoneAudioTrack();
            localAudioTrackRef.current = micTrack;
            await client.publish([micTrack]);
          } catch (micErr) {
            console.warn('Microphone access unavailable:', micErr);
          }
        }

        if (isMounted) {
          setJoined(true);
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Agora call failed:', err);
        if (isMounted) {
          setError(err?.response?.data?.message || err?.message || 'Failed to start video call');
          setLoading(false);
        }
      }
    };

    startCall();

    return () => {
      isMounted = false;
      localAudioTrackRef.current?.close();
      localVideoTrackRef.current?.close();
      if (clientRef.current) {
        clientRef.current.leave().catch(() => {});
      }
    };
  }, [bookingId]);

  const toggleAudio = async () => {
    if (localAudioTrackRef.current) {
      await localAudioTrackRef.current.setEnabled(audioMuted);
      setAudioMuted(!audioMuted);
    }
  };

  const toggleVideo = async () => {
    if (localVideoTrackRef.current) {
      await localVideoTrackRef.current.setEnabled(videoMuted);
      setVideoMuted(!videoMuted);
    }
  };

  const handleEndCall = () => {
    localAudioTrackRef.current?.close();
    localVideoTrackRef.current?.close();
    clientRef.current?.leave().catch(() => {});
    onEndCall();
  };

  return (
    <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
      {/* Video display area */}
      <div className="relative h-72 sm:h-96 bg-gray-950 flex items-center justify-center overflow-hidden">
        {loading && (
          <div className="text-center text-white space-y-3 z-10">
            <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-gray-300">Connecting to secure video channel...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-white p-6 space-y-3 z-10">
            <p className="text-red-400 font-semibold text-sm">⚠️ {error}</p>
            <button
              onClick={handleEndCall}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-semibold"
            >
              Close Call
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Remote user stream (main container) */}
            <div ref={remoteVideoRef} className="absolute inset-0 w-full h-full flex items-center justify-center">
              {!remoteUser && (
                <div className="text-center text-white/70">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500/20 to-teal-500/20 border border-primary-500/30 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                    <User className="w-10 h-10 text-primary-400" />
                  </div>
                  <p className="font-semibold text-sm">Waiting for caregiver to join...</p>
                  <p className="text-xs text-gray-500 mt-1">Room ID: consultation-{bookingId}</p>
                </div>
              )}
            </div>

            {/* Local user camera preview (picture-in-picture) */}
            <div
              ref={localVideoRef}
              className="absolute bottom-4 right-4 w-28 h-36 bg-gray-800 rounded-2xl overflow-hidden border-2 border-gray-700 shadow-xl z-20"
            />
          </>
        )}
      </div>

      {/* Control bar */}
      <div className="p-4 bg-gray-900 border-t border-gray-800 flex items-center justify-center gap-4">
        <button
          onClick={toggleAudio}
          disabled={loading || !!error}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
            audioMuted ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          {audioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <button
          onClick={toggleVideo}
          disabled={loading || !!error}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
            videoMuted ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          {videoMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        </button>

        <button
          onClick={handleEndCall}
          className="w-14 h-12 bg-red-600 hover:bg-red-700 text-white rounded-2xl flex items-center justify-center shadow-lg transition-colors"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AgoraVideoCall;
