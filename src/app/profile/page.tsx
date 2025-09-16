'use client';
import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';
import { Users } from 'lucide-react';

const INDUSTRY_OPTIONS = [
  { value: 'tour', label: 'Tour' },
  { value: 'travel', label: 'Travel' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'other', label: 'Others' },
];

export default function ProfilePage() {
  const { user, industryType, reloadUser, initialized } = useAuth();
  const router = useRouter();
  const [selectedIndustry, setSelectedIndustry] = useState<string>('other');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  // Sync default once auth is hydrated
  useEffect(() => {
      if (!initialized) return;
      setSelectedIndustry(industryType || 'other');
      console.log("Industry Types "+industryType + user);
  }, [initialized, industryType]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-600">Loading...</div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const onSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const resp = await apiService.updateIndustryProfile({ industryType: selectedIndustry });
      if (!resp.success) throw new Error(resp.message || 'Failed to update');
      await reloadUser();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your business industry</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="industry">Industry Type</Label>
              <select
                id="industry"
                className="border rounded-md p-2 text-sm"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
              >
                {INDUSTRY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="flex gap-3">
              <Button onClick={onSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={() => router.back()} disabled={saving}>
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


