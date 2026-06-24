import { useState, useRef } from "react";

import Button from "../../../components/ui/Button";
import Section from "../../../components/ui/Section";
import { EllipsisVerticalIcon } from "../../../components/ui/icons";

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
        <div className={`p-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg flex flex-col justify-between ${className}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Study Timer</h2>
            <button>
              <EllipsisVerticalIcon className="w-6 h-6 rotate-90" />
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
                        className="text-text-tertiary-default-light dark:text-text-tertiary-default-dark"
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
                        className="text-text-accent-default-light dark:text-text-accent-default-dark transition-all duration-500"
                    />
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-5xl font-bold">{formatTime(currTime)}</p>
                    <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                    Focus Mode
                    </p>
                </div>
            </div>


          <div className="flex items-center justify-center border-t pt-4 border-border-primary-default-light dark:border-border-primary-default-dark">
            <Button 
              className="bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark text-text-accent-active-light dark:text-text-accent-active-dark px-4 py-2 w-[80%] rounded-lg hover:bg-bg-surface-accent-hover-light dark:hover:bg-bg-surface-accent-hover-dark transition duration-200"
              onClick={handleStart}
            >
              {isRunning ? 'Pause' : 'Start'}
            </Button>
          </div>
        </div>
    );
}