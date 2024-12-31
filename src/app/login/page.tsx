"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedPassword = localStorage.getItem('appPassword');
    if (savedPassword === process.env.NEXT_PUBLIC_APP_PASSWORD) {
      router.push('/');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_APP_PASSWORD) {
      localStorage.setItem('appPassword', password);
      router.push('/');
    } else {
      alert('Incorrect password');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen text-foreground">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-md p-8">
        <h1 className="text-2xl font-semibold text-foreground mb-4 text-center">Welcome to Dayflow</h1>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 border rounded bg-background text-foreground border-foreground/20 focus:border-foreground/40 outline-none"
        />
        <button 
          type="submit" 
          className="p-3 bg-foreground text-background rounded hover:bg-foreground/90 transition-colors font-medium"
        >
          Login
        </button>
      </form>
    </div>
  );
} 