"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/lib/api";
import {
  LayoutDashboard,
  User as UserIcon,
  Settings as SettingsIcon,
  Map as MapIcon,
  Calendar as CalendarIcon,
  Users as UsersIcon,
  BarChart3 as ChartIcon,
  Plane as PlaneIcon,
  Truck as TruckIcon,
  Package as PackageIcon,
  Route as RouteIcon,
  CreditCard,
} from "lucide-react";

type NavItem = { name: string; path: string; icon?: string };

export function AppSidebar() {
  const { initialized, user } = useAuth();
  const [navigation, setNavigation] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const resolvePath = (path: string) => {
    if (path.startsWith('/dashboard')) return path;
    if (path === '/dashboard') return path;
    // Prefix non-dashboard absolute paths (e.g., /tours) with /dashboard
    if (path.startsWith('/')) return `/dashboard${path}`;
    // Fallback: ensure we land under /dashboard
    return `/dashboard/${path}`;
  };

  const renderIcon = (icon?: string) => {
    switch ((icon || '').toLowerCase()) {
      case 'dashboard':
        return <LayoutDashboard className="h-4 w-4" />;
      case 'user':
        return <UserIcon className="h-4 w-4" />;
      case 'credit-card':
        return <CreditCard className="h-4 w-4" />;
      case 'settings':
        return <SettingsIcon className="h-4 w-4" />;
      case 'map':
        return <MapIcon className="h-4 w-4" />;
      case 'calendar':
        return <CalendarIcon className="h-4 w-4" />;
      case 'users':
        return <UsersIcon className="h-4 w-4" />;
      case 'chart':
        return <ChartIcon className="h-4 w-4" />;
      case 'plane':
        return <PlaneIcon className="h-4 w-4" />;
      case 'truck':
        return <TruckIcon className="h-4 w-4" />;
      case 'package':
        return <PackageIcon className="h-4 w-4" />;
      case 'route':
        return <RouteIcon className="h-4 w-4" />;
      default:
        return <LayoutDashboard className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    const loadNav = async () => {
      if (!initialized || !user) return;
      try {
        setLoading(true);
        const resp = await apiService.getNavigation();
        if (resp.success && resp.data?.navigation) {
          setNavigation(resp.data.navigation as NavItem[]);
        } else {
          setNavigation([]);
        }
      } finally {
        setLoading(false);
      }
    };
    loadNav();
  }, [initialized, user]);

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          {loading && (
            <div className="px-3 py-2 text-xs text-gray-500">Loading...</div>
          )}
          {!loading && navigation.map((item) => (
            <Link
              key={item.path}
              href={resolvePath(item.path)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              {renderIcon(item.icon)}
              <span>{item.name}</span>
            </Link>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}