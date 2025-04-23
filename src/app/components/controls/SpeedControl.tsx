'use client';

import { useExperimentContext } from "@/app/contexts";
import { cn } from '@/app/utils';

export function SpeedControl() {
  const {
    connect,
    disconnect,
    isConnected,
    displayText,
    index,
    handleFaster,
    handleSlower
  } = useExperimentContext();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 p-1 rounded-md border bg-white shadow-sm">
        <button
          onClick={handleSlower}
          className={cn(
            'text-md px-2 rounded-md transition hover:cursor-pointer',
            index < 4 ? 'bg-yellow-100 text-yellow-700' : 'text-gray-500 hover:bg-yellow-100'
          )}
        >
          🐢
        </button>

        <span className="text-sm font-bold text-gray-700 w-8 text-center">
          {displayText}
        </span>

        <button
          onClick={handleFaster}
          className={cn(
            'text-md px-2 rounded-md transition hover:cursor-pointer',
            index > 4 ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-500 hover:bg-blue-100'
          )}
        >
          🐇
        </button>
      </div>

      <hr className="h-0.25 w-full border-t-0 bg-gray-200"/>

      <button
        onClick={isConnected ? disconnect : connect}
        className={cn(
          'px-2 py-1 w-full rounded-md transition hover:cursor-pointer font-medium',
          isConnected
            ? 'bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800'
            : 'bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800'
        )}
      >
        {isConnected ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  );
}