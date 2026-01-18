# 🔑 unlimit-keys

## **Never get blocked by rate limits again!** 

Tired of hitting "Rate Limit Exceeded" errors? Use this tool to automatically rotate between your API keys. It picks the best key every time you make a request - so you can use AI services (Google Gemini, Groq, OpenAI, and more) without worrying about limits!

## **What you get:**
- 🚀 Use APIs 3x more (with 3 keys), 10x more (with 10 keys), etc.
- 🔄 Automatic key rotation - no manual switching
- ✅ Works with ANY API (AI, weather, payment, search, etc.)
- ⚡ Super fast - handles thousands of requests per second
- 🔒 Works perfectly with serverless apps and high-traffic services

## Quick Start 🚀

### Installation

**Using npm:**
```bash
npm install unlimit-keys
```

**Using pnpm:**
```bash
pnpm add unlimit-keys
```

## Setup

### 1. Get Redis (Free!) 🗄️

We use [Upstash Redis](https://upstash.com/) - it's free and perfect for this. Follow their setup guide to get your Redis URL and token.

Create a `.env.local` file with your keys:

```env
# Upstash Redis (get from https://upstash.com - it's free!)
REDIS_URL=https://your-redis-url.upstash.io
REDIS_TOKEN=your-token

# Your API keys (comma or newline separated)
API_KEYS="key1,key2,key3"
```

### 2. Save Your Keys 📝

Run this once to save all your keys to Redis:

**Using npm:**
```bash
npx unlimit-keys sync
```

**Using pnpm:**
```bash
pnpm dlx unlimit-keys sync
```

## How to Use It

### Option 1: In Your Code 💻

```typescript
import { getLeastUsedKey } from 'unlimit-keys';

// Get the best key to use right now
const apiKey = await getLeastUsedKey();

// Use it with your AI service
const response = await fetch('https://api.example.com/chat', {
  headers: { 'Authorization': \`Bearer \${apiKey}\` }
});
```

### Option 2: Command Line 📱

```bash
# Get a key via command line
npx unlimit-keys get-key
```

## Real Examples 📚

### Using with Google Gemini 🤖

```typescript
import { getLeastUsedKey } from 'unlimit-keys';

async function askGemini(question: string) {
  const apiKey = await getLeastUsedKey();
  
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: question }] }]
    })
  });
  
  return response.json();
}

// Use many times without rate limits!
await askGemini('What is AI?');
await askGemini('How do I code?');
```

### Using with Groq ⚡

```typescript
import { getLeastUsedKey } from 'unlimit-keys';
import Groq from 'groq-sdk';

async function askGroq(question: string) {
  const apiKey = await getLeastUsedKey();
  
  const client = new Groq({ apiKey });
  const message = await client.messages.create({
    model: 'mixtral-8x7b-32768',
    max_tokens: 1024,
    messages: [{ role: 'user', content: question }]
  });
  
  return message;
}

await askGroq('Tell me a joke');
```

### Using with Google AI SDK 🎯

```typescript
import { getLeastUsedKey } from 'unlimit-keys';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function askWithSDK(question: string) {
  const apiKey = await getLeastUsedKey();
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const result = await model.generateContent(question);
  
  return result.response.text();
}

await askWithSDK('What is machine learning?');
```

### Using with Regular APIs 🌍

Not just for AI! Works with any API that uses keys. Here's an example with a weather API:

```typescript
import { getLeastUsedKey } from 'unlimit-keys';

async function getWeather(city: string) {
  const apiKey = await getLeastUsedKey();
  
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`, {
    method: 'GET'
  });
  
  return response.json();
}

// Make lots of weather requests without hitting rate limits!
await getWeather('London');
await getWeather('New York');
await getWeather('Tokyo');
```

## Supported Services 🌐

**AI & ML Services:**
- 🤖 [Google Gemini](https://ai.google.dev/)
- ⚡ [Groq](https://www.groq.com/)
- 🧠 [OpenAI](https://openai.com/)
- 🤖 [Anthropic Claude](https://www.anthropic.com/)

**Other APIs:**
- Weather APIs
- Payment APIs
- Search APIs
- Translation APIs
- And literally any API that uses keys!

**Works with anything that has API rate limits!**

## How It Works Behind the Scenes 🔧

1. **You have multiple keys** - Like 3 API keys
2. **We pick the best one** - We use the key that's been used the least recently
3. **We use it** - You make your API call
4. **We update the score** - We mark that key as just-used so we don't pick it again
5. **Repeat!** - Next time you call us, we pick a different key

This spreads out your requests so you hit rate limits slower!

## License

MIT
