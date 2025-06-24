'use client';
import Hls from 'hls.js';
import { useEffect, useState, useRef } from 'react';

export default function Page() {
    const videoRef = useRef(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
    if (videoRef.current) {
        if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource("http://localhost:5010/hls/xxx.m3u8");
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoRef.current.play();
        });
        return () => {
            hls.destroy();
        };
        }
    }
    }, []);

    useEffect(() => {
    const socket = new WebSocket("ws://localhost:7000/tracking");

    socket.onopen = () => {
        // console.log('Соединение установлено');
    };

    socket.onmessage = (event) => {
        setMessages(prev => [event.data, ...prev]);
    };

    socket.onerror = (error) => {
        console.log('Ошибка WebSocket', error);
    };

    socket.onclose = () => {
        // console.log('Соединение закрыто');
    };

    return () => {
        socket.close();
    };
    });
    return (
    <div>
        <video ref={videoRef} id="video" width="40%" height="30%" controls={true} autoPlay={true}></video>
        <h1>Данные предсказаний</h1>
        <div>
        {messages.map((msg, index) => (
            <div key={index}>{msg}</div>
        ))}
        </div>
    </div>
    );
}