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
  
  const prompt = `You are evaluating a physics student's answer. Be strict and accurate.

CONCEPT BEING TESTED: ${conceptName}
WHAT THE STUDENT SHOULD UNDERSTAND: ${keyIdeas.join('; ')}
STUDENT'S ACTUAL ANSWER: "${userMessage}"

EVALUATION TASK:
Determine if the student's answer demonstrates understanding of the concept.

Grade as:
- A = Correct: Answer shows clear understanding of the key ideas
- B = Partially Correct: Answer has some right ideas but is incomplete or has minor errors
- C = Incorrect: Answer shows fundamental misunderstanding or is completely wrong

OUTPUT REQUIREMENTS:
- First character MUST be the letter A, B, or C
- Follow with " - " and then EXACTLY ONE brief explanation (maximum 12 words)
- No other text, no preamble, no markdown

EXAMPLES:
"A - Correctly identifies gravity as universal force between masses"
"B - Understands force concept but misses distance relationship"
"C - Confuses mass with weight"

Now evaluate this student's answer:`;

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
          maxOutputTokens: 500
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
