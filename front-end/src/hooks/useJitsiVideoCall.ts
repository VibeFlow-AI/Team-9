import { useState, useCallback } from 'react';
import { jitsiService } from '@/lib/jitsi';
import type { JitsiMeetAPI } from '@/lib/jitsi';

export interface JitsiVideoCallState {
  isLoading: boolean;
  isInCall: boolean;
  error: string | null;
  roomName: string | null;
  api: JitsiMeetAPI | null;
}

export interface UseJitsiVideoCallReturn {
  state: JitsiVideoCallState;
  startCall: (sessionId: string, mentorName?: string, studentName?: string, userDisplayName?: string) => Promise<void>;
  endCall: () => void;
  joinCall: (roomName: string, userDisplayName?: string) => Promise<void>;
}

export const useJitsiVideoCall = (): UseJitsiVideoCallReturn => {
  const [state, setState] = useState<JitsiVideoCallState>({
    isLoading: false,
    isInCall: false,
    error: null,
    roomName: null,
    api: null,
  });

  const startCall = useCallback(async (
    sessionId: string,
    mentorName?: string,
    studentName?: string,
    userDisplayName?: string
  ) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Generate a unique room name
      const roomName = jitsiService.generateRoomName(sessionId, mentorName, studentName);

      // Open Jitsi Meet in a new window/tab
      const jitsiUrl = `https://meet.jit.si/${roomName}`;
      const newWindow = window.open(
        jitsiUrl,
        '_blank',
        'width=1200,height=800,scrollbars=yes,resizable=yes'
      );

      if (!newWindow) {
        throw new Error('Failed to open video call window. Please allow popups for this site.');
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        isInCall: true,
        roomName,
      }));

      // Focus the new window
      newWindow.focus();

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to start video call',
      }));
    }
  }, []);

  const joinCall = useCallback(async (roomName: string, userDisplayName?: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Open Jitsi Meet in a new window/tab
      const jitsiUrl = `https://meet.jit.si/${roomName}`;
      const newWindow = window.open(
        jitsiUrl,
        '_blank',
        'width=1200,height=800,scrollbars=yes,resizable=yes'
      );

      if (!newWindow) {
        throw new Error('Failed to open video call window. Please allow popups for this site.');
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        isInCall: true,
        roomName,
      }));

      // Focus the new window
      newWindow.focus();

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to join video call',
      }));
    }
  }, []);

  const endCall = useCallback(() => {
    const api = jitsiService.getCurrentAPI();
    if (api) {
      api.dispose();
    }

    setState({
      isLoading: false,
      isInCall: false,
      error: null,
      roomName: null,
      api: null,
    });
  }, []);

  return {
    state,
    startCall,
    endCall,
    joinCall,
  };
};
