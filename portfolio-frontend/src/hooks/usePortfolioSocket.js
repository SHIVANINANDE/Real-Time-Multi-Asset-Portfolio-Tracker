import { useState, useEffect, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const usePortfolioSocket = (userId) => {
    const [portfolioData, setPortfolioData] = useState(null);
    const [connectionState, setConnectionState] = useState('Disconnected');
    const [client, setClient] = useState(null);

    const connect = useCallback(() => {
        if (!userId) return;

        setConnectionState('Connecting');
        const newClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws-portfolio'),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                setConnectionState('Connected');
                newClient.subscribe(`/topic/portfolio/${userId}`, (message) => {
                    if (message.body) {
                        setPortfolioData(JSON.parse(message.body));
                    }
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
                setConnectionState('Disconnected');
            },
            onWebSocketClose: () => {
                setConnectionState('Disconnected');
            },
            onDisconnect: () => {
                setConnectionState('Disconnected');
            }
        });

        newClient.activate();
        setClient(newClient);

        return () => {
            newClient.deactivate();
        };
    }, [userId]);

    useEffect(() => {
        const cleanup = connect();
        return () => {
            if (cleanup) cleanup();
        };
    }, [connect]);

    // Provide a manual reconnect mechanism just in case
    const reconnect = () => {
        if (client) {
            client.deactivate();
        }
        connect();
    };

    return { portfolioData, connectionState, reconnect };
};
