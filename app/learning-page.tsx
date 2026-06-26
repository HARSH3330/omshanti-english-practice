'use client';

import React, { useMemo, useRef, useState } from 'react';

type WordCard = {
  word: string;
  meaning: string;
  hindi: string;
  sentence: string;
  hindiSentence: string;
  partOfSpeech: string;
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

type DictionaryResult = {
  word: string;
  partOfSpeech: string;
  meaning: string;
  hindiMeaning: string;
  examples: { sentence: string; hindi: string }[];
  synonyms: string[];
  antonym: string;
  source?: string;
};

type SentenceWord = {
  word: string;
  grammarType: string;
  simpleMeaning: string;
};

type SentenceBreakdownResult = {
  correctedSentence: string;
  explanation: string;
  hindiExplanation: string;
  words: SentenceWord[];
  source?: string;
};

const words = [
  ['Water','Noun','A clear liquid we drink.','पानी','I need a glass of water.','मुझे एक गिलास पानी चाहिए।'],
  ['Food','Noun','Something we eat.','खाना','The food is ready.','खाना तैयार है।'],
  ['Tea','Noun','A hot drink.','चाय','I am making tea.','मैं चाय बना रही हूँ।'],
  ['Family','Noun','People who live with us or are related to us.','परिवार','My family is very kind.','मेरा परिवार बहुत दयालु है।'],
  ['Market','Noun','A place where people buy things.','बाज़ार','I am going to the market.','मैं बाज़ार जा रही हूँ।'],
  ['Doctor','Noun','A person who helps sick people.','डॉक्टर','I need to see a doctor.','मुझे डॉक्टर को दिखाना है।'],
  ['Clean','Adjective / Verb','Not dirty; to remove dirt.','साफ / साफ करना','Please keep the room clean.','कृपया कमरे को साफ रखें।'],
  ['Hungry','Adjective','Wanting to eat food.','भूखा','I am hungry now.','मुझे अब भूख लगी है।'],
  ['Tired','Adjective','Needing rest.','थका हुआ','I am tired today.','मैं आज थकी हुई हूँ।'],
  ['Happy','Adjective','Feeling good.','खुश','I am happy to see you.','मैं तुम्हें देखकर खुश हूँ।'],
  ['Slowly','Adverb','Not fast.','धीरे-धीरे','Please speak slowly.','कृपया धीरे-धीरे बोलिए।'],
  ['Quickly','Adverb','Fast.','जल्दी','Come quickly, please.','कृपया जल्दी आओ।'],
  ['Remember','Verb','To keep something in your mind.','याद रखना','Please remember my name.','कृपया मेरा नाम याद रखें।'],
  ['Forget','Verb','To not remember.','भूलना','Do not forget your medicine.','अपनी दवा मत भूलना।'],
  ['Enough','Adjective','As much as needed.','काफी / पर्याप्त','I have enough water.','मेरे पास पर्याप्त पानी है।'],
  ['Together','Adverb','With each other.','साथ में','We eat dinner together.','हम साथ में रात का खाना खाते हैं।'],
  ['Careful','Adjective','Doing something with attention.','सावधान','Be careful on the stairs.','सीढ़ियों पर सावधान रहें।'],
  ['Beautiful','Adjective','Something that looks very nice.','सुंदर','This flower is beautiful.','यह फूल सुंदर है।'],
  ['Medicine','Noun','Something we take to feel better.','दवा','Take your medicine after food.','खाने के बाद अपनी दवा लें।'],
  ['Morning','Noun','The early part of the day.','सुबह','I wake up early in the morning.','मैं सुबह जल्दी उठती हूँ।'],
  ['Evening','Noun','The time after afternoon.','शाम','I go for a walk in the evening.','मैं शाम को टहलने जाती हूँ।'],
  ['Speak','Verb','To say words.','बोलना','I want to speak English.','मैं अंग्रेज़ी बोलना चाहती हूँ।'],
  ['Listen','Verb','To hear carefully.','सुनना','Please listen carefully.','कृपया ध्यान से सुनिए।'],
  ['Help','Verb / Noun','To make work easier for someone.','मदद','Can you help me?','क्या आप मेरी मदद कर सकते हैं?'],
  ['Come','Verb','To move near someone.','आना','Please come here.','कृपया यहाँ आइए।'],
  ['Go','Verb','To move to another place.','जाना','I want to go home.','मैं घर जाना चाहती हूँ।'],
  ['Sit','Verb','To rest on a chair or floor.','बैठना','Please sit here.','कृपया यहाँ बैठिए।'],
  ['Stand','Verb','To be on your feet.','खड़ा होना','Please stand near the door.','कृपया दरवाज़े के पास खड़े हों।'],
  ['Wait','Verb','To stay for some time.','इंतज़ार करना','Please wait for five minutes.','कृपया पाँच मिनट इंतज़ार करें।'],
  ['Buy','Verb','To get something by paying money.','खरीदना','I want to buy vegetables.','मैं सब्ज़ियाँ खरीदना चाहती हूँ।'],
  ['Bring','Verb','To carry something to someone.','लाना','Please bring my phone.','कृपया मेरा फोन लाएँ।'],
  ['Cook','Verb','To make food.','पकाना','I cook lunch at home.','मैं घर पर दोपहर का खाना बनाती हूँ।'],
  ['Wash','Verb','To clean with water.','धोना','Wash your hands before eating.','खाने से पहले हाथ धोएँ।'],
  ['Call','Verb / Noun','To speak on the phone.','फोन करना','Please call me later.','कृपया मुझे बाद में फोन करें।'],
  ['Visit','Verb','To go and meet someone.','मिलने जाना','We will visit relatives tomorrow.','हम कल रिश्तेदारों से मिलने जाएँगे।'],
  ['Simple','Adjective','Easy to understand.','सरल','This sentence is simple.','यह वाक्य सरल है।'],
  ['Easy','Adjective','Not difficult.','आसान','This work is easy.','यह काम आसान है।'],
  ['Difficult','Adjective','Not easy.','कठिन','English feels difficult sometimes.','कभी-कभी अंग्रेज़ी कठिन लगती है।'],
  ['Smile','Verb / Noun','A happy look on the face.','मुस्कान / मुस्कुराना','She has a beautiful smile.','उसकी मुस्कान सुंदर है।'],
  ['Home','Noun','The place where we live.','घर','I am at home.','मैं घर पर हूँ।'],
  ['Room','Noun','A part of a house.','कमरा','The room is clean.','कमरा साफ है।'],
  ['Door','Noun','Something we open to enter a room.','दरवाज़ा','Please close the door.','कृपया दरवाज़ा बंद करें।'],
  ['Window','Noun','An opening in a wall for air and light.','खिड़की','Open the window.','खिड़की खोलिए।'],
  ['Chair','Noun','A thing we sit on.','कुर्सी','Please sit on the chair.','कृपया कुर्सी पर बैठिए।'],
  ['Table','Noun','A thing used to keep items on.','मेज़','The keys are on the table.','चाबियाँ मेज़ पर हैं।'],
  ['Phone','Noun','A device used to talk to people.','फोन','My phone is charging.','मेरा फोन चार्ज हो रहा है।'],
  ['Key','Noun','A small thing used to open a lock.','चाबी','Where is the key?','चाबी कहाँ है?'],
  ['Bag','Noun','A thing used to carry items.','बैग','My bag is heavy.','मेरा बैग भारी है।'],
  ['Money','Noun','Coins or notes used to buy things.','पैसा','I need some money.','मुझे कुछ पैसे चाहिए।'],
  ['Shop','Noun','A place where we buy things.','दुकान','The shop is open.','दुकान खुली है।'],
  ['Vegetables','Noun','Healthy food like potato, tomato, and onion.','सब्ज़ियाँ','I bought fresh vegetables.','मैंने ताज़ी सब्ज़ियाँ खरीदीं।'],
  ['Fruit','Noun','Sweet food from plants.','फल','Apple is a fruit.','सेब एक फल है।'],
  ['Milk','Noun','A white drink.','दूध','Please boil the milk.','कृपया दूध उबालिए।'],
  ['Sugar','Noun','Something sweet used in tea.','चीनी','Add less sugar to tea.','चाय में कम चीनी डालिए।'],
  ['Salt','Noun','Something used to make food salty.','नमक','The food needs salt.','खाने में नमक चाहिए।'],
  ['Rice','Noun','A common food grain.','चावल','We eat rice for lunch.','हम दोपहर में चावल खाते हैं।'],
  ['Bread','Noun','A food made from flour.','ब्रेड / रोटी','I want bread with tea.','मुझे चाय के साथ ब्रेड चाहिए।'],
  ['Breakfast','Noun','The first meal of the day.','नाश्ता','Breakfast is ready.','नाश्ता तैयार है।'],
  ['Lunch','Noun','Food eaten in the afternoon.','दोपहर का खाना','I made lunch today.','मैंने आज दोपहर का खाना बनाया।'],
  ['Dinner','Noun','Food eaten at night.','रात का खाना','Dinner is on the table.','रात का खाना मेज़ पर है।'],
  ['Hot','Adjective','Having a high temperature.','गरम','The tea is hot.','चाय गरम है।'],
  ['Cold','Adjective','Having a low temperature.','ठंडा','The water is cold.','पानी ठंडा है।'],
  ['Fresh','Adjective','New and good to use.','ताज़ा','These vegetables are fresh.','ये सब्ज़ियाँ ताज़ी हैं।'],
  ['Old','Adjective','Not new.','पुराना','This is an old photo.','यह पुरानी फोटो है।'],
  ['New','Adjective','Recently made or bought.','नया','I bought a new cup.','मैंने नया कप खरीदा।'],
  ['Good','Adjective','Nice or correct.','अच्छा','This is a good idea.','यह अच्छा विचार है।'],
  ['Bad','Adjective','Not good.','बुरा','This smell is bad.','यह गंध बुरी है।'],
  ['Big','Adjective','Large in size.','बड़ा','This bag is big.','यह बैग बड़ा है।'],
  ['Small','Adjective','Little in size.','छोटा','This cup is small.','यह कप छोटा है।'],
  ['Heavy','Adjective','Hard to lift.','भारी','This box is heavy.','यह डिब्बा भारी है।'],
  ['Light','Adjective','Not heavy.','हल्का','This bag is light.','यह बैग हल्का है।'],
  ['Near','Preposition','Close to something.','पास','The shop is near my home.','दुकान मेरे घर के पास है।'],
  ['Far','Adjective / Adverb','Not near.','दूर','The hospital is far.','अस्पताल दूर है।'],
  ['Inside','Preposition / Adverb','In something.','अंदर','The keys are inside the bag.','चाबियाँ बैग के अंदर हैं।'],
  ['Outside','Preposition / Adverb','Not inside.','बाहर','The children are outside.','बच्चे बाहर हैं।'],
  ['Before','Preposition','Earlier than something.','पहले','Wash hands before eating.','खाने से पहले हाथ धोएँ।'],
  ['After','Preposition','Later than something.','बाद में','Rest after lunch.','दोपहर के खाने के बाद आराम करें।'],
  ['Today','Noun / Adverb','This day.','आज','Today is a good day.','आज अच्छा दिन है।'],
  ['Tomorrow','Noun / Adverb','The next day.','कल','I will call you tomorrow.','मैं आपको कल फोन करूँगी।'],
  ['Yesterday','Noun / Adverb','The day before today.','बीता हुआ कल','I visited the doctor yesterday.','मैं कल डॉक्टर के पास गई थी।'],
  ['Now','Adverb','At this time.','अभी','I am busy now.','मैं अभी व्यस्त हूँ।'],
  ['Later','Adverb','After some time.','बाद में','I will talk later.','मैं बाद में बात करूँगी।'],
  ['Always','Adverb','Every time.','हमेशा','Always speak politely.','हमेशा विनम्रता से बोलिए।'],
  ['Never','Adverb','Not at any time.','कभी नहीं','Never skip medicine.','दवा कभी मत छोड़िए।'],
  ['Sometimes','Adverb','Not always.','कभी-कभी','Sometimes I feel tired.','कभी-कभी मैं थकी हुई महसूस करती हूँ।'],
  ['Polite','Adjective','Speaking with respect.','विनम्र','Be polite with everyone.','सबके साथ विनम्र रहें।'],
  ['Kind','Adjective','Good and helpful.','दयालु','She is a kind person.','वह दयालु व्यक्ति है।'],
  ['Busy','Adjective','Having work to do.','व्यस्त','I am busy in the kitchen.','मैं रसोई में व्यस्त हूँ।'],
  ['Ready','Adjective','Prepared.','तैयार','I am ready to go.','मैं जाने के लिए तैयार हूँ।'],
  ['Late','Adjective / Adverb','After the correct time.','देर','Do not be late.','देर मत करो।'],
  ['Early','Adjective / Adverb','Before the usual time.','जल्दी','I wake up early.','मैं जल्दी उठती हूँ।'],
  ['Walk','Verb / Noun','To move on foot.','चलना / टहलना','I walk in the evening.','मैं शाम को टहलती हूँ।'],
  ['Read','Verb','To look at words and understand them.','पढ़ना','I read a small sentence.','मैं एक छोटा वाक्य पढ़ती हूँ।'],
  ['Write','Verb','To make words with a pen or keyboard.','लिखना','Please write your name.','कृपया अपना नाम लिखिए।'],
  ['Learn','Verb','To get new knowledge.','सीखना','I learn English every day.','मैं हर दिन अंग्रेज़ी सीखती हूँ।'],
  ['Practice','Verb / Noun','To do something again to improve.','अभ्यास','Practice English daily.','रोज़ अंग्रेज़ी का अभ्यास करें।'],
  ['Question','Noun','Something we ask.','सवाल','I have a question.','मेरा एक सवाल है।'],
  ['Answer','Noun / Verb','A reply to a question.','जवाब','Please answer slowly.','कृपया धीरे से जवाब दें।'],
  ['Understand','Verb','To know the meaning.','समझना','I understand this sentence.','मैं यह वाक्य समझती हूँ।'],
  ['Repeat','Verb','To say again.','दोहराना','Please repeat the word.','कृपया शब्द दोहराएँ।'],
  ['Correct','Adjective / Verb','Right; to fix a mistake.','सही / सुधारना','This answer is correct.','यह जवाब सही है।'],
  ['Wrong','Adjective','Not correct.','गलत','This word is wrong.','यह शब्द गलत है।'],
  ['Safe','Adjective','Not in danger.','सुरक्षित','Stay safe at home.','घर पर सुरक्षित रहें।'],
  ['Healthy','Adjective','Good for the body.','स्वस्थ','Healthy food is important.','स्वस्थ खाना ज़रूरी है।'],
  ['Sick','Adjective','Not well.','बीमार','I feel sick today.','मैं आज बीमार महसूस कर रही हूँ।'],
  ['Pain','Noun','A hurt feeling in the body.','दर्द','I have pain in my knee.','मेरे घुटने में दर्द है।'],
  ['Headache','Noun','Pain in the head.','सिरदर्द','I have a headache.','मुझे सिरदर्द है।'],
  ['Rest','Verb / Noun','To relax and stop working.','आराम','Please rest for some time.','कृपया कुछ समय आराम करें।'],
  ['Sleep','Verb / Noun','To rest at night.','सोना / नींद','I need good sleep.','मुझे अच्छी नींद चाहिए।'],
  ['Wake','Verb','To stop sleeping.','जागना','I wake up at six.','मैं छह बजे जागती हूँ।'],
  ['Open','Verb / Adjective','Not closed.','खोलना / खुला','Please open the door.','कृपया दरवाज़ा खोलिए।'],
  ['Close','Verb / Adjective','To shut something.','बंद करना','Please close the window.','कृपया खिड़की बंद करें।'],
  ['Turn','Verb','To move or change direction.','मोड़ना','Turn left at the shop.','दुकान पर बाएँ मुड़िए।'],
  ['Left','Noun / Adjective','One side of the body or direction.','बायाँ','Turn left here.','यहाँ बाएँ मुड़िए।'],
  ['Right','Noun / Adjective','Correct or one side.','दायाँ / सही','The hospital is on the right.','अस्पताल दाईं ओर है।'],
  ['Straight','Adverb / Adjective','Without turning.','सीधा','Go straight for two minutes.','दो मिनट सीधे जाइए।'],
  ['Relatives','Noun','People in our family group.','रिश्तेदार','We are visiting relatives.','हम रिश्तेदारों से मिलने जा रहे हैं।'],
  ['Neighbor','Noun','A person living near us.','पड़ोसी','My neighbor is helpful.','मेरा पड़ोसी मददगार है।'],
  ['Guest','Noun','A person who visits our home.','मेहमान','A guest is coming today.','आज एक मेहमान आ रहा है।'],
  ['Address','Noun','Where someone lives.','पता','Please write your address.','कृपया अपना पता लिखिए।'],
  ['Road','Noun','A path for vehicles and people.','सड़क','The road is busy.','सड़क व्यस्त है।'],
  ['Auto','Noun','A small public vehicle.','ऑटो','I will take an auto.','मैं ऑटो लूँगी।'],
  ['Bus','Noun','A large vehicle for many people.','बस','The bus is late.','बस देर से है।'],
  ['Ticket','Noun','A paper or message for travel or entry.','टिकट','Please keep the ticket.','कृपया टिकट संभालकर रखें।'],
];

const wordBank = words.map(([word, partOfSpeech, meaning, hindi, sentence, hindiSentence]) => ({ word, partOfSpeech, meaning, hindi, sentence, hindiSentence }));
const WORDS_PER_DAY = 6;

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

function getDayNumber(date: Date) {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
}

function getDailyWords(date = new Date()) {
  const start = (getDayNumber(date) * WORDS_PER_DAY) % wordBank.length;
  return Array.from({ length: WORDS_PER_DAY }, (_, index) => wordBank[(start + index) % wordBank.length]);
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

function localDictionaryLookup(input: string): DictionaryResult {
  const search = normalize(input);
  const found = wordBank.find((item) => normalize(item.word) === search) || wordBank.find((item) => normalize(item.word).includes(search));
  const fallbackWord = input.trim() || 'Word';
  if (!found) {
    return {
      word: fallbackWord,
      partOfSpeech: 'Noun / Verb',
      meaning: 'A useful English word. Add API key for a better explanation.',
      hindiMeaning: 'बेहतर अर्थ के लिए API key जोड़ें।',
      examples: [
        { sentence: 'Please explain this word.', hindi: 'कृपया इस शब्द को समझाइए।' },
        { sentence: 'I want to learn this word.', hindi: 'मैं यह शब्द सीखना चाहती हूँ।' },
      ],
      synonyms: [],
      antonym: 'Not available',
      source: 'local-fallback',
    };
  }
  return {
    word: found.word,
    partOfSpeech: found.partOfSpeech,
    meaning: found.meaning,
    hindiMeaning: found.hindi,
    examples: [
      { sentence: found.sentence, hindi: found.hindiSentence },
      { sentence: `Please use ${found.word.toLowerCase()} in a sentence.`, hindi: `कृपया ${found.hindi} को वाक्य में इस्तेमाल करें।` },
    ],
    synonyms: ['daily word', 'simple word'],
    antonym: 'Not available',
    source: 'local-fallback',
  };
}

function localSentenceBreakdown(input: string): SentenceBreakdownResult {
  const correction = localCorrection(input);
  const articles = new Set(['a', 'an', 'the']);
  const pronouns = new Set(['i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them']);
  const prepositions = new Set(['in', 'on', 'at', 'to', 'from', 'with', 'for', 'of', 'near', 'inside', 'outside', 'before', 'after']);
  const conjunctions = new Set(['and', 'but', 'or', 'because', 'so']);
  const verbs = new Set(['am', 'is', 'are', 'was', 'were', 'go', 'goes', 'going', 'come', 'eat', 'drink', 'read', 'reading', 'cook', 'wash', 'buy', 'bring', 'speak', 'listen', 'help', 'want', 'need', 'have', 'has', 'do', 'does']);
  const adjectives = new Set(['beautiful', 'good', 'bad', 'big', 'small', 'clean', 'hungry', 'tired', 'happy', 'easy', 'difficult', 'fresh', 'hot', 'cold']);
  const adverbs = new Set(['slowly', 'quickly', 'now', 'later', 'today', 'tomorrow', 'yesterday', 'always', 'never', 'sometimes']);
  const words = input.replace(/[.,!?]/g, '').split(/\s+/).filter(Boolean).map((word): SentenceWord => {
    const clean = normalize(word);
    if (articles.has(clean)) return { word, grammarType: 'Article', simpleMeaning: 'Used before a noun' };
    if (pronouns.has(clean)) return { word, grammarType: 'Pronoun', simpleMeaning: 'Used instead of a name' };
    if (prepositions.has(clean)) return { word, grammarType: 'Preposition', simpleMeaning: 'Shows place, time, or direction' };
    if (conjunctions.has(clean)) return { word, grammarType: 'Conjunction', simpleMeaning: 'Joins words or sentences' };
    if (verbs.has(clean) || clean.endsWith('ing')) return { word, grammarType: 'Verb', simpleMeaning: 'Action or being word' };
    if (adverbs.has(clean) || clean.endsWith('ly')) return { word, grammarType: 'Adverb', simpleMeaning: 'Describes how or when' };
    if (adjectives.has(clean)) return { word, grammarType: 'Adjective', simpleMeaning: 'Describes a noun' };
    return { word, grammarType: 'Noun', simpleMeaning: 'Person, place, thing, or idea' };
  });

  return {
    correctedSentence: correction.corrected,
    explanation: 'This table shows the basic grammar job of each word.',
    hindiExplanation: 'इस table में हर word का grammar काम दिखाया गया है, जैसे noun, verb, adjective और adverb।',
    words,
    source: 'local-fallback',
  };
}

export default function LearningPage() {
  const dailyWords = useMemo(() => getDailyWords(), []);
  const todayLabel = useMemo(() => new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), []);
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
  const [dictionaryInput, setDictionaryInput] = useState('Beautiful');
  const [dictionaryResult, setDictionaryResult] = useState<DictionaryResult | null>(null);
  const [dictionaryLoading, setDictionaryLoading] = useState(false);
  const [dictionaryError, setDictionaryError] = useState('');
  const [breakdownInput, setBreakdownInput] = useState('The beautiful girl is reading a book slowly.');
  const [breakdownResult, setBreakdownResult] = useState<SentenceBreakdownResult | null>(null);
  const [breakdownLoading, setBreakdownLoading] = useState(false);
  const [breakdownError, setBreakdownError] = useState('');
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

  const explainWord = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!dictionaryInput.trim()) return;
    setDictionaryLoading(true);
    setDictionaryError('');
    try {
      const response = await fetch('/api/explain-word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: dictionaryInput }),
      });
      if (!response.ok) throw new Error('Word route unavailable');
      setDictionaryResult(await response.json());
    } catch {
      setDictionaryResult(localDictionaryLookup(dictionaryInput));
      setDictionaryError('Using simple local word help. Add API key for richer meanings.');
    } finally {
      setDictionaryLoading(false);
    }
  };

  const analyzeSentence = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!breakdownInput.trim()) return;
    setBreakdownLoading(true);
    setBreakdownError('');
    try {
      const response = await fetch('/api/analyze-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: breakdownInput }),
      });
      if (!response.ok) throw new Error('Sentence route unavailable');
      setBreakdownResult(await response.json());
    } catch {
      setBreakdownResult(localSentenceBreakdown(breakdownInput));
      setBreakdownError('Using simple local grammar help. Add API key for deeper analysis.');
    } finally {
      setBreakdownLoading(false);
    }
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
          <div><p className="small-label">Step 1 Â· {todayLabel}</p><h2>Today&apos;s Words</h2><p className="section-note">These words change automatically every day from a local 100+ word bank. No API cost.</p></div>
          <button className="quiet-button" onClick={() => markDone('words')}>Mark words learned</button>
        </div>
        <div className="word-grid">
          {dailyWords.map((item) => {
            const wordKey = `word-${item.word}`;
            return (
              <article className="word-card" key={item.word}>
                <div className="word-title-row"><h3>{item.word}</h3><span>{item.hindi}</span></div>
                <p><strong>Part of speech:</strong> {item.partOfSpeech}</p>
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
        <div className="section-heading">
          <div><p className="small-label">New Helper</p><h2>Vocabulary Helper</h2><p className="section-note">Type any English word and get a simple meaning, Hindi meaning, examples, synonyms, and pronunciation.</p></div>
        </div>
        <div className="helper-layout">
          <form className="helper-card" onSubmit={explainWord}>
            <label htmlFor="dictionary-word">Find word meaning</label>
            <input id="dictionary-word" value={dictionaryInput} onChange={(event) => setDictionaryInput(event.target.value)} placeholder="Example: Beautiful" />
            <div className="button-row">
              <button type="submit" disabled={dictionaryLoading}>{dictionaryLoading ? 'Explaining...' : 'Explain Word'}</button>
              {dictionaryResult && <button type="button" onClick={() => speak(dictionaryResult.word)}>Listen Word</button>}
            </div>
          </form>
          <article className="result-card helper-result">
            {dictionaryResult ? (
              <>
                {dictionaryError && <p className="api-note">{dictionaryError}</p>}
                <p><strong>Word:</strong> {dictionaryResult.word}</p>
                <p><strong>Part of speech:</strong> {dictionaryResult.partOfSpeech}</p>
                <p><strong>Meaning:</strong> {dictionaryResult.meaning}</p>
                <p><strong>Hindi meaning:</strong> {dictionaryResult.hindiMeaning}</p>
                {dictionaryResult.examples.map((example, index) => (
                  <div className="example-box" key={`${example.sentence}-${index}`}>
                    <p><strong>Example {index + 1}:</strong> {example.sentence}</p>
                    <p className="hindi-line">{example.hindi}</p>
                  </div>
                ))}
                <p><strong>Synonyms:</strong> {dictionaryResult.synonyms.length ? dictionaryResult.synonyms.join(', ') : 'Not available'}</p>
                <p><strong>Antonym:</strong> {dictionaryResult.antonym || 'Not available'}</p>
              </>
            ) : <p>Word explanation will appear here.</p>}
          </article>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div><p className="small-label">New Helper</p><h2>Sentence Breakdown</h2><p className="section-note">Analyze nouns, verbs, adjectives, adverbs, pronouns, prepositions, articles, and conjunctions.</p></div>
        </div>
        <div className="helper-layout">
          <form className="helper-card" onSubmit={analyzeSentence}>
            <label htmlFor="sentence-breakdown">Type one sentence</label>
            <textarea id="sentence-breakdown" value={breakdownInput} onChange={(event) => setBreakdownInput(event.target.value)} />
            <button type="submit" disabled={breakdownLoading}>{breakdownLoading ? 'Analyzing...' : 'Analyze Sentence'}</button>
          </form>
          <article className="result-card helper-result">
            {breakdownResult ? (
              <>
                {breakdownError && <p className="api-note">{breakdownError}</p>}
                <p><strong>Corrected sentence:</strong> {breakdownResult.correctedSentence}</p>
                <p><strong>Explanation:</strong> {breakdownResult.explanation}</p>
                <p><strong>Hindi:</strong> {breakdownResult.hindiExplanation}</p>
                <div className="table-wrap">
                  <table className="word-table">
                    <thead><tr><th>Word</th><th>Grammar Type</th><th>Simple Meaning</th></tr></thead>
                    <tbody>{breakdownResult.words.map((item, index) => <tr key={`${item.word}-${index}`}><td>{item.word}</td><td>{item.grammarType}</td><td>{item.simpleMeaning}</td></tr>)}</tbody>
                  </table>
                </div>
              </>
            ) : <p>Sentence analysis will appear here.</p>}
          </article>
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
