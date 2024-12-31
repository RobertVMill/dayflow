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
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Login
        </button>
      </form>
    </div>
  );
} 