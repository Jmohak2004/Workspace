import { useState } from "react";
import "./App.css";

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [result, setResult] = useState(null);

  // Mock conversion rates (for demo only)
  const rates = {
    USD: { INR: 83, EUR: 0.92, USD: 1 },
    INR: { USD: 0.012, EUR: 0.011, INR: 1 },
    EUR: { USD: 1.08, INR: 90, EUR: 1 },
  };

  const handleConvert = () => {
    if (rates[fromCurrency] && rates[fromCurrency][toCurrency]) {
      const converted = amount * rates[fromCurrency][toCurrency];
      setResult(converted.toFixed(2));
    } else {
      setResult("Conversion not available");
    }
  };

  return (
    <div className="app">
      <h1>💱 Currency Converter</h1>

      <div className="converter-box">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        >
          <option value="USD">USD</option>
          <option value="INR">INR</option>
          <option value="EUR">EUR</option>
        </select>

        <span>→</span>

        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
        >
          <option value="USD">USD</option>
          <option value="INR">INR</option>
          <option value="EUR">EUR</option>
        </select>

        <button onClick={handleConvert}>Convert</button>
      </div>

      {result && (
        <p className="result">
          {amount} {fromCurrency} = <b>{result} {toCurrency}</b>
        </p>
      )}
    </div>
  );
}

export default App;
