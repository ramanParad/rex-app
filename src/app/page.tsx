'use client'

import { useCallback } from 'react'

export default function LoginPage() {
  const handleGoogleLogin = useCallback(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const redirectUri = `${window.location.origin}/thank-you`
    const scope = [
      'email',
      'profile',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/calendar.events.freebusy',
      'https://www.googleapis.com/auth/calendar.events.owned',
      'https://www.googleapis.com/auth/gmail.compose',
      'https://www.googleapis.com/auth/gmail.modify',
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/tasks'
    ].join(' ');    
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;

    window.location.href = googleAuthUrl
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Welcome</h1>
        <button
          onClick={handleGoogleLogin}
          className="bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-lg shadow-sm hover:bg-gray-100 flex items-center"
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            className="w-6 h-6 mr-2"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  )
}

