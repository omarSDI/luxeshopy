'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { seedExampleProducts } from '../actions/products';

export default function AdminSeedButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const onSeed = () => {
    setMessage(null);
    startTransition(async () => {
      const res = await seedExampleProducts();
      if (res.success) {
        setMessage('Seeding successful!');
        router.refresh();
      } else {
        setMessage(`Error: ${res.error}`);
      }
    });
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onSeed}
        disabled={isPending}
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Seeding…' : 'Admin: Seed products'}
      </button>
      {message && <span className="text-sm text-gray-500">{message}</span>}
    </div>
  );
}

