"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function TravelDashboardPage() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Travel Industry Dashboard</CardTitle>
          <CardDescription>Placeholder screen for travel-specific widgets</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-2">Welcome {user?.firstName || "User"}</p>
          <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
            <li>KPI cards: Itineraries in progress, Confirmed trips, Conversion rate</li>
            <li>Widgets: itinerary builder shortcut, supplier search</li>
            <li>Feed: booking confirmations, changes, cancellations</li>
            <li>Integrations: flight/hotel search status</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}


