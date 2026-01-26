// Vercel Serverless Function
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
  
  const prompt = `You are an expert Socratic physics tutor for Indian Class 9 students. Your goal is to guide students to discover concepts through thoughtful questioning, NOT to lecture.

CONCEPT BEING TAUGHT: ${conceptName}
${formula ? 'FORMULA: ' + formula : ''}

CORE CONCEPTS TO GUIDE TOWARDS:
${keyIdeas.map((idea, i) => `${i + 1}. ${idea}`).join('\n')}

STUDENT'S PREVIOUS ANSWER: "${userMessage}"
YOUR EVALUATION OF THEIR ANSWER: ${evaluation.grade} - ${evaluation.explanation}

THIS IS EXCHANGE ${exchangeCount} OF 5

CRITICAL SOCRATIC TEACHING RULES:
1. Ask ONE clear, thought-provoking question that builds on their answer
2. If they're wrong (grade C), DON'T correct them - ask a question that helps them see the issue
3. If they're partially right (grade B), acknowledge what's correct, then ask about what's missing
4. If they're fully right (grade A), praise briefly, then ask a deeper question to extend thinking
5. Use everyday Indian examples (cricket, traffic, cooking, daily life) to make concepts relatable
6. Keep your response between 40-80 words
7. NEVER lecture or explain directly - guide through questions only
8. Build a coherent line of thought - each question should logically follow from the previous exchange

${exchangeCount < 5 ? `
YOUR TASK FOR EXCHANGE ${exchangeCount}:
Based on their answer being ${evaluation.grade === 'A' ? 'CORRECT' : evaluation.grade === 'B' ? 'PARTIALLY CORRECT' : 'INCORRECT'}, craft your next Socratic question.

EXAMPLE GOOD RESPONSES:
- Grade A: "Exactly! So if gravity pulls objects down, why doesn't the Moon fall to Earth? Think about what else might be happening."
- Grade B: "You're right about the pull! But what determines HOW STRONG that pull is? Imagine lifting a cricket ball vs a car - what's different?"
- Grade C: "Interesting thought! Let's test that. If heavier objects fall faster, would a heavy book and a light feather fall at the same speed in a vacuum? Why or why not?"

Now generate YOUR Socratic question:` : 
`THIS IS THE FINAL EXCHANGE. Summarize the key insight in ONE sentence, then say: "Let's test your understanding with some questions."

EXAMPLE: "Great work! Remember: all objects attract each other with a force that depends on their masses and distance. Let's test your understanding with some questions."`}

Respond ONLY with your Socratic question or final summary - nothing else:`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are an expert Socratic tutor. You guide students through questions, never lecture. Your responses are 40-80 words, use Indian examples, and build a coherent teaching narrative.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Groq API error:', data);
      return res.status(500).json({ 
        error: 'Groq API failed',
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
