#!/usr/bin/env node
import { Command } from 'commander';
import { getLeastUsedKey } from './schema/getLeastUsedKey';

const program = new Command();

program
  .name('unlimit-keys')
  .description('Distributed LRU API key rotation using Redis')
  .version('0.1.0');

program
  .command('get-key')
  .description('Get the least recently used API key')
  .action(async () => {
    try {
      const key = await getLeastUsedKey();
      console.log(key);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('sync')
  .description('Sync API keys from RU_API_KEYS env var to Redis')
  .action(() => {
    console.log('Please run: npx unlimit-keys sync');
    console.log('Or: node dist/scripts/sync-api-keys.js');
  });

program.parse();
