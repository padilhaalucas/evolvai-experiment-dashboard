'use client'

import { useState, useMemo, useRef, useEffect } from 'react';
import { format, parseISO } from 'date-fns';

import { ExperimentLog } from '@/app/types';
import { useExperimentContext } from "@/app/contexts";
import { SectionHeader } from "@/app/components";
import { generateLogs } from "@/app/utils";

export function EventLogPanel() {
  const { data: experiment } = useExperimentContext();

  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState<'all' | 'visitors' | 'conversions' | 'revenue'>('all');
  const prevLogsRef = useRef<ExperimentLog[]>([]);
  const [newLogIds, setNewLogIds] = useState<Set<string>>(new Set());
  const logContainerRef = useRef<HTMLDivElement>(null);

  const logs = useMemo(() => {
    if (!experiment) return [];

    return [...generateLogs(experiment)];
  }, [experiment]);

  const filteredLogs = useMemo(() => {
    if (filter === 'all') return logs;
    return logs.filter(log => log.eventType === filter);
  }, [logs, filter]);

  useEffect(() => {
    if (!logs.length) return;

    if (logs.length > prevLogsRef.current.length) {

      const existingLogMap = new Map();
      prevLogsRef.current.forEach(log => {
        const key = `${log.timestamp}-${log.eventType}-${log.message}`;
        existingLogMap.set(key, true);
      });

      const newLogsSet = new Set<string>();
      logs.forEach(log => {
        const key = `${log.timestamp}-${log.eventType}-${log.message}`;
        if (!existingLogMap.has(key)) {
          newLogsSet.add(key);
        }
      });

      if (newLogsSet.size > 0) {
        setNewLogIds(newLogsSet);

        const timer = setTimeout(() => {
          setNewLogIds(new Set());
        }, 3000);

        return () => clearTimeout(timer);
      }
    }

    prevLogsRef.current = logs;
  }, [logs]);

  if (!experiment) {
    return (
      <div className="bg-white shadow rounded-lg p-6 mt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Event Log Stream</h2>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="relative p-1.5 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none group"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse metrics section" : "Expand metrics section"}
            title={isExpanded ? "Collapse" : "Expand"}
          >
            <span className="absolute inset-0 rounded-full bg-gray-200 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 text-gray-500 transition-transform duration-500 ease-in-out ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <div className="text-gray-500 mt-4">Loading event logs...</div>
      </div>
    );
  }

  const filters = [
    { title: 'All', onClick: () => setFilter('all'), isSelected: filter === 'all' },
    { title: 'Visitors', onClick: () => setFilter('visitors'), isSelected: filter === 'visitors' },
    { title: 'Conversions', onClick: () => setFilter('conversions'), isSelected: filter === 'conversions' },
    { title: 'Revenue', onClick: () => setFilter('revenue'), isSelected: filter === 'revenue' },
  ]

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6 overflow-hidden">
      <SectionHeader
        title="Event Log Stream"
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        filters={filters}
      />

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'mt-4 opacity-100' : 'mt-0 opacity-0'}`}
        style={{
          maxHeight: isExpanded ? '500px' : '0px',
        }}
      >
        <div ref={logContainerRef} className="overflow-y-auto max-h-80 evolvai-scrollbar">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No logs available with the current filter.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredLogs.map((log, index) => {
                const logId = `${log.timestamp}-${log.eventType}-${log.message}`;
                const isNew = newLogIds.has(logId);

                return (
                  <li
                    key={`${logId}-${index}`}
                    className={`relative py-3 ${
                      isNew ? 'animate-slide-in' : ''
                    }`}
                  >
                    <div className="relative flex items-start z-10">
                      <div className={`mt-1.75 ml-2 flex-shrink-0 w-2 h-2 rounded-full mr-3 ${isNew ? 'connection-pulse': ''} ${
                        log.eventType === 'visitors'
                          ? 'bg-blue-500'
                          : log.eventType === 'conversions'
                            ? 'bg-green-500'
                            : 'bg-yellow-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {log.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(parseISO(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}