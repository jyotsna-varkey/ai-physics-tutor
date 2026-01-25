module.exports = async (req, res) => {
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
  
  const { conceptName, keyIdeas, userMessage } = req.body;
  
  const prompt = `Evaluate this physics answer:

CONCEPT: ${conceptName}
CORRECT UNDERSTANDING: ${keyIdeas.join('; ')}
STUDENT ANSWER: "${userMessage}"

Is the student's answer:
A) Correct (shows understanding)
B) Partially correct (has some right ideas but incomplete/mixed with errors)
C) Incorrect (fundamental misconception)

Respond with ONLY the letter (A, B, or C) and a 10-word explanation.
Format: "B - Understands force but misses mass relationship"`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
        temperature: 0.3
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Groq API error:', data);
      return res.status(500).json({ 
        error: 'Groq API failed',
        result: 'B - Could not evaluate'
      });
    }
    
    const result = data.choices[0].message.content;
    
    return res.status(200).json({ result });
  } catch (error) {
    console.error('Evaluation error:', error);
    return res.status(500).json({ 
      error: 'Evaluation failed',
      result: 'B - Could not evaluate'
    });
  }
};
