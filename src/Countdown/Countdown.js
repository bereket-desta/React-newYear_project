import React, { useState, useEffect } from "react";
import ReactCardFlip from "react-card-flip";
import "./Countdown.css"; // Ensure you have the appropriate styles

import FireworksCanvas from "../Firework/Firework.js";
import Rainfall from "../adey/adey.js";

import dayImage from '../assets/images/num-2.jpg';
import hourImage from '../assets/images/num-0.jpg';
import minuteImage from '../assets/images/num-1.jpg';
import secondImage from '../assets/images/num-7.jpg';

const Countdown = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
        isTimeUp: false
    });
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        const countdownDate = new Date("September 18, 2024 00:00:00").getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = countdownDate - now;

            if (difference < 0) {
                clearInterval(interval);
                setTimeLeft({ isTimeUp: true });
                setIsFlipped(true);
            } else {
                setTimeLeft({
                    days: formatTime(Math.floor(difference / (24 * 60 * 60 * 1000))),
                    hours: formatTime(Math.floor((difference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))),
                    minutes: formatTime(Math.floor((difference % (60 * 60 * 1000)) / (60 * 1000))),
                    seconds: formatTime(Math.floor((difference % (60 * 1000)) / 1000)),
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (time) => (time < 10 ? `0${time}` : time);

    const images = {
        days: dayImage,
        hours: hourImage,
        minutes: minuteImage,
        seconds: secondImage,
    };

    const getCardContent = (value, isFlipped, unit) => (
        <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
            <div className="card-front">
            <div className="card-value">
                {value}
            </div>
            <div className="card-label">
                {unit.charAt(0).toUpperCase() + unit.slice(1)}
            </div>
            </div>
            <div className="card-back">
                
                <img src={images[unit]} alt={`${unit}`} />
                

            </div>
        </ReactCardFlip>
    );

    return (
        
            
        <div id="countdown-box" className="cdb">
            {timeLeft.isTimeUp && (
            <h1>HAPPY ETHIOPIAN NEW YEAR </h1>
            )}
            <div className="countdown-container">
                <div className="countdown-card">
                    {getCardContent(timeLeft.days, isFlipped, "days")}
                </div>
                <div className="countdown-card">
                    {getCardContent(timeLeft.hours, isFlipped, "hours")}
                </div>
                <div className="countdown-card">
                    {getCardContent(timeLeft.minutes, isFlipped, "minutes")}
                </div>
                <div className="countdown-card">
                    {getCardContent(timeLeft.seconds, isFlipped, "seconds")}
                </div>
            </div>
            {timeLeft.isTimeUp && (
            <h1>🌼🌼መልካም አዲስ ዓመት🌼🌼</h1>
            
            )}
       {timeLeft.isTimeUp && (
        <div class="newyear-container">
            
        <FireworksCanvas />
        <Rainfall />

        </div>
        )}
        
        
        </div>
    );
};

export default Countdown;
