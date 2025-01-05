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
      return NextResponse.json(
        { error: tokenData.error || 'Failed to exchange code for tokens' },
        { status: 400 }
      )
    }

    // Get user info using the access token
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch user info' },
        { status: 400 }
      )
    }

    const userData = await userResponse.json();

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    
    // Upsert the authentication data
    const { error: upsertError } = await supabase
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
      return NextResponse.json(
        { error: 'Failed to store authentication data' },
        { status: 500 }
      )
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

