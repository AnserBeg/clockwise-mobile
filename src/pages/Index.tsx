import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginScreen } from '@/components/screens/LoginScreen';
import { TimeTrackingScreen } from '@/components/screens/TimeTrackingScreen';
import { LeaveManagementScreen } from '@/components/screens/LeaveManagementScreen';
import { Loader2, Clock, Calendar, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { LoadingScreen } from '@/components/LoadingScreen';

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<'time-tracking' | 'leave-management'>('time-tracking');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const handleScreenChange = (screen: 'time-tracking' | 'leave-management') => {
    setCurrentScreen(screen);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Mobile Navigation Header */}
      <div className="bg-gradient-to-r from-gradient-primary-from to-gradient-primary-to text-primary-foreground p-4 shadow-mobile">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-lg font-semibold">Welcome back!</h1>
              <p className="text-sm opacity-90 capitalize">
                {currentScreen === 'time-tracking' ? 'Time Tracking' : 'Leave Management'}
              </p>
            </div>
          </div>
          
          {/* Burger Menu on the Right */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 text-primary-foreground hover:bg-white/20"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-sidebar p-0">
              <SheetHeader className="p-4 border-b border-border">
                <SheetTitle className="text-left text-lg font-semibold text-sidebar-foreground">
                  Navigation
                </SheetTitle>
              </SheetHeader>
              
              <div className="p-4 space-y-4">
                {/* Navigation Menu Items */}
                <div className="space-y-2">
                  <Button
                    variant={currentScreen === 'time-tracking' ? 'default' : 'ghost'}
                    onClick={() => handleScreenChange('time-tracking')}
                    className="w-full justify-start h-12"
                  >
                    <Clock className="h-5 w-5 mr-3" />
                    Time Tracking
                  </Button>
                  
                  <Button
                    variant={currentScreen === 'leave-management' ? 'default' : 'ghost'}
                    onClick={() => handleScreenChange('leave-management')}
                    className="w-full justify-start h-12"
                  >
                    <Calendar className="h-5 w-5 mr-3" />
                    Leave Management
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Screen Content */}
      {currentScreen === 'time-tracking' ? (
        <TimeTrackingScreen />
      ) : (
        <LeaveManagementScreen />
      )}
    </div>
  );
};

export default Index;
