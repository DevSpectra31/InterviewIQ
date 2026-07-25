import dotenv from 'dotenv';

dotenv.config();

/**
 * Question fallback dictionary by topic and type to guarantee interview continuation
 * even if LLM server is unreachable.
 */
const QUESTION_BANK = {
  TECHNICAL: {
    'React.js': [
      'What are React Hooks, and how do useEffect and useState work under the hood?',
      'Explain the Virtual DOM in React and how reconciliation works.',
      'How do you manage state across complex React components (e.g., Context API vs. Redux/Zustand)?',
      'What is component code splitting and dynamic import in React for performance optimization?',
      'How do key props help React identify modified items in lists, and what happens if keys are missing or array indexes are used?'
    ],
    'Node.js': [
      'Explain the Node.js Event Loop and its main phases (Timers, Poll, Check).',
      'What is the difference between process.nextTick() and setImmediate() in Node.js?',
      'How do Streams and Buffers work in Node.js for handling high-volume data processing?',
      'How do you handle unhandled promise rejections and global uncaught exceptions in Express production apps?',
      'Explain how cluster mode or worker threads enable multithreading performance in Node.js.'
    ],
    'System Design': [
      'How would you design a rate limiter for an API with millions of daily requests?',
      'Explain horizontal vs. vertical scaling, load balancing algorithms, and sticky sessions.',
      'How do DB indexing, read-replicas, and sharding improve database read/write throughput?',
      'Design a URL shortener service (like bit.ly) focusing on database schema and collision prevention.',
      'Explain caching strategies (Cache-aside, Write-through, Write-back) and eviction policies like LRU.'
    ],
    'JavaScript': [
      'Explain Closures in JavaScript with a real-world code example.',
      'What is the event delegation pattern, and why is it useful in DOM manipulation?',
      'Compare call(), apply(), and bind() methods in JS with code use cases.',
      'Explain Promises, microtasks, and macrotasks execution order in V8 engine.',
      'What are JavaScript prototypes and prototype inheritance?'
    ],
    DEFAULT: [
      'Explain a challenging technical bug you encountered recently and how you resolved it.',
      'What design patterns do you regularly apply in your code architecture?',
      'How do you write clean, testable code and ensure test coverage in your projects?',
      'What strategies do you use for performance monitoring and memory leak detection?'
    ]
  },
  HR: {
    DEFAULT: [
      'Tell me about a time you had a conflict with a teammate and how you resolved it.',
      'Where do you see yourself in 3 to 5 years in your engineering career?',
      'Why do you want to join our organization and what unique value do you bring?',
      'Describe a project where requirements changed abruptly and how you adapted.',
      'How do you prioritize competing deadlines under tight pressure?'
    ]
  },
  RESUME: {
    DEFAULT: [
      'Walk me through the most technically complex project listed on your resume.',
      'What was your specific role and individual contribution in your team project?',
      'How did you measure the success and impact of the architectural decisions you made?',
      'If you could rebuild your featured project today, what would you do differently?'
    ]
  },
  COMPANY: {
    DEFAULT: [
      'What core values of our company resonate most with your work ethic?',
      'How do you stay updated with emerging industry technologies and trends?',
      'How do you handle feature tradeoffs when business deadlines clash with technical debt?'
    ]
  }
};

/**
 * Fallback evaluation generator if LLM endpoint fails.
 */
function generateFallbackEvaluation(questionText, answerText, topic) {
  const words = answerText ? answerText.trim().split(/\s+/).length : 0;
  
  if (words < 5) {
    return {
      score: 3,
      strengths: ['Submitted a response.'],
      weaknesses: ['Response is extremely brief and lacks depth or technical context.'],
      missingConcepts: ['Core definitions', 'Practical implementation detail', 'Real-world example'],
      idealAnswer: `A comprehensive answer for "${questionText}" should outline the foundational concept, explain step-by-step how it works, and provide a concrete practical example in ${topic || 'the relevant framework'}.`,
      suggestions: ['Expand on the explanation with technical terms, step-by-step reasoning, and a code or structural example.']
    };
  }

  if (words < 25) {
    return {
      score: 6,
      strengths: ['Identified basic concepts relevant to the question.'],
      weaknesses: ['Could benefit from more thorough explanation and edge-case handling.'],
      missingConcepts: ['Deep architectural implications', 'Performance considerations'],
      idealAnswer: `An ideal response to "${questionText}" covers the foundational mechanics, key terminology, pros/cons, and how it is applied in production environments for ${topic || 'software development'}.`,
      suggestions: ['Elaborate further on trade-offs and real-world practical experience.']
    };
  }

  return {
    score: 8,
    strengths: [
      'Provided a clear, structured explanation.',
      'Demonstrated relevant terminology and conceptual understanding.'
    ],
    weaknesses: ['Minor opportunity to include deeper edge cases or architectural tradeoffs.'],
    missingConcepts: ['Edge-case failure modes', 'Advanced optimization details'],
    idealAnswer: `An exemplary answer highlights the exact mechanics of ${questionText}, discusses architectural implications, performance best practices, and code examples.`,
    suggestions: ['Solid answer! To push for a 10/10 score, reference specific framework internals or benchmark numbers.']
  };
}

/**
 * Call Ollama server if running
 */
async function callOllama(prompt, jsonFormat = false) {
  const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL || 'llama3';

  const response = await fetch(`${ollamaUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      format: jsonFormat ? 'json' : undefined,
    }),
    signal: AbortSignal.timeout(8000), // 8 sec timeout
  });

  if (!response.ok) {
    throw new Error(`Ollama returned status ${response.status}`);
  }

  const data = await response.json();
  return data.response;
}

/**
 * Main exported AI service
 */
export const aiService = {
  /**
   * Generate next question for an interview session
   */
  async generateQuestion({ type, topic, difficulty, previousQuestions = [] }) {
    const prompt = `You are an expert tech interviewer conducting a ${type} interview on "${topic}" at ${difficulty} difficulty level.
Previous questions asked so far: ${JSON.stringify(previousQuestions.map(q => q.questionText))}

Generate the NEXT single interview question. Respond ONLY with JSON format:
{
  "questionText": "The text of the interview question"
}`;

    try {
      const responseText = await callOllama(prompt, true);
      const parsed = JSON.parse(responseText);
      if (parsed.questionText) {
        return parsed.questionText;
      }
    } catch (err) {
      console.warn(`[AIService] Ollama question generation failed: ${err.message}. Using domain question fallback.`);
    }

    // Fallback selection from QUESTION_BANK
    const typeBank = QUESTION_BANK[type] || QUESTION_BANK.TECHNICAL;
    const list = typeBank[topic] || typeBank.DEFAULT || QUESTION_BANK.TECHNICAL.DEFAULT;
    
    // Pick question not already asked
    const askedSet = new Set(previousQuestions.map((q) => q.questionText.toLowerCase().trim()));
    const unasked = list.filter((q) => !askedSet.has(q.toLowerCase().trim()));

    if (unasked.length > 0) {
      return unasked[Math.floor(Math.random() * unasked.length)];
    }

    return `Explain advanced performance optimization and security best practices when scaling ${topic || 'applications'} in production environments.`;
  },

  /**
   * Evaluate user's answer to a question
   */
  async evaluateAnswer({ questionText, answerText, topic, difficulty }) {
    if (!answerText || !answerText.trim()) {
      return {
        score: 0,
        strengths: [],
        weaknesses: ['No answer provided.'],
        missingConcepts: ['Complete answer missing'],
        idealAnswer: `An ideal response to "${questionText}" should explain the underlying principles clearly with concrete examples.`,
        suggestions: ['Make sure to write down your explanation before submitting.']
      };
    }

    const prompt = `You are an expert interviewer evaluating a candidate's response.
Question: "${questionText}"
Topic: "${topic}"
Difficulty: "${difficulty}"
Candidate Answer: "${answerText}"

Evaluate the candidate's answer and respond strictly in JSON with the following structure:
{
  "score": integer between 0 and 10,
  "strengths": ["string array of key strengths"],
  "weaknesses": ["string array of points to improve"],
  "missingConcepts": ["string array of missing technical concepts"],
  "idealAnswer": "Clear, accurate example of an ideal 10/10 response",
  "suggestions": ["actionable advice for the candidate"]
}`;

    try {
      const responseText = await callOllama(prompt, true);
      const parsed = JSON.parse(responseText);
      
      if (typeof parsed.score === 'number') {
        return {
          score: Math.min(10, Math.max(0, parsed.score)),
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
          weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
          missingConcepts: Array.isArray(parsed.missingConcepts) ? parsed.missingConcepts : [],
          idealAnswer: parsed.idealAnswer || '',
          suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : []
        };
      }
    } catch (err) {
      console.warn(`[AIService] Ollama evaluation failed: ${err.message}. Using heuristic fallback evaluation.`);
    }

    return generateFallbackEvaluation(questionText, answerText, topic);
  }
};

export default aiService;
