import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { timeTrackingAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  Play, 
  Square, 
  LogOut, 
  RefreshCw, 
  User,
  Calendar,
  Timer,
  CheckCircle
} from 'lucide-react';

interface TimeEntry {
  id: string;
  profile_id: string;
  so_id: string;
  clock_in_time: string;
  clock_out_time?: string;
  total_hours?: number;
  status: 'active' | 'completed';
}

interface Profile {
  id: string;
  name: string;
}

interface SalesOrder {
  id: string;
  name: string;
  number: string;
}

export const TimeTrackingScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [selectedSalesOrder, setSelectedSalesOrder] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const fetchData = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    setIsLoading(true);
    
    try {
      const [entriesData, profilesData, salesOrdersData] = await Promise.all([
        timeTrackingAPI.getTimeEntries(today),
        timeTrackingAPI.getProfiles(),
        timeTrackingAPI.getSalesOrders(),
      ]);
      
      setTimeEntries(entriesData || []);
      setProfiles(profilesData || []);
      setSalesOrders(salesOrdersData || []);
    } catch (error: any) {
      toast({
        title: "Failed to load data",
        description: error.response?.data?.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClockIn = async () => {
    if (!selectedProfile || !selectedSalesOrder) {
      toast({
        title: "Selection Required",
        description: "Please select both a profile and sales order",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await timeTrackingAPI.clockIn(selectedProfile, selectedSalesOrder);
      toast({
        title: "Clocked In!",
        description: "Successfully started time tracking",
      });
      await fetchData();
      setSelectedProfile('');
      setSelectedSalesOrder('');
    } catch (error: any) {
      toast({
        title: "Clock In Failed",
        description: error.response?.data?.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockOut = async (entryId: string) => {
    setIsLoading(true);
    try {
      await timeTrackingAPI.clockOut(entryId);
      toast({
        title: "Clocked Out!",
        description: "Time entry completed successfully",
      });
      await fetchData();
    } catch (error: any) {
      toast({
        title: "Clock Out Failed",
        description: error.response?.data?.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getProfileName = (profileId: string) => {
    return profiles.find(p => p.id === profileId)?.name || 'Unknown Profile';
  };

  const getSalesOrderName = (soId: string) => {
    const so = salesOrders.find(s => s.id === soId);
    return so ? `${so.number} - ${so.name}` : 'Unknown Order';
  };

  const activeEntries = timeEntries.filter(entry => entry.status === 'active');
  const completedEntries = timeEntries.filter(entry => entry.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground p-4 shadow-mobile">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Welcome back!</h1>
              <p className="text-sm opacity-90">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-primary-foreground hover:bg-white/20"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 text-sm opacity-90">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Clock In Section */}
        <Card className="shadow-card border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center">
                  <Play className="h-5 w-5 mr-2 text-primary" />
                  Clock In
                </CardTitle>
                <CardDescription>Start tracking your time</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchData(true)}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Select Profile
                </label>
                <Select value={selectedProfile} onValueChange={setSelectedProfile}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Choose a profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Select Sales Order
                </label>
                <Select value={selectedSalesOrder} onValueChange={setSelectedSalesOrder}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Choose a sales order" />
                  </SelectTrigger>
                  <SelectContent>
                    {salesOrders.map((so) => (
                      <SelectItem key={so.id} value={so.id}>
                        {so.number} - {so.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button
              onClick={handleClockIn}
              disabled={isLoading || !selectedProfile || !selectedSalesOrder}
              variant="success"
              size="mobile"
              className="w-full"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Clocking In...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Clock In
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Active Time Entries */}
        {activeEntries.length > 0 && (
          <Card className="shadow-card border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Timer className="h-5 w-5 mr-2 text-warning" />
                Active Sessions
              </CardTitle>
              <CardDescription>Currently tracking time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeEntries.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-4 bg-warning/5 border-warning/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-warning rounded-full animate-pulse" />
                      <Badge variant="outline" className="border-warning text-warning">
                        ACTIVE
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Started: {formatTime(entry.clock_in_time)}
                    </span>
                  </div>
                  
                  <div className="space-y-1 mb-4">
                    <p className="font-medium">{getProfileName(entry.profile_id)}</p>
                    <p className="text-sm text-muted-foreground">
                      {getSalesOrderName(entry.so_id)}
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => handleClockOut(entry.id)}
                    disabled={isLoading}
                    variant="destructive"
                    size="mobile"
                    className="w-full"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Clock Out
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Today's Completed Entries */}
        {completedEntries.length > 0 && (
          <Card className="shadow-card border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-success" />
                Today's Completed
              </CardTitle>
              <CardDescription>Finished time entries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {completedEntries.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-4 bg-success/5 border-success/20">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="border-success text-success">
                      COMPLETED
                    </Badge>
                    <span className="text-sm font-medium">
                      {entry.total_hours?.toFixed(2) || '0.00'} hours
                    </span>
                  </div>
                  
                  <div className="space-y-1 mb-3">
                    <p className="font-medium">{getProfileName(entry.profile_id)}</p>
                    <p className="text-sm text-muted-foreground">
                      {getSalesOrderName(entry.so_id)}
                    </p>
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>In: {formatTime(entry.clock_in_time)}</span>
                    {entry.clock_out_time && (
                      <span>Out: {formatTime(entry.clock_out_time)}</span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {timeEntries.length === 0 && !isLoading && (
          <Card className="shadow-card border-0 text-center py-8">
            <CardContent>
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No time entries today</h3>
              <p className="text-muted-foreground mb-4">
                Clock in to start tracking your work time
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};