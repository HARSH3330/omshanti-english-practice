import { NextResponse } from 'next/server';

function fallback(sentence: string) {
  const words = sentence.replace(/[.,!?]/g, '').split(/\s+/).filter(Boolean).map((word) => ({
    word,
    grammarType: ['the', 'a', 'an'].includes(word.toLowerCase()) ? 'Article' : word.toLowerCase().endsWith('ly') ? 'Adverb' : word.toLowerCase().endsWith('ing') ? 'Verb' : 'Noun',
    simpleMeaning: 'Basic grammar word',
  }));
  return {
    correctedSentence: sentence,
    explanation: 'This is a simple local grammar breakdown.',
    hindiExplanation: 'यह simple local grammar breakdown है। बेहतर analysis के लिए API key जोड़ें।',
    words,
    source: 'local-fallback',
  };
}

export async function POST(request: Request) {
  const { sentence } = await request.json().catch(() => ({ sentence: '' }));
  if (!sentence || typeof sentence !== 'string') return NextResponse.json({ error: 'Sentence is required.' }, { status: 400 });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json(fallback(sentence));

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Analyze a beginner English sentence for a Hindi-speaking mother. Return only JSON: correctedSentence, explanation, hindiExplanation, words array. Each words item has word, grammarType, simpleMeaning. Identify nouns, verbs, adjectives, adverbs, pronouns, prepositions, articles, conjunctions. Keep simple.' },
        { role: 'user', content: sentence },
      ],
    }),
  });
  if (!response.ok) return NextResponse.json(fallback(sentence));
  const data = await response.json();
  try { return NextResponse.json({ ...JSON.parse(data.choices?.[0]?.message?.content || '{}'), source: 'openai' }); }
  catch { return NextResponse.json(fallback(sentence)); }
}
