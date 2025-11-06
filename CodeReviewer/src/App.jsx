import React, { useState } from 'react';

/**
 * AI Code Reviewer — Single-file React component
 * - Fixed bugs in the markdown renderer
 * - Added optional API key input (you can also use REACT_APP_GEMINI_API_KEY / NEXT_PUBLIC_GEMINI_API_KEY)
 * - Improved fetch backoff and error handling
 * - Avoids mutating React element props when building lists
 *
 * Usage:
 * 1. Provide a Gemini API key (paste into the "API Key" field or set an env var)
 *    - Env var names (for local builds): REACT_APP_GEMINI_API_KEY or NEXT_PUBLIC_GEMINI_API_KEY
 * 2. Paste code and click "Review Code"
 */
export default function App() {
  const [code, setCode] = useState(`function helloWorld() {\n  console.log("Hello, World!");\n}`);
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Allow key from env (if available) or user input
  const envKey = (typeof process !== 'undefined' && (process.env.REACT_APP_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY)) || '';
  const [apiKey, setApiKey] = useState(envKey);

  // Model & endpoint (you can change the model string if needed)
  const model = 'gemini-2.5-flash-preview-09-2025';

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const systemPrompt = `You are an expert code reviewer. Your task is to analyze the user's code and provide constructive feedback.\n\nFollow these rules:\n1. Be specific: Point out exact line numbers or code snippets.\n2. Be constructive: Explain why something is an issue and suggest improvements.\n3. Be comprehensive: Cover bugs, style, security, performance, and simplification.\n4. Be professional and encouraging.\n5. Format the response using Markdown.`;

  // Improved backoff: includes response body when available
  const fetchWithBackoff = async (url, options, retries = 5, delay = 1000) => {
    try {
      const response = await fetch(url, options);
      const text = await response.text();
      let json = null;
      try { json = text ? JSON.parse(text) : null; } catch (e) { /* not JSON */ }

      if (!response.ok) {
        const message = json?.error?.message || json?.message || text || `HTTP ${response.status}`;
        const err = new Error(message);
        err.status = response.status;
        throw err;
      }

      return json;
    } catch (err) {
      if (retries > 0) {
        await new Promise((res) => setTimeout(res, delay));
        return fetchWithBackoff(url, options, retries - 1, delay * 2);
      }
      throw err;
    }
  };

  const handleReview = async () => {
    setIsLoading(true);
    setError('');
    setReview('');

    if (!apiKey) {
      setError('No API key provided. Paste your Gemini API key into the API Key field or set REACT_APP_GEMINI_API_KEY.');
      setIsLoading(false);
      return;
    }

    const userQuery = `Please review the following code:\n\n\n\n${code}`;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      // generationConfig can be tuned
      generationConfig: { temperature: 0.0, maxOutputTokens: 1024 }
    };

    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // API key is sent as query param below; some setups prefer Bearer token if you have one
      },
      body: JSON.stringify(payload)
    };

    try {
      const urlWithKey = `${apiUrl}?key=${encodeURIComponent(apiKey)}`;
      const result = await fetchWithBackoff(urlWithKey, fetchOptions);

      // Defensive extraction
      const candidate = result?.candidates?.[0] || result?.output?.[0] || null;
      const text = candidate?.content?.parts?.[0]?.text || candidate?.content?.[0]?.text || null;

      if (text) {
        setReview(text);
      } else {
        console.error('Unexpected API response:', result);
        setError('Could not parse the review from the API response. Check the console for details.');
      }
    } catch (err) {
      console.error('Error fetching code review:', err);
      setError(`Failed to get review: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white font-sans p-4 md:p-8 gap-8">
      <div className="flex-1 flex flex-col">
        <h1 className="text-3xl font-bold mb-4 text-cyan-400">AI Code Reviewer</h1>
        <p className="mb-4 text-gray-400">Paste your code into the editor and click "Review Code". Provide your Gemini API key below if not using an environment variable.</p>

        <div className="mb-4 flex items-center gap-3">
          <input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Paste Gemini API key (optional if set in env)"
            className="flex-1 p-2 rounded-md bg-gray-800 text-sm text-gray-100 outline-none border border-gray-700"
            type="password"
          />
          <button
            onClick={() => { setApiKey(''); setReview(''); setError(''); }}
            className="px-3 py-2 bg-gray-700 rounded-md text-sm hover:bg-gray-600"
            title="Clear key"
          >
            Clear
          </button>
        </div>

        <div className="flex-1 flex flex-col bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300">Code Editor</div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            className="flex-1 w-full p-4 bg-gray-800 text-gray-200 font-mono text-sm resize-none outline-none focus:ring-2 focus:ring-cyan-500 rounded-b-lg"
            spellCheck="false"
            rows={18}
          />
        </div>

        <button
          onClick={handleReview}
          disabled={isLoading || !code.trim()}
          className={`mt-6 px-6 py-3 rounded-lg font-semibold text-white shadow-lg transition-all duration-300 ease-in-out ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500'} focus:outline-none focus:ring-4 focus:ring-cyan-500 focus:ring-opacity-50`}
        >
          {isLoading ? 'Reviewing...' : 'Review Code'}
        </button>
      </div>

      <div className="flex-1 flex flex-col mt-8 lg:mt-0">
        <h2 className="text-2xl font-bold mb-4 text-gray-300">Review Feedback</h2>
        <div className="flex-1 bg-gray-800 rounded-lg shadow-xl p-6 overflow-y-auto">
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {!error && review && (
            <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-headings:text-cyan-400 prose-code:text-yellow-300 prose-a:text-cyan-400 prose-strong:text-white">
              <SimpleMarkdownRenderer content={review} />
            </div>
          )}

          {!isLoading && !error && !review && (
            <div className="text-gray-500 text-center flex flex-col items-center justify-center h-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M12 21v-1m0-16a1 1 0 00-1 1v16a1 1 0 002 0V4a1 1 0 00-1-1z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 10h6M9 14h6" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.761 0 5 2.239 5 5v8c0 2.761-2.239 5-5 5s-5-2.239-5-5V8c0-2.761 2.239-5 5-5z" />
              </svg>
              Your code review will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// --------------------
// Lightweight Markdown renderer (safe, dependency-free)
// - Supports headings (#, ##, ###), lists (-, *, 1.), code fences (```), inline code (`), bold (**), italic (*), and paragraphs.
// - Implemented without mutating React elements.
// --------------------
function SimpleMarkdownRenderer({ content }) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeBlockLang = '';
  let codeBlockContent = [];
  let listBuffer = null; // { type: 'ul'|'ol', items: [] }

  const flushList = () => {
    if (listBuffer) {
      const children = listBuffer.items.map((item, i) => <li key={i}><InlineText text={item} /></li>);
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc pl-6 my-2 space-y-1">{children}</ul>
      );
      listBuffer = null;
    }
  };

  lines.forEach((rawLine, idx) => {
    const line = rawLine;

    // Code fence start/end
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // end
        elements.push(
          <pre key={`code-${idx}`} className="bg-gray-900 p-4 rounded-md text-sm my-4 overflow-x-auto"><code>{codeBlockContent.join('\n')}</code></pre>
        );
        codeBlockContent = [];
        inCodeBlock = false;
        codeBlockLang = '';
      } else {
        inCodeBlock = true;
        codeBlockLang = line.replace('```', '').trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      return;
    }

    // Headings
    if (line.startsWith('### ')) { flushList(); elements.push(<h3 key={idx} className="text-lg font-semibold mt-4 mb-2">{line.substring(4)}</h3>); return; }
    if (line.startsWith('## '))  { flushList(); elements.push(<h2 key={idx} className="text-xl font-semibold mt-6 mb-3 border-b border-gray-700 pb-1">{line.substring(3)}</h2>); return; }
    if (line.startsWith('# '))   { flushList(); elements.push(<h1 key={idx} className="text-2xl font-bold mt-8 mb-4 border-b-2 border-gray-600 pb-2">{line.substring(2)}</h1>); return; }

    // Lists
    const listMatch = line.match(/^(\s*)([-*]|(\d+)\.)\s+(.*)/);
    if (listMatch) {
      const itemText = listMatch[4];
      if (!listBuffer) {
        listBuffer = { type: listMatch[2].endsWith('.') ? 'ol' : 'ul', items: [] };
      }
      listBuffer.items.push(itemText);
      return;
    }

    // Blank line: paragraph break
    if (line.trim() === '') {
      flushList();
      elements.push(<br key={`br-${idx}`} />);
      return;
    }

    // Regular paragraph
    flushList();
    elements.push(<p key={idx}><InlineText text={line} /></p>);
  });

  // flush leftover
  if (inCodeBlock) {
    elements.push(
      <pre key={`code-end`} className="bg-gray-900 p-4 rounded-md text-sm my-4 overflow-x-auto"><code>{codeBlockContent.join('\n')}</code></pre>
    );
  }
  flushList();

  return <>{elements}</>;
}

// Inline renderer for **bold**, *italic*, and `code`
function InlineText({ text }) {
  const parts = [];
  let lastIndex = 0;
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) parts.push(text.slice(lastIndex, m.index));
    const token = m[0];
    if (token.startsWith('`')) {
      parts.push(<code key={parts.length} className="bg-gray-700 text-yellow-300 px-1.5 py-0.5 rounded-md text-sm">{token.slice(1, -1)}</code>);
    } else if (token.startsWith('**')) {
      parts.push(<strong key={parts.length}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('*')) {
      parts.push(<em key={parts.length}>{token.slice(1, -1)}</em>);
    }
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return <>{parts.map((p, i) => typeof p === 'string' ? <span key={i}>{p}</span> : <React.Fragment key={i}>{p}</React.Fragment>)}</>;
}
