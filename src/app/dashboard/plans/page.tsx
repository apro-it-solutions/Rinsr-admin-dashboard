'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { Pencil, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IconPlus } from '@tabler/icons-react';

interface PlanService {
  serviceId: string;
  name: string;
  _id: string;
}

interface Plan {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  validity_days: number;
  weight_limit_kg: number;
  pickups_per_month: number;
  features: string[];
  services: PlanService[];
  extra_kg_rate: number;
  rollover_limit_months: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchPlans() {
      setLoading(true);
      try {
        const response = await fetch('/api/plans', { cache: 'no-store' });
        const data = await response.json();

        if (data.success && Array.isArray(data.plans)) {
          setPlans(data.plans);
        } else {
          setPlans([]);
        }
      } catch {
        setPlans([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPlans();
  }, []);

  const filteredPlans = useMemo(() => {
    if (!search.trim()) return plans;
    return plans.filter(
      (plan) =>
        plan.name?.toLowerCase().includes(search.toLowerCase()) ||
        plan.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [plans, search]);

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4 p-6'>
        {/* Header */}
        <div className='flex w-full items-center justify-between gap-2'>
          <h1 className='text-2xl font-bold'>Plans</h1>
          <div className='flex items-center gap-2'>
            <Input
              placeholder='Search plans...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='max-w-xs'
            />
            <Link
              href='/dashboard/plans/new'
              className={cn(buttonVariants(), 'text-xs md:text-sm')}
            >
              <IconPlus className='mr-2 h-4 w-4' /> Add New
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className='overflow-x-auto rounded-lg border bg-white shadow-sm'>
          <Table className='w-full border-collapse'>
            <TableHeader className='bg-muted sticky top-0 z-10'>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration (Days)</TableHead>
                <TableHead>Weight Limit (kg)</TableHead>
                <TableHead>Pickups / Month</TableHead>
                <TableHead className='pr-6 text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className='h-5 w-full' />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredPlans.length > 0 ? (
                filteredPlans.map((plan, idx) => (
                  <TableRow
                    key={plan._id}
                    className={idx % 2 ? 'bg-gray-50' : ''}
                  >
                    <TableCell className='font-medium'>{plan.name}</TableCell>
                    <TableCell>{plan.description || '—'}</TableCell>
                    <TableCell>₹{plan.price}</TableCell>
                    <TableCell>{plan.validity_days ?? '—'}</TableCell>
                    <TableCell>{plan.weight_limit_kg ?? '—'}</TableCell>
                    <TableCell>{plan.pickups_per_month ?? '—'}</TableCell>
                    <TableCell className='pr-6 text-right'>
                      <Link href={`/dashboard/plans/${plan._id}/edit`}>
                        <Button variant='outline' size='sm'>
                          <Pencil className='mr-2 h-4 w-4' />
                          Edit
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className='text-muted-foreground py-10 text-center text-sm'
                  >
                    No plans found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageContainer>
  );
}
