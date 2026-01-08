const REDACT_KEYWORDS = [
  'password',
  'token',
  'secret',
  'apikey',
  'api-key',
  'key',
  'authorization',
  'cookie',
  'set-cookie',
  'email',
];

function shouldRedactKey(key: string): boolean {
  const normalized = key.toLowerCase();
  return REDACT_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

function redactValue(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item));
  }

  if (typeof value !== 'object') {
    return value;
  }

  const result: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (shouldRedactKey(key)) {
      result[key] = '[REDACTED]';
    } else {
      result[key] = redactValue(entry);
    }
  }

  return result;
}

export function redactLogPayload<T>(payload: T): T {
  return redactValue(payload) as T;
}
