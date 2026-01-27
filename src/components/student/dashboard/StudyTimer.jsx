import { useState, useRef } from "react";
import Button from "../../../ui/Button";
import Section from "../../../ui/Section";

// Icons
import { EllipsisHorizontalIcon } from "../../../ui/icons";

export default function StudyTimer({className, timerDuration = 60}) {
    const [strokeOffset, setStrokeOffset] = useState(0);
    const [currTime, setCurrTime] = useState(timerDuration);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);

    const handleStart = () => {
      if (isRunning) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
      } else {
        setIsRunning(true);
        setCurrTime(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
        setStrokeOffset(prev => Math.min(prev + (336 / timerDuration), 336));

        intervalRef.current = setInterval(() => {
          setCurrTime(prev => {
            if (prev <= 1) {
              clearInterval(intervalRef.current);
              setIsRunning(false);
              return 0;
            }
            return prev - 1;
          });
          setStrokeOffset(prev => Math.min(prev + (336 / timerDuration), 336));
        }, 1000);
      }
    };

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Section className={`p-6 bg-surface-bg-light dark:bg-surface-bg-dark border border-default-border-light dark:border-default-border-dark rounded-lg flex flex-col justify-between ${className}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Study Timer</h2>
            <button>
              <EllipsisHorizontalIcon className="w-6 h-6" />
            </button>
          </div>

            <div className="relative w-48 h-48 mx-auto mb-4">
                <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full rotate-90"
                >
                    {/* Background square */}
                    <rect
                        x="8"
                        y="8"
                        width="84"
                        height="84"
                        rx="10"
                        ry="10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-gray-300 dark:text-gray-700"
                    />

                    {/* Progress square */}
                    <rect
                        x="8"
                        y="8"
                        width="84"
                        height="84"
                        rx="10"
                        ry="10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray="336"
                        strokeDashoffset={strokeOffset}
                        strokeLinecap="round"
                        className="text-blue-500 transition-all duration-500"
                    />
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-5xl font-bold">{formatTime(currTime)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                    Focus Mode
                    </p>
                </div>
            </div>


          <div className="flex items-center justify-center border-t pt-4 border-default-border-light dark:border-default-border-dark">
            <Button 
              className="bg-blue-600 text-white px-4 py-2 w-[80%] rounded-lg hover:bg-blue-700 transition duration-200"
              onClick={handleStart}
            >
              {isRunning ? 'Pause' : 'Start'}
            </Button>
          </div>
        </Section>
    );
}