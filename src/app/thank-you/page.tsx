'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

function ThankYouContent() {
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-md w-full mx-4 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Thank You!</h1>
            <p className="text-gray-600">Your Google account has been successfully connected to REX.</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 text-center">What's Next?</h2>
            <ul className="text-center space-y-3 text-gray-600">
              <li className="flex items-center justify-center">
                <span>REX now has access to your Google services.</span>
              </li>
              <li className="flex items-center justify-center">
                <span>We're working on setting up your REX voice agent and will notify you when it's ready.</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 text-center">
            <p className="text-sm text-gray-500">
              You may now close this window.
            </p>
            <p>
              If you have any questions, please contact us at <a href="mailto:info@paradigmintelligence.ai" className="text-indigo-600 hover:text-indigo-500 font-medium">info@paradigmintelligence.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  )
}

