'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';

const INDUSTRY_OPTIONS = [
  { value: 'tour', label: 'Tour' },
  { value: 'travel', label: 'Travel' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'other', label: 'Others' },
];

export default function ProfilePage() {
  const { user, industryType, reloadUser, initialized } = useAuth();
  const router = useRouter();
  const [selectedIndustry, setSelectedIndustry] = useState<string>(industryType || 'other');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pwdMsg, setPwdMsg] = useState<string>('');
  const [pwdError, setPwdError] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurrent, setShowCurrent] = useState<boolean>(false);
  const [showNew, setShowNew] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  useEffect(() => {
    if (initialized && !user) {
      router.replace('/login');
    }
  }, [initialized, user, router]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-600">Loading...</div>
    );
  }

  if (!user) return null;

  const onSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const resp = await apiService.updateIndustryProfile({ industryType: selectedIndustry });
      if (!resp.success) throw new Error(resp.message || 'Failed to update');
      await reloadUser();
      router.push(`/dashboard/${selectedIndustry === 'other' ? 'others' : selectedIndustry}`);
    } catch (e: any) {
      setError(e.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async () => {
    setPwdMsg('');
    setPwdError('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwdError('All password fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('New password and confirm password do not match');
      return;
    }
    try {
      const resp = await apiService.changePassword(currentPassword, newPassword);
      if (resp.success) {
        setPwdMsg('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPwdError(resp.message || 'Failed to change password');
      }
    } catch (e: any) {
      setPwdError(e.message || 'Failed to change password');
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
                {INDUSTRY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}

            <div className="flex gap-3">
              <Button onClick={onSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={() => router.back()} disabled={saving}>
                Cancel
              </Button>
            </div>

            <div className="h-px bg-gray-200" />

            <div className="space-y-3">
              <h3 className="text-base font-medium">Change Password</h3>
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input id="currentPassword" type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                  <button type="button" className="absolute inset-y-0 right-2 flex items-center text-gray-500" onClick={() => setShowCurrent(v => !v)} aria-label={showCurrent ? 'Hide password' : 'Show password'}>
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input id="newPassword" type={showNew ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  <button type="button" className="absolute inset-y-0 right-2 flex items-center text-gray-500" onClick={() => setShowNew(v => !v)} aria-label={showNew ? 'Hide password' : 'Show password'}>
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input id="confirmPassword" type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  <button type="button" className="absolute inset-y-0 right-2 flex items-center text-gray-500" onClick={() => setShowConfirm(v => !v)} aria-label={showConfirm ? 'Hide password' : 'Show password'}>
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {pwdError && <div className="text-sm text-red-600">{pwdError}</div>}
              {pwdMsg && <div className="text-sm text-green-600">{pwdMsg}</div>}
              <div>
                <Button variant="secondary" onClick={onChangePassword}>Update Password</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


