# 🧬 HealSmart — AI Drug Repurposing & Health Intelligence Platform

> A startup-grade React + Tailwind web application for drug repurposing insights, affordable medicine search, and AI-powered health analysis — powered by OpenRouter.

---

## ⚡ Quick Start (3 steps)

```bash
# 1. Install dependencies
npm install

# 2. Set up the server environment for local API routes
cp .env.example .env
# → Set OPENROUTER_API_KEY in .env (never use a VITE_* key)

# 3. Start the development server
npm start
```

Opens at **http://localhost:3000**

> ✅ Works without an API key using built-in mock data.

---

## 🔌 OpenRouter API Setup

1. Visit **https://openrouter.ai/keys** and create a free account
2. Click **"Create Key"** and copy your API key
3. Open `.env` and set:

```env
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free
```

Or configure it live via the **Settings** page in the app (stored in localStorage).

### Free models to use
| Model ID | Speed | Quality |
|---|---|---|
| `mistralai/mistral-7b-instruct` | Fast | Good |
| `google/gemma-2-9b-it:free` | Fast | Good |
| `meta-llama/llama-3-8b-instruct:free` | Medium | Good |
| `anthropic/claude-3-haiku` | Fast | Excellent (paid) |

---

## 📁 Project Structure

```
healsmart-react/
├── public/
│   └── index.html            ← Google Fonts loaded here
├── src/
│   ├── api/
│   │   └── openrouter.js     ← ALL OpenRouter API calls (core file)
│   ├── components/
│   │   ├── Navbar.jsx        ← Sticky responsive navigation
│   │   ├── Footer.jsx        ← Links, disclaimer, data sources
│   │   ├── Toast.jsx         ← Notification toasts
│   │   ├── AuthModal.jsx     ← Patient + Pharma sign-in modal
│   │   ├── DrugResultCard.jsx← Rich drug insight card component
│   │   └── Feedback.jsx      ← LoadingDots + ErrorBanner
│   ├── data/
│   │   └── mockData.js       ← Drug profiles, health fallbacks, pharma KPIs
│   ├── hooks/
│   │   └── useOpenRouter.js  ← Generic async state hook
│   ├── pages/
│   │   ├── Landing.jsx       ← Full landing page (hero, features, pharma dash)
│   │   ├── UploadReport.jsx  ← B2C health report + biomarker analysis
│   │   ├── DrugInsights.jsx  ← Drug / disease search with AI cards
│   │   └── ApiSettings.jsx   ← OpenRouter key + model configuration
│   ├── utils/
│   │   └── scoreHealth.js    ← Local biomarker risk scoring (no API needed)
│   ├── App.jsx               ← Router + global context (toast, auth, apiKey)
│   ├── index.js              ← React entry point
│   └── index.css             ← CSS variables + global utility classes
├── .env.example              ← Copy to .env
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🔑 Key API Functions (`src/api/openrouter.js`)

```js
// Core call — use for any custom prompt
callOpenRouter(systemPrompt, userMessage, apiKey)

// Health biomarker analysis → structured JSON risk assessment
analyseHealthReport({ glucose, cholesterol, bp, bmi, hba1c, age, notes }, apiKey)

// Drug / disease search → array of repurposing intelligence cards
searchDrugInsight(query, apiKey)

// Short plain-text explanation of any drug / concept
explainConcept(concept, apiKey)
```

---

## 🏗️ Scaling to Production

## 🚀 Vercel Deployment

The Vercel production root serves `heal.html`, the HealSmart landing and portal experience. The
research workspace is available at `/research`. Both pages are built by Vite, and all AI requests
go through the same-origin `/api/chat` serverless function. The OpenRouter key is server-only.

In Vercel, add `OPENROUTER_API_KEY` and optionally `OPENROUTER_MODEL`, `OPENROUTER_SITE_URL`, and
`OPENROUTER_SITE_NAME` under Project Settings → Environment Variables. Never commit `.env`.

For local development, use `npm install` and `npm run dev`; the static pages work at `/heal.html`,
but `/api/chat` is provided by Vercel in production (or `vercel dev` locally).

| Feature | Stack |
|---|---|
| Auth | Clerk or Auth0 |
| Database | PostgreSQL + Prisma |
| Backend | FastAPI (Python) or Express |
| Real drug data | ChEMBL API + OpenTargets |
| Jan Aushadhi data | PMJAY portal API |
| Deployment | Vercel (frontend) + Railway (backend) |
| Payments (pharma tier) | Stripe |

---

## ⚕️ Medical Disclaimer

HealSmart provides educational and research-based insights only. It does **not** prescribe medication, provide diagnoses, or substitute professional medical advice. Always consult a licensed healthcare professional.

---

## 📄 License
MIT — build something great.
