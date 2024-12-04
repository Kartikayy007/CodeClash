import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const LiveVideoCall = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const {lectureId, classCode, teacherId} = location.state;
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const userId = sessionStorage.getItem('userId');
  const isTeacher = userId === teacherId;
  const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');

  useEffect(() => {
    if (!token || !lectureId) return;


    if (!isTeacher) {
        console.log("ASASAS")
      markAttendance();
    }
    

    socketRef.current = io('https://singhanish.me', {
      query: { token },
      autoConnect: false
    });

    setupSocketListeners();
    socketRef.current.connect();

    return () => cleanupConnection();
  }, [token, lectureId]);

  const setupSocketListeners = () => {
    socketRef.current.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
      socketRef.current.emit('join-room', `lecture-${lectureId}`);
    });

    
    socketRef.current.on('youtube-video-url', (url) => {
      setYoutubeUrl(url);
      setIsLive(true);
    });
  };

  const startLiveSession = async () => {
    if (!isTeacher) return;

    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      videoRef.current.srcObject = streamRef.current;

      const response = await fetch(`${process.env.REACT_APP_API_URL}/lecture/start-live-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ lectureId })
      });

      if (response.ok) {
        socketRef.current.emit('start-streaming', `lecture-${lectureId}`);
        startStreaming();
      }
    } catch (err) {
      setError('Failed to start live session');
    }
  };

  const startStreaming = () => {
    if (!streamRef.current) return;
    console.log('Starting streaming');
    mediaRecorderRef.current = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm;codecs=vp8,opus',
      videoBitsPerSecond: 250000
    });

    mediaRecorderRef.current.ondataavailable = async (event) => {
      if (event.data.size > 0) {
        const buffer = await event.data.arrayBuffer();
        socketRef.current.emit('streaming-data', {
          roomId: `lecture-${lectureId}`,
          chunk: Array.from(new Uint8Array(buffer))
        });
      }
    };

    mediaRecorderRef.current.start(1000);
  };

  const stopLiveSession = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/lecture/stop-live-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ lectureId })
      });

      setIsLive(false);
      socketRef.current.emit('stop-streaming', `lecture-${lectureId}`);
      cleanupConnection();
    } catch (err) {
      setError('Failed to stop live session');
    }
  };

  const markAttendance = async () => {
    try {
      const axiosConfig = {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/lecture/mark`,
        { lectureId },
        axiosConfig
      );
      console.log(response.data)
      if (response.status === 200) {
        setYoutubeUrl(response.data.lecture.youtubeLiveStreamURL.replace("watch?v=", "embed/"));
    }
    } catch (error) {
      console.error('Error marking attendance:', error);
      setError('Failed to join lecture');
    }
  };

  const cleanupConnection = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
  };

  return (
    <div className="p-8 mt-[60px]">
      <div className="w-full mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Live Session</h2>
          
          <div className="mb-4">
            Status: {isLive ? 'Live' : 'Not Started'}
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          {isTeacher ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-[400px] bg-black rounded-lg mb-4"
              />
              <div className="flex gap-4">
                <button
                  onClick={startLiveSession}
                  disabled={isLive}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:bg-gray-400"
                >
                  Start Session
                </button>
                <button
                  onClick={stopLiveSession}
                  disabled={!isLive}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:bg-gray-400"
                >
                  Stop Session
                </button>
              </div>
            </>
          ) : (
            youtubeUrl ? (
                <iframe
                src={`${youtubeUrl}?autoplay=1&mute=1&controls=1&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3`}
                className="w-full h-[700px] rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                frameBorder="0"
                />
            ) : (
              <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Waiting for lecture to start...</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveVideoCall;
