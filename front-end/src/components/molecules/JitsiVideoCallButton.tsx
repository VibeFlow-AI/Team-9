import React from 'react';
import { Button } from '@/components/ui/button';
import { Video, Loader2 } from 'lucide-react';
import { useJitsiVideoCall } from '@/hooks/useJitsiVideoCall';

export interface JitsiVideoCallButtonProps {
  sessionId: string;
  mentorName?: string;
  studentName?: string;
  userDisplayName?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const JitsiVideoCallButton: React.FC<JitsiVideoCallButtonProps> = ({
  sessionId,
  mentorName,
  studentName,
  userDisplayName,
  variant = 'default',
  size = 'default',
  className = '',
  disabled = false,
  children,
}) => {
  const { state, startCall } = useJitsiVideoCall();

  const handleStartCall = async () => {
    await startCall(sessionId, mentorName, studentName, userDisplayName);
  };

  const isLoading = state.isLoading;
  const hasError = !!state.error;

  const getButtonText = () => {
    if (children) return children;
    if (isLoading) return 'Starting...';
    if (hasError) return 'Retry Call';
    return 'Start Session';
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`flex items-center space-x-2 ${className}`}
      onClick={handleStartCall}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Video className="w-4 h-4" />
      )}
      <span>{getButtonText()}</span>
    </Button>
  );
};
