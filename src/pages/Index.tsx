import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginScreen } from '@/components/screens/LoginScreen';
import { TimeTrackingScreen } from '@/components/screens/TimeTrackingScreen';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <TimeTrackingScreen /> : <LoginScreen />;
};

export default Index;
