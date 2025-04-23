import { useState, useEffect, useRef } from 'react';

interface EventSourceOptions {
  onOpen?: () => void;
  onError?: (event: Event) => void;
}

export interface SSEMeta {
  interval: number;
  mode: string;
  index: number;
}

interface HookProps<T> {
  data: T | null;
  meta: SSEMeta | null;
  isConnected: boolean;
  lastUpdated: Date | null;
  error: Event | null;
  connect: () => void;
  disconnect: () => void;
}

export function useEventSource<T>(
  url: string,
  eventName: string = 'experiment-update',
  options: EventSourceOptions = {}
): HookProps<T> {
  const [data, setData] = useState<T | null>(null);
  const [meta, setMeta] = useState<SSEMeta | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<Event | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectingRef = useRef<boolean>(false);

  const connect = () => {
    if (!eventSourceRef.current && !reconnectingRef.current) {
      console.log(`Connecting to SSE endpoint: ${url}`);

      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('SSE connection opened');
        setIsConnected(true);
        reconnectingRef.current = false;
        options.onOpen?.();
      };

      eventSource.onerror = (event) => {
        console.error('SSE connection error:', event);
        setIsConnected(false);
        setError(event);
        options.onError?.(event);

        if (!reconnectingRef.current && eventSourceRef.current) {
          reconnectingRef.current = true;
          eventSourceRef.current.close();
          eventSourceRef.current = null;
          console.log('Attempting reconnect...');
        }
      };

      eventSource.addEventListener(eventName, (event: MessageEvent) => {
        try {
          const payload = JSON.parse(event.data);
          console.log('Parsed SSE payload:', payload);

          if (payload.data) {
            setData(payload.data);
            setLastUpdated(new Date());
          }

          if (payload.meta) {
            setMeta(payload.meta);
          }
        } catch (e) {
          console.error('Error parsing SSE data:', e);
        }
      });
    }
  };

  const disconnect = () => {
    if (eventSourceRef.current) {
      console.log('Closing SSE connection');
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  };

  return { data, meta, isConnected, lastUpdated, error, connect, disconnect };
}
