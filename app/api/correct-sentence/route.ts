import { NextResponse } from 'next/server';

type CorrectionResponse = {
  corrected: string;
  explanation: string;
  hindiExplanation: string;
  betterSentence: string;
};

function fallbackCorrection(sentence: string): CorrectionResponse {
  const lower = sentence.toLowerCase();

  if (lower.includes('i am go market')) {
    return {
      corrected: 'I am going to the market.',
      explanation: 'Use “going to” when you are going somewhere now or soon.',
      hindiExplanation: 'जब हम अभी या जल्द कहीं जा रहे होते हैं, तो “going to” बोलते हैं।',
      betterSentence: 'I am going to the market now.',
    };
  }

  return {
    corrected: sentence,
    explanation: 'This sentence looks okay for beginner spoken English.',
    hindiExplanation: 'यह sentence beginner spoken English के लिए ठीक है।',
    betterSentence: sentence,
  };
}

export async function POST(request: Request) {
  const { sentence } = await request.json().catch(() => ({ sentence: '' }));

  if (!sentence || typeof sentence !== 'string') {
    return NextResponse.json({ error: 'Sentence is required.' }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  // Add OPENAI_API_KEY in .env.local to enable AI correction. Never expose this key in frontend code.
  if (!apiKey) {
    return NextResponse.json({ ...fallbackCorrection(sentence), source: 'local-fallback' });
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: 'You correct beginner spoken English for an Indian Hindi-speaking parent. Return only valid JSON with keys corrected, explanation, hindiExplanation, betterSentence. Keep every value short, simple, and kind.',
        },
        {
          role: 'user',
          content: sentence,
        },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ ...fallbackCorrection(sentence), source: 'local-fallback' });
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  try {
    return NextResponse.json({ ...JSON.parse(content), source: 'openai' });
  } catch {
    return NextResponse.json({ ...fallbackCorrection(sentence), source: 'local-fallback' });
  }
}
