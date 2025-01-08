'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Example check: Verify query parameter
    const searchParams = new URLSearchParams(window.location.search);
    const isAuthorized = searchParams.get('authorized') === 'true';

    if (!isAuthorized) {
      // Redirect to homepage if not authorized
      router.push('/');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="text-center p-8 bg-white shadow-md rounded-md">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-700">Thank you for your payment.</p>
      </div>
    </div>
  );
}
