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
  
  const prompt = `You are a Socratic physics tutor teaching ${conceptName} to a Class 9 student.

CONCEPT: ${conceptName}
KEY IDEAS TO TEACH:
${keyIdeas.join('\n')}
${formula ? 'FORMULA: ' + formula : ''}

STUDENT SAID: "${userMessage}"
EVALUATION: ${evaluation.grade} - ${evaluation.explanation}
EXCHANGE: ${exchangeCount}/5

RESPONSE STRATEGY BASED ON EVALUATION:
- If grade A (correct): Acknowledge briefly ("That's right!" or "Exactly!"), then ask deeper question
- If grade B (partial): Point out what's correct, then ask question to address the gap
- If grade C (wrong): Do NOT praise. Ask a guiding question to help them see the issue

CRITICAL RULES:
1. NEVER say "Great!" or "Excellent!" unless grade is A
2. Keep under 80 words
3. Use Indian examples when helpful
4. Focus on ONE concept at a time

${exchangeCount < 5 
  ? 'Generate your Socratic response now.' 
  : 'Briefly summarize key learning, then say: "Let\'s test your understanding."'
}

Respond:`;

  try {
    // Using Groq (FREE!)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Free, fast, good quality
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.7
      })
    });
    
    const data = await response.json();
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
