

"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function TourDashboardPage() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Tour Industry Dashboard</CardTitle>
          <CardDescription>Placeholder screen for tour-specific widgets</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-2">Welcome {user?.firstName || "User"}</p>
          <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
            <li>KPI cards: Upcoming tours, Booked seats, Revenue MTD</li>
            <li>Calendar: tour schedule and capacity</li>
            <li>Packages: active tour packages quick view</li>
            <li>Alerts: low-capacity tours, pending vendor invoices</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}


