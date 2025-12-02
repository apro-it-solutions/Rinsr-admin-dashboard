'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import PageContainer from '@/components/layout/page-container';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

interface DeliveryPartner {
  _id: string;
  company_name: string;
  location: string;
  phone_number: string;
  is_active: boolean;
}

export default function EditDeliveryPartnerPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [partner, setPartner] = useState<DeliveryPartner | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔹 Fetch partner details
  useEffect(() => {
    async function fetchPartner() {
      setLoading(true);
      try {
        const res = await fetch(`/api/delivery-partners/${id}`, {
          cache: 'no-store'
        });
        const data = await res.json();
        if (data.success) setPartner(data.data);
        else toast.error(data.message || 'Failed to fetch delivery partner');
      } catch (err) {
        toast.error('Error loading delivery partner');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchPartner();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!partner) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/delivery-partners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: partner.company_name,
          location: partner.location,
          phone_number: partner.phone_number,
          is_active: partner.is_active
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Delivery partner updated successfully');
        router.push('/dashboard/delivery-partners');
      } else {
        toast.error(data.message || 'Failed to update delivery partner');
      }
    } catch (err) {
      toast.error('Error updating delivery partner');
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <PageContainer>
        <div className='flex h-[60vh] items-center justify-center'>
          <Loader2 className='text-muted-foreground h-6 w-6 animate-spin' />
        </div>
      </PageContainer>
    );

  if (!partner)
    return (
      <PageContainer>
        <div className='text-muted-foreground mt-20 text-center'>
          Delivery partner not found.
        </div>
      </PageContainer>
    );

  return (
    <PageContainer>
      <div className='bg-card flex max-w-3xl flex-1 flex-col space-y-6 p-6'>
        <h1 className='text-foreground text-2xl font-bold'>Edit Hub</h1>
        <form onSubmit={handleSubmit} className='space-y-5'>
          <Card className='w-full max-w-md'>
            <CardHeader>
              <CardTitle>Edit Delivery Partner</CardTitle>
              <CardDescription>
                Update the delivery partner details below.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <Label htmlFor='company_name'>Company Name</Label>
                <Input
                  id='company_name'
                  value={partner.company_name}
                  onChange={(e) =>
                    setPartner({ ...partner, company_name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor='location'>Location</Label>
                <Input
                  id='location'
                  value={partner.location}
                  onChange={(e) =>
                    setPartner({ ...partner, location: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor='phone_number'>Phone Number</Label>
                <Input
                  id='phone_number'
                  value={partner.phone_number}
                  onChange={(e) =>
                    setPartner({ ...partner, phone_number: e.target.value })
                  }
                  required
                />
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='is_active'
                  checked={partner.is_active}
                  onCheckedChange={(checked) =>
                    setPartner({ ...partner, is_active: checked as boolean })
                  }
                />
                <Label htmlFor='is_active'>Active</Label>
              </div>
            </CardContent>
            <CardFooter className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.push('/dashboard/delivery-partners')}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={saving}>
                {saving && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
}
