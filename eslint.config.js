// eslint.config.js
import { defineConfig } from 'eslint';

export default defineConfig({
  extends: [
    'eslint:recommended',
    // alte configurări dacă sunt necesare
  ],
  ignores: [
    '**/build/**',
    '**/dist/**',
    '**/*.log',
    '**/*.tmp',
    // alte fișiere sau directoare pe care vrei să le excluzi
  ],
  // alte setări dacă sunt necesare
});
