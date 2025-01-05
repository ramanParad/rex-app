'use client'

import { useEffect, Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Loader2, Home } from 'lucide-react'

function ThankYouContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries())
    
    fetch('/api/handle-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
    .then(async response => {
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed')
      }
      return data
    })
    .then(data => {
      console.log('Success:', data)
      setIsProcessing(false)
    })
    .catch((error) => {
      console.error('Error:', error)
      setError(error.message)
      setIsProcessing(false)
    })
  }, [searchParams]);

  if (isProcessing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-md w-full mx-4 p-8 bg-white rounded-xl shadow-lg">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Processing...</h1>
              <p className="text-gray-600">Please wait while we connect your Google account.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-md w-full mx-4 p-8 bg-white rounded-xl shadow-lg">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <XCircle className="w-16 h-16 text-red-500" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Oops!</h1>
              <p className="text-gray-600">Something went wrong while connecting your Google account.</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>

            <div className="pt-6 text-center">
              <p className="text-sm text-gray-500 mb-4">
                Please try again or contact our support team for assistance.
              </p>
              <p>
                Contact us at <a href="mailto:info@paradigmintelligence.com" className="text-indigo-600 hover:text-indigo-500 font-medium">info@paradigmintelligence.com</a>
              </p>
              <br />
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </button>
            </div>

          </div>
        </div>
      </div>
    )
  }

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
            <h2 className="text-lg font-semibold text-gray-900 mb-3 text-center">What&apos;s Next?</h2>
            <ul className="text-center space-y-3 text-gray-600">
              <li className="flex items-center justify-center">
                <span>REX now has access to your Google services.</span>
              </li>
              <li className="flex items-center justify-center">
                <span>We&apos;re working on setting up your REX voice agent and will notify you when it&apos;s ready.</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 text-center">
            <p className="text-sm text-gray-500">
              You may now close this window.
            </p>
            <p className="mb-4">
              If you have any questions, please contact us at <a href="mailto:info@paradigmintelligence.ai" className="text-indigo-600 hover:text-indigo-500 font-medium">info@paradigmintelligence.com</a>
            </p>
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </button>
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

