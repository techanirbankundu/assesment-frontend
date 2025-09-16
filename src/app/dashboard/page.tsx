'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, DashboardData } from '@/lib/api';
import { 
  BarChart3, 
  Users, 
  Package, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  LogOut,
  Settings,
  User,
  Building2,
  Loader2
} from 'lucide-react';

export default function DashboardPage() {
  const { user, logout, industryType, initialized } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialized) return;
    if (!user) {
      router.push('/login');
      return;
    }
    loadDashboardData();
  }, [user, router, initialized]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDashboard();
      
      if (response.success && response.data) {
        setDashboardData(response.data);
      } else {
        throw new Error(response.message || 'Failed to load dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  // const handleLogout = async () => {
  //   try {
  //     await logout();
  //     router.push('/login');
  //   } catch (error) {
  //     console.error('Logout error:', error);
  //   }
  // };

  // const getIndustryIcon = (industry: string) => {
  //   switch (industry) {
  //     case 'tour':
  //       return <MapPin className="h-6 w-6" />;
  //     case 'travel':
  //       return <Calendar className="h-6 w-6" />;
  //     case 'logistics':
  //       return <Package className="h-6 w-6" />;
  //     default:
  //       return <Building2 className="h-6 w-6" />;
  //   }
  // };

  // const getIndustryTitle = (industry: string) => {
  //   switch (industry) {
  //     case 'tour':
  //       return 'Tour & Travel Dashboard';
  //     case 'travel':
  //       return 'Travel Services Dashboard';
  //     case 'logistics':
  //       return 'Logistics & Shipping Dashboard';
  //     default:
  //       return 'Business Dashboard';
  //   }
  // };

  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadDashboardData} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

     


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        

        {/* Metrics Grid */}
        {dashboardData?.dashboard?.metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Object.entries(dashboardData.dashboard.metrics as Record<string, any>).map(([key, value]) => (
              <Card key={key}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{String(value)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest {industryType === 'logistics' ? 'shipments' : industryType === 'tour' ? 'bookings' : 'activities'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.dashboard?.recentBookings?.length > 0 ? (
                  dashboardData.dashboard.recentBookings.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.title || `Item ${index + 1}`}</p>
                        <p className="text-sm text-gray-500">{item.date || 'Today'}</p>
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        {item.status || 'Active'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Industry Specific Content */}
          <Card>
            <CardHeader>
              <CardTitle>
                {industryType === 'tour' && 'Upcoming Tours'}
                {industryType === 'travel' && 'Upcoming Travels'}
                {industryType === 'logistics' && 'Active Shipments'}
                {!['tour', 'travel', 'logistics'].includes(industryType || '') && 'Recent Orders'}
              </CardTitle>
              <CardDescription>
                {industryType === 'tour' && 'Your scheduled tour activities'}
                {industryType === 'travel' && 'Your upcoming travel bookings'}
                {industryType === 'logistics' && 'Currently active shipments'}
                {!['tour', 'travel', 'logistics'].includes(industryType || '') && 'Your recent business activities'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.dashboard?.upcomingTours?.length > 0 || 
                 dashboardData?.dashboard?.upcomingTravels?.length > 0 || 
                 dashboardData?.dashboard?.activeShipments?.length > 0 ? (
                  (dashboardData.dashboard.upcomingTours || 
                   dashboardData.dashboard.upcomingTravels || 
                   dashboardData.dashboard.activeShipments || []).map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.title || `Item ${index + 1}`}</p>
                        <p className="text-sm text-gray-500">{item.date || 'Today'}</p>
                      </div>
                      <span className="text-sm font-medium text-blue-600">
                        {item.status || 'Scheduled'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No upcoming activities</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Profile Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Personal Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Name:</span> {user?.firstName} {user?.lastName}</p>
                  <p><span className="text-gray-500">Email:</span> {user?.email}</p>
                  {user?.phone && <p><span className="text-gray-500">Phone:</span> {user.phone}</p>}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Business Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Industry:</span> {industryType?.charAt(0).toUpperCase()}{industryType?.slice(1)}</p>
                  <p><span className="text-gray-500">Member since:</span> {new Date(user?.createdAt || '').toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
