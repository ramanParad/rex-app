import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const data = await request.json()
  const { code } = data

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 })
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/thank-you`,
        grant_type: 'authorization_code',
        access_type: 'offline',
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      throw new Error(tokenData.error || 'Failed to exchange code for tokens')
    }

    // Get user info using the access token
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const userData = await userResponse.json();

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    
    // Upsert the authentication data
    const { data: authData, error: upsertError } = await supabase
      .from('Google Auth')
      .upsert({
        email: userData.email,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'email'  // This will update existing records with matching email
      })
      .select();

    if (upsertError) {
      console.error('Supabase error:', upsertError);
      throw new Error('Failed to store authentication data');
    }

    return NextResponse.json({ 
      message: 'Authentication successful',
      user: userData 
    })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

