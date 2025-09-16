"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function OthersDashboardPage() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card>
        <CardHeader>
          <CardTitle>General Business Dashboard</CardTitle>
          <CardDescription>Fallback dashboard for unclassified industries</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-2">Welcome {user?.firstName || "User"}</p>
          <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
            <li>Profile completion checklist</li>
            <li>Quick links to settings and billing</li>
            <li>Getting started guides</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}


