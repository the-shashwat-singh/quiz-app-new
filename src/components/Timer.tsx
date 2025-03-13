import React, { useState, useEffect } from 'react';

interface TimerProps {
  timeLimit: number;
  onTimeUp: () => void;
  isAnswered: boolean;
}

const Timer: React.FC<TimerProps> = ({ timeLimit, onTimeUp, isAnswered }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    if (isAnswered) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAnswered, onTimeUp]);

  useEffect(() => {
    setTimeLeft(timeLimit);
  }, [timeLimit]);

  const percentage = (timeLeft / timeLimit) * 100;
  const color = percentage > 50 ? 'text-green-600' : percentage > 25 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-full shadow-lg p-4 flex items-center justify-center w-20 h-20">
      <div className={`text-2xl font-bold ${color}`}>
        {timeLeft}s
      </div>
    </div>
  );
};

export default Timer; 