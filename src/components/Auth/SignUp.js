"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@mui/material';
import { AuthLayout } from './components/AuthLayout';
import { AuthCard } from './components/AuthCard';
import { FormField } from './components/FormField';
import { StatusMessage } from './components/StatusMessage';
import { useAuth } from './hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';

export function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loading, error, signUp } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    signUp(email, password);
  };

  return (
    <AuthLayout>
      <AuthCard title="Create an account">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <StatusMessage 
            message={error} 
            isSuccess={error?.includes('Check your email')}
          />
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#9C55FF] to-[#B78FFF]"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-[#9C55FF] hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}