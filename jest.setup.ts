import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Provide TextEncoder/TextDecoder
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

// Mock fetch for RTK Query
global.fetch =
  global.fetch ||
  (jest.fn(() =>
    Promise.resolve(
      new Response(JSON.stringify({}), {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
  ) as unknown as typeof fetch);

// Mock import.meta.env for Vite
(global as any).importMeta = {
  env: {
    VITE_API_URL: 'https://chatty-server-uhm7.onrender.com',
  },
};
