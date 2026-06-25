import { NextResponse } from 'next/server';

// Mock TTS – returns a fake audio URL (local placeholder)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const text = url.searchParams.get('text') || 'Hello';
  // In a real implementation we'd call OpenAI TTS, here we return a placeholder MP3.
  const fakeAudio = `${process.env.NEXT_PUBLIC_API_URL || ''}/static/fake-tts.mp3`;
  return NextResponse.json({ audioUrl: fakeAudio, text });
}
