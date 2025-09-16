'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, PaymentMethod } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function PaymentsPage() {
  const { initialized, user } = useAuth();
  const router = useRouter();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (!initialized) return;
    if (!user) {
      router.push('/login');
      return;
    }
    const load = async () => {
      setLoading(true);
      try {
        const resp = await apiService.getPaymentOptions();
        if (resp.success && resp.data?.methods) {
          setMethods(resp.data.methods);
          if (resp.data.methods[0]) setSelected(resp.data.methods[0].id);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [initialized, user, router]);

  const createIntent = async () => {
    setMessage('');
    if (!selected || !amount) {
      setMessage('Please select a method and enter amount');
      return;
    }
    try {
      const resp = await apiService.createPaymentIntent({ amount: Number(amount), methodId: selected });
      if (resp.success) {
        setMessage('Payment intent created');
      } else {
        setMessage(resp.message || 'Failed to create payment');
      }
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : 'Failed to create payment');
    }
  };

  return (
    <div className="p-6">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Payments</CardTitle>
          <CardDescription>Industry-aware payment options</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-gray-600">Loading...</div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="method">Payment Method</Label>
                <select
                  id="method"
                  className="border rounded-md p-2 text-sm"
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                >
                  {methods.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <input
                  id="amount"
                  type="number"
                  className="border rounded-md p-2 text-sm"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={createIntent}>Create Payment</Button>
              </div>

              {message && (
                <div className="text-sm text-gray-700">{message}</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


