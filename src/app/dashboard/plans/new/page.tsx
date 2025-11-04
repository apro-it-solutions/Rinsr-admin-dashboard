'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription
} from '@/components/ui/alert-dialog';
import Link from 'next/link';

const planSchema = z.object({
  name: z.string().min(1, 'Plan name is required'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be greater than 0'),
  currency: z.string().default('INR'),
  validity_days: z.coerce.number().min(1, 'Duration required'),
  weight_limit_kg: z.coerce.number().min(1, 'Weight limit required'),
  pickups_per_month: z.coerce.number().min(1, 'Pickups required'),
  features: z.array(z.string()).optional(),
  services: z.array(
    z.object({
      serviceId: z.string(),
      name: z.string()
    })
  ),
  extra_kg_rate: z.coerce.number().min(0, 'Extra rate required'),
  rollover_limit_months: z.coerce.number().min(0),
  is_active: z.boolean().default(true)
});

type PlanFormData = z.infer<typeof planSchema>;

export default function CreatePlanPage() {
  const router = useRouter();
  const [services, setServices] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    success: boolean;
  } | null>(null);

  const form = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      currency: 'INR',
      validity_days: 30,
      weight_limit_kg: 10,
      pickups_per_month: 8,
      features: [],
      services: [],
      extra_kg_rate: 50,
      rollover_limit_months: 1,
      is_active: true
    }
  });

  // 🧠 Fetch available services
  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (data.success && Array.isArray(data.services)) {
          setServices(data.services);
        } else {
          console.error('Invalid services response');
        }
      } catch (err) {
        console.error('Failed to fetch services:', err);
      }
    }
    fetchServices();
  }, []);

  // 🧾 Handle Submit
  async function onSubmit(values: PlanFormData) {
    setLoading(true);
    setAlert(null);

    try {
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      const data = await response.json();

      if (data.success) {
        setAlert({ message: 'Plan created successfully!', success: true });
        setTimeout(() => router.push('/dashboard/plans'), 1500);
      } else {
        setAlert({
          message: data.message || 'Failed to create plan.',
          success: false
        });
      }
    } catch (err) {
      console.error(err);
      setAlert({
        message: 'Something went wrong while saving.',
        success: false
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className='mx-auto mt-6 max-w-3xl'>
      <CardHeader>
        <CardTitle>Create New Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <Form
          form={form}
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'
        >
          {/* Plan Name */}
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plan Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter plan name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder='Enter plan description' {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Price and Currency */}
          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder='1999' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='currency'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select currency' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='INR'>INR</SelectItem>
                        <SelectItem value='USD'>USD</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Duration, Weight Limit, Pickups */}
          <div className='grid grid-cols-3 gap-4'>
            <FormField
              control={form.control}
              name='validity_days'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Validity (Days)</FormLabel>
                  <FormControl>
                    <Input type='number' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='weight_limit_kg'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight Limit (kg)</FormLabel>
                  <FormControl>
                    <Input type='number' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='pickups_per_month'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pickups per Month</FormLabel>
                  <FormControl>
                    <Input type='number' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Services (Multi-select with checkboxes) */}
          <div className='space-y-2'>
            <Label>Services Included</Label>
            <div className='grid grid-cols-2 gap-3'>
              {services.map((svc) => {
                const isChecked = form
                  .watch('services')
                  .some((s) => s.serviceId === svc._id);
                return (
                  <div
                    key={svc._id}
                    className='flex items-center space-x-2 rounded-md border p-2'
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        const current = form.getValues('services');
                        if (checked) {
                          form.setValue('services', [
                            ...current,
                            { serviceId: svc._id, name: svc.name }
                          ]);
                        } else {
                          form.setValue(
                            'services',
                            current.filter((s) => s.serviceId !== svc._id)
                          );
                        }
                      }}
                    />
                    <span>{svc.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Extra KG Rate */}
          <FormField
            control={form.control}
            name='extra_kg_rate'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Extra KG Rate (₹)</FormLabel>
                <FormControl>
                  <Input type='number' {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Rollover and Active */}
          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='rollover_limit_months'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rollover Limit (Months)</FormLabel>
                  <FormControl>
                    <Input type='number' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='is_active'
              render={({ field }) => (
                <FormItem className='flex items-center justify-between rounded-md border p-3'>
                  <FormLabel>Active</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className='flex justify-end gap-3'>
            <Button type='submit' disabled={loading}>
              {loading ? 'Saving...' : 'Create Plan'}
            </Button>
            <Link href='/dashboard/plans'>
              <Button variant='outline'>Cancel</Button>
            </Link>
          </div>
        </Form>
      </CardContent>

      {/* ✅ Alert */}
      <AlertDialog open={!!alert} onOpenChange={() => setAlert(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>
            {alert?.success ? '✅ Success' : '❌ Error'}
          </AlertDialogTitle>
          <AlertDialogDescription className='pb-4'>
            {alert?.message}
          </AlertDialogDescription>

          {/* Footer Section with Button */}
          <div className='flex justify-end'>
            <Button variant='outline' onClick={() => setAlert(null)}>
              Close
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
