// Modifiable failure rate for simulating networkerrors.
export const FAILURE_RATE = 0.3;

const PROFILE_URL = '/api/profile';

let storedProfile = null;
let originalFetch = null;

function generateAbortError() {
  const error = new Error('Aborted');
  error.name = 'AbortError';
  return error;
}

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(generateAbortError());
      return;
    }

    const onAbort = () => {
      clearTimeout(timeoutId);
      reject(generateAbortError());
    };

    const timeoutId = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);

    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

// Mocked fetch function simulating network latency (300-800ms), with a chance to fail.
async function mockFetch(input, init = {}) {
  const url = input;

  if (url !== PROFILE_URL) {
    return originalFetch(input, init);
  }

  const signal = init.signal;
  const latency = 300 + Math.floor(Math.random() * 500);
  await wait(latency, signal);

  if (Math.random() < FAILURE_RATE) {
    return new Response(JSON.stringify({ message: 'Failed to save profile' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const profile = JSON.parse(init.body);
  storedProfile = { ...profile, skills: [...(profile.skills || [])] };

  return new Response(JSON.stringify(storedProfile), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function installFetchWrapper() {
  if (originalFetch) return;
  originalFetch = window.fetch.bind(window);
  window.fetch = mockFetch;
}
