// src/hooks/useAuditNotifications.ts
import { useEffect, useRef } from 'react';
import {
  ProcessDto,
  ProcessEventDto,
  RfqStateDto,
  PoStateDto
} from '../types';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel
} from '@microsoft/signalr';
import { AUDIT_HUB_URL } from '../config/apiConfig';

interface AuditNotificationHandlers {
  onProcessUpdated?: (dto: ProcessDto) => void;
  onProcessEventUpdated?: (dto: ProcessEventDto) => void;
  onRfqStateUpdated?: (dto: RfqStateDto) => void;
  onPoStateUpdated?: (dto: PoStateDto) => void;
}

export function useAuditNotifications(
  correlationId: string | undefined,
  handlers: AuditNotificationHandlers
) {
  const handlersRef = useRef(handlers);

  // Keep latest handlers in a ref so we don't have to reconnect on every render
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    if (!correlationId) return;

    let connection: HubConnection | null = null;
    let stopped = false;

    async function start() {
      connection = new HubConnectionBuilder()
        .withUrl(AUDIT_HUB_URL)
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      // Wire up handlers
      connection.on('ProcessUpdated', (dto: ProcessDto) => {
        handlersRef.current.onProcessUpdated?.(dto);
      });

      connection.on('ProcessEventUpdated', (dto: ProcessEventDto) => {
        handlersRef.current.onProcessEventUpdated?.(dto);
      });

      connection.on('RfqStateUpdated', (dto: RfqStateDto) => {
        handlersRef.current.onRfqStateUpdated?.(dto);
      });

      connection.on('PoStateUpdated', (dto: PoStateDto) => {
        handlersRef.current.onPoStateUpdated?.(dto);
      });

      try {
        await connection.start();
        if (stopped) return;

        await connection.invoke('SubscribeToCorrelationId', correlationId);
      } catch (err) {
        // You can add some retry/backoff here if you like
        console.error('Failed to start SignalR connection', err);
      }
    }

    start();

    return () => {
      stopped = true;
      if (!connection) return;

      // Best-effort unsubscribe + stop
      connection
        .invoke('UnsubscribeFromCorrelationId', correlationId)
        .catch(() => {});

      connection.stop().catch(() => {});
    };
  }, [correlationId]);
}
