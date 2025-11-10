'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Pencil, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, UserCheck, UserX, Crown } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  is_active?: boolean;
  createdAt?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [report, setReport] = useState<any>(null);
  const [reportLoading, setReportLoading] = useState(true);

  const [pageIndex, setPageIndex] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // 🔹 Fetch customers report
  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch('/api/customers');
        const data = await res.json();
        if (data.success) setReport(data.data?.summary || data.summary);
      } catch (err) {
        console.error('Error fetching customer report:', err);
      } finally {
        setReportLoading(false);
      }
    }
    fetchReport();
  }, []);

  // 🔹 Fetch all users
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const res = await fetch('/api/users', { cache: 'no-store' });
        const data = await res.json();
        setUsers(data.success && Array.isArray(data.users) ? data.users : []);
      } catch (err) {
        console.error('Error fetching users:', err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  // 🔍 Filter + Pagination
  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone?.includes(search)
    );
  }, [users, search]);

  const total = filteredUsers.length;
  const start = (pageIndex - 1) * perPage;
  const end = start + perPage;
  const displayedUsers = filteredUsers.slice(start, end);
  const pageCount = Math.max(1, Math.ceil(total / perPage));

  return (
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-6 p-6'>
        {/* ✅ Customer Stats Section */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader>
              <CardDescription>Total Customers</CardDescription>
              <CardTitle className='text-2xl font-semibold'>
                {reportLoading ? '...' : report?.totalCustomers || 0}
              </CardTitle>
              <Badge variant='outline'>
                <Users className='mr-1 h-4 w-4' /> All
              </Badge>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Verified Customers</CardDescription>
              <CardTitle className='text-2xl font-semibold'>
                {reportLoading ? '...' : report?.verifiedCustomers || 0}
              </CardTitle>
              <Badge variant='outline'>
                <UserCheck className='mr-1 h-4 w-4' /> Verified
              </Badge>
            </CardHeader>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardDescription>Active Customers</CardDescription>
              <CardTitle className='text-2xl font-semibold'>
                {reportLoading ? '...' : report?.activeCustomers || 0}
              </CardTitle>
              <Badge variant='outline'><TrendingUp className='w-4 h-4 mr-1' /> Active</Badge>
            </CardHeader>
          </Card> */}

          <Card>
            <CardHeader>
              <CardDescription>Subscribed Customers</CardDescription>
              <CardTitle className='text-2xl font-semibold'>
                {reportLoading ? '...' : report?.subscribedCustomers || 0}
              </CardTitle>
              <Badge variant='outline'>
                <Crown className='mr-1 h-4 w-4' /> Premium
              </Badge>
            </CardHeader>
          </Card>
        </div>

        {/* 🔍 Search + Table */}
        <div className='mt-4 flex w-full items-center justify-between gap-2'>
          <h1 className='text-foreground text-2xl font-bold'>Customers</h1>
          <Input
            placeholder='Search users...'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPageIndex(1);
            }}
            className='bg-card text-foreground border-input focus:ring-ring max-w-xs'
          />
        </div>

        {/* 📋 Table */}
        <div className='border-border bg-card text-foreground overflow-x-auto rounded-lg border shadow-sm transition-colors'>
          <Table className='w-full border-collapse'>
            <TableHeader className='bg-muted/70 sticky top-0 z-10'>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className='pr-6 text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: perPage }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className='bg-muted/50 h-5 w-full' />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : displayedUsers.length > 0 ? (
                displayedUsers.map((user, idx) => (
                  <TableRow
                    key={user._id}
                    className={cn(
                      'hover:bg-accent transition-colors',
                      idx % 2 === 0 ? 'bg-background' : 'bg-muted/30'
                    )}
                  >
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || '—'}</TableCell>
                    <TableCell>{user.role || 'User'}</TableCell>
                    <TableCell className='pr-6 text-right'>
                      <Link href={`/dashboard/users/${user._id}/edit`}>
                        <Button variant='outline' size='sm'>
                          <Pencil className='mr-2 h-4 w-4' /> Edit
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className='text-muted-foreground py-10 text-center'
                  >
                    No users found.
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
