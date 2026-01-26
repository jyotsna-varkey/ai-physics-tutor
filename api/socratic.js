// Vercel Serverless Function - OpenRouter with Gemini
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
  
  const prompt = `You are an expert Socratic physics tutor for Indian Class 9 students. Your goal is to guide students to discover concepts through thoughtful questioning.

CONCEPT: ${conceptName}
${formula ? 'FORMULA: ' + formula : ''}

KEY IDEAS TO GUIDE TOWARDS:
${keyIdeas.map((idea, i) => `${i + 1}. ${idea}`).join('\n')}

STUDENT'S ANSWER: "${userMessage}"
EVALUATION: ${evaluation.grade} - ${evaluation.explanation}

EXCHANGE: ${exchangeCount} of 5

CRITICAL RULES:
1. Ask ONE clear question that builds logically from their answer
2. Grade ${evaluation.grade === 'A' ? '(CORRECT): Praise briefly, then ask a deeper follow-up question' : evaluation.grade === 'B' ? '(PARTIAL): Acknowledge what\'s right, then guide them to what\'s missing with a question' : '(WRONG): DON\'T correct them - ask a guiding question to help them discover the issue'}
3. Use Indian examples (cricket, daily life, local context)
4. Keep response 50-90 words
5. Build a coherent teaching narrative - each question should connect to the previous exchange
6. NEVER lecture - guide through questions only

${exchangeCount < 5 ? `
EXAMPLES OF GOOD RESPONSES:

If Grade A (correct):
"Exactly right! Gravity does pull everything down. Now think about this: if gravity pulls the Moon towards Earth, why doesn't the Moon crash into us? What else might be happening?"

If Grade B (partial):
"Good start - you're right that gravity pulls objects! But what makes the pull stronger or weaker? Imagine Earth pulling on a small stone vs. the Sun pulling on Earth - what's different?"

If Grade C (wrong):
"Interesting idea! Let's test it. Drop a heavy book and a light pen at the same time. Do they hit the ground at different times? What does that tell you?"

Now write YOUR Socratic question for this student (50-90 words):` : 
`THIS IS THE FINAL EXCHANGE. In 1-2 sentences, summarize the key insight they've learned, then say: "Let's test your understanding with some questions."

Example: "Excellent work! You've discovered that gravity is a force between ALL objects - not just Earth pulling things down. The force depends on mass and distance. Let's test your understanding with some questions."`}`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://ai-physics-tutor.vercel.app',
        'X-Title': 'AI Physics Tutor'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          {
            role: 'system',
            content: 'You are a Socratic tutor. You guide through questions, never lecture. Your responses are 50-90 words and build a coherent teaching narrative.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenRouter API error:', data);
      return res.status(500).json({ 
        error: 'API failed',
        response: exchangeCount < 5 
          ? "Let me ask this differently: Can you explain your reasoning?" 
          : "Let's test your understanding with some questions."
      });
    }
    
    const responseText = data.choices[0].message.content;
    
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
