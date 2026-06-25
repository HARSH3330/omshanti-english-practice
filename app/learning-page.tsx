'use client';

import React, { useMemo, useRef, useState } from 'react';

type WordCard = {
  word: string;
  meaning: string;
  hindi: string;
  sentence: string;
  hindiSentence: string;
};

type SpeechFeedback = {
  expected: string;
  spoken: string;
  message: string;
  tone: 'good' | 'almost' | 'try';
};

type Correction = {
  corrected: string;
  explanation: string;
  hindiExplanation: string;
  betterSentence: string;
  source?: string;
};

type ConversationTopic = {
  title: string;
  question: string;
  answerHelp: string;
  exampleWrong: string;
  exampleCorrect: string;
  explanation: string;
};

type TutorMessage = {
  role: 'mother' | 'tutor';
  text: string;
  correction?: string;
  hindiExplanation?: string;
  pronunciationTip?: string;
};

type TutorReply = {
  reply: string;
  correction: string;
  hindiExplanation: string;
  nextQuestion: string;
  pronunciationTip: string;
  source?: string;
};

const dailyWords: WordCard[] = [
  { word: 'Beautiful', meaning: 'Something that looks very nice.', hindi: 'सुंदर', sentence: 'This flower is beautiful.', hindiSentence: 'यह फूल सुंदर है।' },
  { word: 'Enough', meaning: 'As much as needed.', hindi: 'काफी / पर्याप्त', sentence: 'I have enough water.', hindiSentence: 'मेरे पास पर्याप्त पानी है।' },
  { word: 'Together', meaning: 'With each other.', hindi: 'साथ में', sentence: 'We eat dinner together.', hindiSentence: 'हम साथ में रात का खाना खाते हैं।' },
  { word: 'Careful', meaning: 'Doing something with attention.', hindi: 'सावधान', sentence: 'Be careful on the stairs.', hindiSentence: 'सीढ़ियों पर सावधान रहें।' },
  { word: 'Remember', meaning: 'To keep something in your mind.', hindi: 'याद रखना', sentence: 'Please remember my name.', hindiSentence: 'कृपया मेरा नाम याद रखें।' },
  { word: 'Market', meaning: 'A place where people buy things.', hindi: 'बाज़ार', sentence: 'I am going to the market.', hindiSentence: 'मैं बाज़ार जा रही हूँ।' },
];

const practiceSentences = [
  'I need a glass of water.',
  'Can you please help me?',
  'I am going to the market.',
];

const tutorTopics = [
  'Introducing yourself',
  'Family talk',
  'Buying vegetables',
  'Doctor visit',
  'Daily routine',
  'Phone call',
];

const firstTutorQuestion = 'Hello mummy. Let us practice simple English. What is your name?';

const conversationTopics: ConversationTopic[] = [
  { title: 'Introducing Yourself', question: 'What is your name?', answerHelp: 'My name is ___.', exampleWrong: 'My name Harsh.', exampleCorrect: 'My name is Harsh.', explanation: 'Use “is” after “name”.' },
  { title: 'Talking About Family', question: 'How many people are in your family?', answerHelp: 'There are ___ people in my family.', exampleWrong: 'My family have four people.', exampleCorrect: 'There are four people in my family.', explanation: 'Use “There are” when you tell a number of people.' },
  { title: 'Asking For Water / Tea / Food', question: 'What would you like to drink?', answerHelp: 'I would like tea, please.', exampleWrong: 'Give tea.', exampleCorrect: 'I would like tea, please.', explanation: '“I would like…” sounds polite and natural.' },
  { title: 'Talking To Shopkeeper', question: 'What do you want to buy?', answerHelp: 'I want to buy vegetables.', exampleWrong: 'I want vegetables buy.', exampleCorrect: 'I want to buy vegetables.', explanation: 'Use “to buy” after “want”.' },
  { title: 'Speaking With Doctor', question: 'What is the problem?', answerHelp: 'I have a headache.', exampleWrong: 'My head pain.', exampleCorrect: 'I have a headache.', explanation: 'For health problems, say “I have…”.' },
  { title: 'Daily Routine', question: 'What do you do in the morning?', answerHelp: 'I make tea in the morning.', exampleWrong: 'I making tea morning.', exampleCorrect: 'I make tea in the morning.', explanation: 'For daily habits, use the simple verb: “make”.' },
  { title: 'Phone Conversation', question: 'Who is speaking?', answerHelp: 'This is ___ speaking.', exampleWrong: 'I am Harsh speaking.', exampleCorrect: 'This is Harsh speaking.', explanation: 'On phone calls, “This is…” sounds natural.' },
];

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
}

function compareSpeech(expected: string, spoken: string): SpeechFeedback {
  const cleanExpected = normalize(expected);
  const cleanSpoken = normalize(spoken);
  if (!cleanSpoken) return { expected, spoken, tone: 'try', message: 'Speak slowly and clearly.' };
  if (cleanExpected === cleanSpoken) return { expected, spoken, tone: 'good', message: 'Very good. You said it correctly.' };

  const expectedWords = cleanExpected.split(' ');
  const spokenWords = new Set(cleanSpoken.split(' '));
  const matched = expectedWords.filter((word) => spokenWords.has(word)).length;
  const score = matched / Math.max(expectedWords.length, 1);
  if (score >= 0.65) return { expected, spoken, tone: 'almost', message: 'Almost correct, try again slowly.' };
  return { expected, spoken, tone: 'try', message: `You said “${spoken}”, but the correct sentence is “${expected}”.` };
}

function localCorrection(input: string): Correction {
  const text = input.trim();
  const lower = text.toLowerCase();

  if (lower.includes('i am go market')) {
    return {
      corrected: 'I am going to the market.',
      explanation: 'Use “going to” when you are going somewhere now or soon.',
      hindiExplanation: 'जब हम अभी या जल्द कहीं जा रहे होते हैं, तो “going to” बोलते हैं।',
      betterSentence: 'I am going to the market now.',
      source: 'local',
    };
  }

  if (lower.includes('my name ') && !lower.includes('my name is')) {
    const fixed = text.replace(/my name/gi, 'My name is');
    return { corrected: fixed, explanation: 'Use “is” after “my name”.', hindiExplanation: '“My name” के बाद “is” लगाते हैं।', betterSentence: fixed, source: 'local' };
  }

  if (/\bhe go\b|\bshe go\b/i.test(text)) {
    const fixed = text.replace(/he go/gi, 'he goes').replace(/she go/gi, 'she goes');
    return { corrected: fixed, explanation: 'Use “goes” with he or she.', hindiExplanation: 'He या She के साथ “goes” लगाते हैं।', betterSentence: fixed, source: 'local' };
  }

  return { corrected: text, explanation: 'This sentence looks okay for beginner spoken English.', hindiExplanation: 'यह sentence beginner spoken English के लिए ठीक है।', betterSentence: text, source: 'local' };
}

function localTutorReply(spoken: string, topic: string): TutorReply {
  const correction = localCorrection(spoken);
  let nextQuestion = 'Very nice. What do you do in the morning?';
  if (topic === 'Family talk') nextQuestion = 'Good. How many people are in your family?';
  if (topic === 'Buying vegetables') nextQuestion = 'Good. What vegetables do you want to buy today?';
  if (topic === 'Doctor visit') nextQuestion = 'Okay. What health problem do you have?';
  if (topic === 'Phone call') nextQuestion = 'Nice. Please say: This is mummy speaking.';

  return {
    reply: 'Good try. I understood you.',
    correction: correction.corrected,
    hindiExplanation: correction.hindiExplanation,
    pronunciationTip: 'Speak slowly, open your mouth clearly, and pause after each short sentence.',
    nextQuestion,
    source: 'local-fallback',
  };
}

function pronunciationFromRecognition(spoken: string, confidence?: number) {
  const words = normalize(spoken).split(' ').filter(Boolean).length;
  const confidenceScore = typeof confidence === 'number' ? Math.round(confidence * 100) : 72;
  const lengthBonus = words >= 4 ? 8 : words >= 2 ? 4 : 0;
  const score = Math.max(40, Math.min(96, confidenceScore + lengthBonus));

  if (score >= 85) return `Pronunciation: ${score}%. Very clear.`;
  if (score >= 68) return `Pronunciation: ${score}%. Almost clear, speak a little slower.`;
  return `Pronunciation: ${score}%. Try again slowly and clearly.`;
}

export default function LearningPage() {
  const [feedback, setFeedback] = useState<Record<string, SpeechFeedback>>({});
  const [listeningKey, setListeningKey] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [grammarInput, setGrammarInput] = useState('I am go market');
  const [grammarResult, setGrammarResult] = useState<Correction | null>(null);
  const [grammarLoading, setGrammarLoading] = useState(false);
  const [grammarError, setGrammarError] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(0);
  const [conversationAnswer, setConversationAnswer] = useState('');
  const [tutorTopic, setTutorTopic] = useState(tutorTopics[0]);
  const [tutorMessages, setTutorMessages] = useState<TutorMessage[]>([{ role: 'tutor', text: firstTutorQuestion }]);
  const [tutorLoading, setTutorLoading] = useState(false);
  const [tutorNotice, setTutorNotice] = useState('');
  const recognitionRef = useRef<any>(null);

  const progress = useMemo(() => {
    const total = 7;
    const done = [completed.words, completed.listen, completed.speak, completed.sentences, completed.aiTutor, completed.conversation, completed.grammar].filter(Boolean).length;
    return { done, total, percent: Math.round((done / total) * 100) };
  }, [completed]);

  const markDone = (key: string) => setCompleted((current) => ({ ...current, [key]: true }));

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.82;
    window.speechSynthesis.speak(utterance);
    markDone('listen');
  };

  const startSpeech = (key: string, expected: string, onSpoken?: (spoken: string, confidence?: number) => void) => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setFeedback((current) => ({
        ...current,
        [key]: { expected, spoken: '', tone: 'try', message: 'Speech recognition is not available in this browser. Please use Chrome or Edge on phone, or type the sentence.' },
      }));
      return;
    }

    recognitionRef.current?.stop?.();
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;
    setListeningKey(key);

    recognition.onresult = (event: any) => {
      const result = event.results?.[0]?.[0];
      const spoken = result?.transcript || '';
      const confidence = result?.confidence;
      setFeedback((current) => ({ ...current, [key]: compareSpeech(expected, spoken) }));
      onSpoken?.(spoken, confidence);
      markDone(key.startsWith('sentence') ? 'sentences' : 'speak');
    };
    recognition.onerror = () => {
      setFeedback((current) => ({ ...current, [key]: { expected, spoken: '', tone: 'try', message: 'I could not hear clearly. Please try again slowly.' } }));
    };
    recognition.onend = () => setListeningKey(null);
    recognition.start();
  };

  const askTutor = async (spoken: string, confidence?: number) => {
    if (!spoken.trim()) return;
    const pronunciationTip = pronunciationFromRecognition(spoken, confidence);
    const userMessage: TutorMessage = { role: 'mother', text: spoken, pronunciationTip };
    const nextMessages = [...tutorMessages, userMessage];
    setTutorMessages(nextMessages);
    setTutorLoading(true);
    setTutorNotice('');

    try {
      const response = await fetch('/api/tutor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: tutorTopic, message: spoken, history: nextMessages.slice(-8) }),
      });
      if (!response.ok) throw new Error('Tutor route unavailable');
      const data: TutorReply = await response.json();
      const tutorText = `${data.reply} ${data.nextQuestion}`.trim();
      setTutorMessages((current) => [...current, { role: 'tutor', text: tutorText, correction: data.correction, hindiExplanation: data.hindiExplanation, pronunciationTip: data.pronunciationTip || pronunciationTip }]);
      speak(tutorText);
      if (data.source !== 'openai') setTutorNotice('Using simple offline tutor. Add API key for smarter conversation.');
    } catch {
      const data = localTutorReply(spoken, tutorTopic);
      const tutorText = `${data.reply} ${data.nextQuestion}`.trim();
      setTutorMessages((current) => [...current, { role: 'tutor', text: tutorText, correction: data.correction, hindiExplanation: data.hindiExplanation, pronunciationTip: data.pronunciationTip }]);
      speak(tutorText);
      setTutorNotice('Using simple offline tutor. Add API key for smarter conversation.');
    } finally {
      setTutorLoading(false);
      markDone('aiTutor');
    }
  };

  const resetTutor = () => {
    setTutorMessages([{ role: 'tutor', text: firstTutorQuestion }]);
    setTutorNotice('');
    speak(firstTutorQuestion);
  };

  const checkGrammar = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!grammarInput.trim()) return;
    setGrammarLoading(true);
    setGrammarError('');

    try {
      const response = await fetch('/api/correct-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: grammarInput }),
      });
      if (!response.ok) throw new Error('AI route unavailable');
      const data = await response.json();
      setGrammarResult(data);
    } catch {
      setGrammarResult(localCorrection(grammarInput));
      setGrammarError('Using simple offline correction. Add an OpenAI API key for better answers.');
    } finally {
      setGrammarLoading(false);
      markDone('grammar');
    }
  };

  const topic = conversationTopics[selectedTopic];
  const conversationFeedback = conversationAnswer.trim() ? localCorrection(conversationAnswer) : null;

  return (
    <main className="learning-page">
      <section className="hero-simple">
        <div>
          <p className="small-label">Daily Spoken English</p>
          <h1>Om Shanti English Practice</h1>
          <p className="hero-copy">A simple daily English learning page for mummy: learn words, listen, speak, talk with an AI tutor, and correct small sentences.</p>
          <div className="hero-actions">
            <a href="#ai-tutor">Talk with AI Tutor</a>
            <a href="#daily-words">Start Daily Words</a>
          </div>
        </div>
        <div className="today-card">
          <div className="today-top"><span>Today&apos;s Practice</span><strong>{progress.done}/{progress.total}</strong></div>
          <div className="progress-track"><div style={{ width: `${progress.percent}%` }} /></div>
          <ol>
            <li className={completed.words ? 'done' : ''}>Learn 5 words</li>
            <li className={completed.listen ? 'done' : ''}>Listen to words</li>
            <li className={completed.speak ? 'done' : ''}>Speak words</li>
            <li className={completed.sentences ? 'done' : ''}>Practice 3 sentences</li>
            <li className={completed.aiTutor ? 'done' : ''}>Talk with AI tutor</li>
            <li className={completed.conversation ? 'done' : ''}>Do one conversation card</li>
            <li className={completed.grammar ? 'done' : ''}>Correct one sentence</li>
          </ol>
          {progress.done === progress.total && <p className="success-note">Great job! You practiced English today.</p>}
        </div>
      </section>

      <section id="daily-words" className="section-block">
        <div className="section-heading">
          <div><p className="small-label">Step 1</p><h2>Daily Words</h2></div>
          <button className="quiet-button" onClick={() => markDone('words')}>Mark words learned</button>
        </div>
        <div className="word-grid">
          {dailyWords.map((item) => {
            const wordKey = `word-${item.word}`;
            return (
              <article className="word-card" key={item.word}>
                <div className="word-title-row"><h3>{item.word}</h3><span>{item.hindi}</span></div>
                <p><strong>Meaning:</strong> {item.meaning}</p>
                <p><strong>Sentence:</strong> {item.sentence}</p>
                <p className="hindi-line">{item.hindiSentence}</p>
                <div className="button-row">
                  <button onClick={() => speak(item.word)}>Listen Word</button>
                  <button onClick={() => speak(item.sentence)}>Listen Sentence</button>
                  <button onClick={() => startSpeech(wordKey, item.word)}>{listeningKey === wordKey ? 'Listening...' : 'Speak Word'}</button>
                </div>
                {feedback[wordKey] && <p className={`feedback ${feedback[wordKey].tone}`}>{feedback[wordKey].message}</p>}
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-block soft-section">
        <div className="section-heading"><div><p className="small-label">Step 2</p><h2>Practice 3 Sentences</h2></div></div>
        <div className="sentence-list">
          {practiceSentences.map((sentence, index) => {
            const key = `sentence-${index}`;
            return (
              <article className="practice-card" key={sentence}>
                <div><span className="pill">Sentence {index + 1}</span><h3>{sentence}</h3></div>
                <div className="button-row"><button onClick={() => speak(sentence)}>Listen</button><button onClick={() => startSpeech(key, sentence)}>{listeningKey === key ? 'Listening...' : 'Speak'}</button></div>
                {feedback[key] && <div className={`feedback-box ${feedback[key].tone}`}><p>{feedback[key].message}</p>{feedback[key].spoken && <small>You said: {feedback[key].spoken}</small>}</div>}
              </article>
            );
          })}
        </div>
      </section>

      <section id="ai-tutor" className="section-block ai-tutor-section">
        <div className="section-heading">
          <div><p className="small-label">Step 3</p><h2>Talk With AI Tutor</h2></div>
          <select value={tutorTopic} onChange={(event) => setTutorTopic(event.target.value)} aria-label="Choose conversation topic">
            {tutorTopics.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="ai-layout">
          <article className="phone-tutor-card">
            <div className="phone-top"><span>Voice Tutor</span><strong>{listeningKey === 'ai-tutor' ? 'Listening' : tutorLoading ? 'Thinking' : 'Ready'}</strong></div>
            <div className="chat-window">
              {tutorMessages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`chat-line ${message.role}`}>
                  <p>{message.text}</p>
                  {message.correction && <small><strong>Correct:</strong> {message.correction}</small>}
                  {message.hindiExplanation && <small><strong>Hindi:</strong> {message.hindiExplanation}</small>}
                  {message.pronunciationTip && <small><strong>Pronunciation:</strong> {message.pronunciationTip}</small>}
                </div>
              ))}
              {tutorNotice && <p className="api-note">{tutorNotice}</p>}
            </div>
            <div className="big-mic-area">
              <button className="big-mic-button" onClick={() => startSpeech('ai-tutor', 'Speak your answer', askTutor)} disabled={tutorLoading}>
                {listeningKey === 'ai-tutor' ? 'Listening...' : 'Hold Phone & Speak'}
              </button>
              <button className="quiet-button" onClick={() => speak(tutorMessages[tutorMessages.length - 1]?.text || firstTutorQuestion)}>Repeat Tutor</button>
              <button className="quiet-button" onClick={resetTutor}>Restart</button>
            </div>
          </article>
          <aside className="tutor-help-card">
            <h3>How mummy can use it</h3>
            <p>1. Tap <strong>Repeat Tutor</strong> to hear the question.</p>
            <p>2. Tap <strong>Hold Phone & Speak</strong>.</p>
            <p>3. Say one short English sentence.</p>
            <p>4. The tutor replies, corrects the sentence, and asks the next question.</p>
            <p className="soft-note">Best on phone: Chrome or Edge, microphone permission allowed, quiet room.</p>
          </aside>
        </div>
      </section>

      <section className="section-block soft-section">
        <div className="section-heading"><div><p className="small-label">Step 4</p><h2>Small Conversation Cards</h2></div></div>
        <div className="conversation-layout">
          <div className="topic-list">{conversationTopics.map((item, index) => <button key={item.title} className={selectedTopic === index ? 'active' : ''} onClick={() => setSelectedTopic(index)}>{item.title}</button>)}</div>
          <article className="conversation-card">
            <p className="pill">{topic.title}</p>
            <h3>Website asks: “{topic.question}”</h3>
            <p className="answer-help">Try: {topic.answerHelp}</p>
            <div className="button-row"><button onClick={() => speak(topic.question)}>Listen Question</button><button onClick={() => startSpeech('conversation', topic.answerHelp)}>{listeningKey === 'conversation' ? 'Listening...' : 'Speak Answer'}</button></div>
            <textarea value={conversationAnswer} onChange={(event) => setConversationAnswer(event.target.value)} placeholder="Type your answer here if speaking is difficult" />
            <button className="wide-button" onClick={() => markDone('conversation')}>I practiced this conversation</button>
            <div className="correction-mini"><p><strong>Original:</strong> {topic.exampleWrong}</p><p><strong>Correct:</strong> {topic.exampleCorrect}</p><p><strong>Why:</strong> {topic.explanation}</p></div>
            {feedback.conversation && <p className={`feedback ${feedback.conversation.tone}`}>{feedback.conversation.message}</p>}
            {conversationFeedback && conversationAnswer.trim() && <div className="feedback-box almost"><p><strong>Correction:</strong> {conversationFeedback.corrected}</p><small>{conversationFeedback.hindiExplanation}</small></div>}
          </article>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><p className="small-label">Step 5</p><h2>Grammar Correction</h2></div></div>
        <div className="grammar-layout">
          <form className="grammar-card" onSubmit={checkGrammar}>
            <label htmlFor="grammar">Say or type one sentence</label>
            <textarea id="grammar" value={grammarInput} onChange={(event) => setGrammarInput(event.target.value)} />
            <div className="button-row"><button type="button" onClick={() => startSpeech('grammar-speech', grammarInput || 'I am going to the market')}>Speak Sentence</button><button type="submit" disabled={grammarLoading}>{grammarLoading ? 'Checking...' : 'Correct Sentence'}</button></div>
            {feedback['grammar-speech'] && <p className={`feedback ${feedback['grammar-speech'].tone}`}>{feedback['grammar-speech'].message}</p>}
          </form>
          <article className="result-card">
            {grammarResult ? <>{grammarError && <p className="api-note">{grammarError}</p>}<p><strong>Correct:</strong> {grammarResult.corrected}</p><p><strong>Explanation:</strong> {grammarResult.explanation}</p><p><strong>Hindi:</strong> {grammarResult.hindiExplanation}</p><p><strong>Better natural sentence:</strong> {grammarResult.betterSentence}</p></> : <p>Correction will appear here.</p>}
          </article>
        </div>
      </section>
    </main>
  );
}
