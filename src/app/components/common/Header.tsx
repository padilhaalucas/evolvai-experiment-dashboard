'use client'

import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';

import { useExperimentContext } from "@/app/contexts";
import { SpeedControl } from '@/app/components';
import { cn } from '@/app/utils';

export function Header() {
  const {
    experimentId,
    isConnected,
    lastUpdated,
  } = useExperimentContext();

  const [time, setTime] = useState<string>('');
  const [showSpeedModal, setShowSpeedModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastUpdated) {
      setTime(format(lastUpdated, 'HH:mm:ss'));
    }
  }, [lastUpdated]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSpeedModal(false);
      }
    };

    if (showSpeedModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSpeedModal]);

  return (
    <header className="bg-white shadow sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">
          Experiment Monitoring Dashboard
        </h1>

        <div className="relative flex flex-col items-end gap-1">
          <div className="flex flex-row gap-2">
            <div className={cn(
              "w-fit px-3 py-1 flex items-center justify-between rounded-md",
              isConnected ? "bg-green-100" : "bg-red-100"
            )}>
              <div className={cn(
                "w-2 h-2 rounded-full mr-2",
                isConnected ? "bg-green-500 connection-pulse" : "bg-red-500"
              )}></div>
              <span className={cn(
                "text-sm font-bold",
                isConnected ? "text-green-600" : "text-red-500"
              )}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>


            {experimentId && (
              <div className="relative" ref={dropdownRef}>
                <button
                  className={cn(
                    "text-md px-2 py-1 border rounded-md transition-colors duration-200 hover:cursor-pointer",
                    showSpeedModal
                      ? "bg-gray-100 text-gray-800 border-gray-400 shadow-sm"
                      : "bg-white text-gray-500 border-gray-300 hover:text-gray-700 hover:border-gray-400"
                  )}
                  onClick={() => setShowSpeedModal((prev) => !prev)}
                >
                  ⚙
                </button>

                {showSpeedModal && (
                  <div
                    className="absolute right-0 mt-2 w-fit bg-white border border-gray-200 rounded-md shadow-lg p-3 z-20 animate-fadeInScale"
                  >
                    <SpeedControl />
                  </div>
                )}
              </div>
            )}
          </div>


          <div className="flex items-center gap-1">
            <span className="text-[11px] text-gray-500">Last updated:</span>
            <div className="text-[11px] font-bold text-gray-600">
              {time || 'Never'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
