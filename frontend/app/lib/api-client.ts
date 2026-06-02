import { RateLimiter } from "./utils";

const globalRateLimiter = new RateLimiter({
  maxConcurrent: 5,
  maxPerWindow: 20,
  windowMs: 1000,
});

export async function rateLimitedFetch(
  url: string,
  options?: RequestInit
): Promise<Response> {
  return globalRateLimiter.execute(() => fetch(url, options));
}

export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await rateLimitedFetch(url, options);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
