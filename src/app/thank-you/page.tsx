'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function ThankYouPage() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries())
    
    fetch('/api/handle-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error))
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Thank You!</h1>
      </div>
    </div>
  )
}

