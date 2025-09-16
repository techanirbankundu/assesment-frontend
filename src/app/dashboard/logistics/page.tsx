"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function LogisticsDashboardPage() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Logistics Industry Dashboard</CardTitle>
          <CardDescription>Placeholder screen for logistics-specific widgets</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-2">Welcome {user?.firstName || "User"}</p>
          <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
            <li>KPI cards: Active shipments, On-time %, Exceptions</li>
            <li>Map: fleet locations and routes</li>
            <li>Table: warehouse inventory snapshots</li>
            <li>Alerts: SLA breaches, delayed pickups</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}


