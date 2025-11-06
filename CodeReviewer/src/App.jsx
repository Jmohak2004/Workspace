import React, { useState } from 'react';

/**
 * App Component
 * * This is the main component for the AI Code Reviewer application.
 * It provides a user interface to input code, send it to the Gemini API
 * for review, and display the feedback.
 */
export default function App() {
  // State for the code input by the user
  const [code, setCode] = useState(`function helloWorld() {\n  console.log("Hello, World!");\n}`);
  // State for the review feedback received from the API
  const [review, setReview] = useState('');
  // State to manage loading status during API calls
  const [isLoading, setIsLoading] = useState(false);
  // State to store any error messages
  const [error, setError] = useState('');

  // --- API Configuration ---

  // The Gemini model to use
  const model = "gemini-2.5-flash-preview-09-2025";
  
  // NOTE: The API key is intentionally left as an empty string.
  // The environment will automatically provide the key.
  const apiKey = "AIzaSyBowTqk1yqYM3tYVuMs-yQLG5V2weSilTE"; 
  
  // The API endpoint for the Gemini model
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // System instruction to guide the AI's behavior
  const systemPrompt = `
    You are an expert code reviewer. Your task is to analyze the user's code
    and provide constructive feedback.
    
    Follow these rules:
    1.  **Be specific:** Point out exact line numbers or code snippets.
    2.  **Be constructive:** Explain *why* something is an issue and suggest a better alternative.
    3.  **Be comprehensive:** Cover potential bugs, style violations, security vulnerabilities, 
        performance bottlenecks, and areas for simplification or improvement.
    4.  **Be professional:** Maintain a helpful and encouraging tone.
    5.  **Format:** Use Markdown for clear formatting. Use bullet points or numbered lists
        for individual feedback items.
  `;

  /**
   * Fetches data from the API with exponential backoff for retries.
   * This handles rate limiting and transient network errors gracefully.
   * * @param {string} url - The API endpoint to fetch.
   * @param {object} options - The request options (method, headers, body).
   * @param {number} [retries=5] - The number of retry attempts.
   * @param {number} [delay=1000] - The initial delay in ms before retrying.
   * @returns {Promise<object>} - The JSON response from the API.
   */
  const fetchWithBackoff = async (url, options, retries = 5, delay = 1000) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        // Throw an error to be caught by the catch block
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      if (retries > 0) {
        // Wait for the specified delay
        await new Promise(res => setTimeout(res, delay));
        // Recursively call with one less retry and double the delay
        return fetchWithBackoff(url, options, retries - 1, delay * 2);
      } else {
        // No retries left, re-throw the last error
        throw err;
      }
    }
  };

  /**
   * Handles the "Review Code" button click.
   * This function prepares and sends the request to the Gemini API.
   */
  const handleReview = async () => {
    // Reset states
    setIsLoading(true);
    setError('');
    setReview('');

    // --- Payload Construction ---
    const userQuery = `
      Please review the following code:
      
      \`\`\`
      ${code}
      \`\`\`
    `;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        // Optional: configure temperature, max tokens, etc.
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    };

    const fetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    };

    // --- API Call ---
    try {
      const result = await fetchWithBackoff(apiUrl, fetchOptions);

      // Extract text from the API response
      const candidate = result.candidates?.[0];
      const text = candidate?.content?.parts?.[0]?.text;

      if (text) {
        setReview(text);
      } else {
        // Handle cases where the response structure is unexpected
        console.error("Unexpected API response structure:", result);
        setError("Could not parse the review from the API response. Check the console for details.");
      }
    } catch (err) {
      console.error("Error fetching code review:", err);
      setError(`Failed to get review. ${err.message}. Please check your network connection and try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white font-sans p-4 md:p-8 gap-8">
      
      {/* --- Left Panel: Code Input --- */}
      <div className="flex-1 flex flex-col">
        <h1 className="text-3xl font-bold mb-4 text-cyan-400">AI Code Reviewer</h1>
        <p className="mb-4 text-gray-400">
          Paste your code into the editor below and click "Review Code" to get
          instant feedback from the Gemini AI.
        </p>
        
        <div className="flex-1 flex flex-col bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300">
            Code Editor
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            className="flex-1 w-full p-4 bg-gray-800 text-gray-200 font-mono text-sm resize-none outline-none focus:ring-2 focus:ring-cyan-500 rounded-b-lg"
            spellCheck="false"
          />
        </div>
        
        <button
          onClick={handleReview}
          disabled={isLoading || !code.trim()}
          className={`
            mt-6 px-6 py-3 rounded-lg font-semibold text-white shadow-lg
            transition-all duration-300 ease-in-out
            ${isLoading 
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed'
            }
            focus:outline-none focus:ring-4 focus:ring-cyan-500 focus:ring-opacity-50
          `}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Reviewing...
            </div>
          ) : (
            'Review Code'
          )}
        </button>
      </div>

      {/* --- Right Panel: Review Output --- */}
      <div className="flex-1 flex flex-col mt-8 lg:mt-0">
        <h2 className="text-2xl font-bold mb-4 text-gray-300">Review Feedback</h2>
        
        <div className="flex-1 bg-gray-800 rounded-lg shadow-xl p-6 overflow-y-auto">
          {/* Error Message Display */}
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Review Display */}
          {!error && review && (
            <div 
              className="prose prose-invert prose-sm md:prose-base max-w-none 
                         prose-headings:text-cyan-400 prose-code:text-yellow-300 
                         prose-a:text-cyan-400 prose-strong:text-white"
            >
              {/* We use a simple regex-based Markdown-to-JSX converter 
                to avoid heavy dependencies like react-markdown.
              */}
              <SimpleMarkdownRenderer content={review} />
            </div>
          )}

          {/* Placeholder / Initial State */}
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

/**
 * SimpleMarkdownRenderer Component
 * * A lightweight component to render basic Markdown elements
 * (like lists, bold, and code blocks) as React elements.
 * This avoids the need for a full Markdown parsing library.
 */
function SimpleMarkdownRenderer({ content }) {
  // Split content by lines
  const lines = content.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeBlockContent = [];
  let inList = false;

  lines.forEach((line, index) => {
    // --- Code Blocks (```) ---
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        elements.push(
          <pre key={`code-${index}`} className="bg-gray-900 p-4 rounded-md text-sm my-4 overflow-x-auto">
            <code>{codeBlockContent.join('\n')}</code>
          </pre>
        );
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        // Start of code block
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      return;
    }
    
    // --- Headings (##, ###) ---
    if (line.startsWith('### ')) {
      elements.push(<h3 key={index} className="text-lg font-semibold mt-4 mb-2">{line.substring(4)}</h3>);
      return;
    }
    if (line.startsWith('## ')) {
      elements.push(<h2 key={index} className="text-xl font-semibold mt-6 mb-3 border-b border-gray-700 pb-1">{line.substring(3)}</h2>);
      return;
    }
    if (line.startsWith('# ')) {
      elements.push(<h1 key={index} className="text-2xl font-bold mt-8 mb-4 border-b-2 border-gray-600 pb-2">{line.substring(2)}</h1>);
      return;
    }

    // --- Lists (*, -, 1.) ---
    const isListItem = line.match(/^(\s*)(\*|-|\d+\.)\s+(.*)/);
    if (isListItem) {
      if (!inList) {
        // Start a new list
        elements.push(<ul key={`list-start-${index}`} className="list-disc pl-6 my-2 space-y-1"></ul>);
        inList = true;
      }
      // Add list item to the last element (which must be the <ul>)
      const listContent = <SimpleMarkdownLine content={isListItem[3]} />;
      elements[elements.length - 1].props.children.push(<li key={index}>{listContent}</li>);
      return;
    }
    
    // If we are out of a list, set inList to false
    if (!isListItem) {
      inList = false;
    }

    // --- Paragraphs ---
    if (line.trim() === '') {
      elements.push(<br key={`br-${index}`} />);
    } else {
      elements.push(<p key={index}><SimpleMarkdownLine content={line} /></p>);
    }
  });

  // Handle unclosed code block at the end
  if (inCodeBlock) {
    elements.push(
      <pre key="code-end" className="bg-gray-900 p-4 rounded-md text-sm my-4 overflow-x-auto">
        <code>{codeBlockContent.join('\n')}</code>
      </pre>
    );
  }

  return <>{elements}</>;
}

/**
 * SimpleMarkdownLine Component
 * * Renders inline Markdown elements like **bold** and `code`.
 */
function SimpleMarkdownLine({ content }) {
  // Regex to find **bold**, *italic*, and `code`
  const regex = /(\*\*)(.*?)\1|(\*)(.*?)\3|(`)(.*?)\5/g;
  const parts = content.split(regex);
  
  return parts.filter(Boolean).map((part, index) => {
    if (part === '**') return null; // Skip markdown markers
    if (part === '*') return null;
    if (part === '`') return null;

    const prevPart = parts[index - 1];
    if (prevPart === '**') {
      return <strong key={index}>{part}</strong>;
    }
    if (prevPart === '*') {
      return <em key={index}>{part}</em>;
    }
    if (prevPart === '`') {
      return <code key={index} className="bg-gray-700 text-yellow-300 px-1.5 py-0.5 rounded-md text-sm">{part}</code>;
    }

    // Check if the part *before* this one was a marker
    const beforePrevPart = parts[index - 2];
    if (beforePrevPart === '**' || beforePrevPart === '*' || beforePrevPart === '`') {
      return null;
    }

    return <span key={index}>{part}</span>;
  });
}