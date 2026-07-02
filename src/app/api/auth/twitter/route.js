import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID;
const TWITTER_REDIRECT_URI = process.env.TWITTER_REDIRECT_URI;

function generateCodeVerifier() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function GET() {
  const codeVerifier = generateCodeVerifier();

  const params = new URLSearchParams({
    client_id: TWITTER_CLIENT_ID,
    redirect_uri: TWITTER_REDIRECT_URI,
    response_type: 'code',
    scope: 'tweet.read users.read',
    state: 'state',
    code_challenge: codeVerifier,
    code_challenge_method: 'plain'
  });

  const authUrl = `https://twitter.com/i/oauth2/authorize?${params}`;
  const response = NextResponse.redirect(authUrl);

  response.cookies.set("twitter_code_verifier", codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  });

  return response;
}