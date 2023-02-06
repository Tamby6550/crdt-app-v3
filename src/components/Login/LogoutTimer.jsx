import React, { useState, useEffect } from 'react';

const LogoutTimer = ({ logoutTime, onLogout }) => {
    const [timer, setTimer] = useState(logoutTime);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimer(prevTimer => prevTimer - 1);
        }, 1000);

        document.addEventListener('mousemove', resetIdleTime);
        document.addEventListener('keydown', resetIdleTime);

        return () => {
            clearInterval(intervalId);
            document.removeEventListener('mousemove', resetIdleTime);
            document.removeEventListener('keydown', resetIdleTime);
        };
    }, []);

    const resetIdleTime = () => {
        setTimer(logoutTime);
    };
    useEffect(() => {
        if (timer === 0) {
            onLogout();
        }
    }, [timer]);

    return null;
};

export default LogoutTimer;

