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
          temperature: 0.3,
          maxOutputTokens: 100
        }
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Gemini API error:', data);
      return res.status(500).json({ 
        error: 'API failed',
        result: 'B - Could not evaluate'
      });
    }
    
    const result = data.candidates[0].content.parts[0].text;
    
    return res.status(200).json({ result });
  } catch (error) {
    console.error('Evaluation error:', error);
    return res.status(500).json({ 
      error: 'Evaluation failed',
      result: 'B - Could not evaluate'
    });
  }
}
