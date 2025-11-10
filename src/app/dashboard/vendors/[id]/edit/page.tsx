'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function EditVendorPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    company_name: '',
    location: '',
    phone_number: '',
    services: ['']
  });

  // Fetch vendor details
  useEffect(() => {
    async function fetchVendor() {
      setLoading(true);
      try {
        const res = await fetch(`/api/vendors/${id}`);
        const data = await res.json();

        if (data?.vendor) {
          setFormData({
            company_name: data.vendor.company_name || '',
            location: data.vendor.location || '',
            phone_number: data.vendor.phone_number || '',
            services: data.vendor.services?.length ? data.vendor.services : ['']
          });
        } else {
          toast.error('Vendor not found');
        }
      } catch {
        toast.error('Failed to load vendor data');
      } finally {
        setLoading(false);
      }
    }

    fetchVendor();
  }, [id]);

  // Submit handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/vendors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Vendor updated successfully');
        router.push('/dashboard/vendors');
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  // Handle dynamic services
  const handleServiceChange = (index: number, value: string) => {
    const newServices = [...formData.services];
    newServices[index] = value;
    setFormData({ ...formData, services: newServices });
  };

  const addServiceField = () =>
    setFormData({ ...formData, services: [...formData.services, ''] });

  // --- UI ---

  if (loading) {
    return (
      <div className='mx-auto max-w-2xl space-y-6 p-6'>
        <Skeleton className='h-8 w-40' />
        <Card>
          <CardContent className='space-y-4 p-6'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-1/2' />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='bg-card flex max-w-3xl flex-1 flex-col space-y-6 rounded-lg p-6 shadow'>
      <h1 className='text-foreground text-2xl font-bold'>Edit Vendor</h1>

      <Card>
        <CardHeader>
          <CardTitle className='text-lg font-semibold'>
            Vendor Details
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* Company Name */}
            <div className='space-y-2'>
              <Label htmlFor='company_name'>Company Name</Label>
              <Input
                id='company_name'
                value={formData.company_name}
                onChange={(e) =>
                  setFormData({ ...formData, company_name: e.target.value })
                }
                placeholder='Enter company name'
                required
              />
            </div>

            {/* Location */}
            <div className='space-y-2'>
              <Label htmlFor='location'>Location</Label>
              <Input
                id='location'
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder='Enter vendor location'
                required
              />
            </div>

            {/* Phone Number */}
            <div className='space-y-2'>
              <Label htmlFor='phone_number'>Phone Number</Label>
              <Input
                id='phone_number'
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
                placeholder='+911234567890'
                required
              />
            </div>

            {/* Services */}
            <div className='space-y-2'>
              <Label>Services</Label>
              {formData.services.map((service, i) => (
                <Input
                  key={i}
                  value={service}
                  onChange={(e) => handleServiceChange(i, e.target.value)}
                  placeholder='e.g. Laundry, Ironing, Dry Clean'
                  className='mb-2'
                />
              ))}
              <Button
                type='button'
                variant='outline'
                onClick={addServiceField}
                size='sm'
              >
                + Add another service
              </Button>
            </div>

            {/* Submit Button */}
            <Button type='submit' className='w-half' disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
