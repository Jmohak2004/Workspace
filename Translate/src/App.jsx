import { useState } from "react";
import "./App.css";

// Available languages (code → display name)
const languages = {
  hi: "Hindi",
  es: "Spanish",
  fr: "French",
  de: "German",
  ja: "Japanese",
  zh: "Chinese",
};

const TranslationCard = ({ original, translated, lang }) => {
  return (
    <div className="card">
      <h3>Translation ({languages[lang]})</h3>
      <p className="original"><b>Original:</b> {original}</p>
      <p className="translated"><b>Translated:</b> {translated}</p>
    </div>
  );
};

function App() {
  const [input, setInput] = useState("");
  const [targetLang, setTargetLang] = useState("hi");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          input
        )}&langpair=en|${targetLang}`
      );
      const data = await res.json();
      const translatedText = data.responseData.translatedText;

      setResult({ original: input, translated: translatedText, lang: targetLang });
    } catch (error) {
      setResult({ original: input, translated: "⚠️ Error translating", lang: targetLang });
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <h1 className="title">🌍 Universal Translator</h1>

      <div className="input-box">
        <textarea
          rows="3"
          placeholder="Enter text in English..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="controls">
          <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
            {Object.entries(languages).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
          <button onClick={handleTranslate} disabled={loading}>
            {loading ? "Translating..." : "Translate"}
          </button>
        </div>
      </div>

      {result && <TranslationCard {...result} />}
    </div>
  );
}

export default App;
