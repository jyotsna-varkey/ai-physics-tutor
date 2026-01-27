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
  
  const prompt = `You are a Socratic physics tutor. The student just answered a question about ${conceptName}.

STUDENT SAID: "${userMessage}"
EVALUATION: ${evaluation.grade} (${evaluation.grade === 'A' ? 'correct' : evaluation.grade === 'B' ? 'partially correct' : 'wrong'})

KEY CONCEPTS THEY NEED TO LEARN:
${keyIdeas.join('; ')}

YOUR JOB: Ask ONE thought-provoking question (30-50 words) that helps them discover the answer themselves.

${evaluation.grade === 'A' ? 
'Their answer is CORRECT. Praise briefly, then ask a deeper question about the next concept.' : 
evaluation.grade === 'B' ? 
'Their answer is PARTIALLY CORRECT. Acknowledge what\'s right, then ask about what\'s missing.' : 
'Their answer is WRONG. Don\'t correct them. Ask a question that helps them test their idea and discover the error.'}

EXAMPLES:
- "Great! So if gravity pulls everything, does it pull you and the Moon the same way? What might be different?"
- "Good thinking! But what determines the strength of that pull?"
- "Interesting! If that's true, what happens when you drop a book and a feather at the same time?"

Write your question (30-50 words):`;

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
