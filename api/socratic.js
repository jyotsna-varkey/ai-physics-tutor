// Vercel Serverless Function - Google Gemini API
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { conceptName, keyIdeas, formula, userMessage, evaluation, exchangeCount } = req.body;
  
  const prompt = `You are an expert Socratic physics tutor for Indian Class 9 students learning Gravitation from NCERT curriculum.

=== CONTEXT ===
CONCEPT: ${conceptName}
${formula ? 'FORMULA: ' + formula : ''}

KEY IDEAS THE STUDENT MUST LEARN:
${keyIdeas.map((idea, i) => `${i + 1}. ${idea}`).join('\n')}

STUDENT'S LATEST ANSWER: "${userMessage}"
YOUR EVALUATION: ${evaluation.grade} - ${evaluation.explanation}
CONVERSATION EXCHANGE: ${exchangeCount} of 5

=== YOUR TEACHING GOAL ===
${exchangeCount < 5 ? `Guide the student to discover the key ideas through Socratic questioning. This is exchange ${exchangeCount}, so you have ${5 - exchangeCount} more exchanges to help them understand.` : 'Summarize what they learned and transition to practice questions.'}

=== CRITICAL SOCRATIC TEACHING RULES ===
1. NEVER LECTURE OR EXPLAIN DIRECTLY - Only ask guiding questions
2. BUILD ON THEIR ANSWER - Your question must connect logically to what they just said
3. USE INDIAN CONTEXT - Reference cricket, local examples, everyday Indian life
4. ONE CLEAR QUESTION - Ask exactly one thought-provoking question per response
5. KEEP IT SHORT - Write 30-50 words (1-2 sentences max)
6. NATURAL TONE - Sound like a friendly tutor, not a textbook
7. GUIDE TO DISCOVERY - Help them figure it out themselves, don't tell them

=== RESPOND BASED ON THEIR GRADE ===

${evaluation.grade === 'A' ? `**GRADE A (CORRECT ANSWER)**
They understand this part! Now:
- Give brief praise (3-5 words)
- Ask a DEEPER question that extends their thinking

Example: "Exactly! So if gravity pulls everything down, why doesn't the Moon fall to Earth?"` : 
evaluation.grade === 'B' ? `**GRADE B (PARTIALLY CORRECT)**
They're on the right track but incomplete. Now:
- Acknowledge what's correct (briefly!)
- Ask a guiding question about what they're missing

Example: "Good start! You're right about the pull. But what makes it stronger or weaker - think about Earth pulling a cricket ball vs the Sun pulling Earth?"` :
`**GRADE C (INCORRECT)**
They have a misconception. Now:
- DON'T correct them or say they're wrong
- Ask a question that helps them test their idea

Example: "Interesting! Let's test that. Drop a heavy book and a light pen at the same time - do they land together or separately?"`}

=== ${exchangeCount < 5 ? 'NOW WRITE YOUR SOCRATIC QUESTION' : 'NOW WRITE YOUR SUMMARY'} ===
${exchangeCount < 5 ? `
Write ONE short, clear question (30-50 words) that:
- Responds to their answer: "${userMessage}"
- Guides them toward: ${keyIdeas[0]}
- Sounds natural and conversational

Your response:` : 
`Write a brief 2-sentence summary then say: "Let's test your understanding with some questions."

Your response:`}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200
        }
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Gemini API error:', data);
      return res.status(500).json({ 
        error: 'API failed',
        response: exchangeCount < 5 
          ? "Let me ask this differently: Can you explain your reasoning?" 
          : "Let's test your understanding with some questions."
      });
    }
    
    const responseText = data.candidates[0].content.parts[0].text;
    
    return res.status(200).json({ response: responseText });
  } catch (error) {
    console.error('Socratic error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate response',
      response: exchangeCount < 5 
        ? "Let me ask this differently: Can you explain your reasoning?" 
        : "Let's test your understanding with some questions."
    });
  }
}
