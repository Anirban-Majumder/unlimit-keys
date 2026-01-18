# unlimit-keys

A generic, distributed API key rotator that uses Redis to select the least recently used (LRU) key from a pool. Ideal for distributing load across multiple API keys to avoid rate limits, regardless of the provider (Google, OpenAI, Anthropic, etc.).

## Installation

```bash
npm install unlimit-keys
```

## Setup

### 1. Environment Variables

Create a `.env.local` file with your Redis credentials and API keys:

```env
# Upstash Redis credentials
REDIS_URL=https://your-redis-url.upstash.io
REDIS_TOKEN=your-token

# Comma-separated or newline-separated API keys
API_KEYS="key1,key2,key3"
```

### 2. Sync Keys to Redis

Run the sync script to load your API keys into the global Redis pool:

```bash
npx unlimit-keys sync
```

## Usage

### Programmatic API

```typescript
import { getLeastUsedKey } from 'unlimit-keys';

// Get the least recently used key
const apiKey = await getLeastUsedKey();
console.log(apiKey);
```

### CLI

```bash
# Get the least recently used key via CLI
npx unlimit-keys get-key
```

## How It Works

1.  **Key Pool**: Keys are stored in a single Redis Sorted Set (`API_KEYS`).
2.  **LRU Rotation**: When you request a key, the library atomically:
    *   Finds the key with the lowest score (oldest usage timestamp).
    *   Updates that key's score to the current timestamp.
    *   Returns the key.
3.  **Concurrency**: Atomic Lua scripts ensure no race conditions, even with high concurrency across serverless functions.

## License

ISC
