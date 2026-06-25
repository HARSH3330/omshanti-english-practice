import { NextResponse } from 'next/server';

type TutorResponse = {
  reply: string;
  correction: string;
  hindiExplanation: string;
  nextQuestion: string;
  pronunciationTip: string;
  source?: string;
};

function fallbackReply(message: string, topic: string): TutorResponse {
  const lower = message.toLowerCase();
  let correction = message;
  let hindiExplanation = 'बहुत अच्छा प्रयास। छोटे sentence बोलते रहें।';

  if (lower.includes('my name ') && !lower.includes('my name is')) {
    correction = message.replace(/my name/gi, 'My name is');
    hindiExplanation = '“My name” के बाद “is” लगाते हैं।';
  }

  if (lower.includes('i am go')) {
    correction = 'I am going to the market.';
    hindiExplanation = 'कहीं जाने के लिए “going to” बोलते हैं।';
  }

  let nextQuestion = 'What do you do in the morning?';
  if (topic === 'Family talk') nextQuestion = 'How many people are in your family?';
  if (topic === 'Buying vegetables') nextQuestion = 'What vegetables do you want to buy today?';
  if (topic === 'Doctor visit') nextQuestion = 'What health problem do you have?';
  if (topic === 'Phone call') nextQuestion = 'Please say: This is mummy speaking.';

  return {
    reply: 'Good try. I understood you.',
    correction,
    hindiExplanation,
    nextQuestion,
    pronunciationTip: 'Speak slowly and clearly. Keep sentences short.',
    source: 'local-fallback',
  };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const message = typeof body.message === 'string' ? body.message : '';
  const topic = typeof body.topic === 'string' ? body.topic : 'Introducing yourself';
  const history = Array.isArray(body.history) ? body.history : [];

  if (!message.trim()) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(fallbackReply(message, topic));
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'You are a kind spoken English tutor for an Indian Hindi-speaking mother. Keep English very simple. Return only JSON with reply, correction, hindiExplanation, nextQuestion, pronunciationTip. reply max 18 words. nextQuestion max 12 words. Hindi explanation should be simple Hindi. Do not mention apps, API, or technical words.',
        },
        {
          role: 'user',
          content: JSON.stringify({ topic, currentMessage: message, recentHistory: history.slice(-8) }),
        },
      ],
    }),
  });

  if (!response.ok) {
    return NextResponse.json(fallbackReply(message, topic));
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  try {
    return NextResponse.json({ ...JSON.parse(content), source: 'openai' });
  } catch {
    return NextResponse.json(fallbackReply(message, topic));
  }
}
