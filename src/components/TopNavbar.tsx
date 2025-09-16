'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Settings, LogOut, MapPin, Calendar, Package, Building2 } from 'lucide-react';
import { SidebarTrigger } from './ui/sidebar';

function getIndustryIcon(industry: string) {
  switch (industry) {
    case 'tour':
      return <MapPin className="h-6 w-6" />;
    case 'travel':
      return <Calendar className="h-6 w-6" />;
    case 'logistics':
      return <Package className="h-6 w-6" />;
    default:
      return <Building2 className="h-6 w-6" />;
  }
}

function getIndustryTitle(industry: string) {
  switch (industry) {
    case 'tour':
      return 'Tour & Travel Dashboard';
    case 'travel':
      return 'Travel Services Dashboard';
    case 'logistics':
      return 'Logistics & Shipping Dashboard';
    default:
      return 'Business Dashboard';
  }
}

export default function TopNavbar() {
  const router = useRouter();
  const { user, industryType, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-3">
                        <SidebarTrigger/>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">{getIndustryTitle(industryType || 'other')}</h1>
                            <p className="text-sm text-gray-500">Welcome back, {user?.firstName} {user?.lastName}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
    </header>
  );
}