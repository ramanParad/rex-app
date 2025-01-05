import { NextRequest, NextResponse } from 'next/server';
import { gmail_v1 } from '@googleapis/gmail';
import { OAuth2Client } from 'google-auth-library';
import { createClient } from '@supabase/supabase-js';

async function getTokens(email: string) {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
  
  const { data, error } = await supabase
    .from('Google Auth')
    .select('access_token, refresh_token')
    .eq('email', email)
    .single();

  if (error) throw new Error('Failed to get tokens');
  return data;
}

async function createGmailDraft(auth: OAuth2Client, message: { to: string; subject: string; body: string }) {
  const gmail = new gmail_v1.Gmail({ auth });
  
  // Create the email content
  const str = [
    'Content-Type: text/plain; charset="UTF-8"\n',
    'MIME-Version: 1.0\n',
    'Content-Transfer-Encoding: 7bit\n',
    `To: ${message.to}\n`,
    `Subject: ${message.subject}\n\n`,
    message.body
  ].join('');

  const encodedMessage = Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  try {
    const res = await gmail.users.drafts.create({
      userId: 'me',
      requestBody: {
        message: {
          raw: encodedMessage
        }
      }
    });
    return res.data;
  } catch (error) {
    console.error('Error creating draft:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { email, message } = data;

    if (!email || !message) {
      return NextResponse.json({ error: 'Email and message are required' }, { status: 400 });
    }

    // Get tokens from Supabase
    const tokens = await getTokens(email);

    // Create OAuth2 client
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_APP_URL}/thank-you`
    );

    // Set credentials
    oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token
    });

    // Create draft
    const draft = await createGmailDraft(oauth2Client, message);

    return NextResponse.json({ 
      message: 'Draft created successfully', 
      draftId: draft.id 
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to create draft' },
      { status: 500 }
    );
  }
}