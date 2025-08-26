// "use client"

// import { useState, useEffect } from "react"
// import "./currency-converter.css"

// const POPULAR_CURRENCIES = [
//   { code: "USD", name: "US Dollar", flag: "🇺🇸" },
//   { code: "EUR", name: "Euro", flag: "🇪🇺" },
//   { code: "GBP", name: "British Pound", flag: "🇬🇧" },
//   { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
//   { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
//   { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
//   { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
//   { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
// ]

// const ALL_CURRENCIES = [
//   { code: "USD", name: "US Dollar", flag: "🇺🇸" },
//   { code: "EUR", name: "Euro", flag: "🇪🇺" },
//   { code: "GBP", name: "British Pound", flag: "🇬🇧" },
//   { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
//   { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
//   { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
//   { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
//   { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
//   { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
//   { code: "KRW", name: "South Korean Won", flag: "🇰🇷" },
//   { code: "BRL", name: "Brazilian Real", flag: "🇧🇷" },
//   { code: "MXN", name: "Mexican Peso", flag: "🇲🇽" },
//   { code: "RUB", name: "Russian Ruble", flag: "🇷🇺" },
//   { code: "ZAR", name: "South African Rand", flag: "🇿🇦" },
//   { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
//   { code: "NOK", name: "Norwegian Krone", flag: "🇳🇴" },
//   { code: "SEK", name: "Swedish Krona", flag: "🇸🇪" },
//   { code: "DKK", name: "Danish Krone", flag: "🇩🇰" },
//   { code: "PLN", name: "Polish Zloty", flag: "🇵🇱" },
//   { code: "CZK", name: "Czech Koruna", flag: "🇨🇿" },
//   { code: "HUF", name: "Hungarian Forint", flag: "🇭🇺" },
//   { code: "ILS", name: "Israeli Shekel", flag: "🇮🇱" },
//   { code: "AED", name: "UAE Dirham", flag: "🇦🇪" },
//   { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦" },
//   { code: "THB", name: "Thai Baht", flag: "🇹🇭" },
//   { code: "MYR", name: "Malaysian Ringgit", flag: "🇲🇾" },
//   { code: "PHP", name: "Philippine Peso", flag: "🇵🇭" },
//   { code: "IDR", name: "Indonesian Rupiah", flag: "🇮🇩" },
//   { code: "VND", name: "Vietnamese Dong", flag: "🇻🇳" },
//   { code: "TRY", name: "Turkish Lira", flag: "🇹🇷" },
//   { code: "EGP", name: "Egyptian Pound", flag: "🇪🇬" },
//   { code: "NGN", name: "Nigerian Naira", flag: "🇳🇬" },
//   { code: "KES", name: "Kenyan Shilling", flag: "🇰🇪" },
//   { code: "GHS", name: "Ghanaian Cedi", flag: "🇬🇭" },
//   { code: "MAD", name: "Moroccan Dirham", flag: "🇲🇦" },
//   { code: "TND", name: "Tunisian Dinar", flag: "🇹🇳" },
//   { code: "DZD", name: "Algerian Dinar", flag: "🇩🇿" },
//   { code: "LYD", name: "Libyan Dinar", flag: "🇱🇾" },
//   { code: "ETB", name: "Ethiopian Birr", flag: "🇪🇹" },
//   { code: "UGX", name: "Ugandan Shilling", flag: "🇺🇬" },
//   { code: "TZS", name: "Tanzanian Shilling", flag: "🇹🇿" },
//   { code: "ZMW", name: "Zambian Kwacha", flag: "🇿🇲" },
//   { code: "BWP", name: "Botswana Pula", flag: "🇧🇼" },
//   { code: "MUR", name: "Mauritian Rupee", flag: "🇲🇺" },
//   { code: "SCR", name: "Seychellois Rupee", flag: "🇸🇨" },
//   { code: "MZN", name: "Mozambican Metical", flag: "🇲🇿" },
//   { code: "AOA", name: "Angolan Kwanza", flag: "🇦🇴" },
//   { code: "NAD", name: "Namibian Dollar", flag: "🇳🇦" },
//   { code: "SZL", name: "Swazi Lilangeni", flag: "🇸🇿" },
//   { code: "LSL", name: "Lesotho Loti", flag: "🇱🇸" },
//   { code: "GMD", name: "Gambian Dalasi", flag: "🇬🇲" },
//   { code: "SLL", name: "Sierra Leonean Leone", flag: "🇸🇱" },
//   { code: "LRD", name: "Liberian Dollar", flag: "🇱🇷" },
//   { code: "GNF", name: "Guinean Franc", flag: "🇬🇳" },
//   { code: "CDF", name: "Congolese Franc", flag: "🇨🇩" },
//   { code: "RWF", name: "Rwandan Franc", flag: "🇷🇼" },
//   { code: "BIF", name: "Burundian Franc", flag: "🇧🇮" },
//   { code: "DJF", name: "Djiboutian Franc", flag: "🇩🇯" },
//   { code: "SOS", name: "Somali Shilling", flag: "🇸🇴" },
//   { code: "ERN", name: "Eritrean Nakfa", flag: "🇪🇷" },
//   { code: "SDG", name: "Sudanese Pound", flag: "🇸🇩" },
//   { code: "SSP", name: "South Sudanese Pound", flag: "🇸🇸" },
//   { code: "CFA", name: "CFA Franc", flag: "🌍" },
//   { code: "XOF", name: "West African CFA Franc", flag: "🌍" },
//   { code: "XAF", name: "Central African CFA Franc", flag: "🌍" },
//   { code: "KMF", name: "Comorian Franc", flag: "🇰🇲" },
//   { code: "MGA", name: "Malagasy Ariary", flag: "🇲🇬" },
//   { code: "CVE", name: "Cape Verdean Escudo", flag: "🇨🇻" },
//   { code: "STN", name: "São Tomé and Príncipe Dobra", flag: "🇸🇹" },
//   { code: "XPF", name: "CFP Franc", flag: "🇵🇫" },
//   { code: "FJD", name: "Fijian Dollar", flag: "🇫🇯" },
//   { code: "PGK", name: "Papua New Guinean Kina", flag: "🇵🇬" },
//   { code: "SBD", name: "Solomon Islands Dollar", flag: "🇸🇧" },
//   { code: "VUV", name: "Vanuatu Vatu", flag: "🇻🇺" },
//   { code: "WST", name: "Samoan Tala", flag: "🇼🇸" },
//   { code: "TOP", name: "Tongan Paʻanga", flag: "🇹🇴" },
//   { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿" },
//   { code: "TVD", name: "Tuvaluan Dollar", flag: "🇹🇻" },
//   { code: "KID", name: "Kiribati Dollar", flag: "🇰🇮" },
//   { code: "NRU", name: "Nauruan Dollar", flag: "🇳🇷" },
//   { code: "MOP", name: "Macanese Pataca", flag: "🇲🇴" },
//   { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰" },
//   { code: "TWD", name: "New Taiwan Dollar", flag: "🇹🇼" },
//   { code: "KPW", name: "North Korean Won", flag: "🇰🇵" },
//   { code: "MNT", name: "Mongolian Tugrik", flag: "🇲🇳" },
//   { code: "LAK", name: "Lao Kip", flag: "🇱🇦" },
//   { code: "KHR", name: "Cambodian Riel", flag: "🇰🇭" },
//   { code: "MMK", name: "Myanmar Kyat", flag: "🇲🇲" },
//   { code: "BDT", name: "Bangladeshi Taka", flag: "🇧🇩" },
//   { code: "BTN", name: "Bhutanese Ngultrum", flag: "🇧🇹" },
//   { code: "NPR", name: "Nepalese Rupee", flag: "🇳🇵" },
//   { code: "LKR", name: "Sri Lankan Rupee", flag: "🇱🇰" },
//   { code: "MVR", name: "Maldivian Rufiyaa", flag: "🇲🇻" },
//   { code: "PKR", name: "Pakistani Rupee", flag: "🇵🇰" },
//   { code: "AFN", name: "Afghan Afghani", flag: "🇦🇫" },
//   { code: "IRR", name: "Iranian Rial", flag: "🇮🇷" },
//   { code: "IQD", name: "Iraqi Dinar", flag: "🇮🇶" },
//   { code: "SYP", name: "Syrian Pound", flag: "🇸🇾" },
//   { code: "LBP", name: "Lebanese Pound", flag: "🇱🇧" },
//   { code: "JOD", name: "Jordanian Dinar", flag: "🇯🇴" },
//   { code: "KWD", name: "Kuwaiti Dinar", flag: "🇰🇼" },
//   { code: "BHD", name: "Bahraini Dinar", flag: "🇧🇭" },
//   { code: "QAR", name: "Qatari Riyal", flag: "🇶🇦" },
//   { code: "OMR", name: "Omani Rial", flag: "🇴🇲" },
//   { code: "YER", name: "Yemeni Rial", flag: "🇾🇪" },
//   { code: "UZS", name: "Uzbekistani Som", flag: "🇺🇿" },
//   { code: "KZT", name: "Kazakhstani Tenge", flag: "🇰🇿" },
//   { code: "KGS", name: "Kyrgyzstani Som", flag: "🇰🇬" },
//   { code: "TJS", name: "Tajikistani Somoni", flag: "🇹🇯" },
//   { code: "TMT", name: "Turkmenistani Manat", flag: "🇹🇲" },
//   { code: "AZN", name: "Azerbaijani Manat", flag: "🇦🇿" },
//   { code: "GEL", name: "Georgian Lari", flag: "🇬🇪" },
//   { code: "AMD", name: "Armenian Dram", flag: "🇦🇲" },
//   { code: "BYN", name: "Belarusian Ruble", flag: "🇧🇾" },
//   { code: "UAH", name: "Ukrainian Hryvnia", flag: "🇺🇦" },
//   { code: "MDL", name: "Moldovan Leu", flag: "🇲🇩" },
//   { code: "RON", name: "Romanian Leu", flag: "🇷🇴" },
//   { code: "BGN", name: "Bulgarian Lev", flag: "🇧🇬" },
//   { code: "RSD", name: "Serbian Dinar", flag: "🇷🇸" },
//   { code: "MKD", name: "Macedonian Denar", flag: "🇲🇰" },
//   { code: "ALL", name: "Albanian Lek", flag: "🇦🇱" },
//   { code: "BAM", name: "Bosnia-Herzegovina Convertible Mark", flag: "🇧🇦" },
//   { code: "HRK", name: "Croatian Kuna", flag: "🇭🇷" },
//   { code: "ISK", name: "Icelandic Krona", flag: "🇮🇸" },
// ]

// export default function CurrencyConverter() {
//   const [amount, setAmount] = useState("1")
//   const [fromCurrency, setFromCurrency] = useState("USD")
//   const [toCurrency, setToCurrency] = useState("EUR")
//   const [exchangeRate, setExchangeRate] = useState(null)
//   const [convertedAmount, setConvertedAmount] = useState(null)
//   const [lastUpdated, setLastUpdated] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)
//   const [exchangeRates, setExchangeRates] = useState({})

//   useEffect(() => {
//     if (amount && fromCurrency && toCurrency) {
//       convertCurrency()
//     }
//   }, [amount, fromCurrency, toCurrency])

//   const convertCurrency = async () => {
//     if (!amount || amount === "0") return

//     const numAmount = Number.parseFloat(amount)
//     if (isNaN(numAmount)) return

//     if (fromCurrency === toCurrency) {
//       setExchangeRate(1)
//       setConvertedAmount(numAmount)
//       setLastUpdated(new Date().toLocaleTimeString())
//       return
//     }

//     setLoading(true)
//     setError(null)

//     try {
//       const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)

//       if (!response.ok) {
//         throw new Error("Failed to fetch exchange rates")
//       }

//       const data = await response.json()

//       if (!data.rates || !data.rates[toCurrency]) {
//         throw new Error(`Exchange rate not available for ${toCurrency}`)
//       }

//       const rate = data.rates[toCurrency]
//       const converted = numAmount * rate

//       setExchangeRate(rate)
//       setConvertedAmount(converted)
//       setExchangeRates(data.rates)
//       setLastUpdated(new Date().toLocaleTimeString())
//     } catch (err) {
//       console.error("Currency conversion error:", err)
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const swapCurrencies = () => {
//     setFromCurrency(toCurrency)
//     setToCurrency(fromCurrency)
//   }

//   const handleQuickAmount = (value) => {
//     setAmount(value.toString())
//   }

//   const handleAmountChange = (e) => {
//     const value = e.target.value
//     if (value === "" || /^\d*\.?\d*$/.test(value)) {
//       setAmount(value)
//     }
//   }

//   const getChartData = () => {
//     const majorCurrencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY"]

//     if (!exchangeRates || Object.keys(exchangeRates).length === 0) {
//       return []
//     }

//     return majorCurrencies
//       .filter((currency) => currency !== fromCurrency)
//       .map((currency) => {
//         const rate = exchangeRates[currency] || 1
//         const currencyInfo = ALL_CURRENCIES.find((c) => c.code === currency)

//         return {
//           currency: currency,
//           name: currencyInfo?.name || currency,
//           flag: currencyInfo?.flag || "",
//           rate: rate,
//           value: Number.parseFloat(amount || "1") * rate,
//         }
//       })
//       .sort((a, b) => b.rate - a.rate)
//   }

//   return (
//     <div className="currency-converter">
//       <header className="currency-header">
//         <div className="currency-header-container">
//           <h1 className="currency-title">Currency Converter</h1>
//         </div>
//       </header>

//       <main className="currency-main">
//         <div className="currency-content">
//           <div className="currency-card">
//             <div className="currency-form">
//               <div className="currency-input-group">
//                 <label className="currency-label">Amount</label>
//                 <input
//                   type="number"
//                   value={amount}
//                   onChange={handleAmountChange}
//                   placeholder="Enter amount"
//                   className="currency-input"
//                   min="0"
//                   step="0.01"
//                 />
//                 <div className="quick-amounts">
//                   {[1, 10, 100, 1000].map((value) => (
//                     <button key={value} onClick={() => handleQuickAmount(value)} className="quick-amount-btn">
//                       {value}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="currency-grid">
//                 <div className="currency-input-group">
//                   <label className="currency-label">From</label>
//                   <select
//                     value={fromCurrency}
//                     onChange={(e) => setFromCurrency(e.target.value)}
//                     className="currency-select"
//                   >
//                     {ALL_CURRENCIES.map((currency) => (
//                       <option key={currency.code} value={currency.code}>
//                         {currency.flag} {currency.code} - {currency.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="swap-container">
//                   <button onClick={swapCurrencies} className="swap-btn" disabled={loading}>
//                     <span className="swap-icon">⇅</span>
//                   </button>
//                 </div>

//                 <div className="currency-input-group">
//                   <label className="currency-label">To</label>
//                   <select
//                     value={toCurrency}
//                     onChange={(e) => setToCurrency(e.target.value)}
//                     className="currency-select"
//                   >
//                     {ALL_CURRENCIES.map((currency) => (
//                       <option key={currency.code} value={currency.code}>
//                         {currency.flag} {currency.code} - {currency.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {loading && (
//                 <div className="loading-container">
//                   <div className="loading-spinner"></div>
//                   <div className="loading-text">Converting currencies...</div>
//                 </div>
//               )}

//               {error && (
//                 <div className="error-container">
//                   <div className="error-title">Conversion Error</div>
//                   <div className="error-message">{error}</div>
//                   <button onClick={convertCurrency} className="error-retry-btn">
//                     Try Again
//                   </button>
//                 </div>
//               )}

//               {convertedAmount !== null && !loading && !error && (
//                 <div className="result-container">
//                   <div className="result-from">
//                     {Number.parseFloat(amount).toLocaleString()} {fromCurrency} =
//                   </div>
//                   <div className="result-to">
//                     {convertedAmount.toLocaleString(undefined, {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 6,
//                     })}{" "}
//                     {toCurrency}
//                   </div>
//                   {exchangeRate && (
//                     <div className="result-rate">
//                       <span>📈</span>1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}
//                     </div>
//                   )}
//                   {lastUpdated && (
//                     <div className="result-updated">
//                       <span>🕒</span>
//                       Last updated: {lastUpdated}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="currency-card">
//             <h3 className="chart-title">Currency Comparison (1 {fromCurrency} equals)</h3>
//             {loading ? (
//               <div className="chart-loading">
//                 <div className="chart-loading-spinner"></div>
//               </div>
//             ) : getChartData().length > 0 ? (
//               <div className="chart-container">
//                 <div className="chart-bars">
//                   {getChartData().map((data, index) => {
//                     const maxRate = Math.max(...getChartData().map((d) => d.rate))
//                     const barWidth = (data.rate / maxRate) * 100

//                     return (
//                       <div key={data.currency} className="chart-bar-item">
//                         <div className="chart-currency-code">
//                           {data.flag} {data.currency}
//                         </div>
//                         <div className="chart-bar-container">
//                           <div className="chart-bar" style={{ width: `${barWidth}%` }}></div>
//                           <div className="chart-bar-label">{data.rate.toFixed(4)}</div>
//                         </div>
//                         <div className="chart-value">
//                           {data.value.toFixed(2)} {data.currency}
//                         </div>
//                       </div>
//                     )
//                   })}
//                 </div>
//               </div>
//             ) : (
//               <div className="chart-empty">
//                 <div className="chart-empty-content">
//                   <span className="chart-empty-icon">📊</span>
//                   <p className="chart-empty-text">Chart will appear after currency conversion</p>
//                 </div>
//               </div>
//             )}
//             <p className="chart-description">Showing how much 1 {fromCurrency} is worth in other major currencies</p>
//           </div>

//           <div className="currency-card">
//             <h3 className="popular-title">Popular Currencies</h3>
//             <div className="popular-grid">
//               {POPULAR_CURRENCIES.map((currency) => (
//                 <button
//                   key={currency.code}
//                   className="popular-btn"
//                   onClick={() => {
//                     if (fromCurrency === currency.code) {
//                       setToCurrency(currency.code)
//                     } else {
//                       setFromCurrency(currency.code)
//                     }
//                   }}
//                 >
//                   <div className="popular-btn-content">
//                     <div className="popular-currency-code">
//                       {currency.flag} {currency.code}
//                     </div>
//                     <div className="popular-currency-name">{currency.name}</div>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         <footer className="currency-footer"></footer>
//       </main>
//     </div>
//   )
// }
