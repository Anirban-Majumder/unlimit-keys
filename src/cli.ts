#!/usr/bin/env node
import { Command } from 'commander';
import { getLeastUsedKey } from './schema/getLeastUsedKey';
import { syncApiKeys } from './scripts/sync-api-keys';

const program = new Command();

program
  .name('unlimit-keys')
  .description('Distributed LRU API key rotation using Redis')
  .version(require('../package.json').version);

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
  .description('Sync API keys from API_KEYS env var to Redis')
  .action(async () => {
    try {
      await syncApiKeys();
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();
