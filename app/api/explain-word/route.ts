import { NextResponse } from 'next/server';

function fallback(word: string) {
  return {
    word,
    partOfSpeech: 'Noun / Verb',
    meaning: 'A useful English word. Add OPENAI_API_KEY for a richer explanation.',
    hindiMeaning: 'बेहतर अर्थ के लिए OPENAI_API_KEY जोड़ें।',
    examples: [
      { sentence: 'I want to learn this word.', hindi: 'मैं यह शब्द सीखना चाहती हूँ।' },
      { sentence: 'Please explain this word.', hindi: 'कृपया इस शब्द को समझाइए।' },
    ],
    synonyms: [],
    antonym: 'Not available',
    source: 'local-fallback',
  };
}

export async function POST(request: Request) {
  const { word } = await request.json().catch(() => ({ word: '' }));
  if (!word || typeof word !== 'string') return NextResponse.json({ error: 'Word is required.' }, { status: 400 });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json(fallback(word));

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Explain one beginner English word for a Hindi-speaking mother. Return only JSON: word, partOfSpeech, meaning, hindiMeaning, examples array of 2 objects with sentence and hindi, synonyms array, antonym. Keep simple.' },
        { role: 'user', content: word },
      ],
    }),
  });
  if (!response.ok) return NextResponse.json(fallback(word));
  const data = await response.json();
  try { return NextResponse.json({ ...JSON.parse(data.choices?.[0]?.message?.content || '{}'), source: 'openai' }); }
  catch { return NextResponse.json(fallback(word)); }
}
