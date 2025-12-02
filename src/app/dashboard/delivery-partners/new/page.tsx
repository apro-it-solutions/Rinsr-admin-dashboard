'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function NewDeliveryPartnerPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    location: '',
    phone_number: '',
    is_active: true
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/delivery-partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Delivery partner created successfully');
        router.push('/dashboard/delivery-partners');
      } else {
        toast.error(data.message || 'Failed to create delivery partner');
      }
    } catch (err) {
      toast.error('Error creating delivery partner');
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageContainer>
      <div className='bg-card flex max-w-3xl flex-1 flex-col space-y-6 p-6'>
        <h1 className='text-foreground text-2xl font-bold'>Edit Hub</h1>
        <form onSubmit={handleSubmit} className='space-y-'>
          <Card className='w-full max-w-md'>
            <CardHeader>
              <CardTitle>Add Delivery Partner</CardTitle>
              <CardDescription>
                Enter the details of the new delivery partner.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <Label htmlFor='company_name'>Company Name</Label>
                <Input
                  id='company_name'
                  value={formData.company_name}
                  onChange={(e) =>
                    setFormData({ ...formData, company_name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor='location'>Location</Label>
                <Input
                  id='location'
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor='phone_number'>Phone Number</Label>
                <Input
                  id='phone_number'
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_number: e.target.value })
                  }
                  required
                />
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='is_active'
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked as boolean })
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
                Create Partner
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
}
