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
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
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
