"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@mui/material';
import { AuthLayout } from './components/AuthLayout';
import { AuthCard } from './components/AuthCard';
import { FormField } from './components/FormField';
import { StatusMessage } from './components/StatusMessage';
import { useAuth } from './hooks/useAuth';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loading, error, signIn } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(email, password);
  };

  return (
    <AuthLayout>
      <AuthCard title="Welcome back">
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
          <StatusMessage message={error} />
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#9C55FF] to-[#B78FFF]"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Log in'}
          </Button>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-[#9C55FF] hover:underline">
              Sign up
            </Link>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}