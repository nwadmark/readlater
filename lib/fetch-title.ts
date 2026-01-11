/**
 * Fetches the <title> tag from a URL with timeout and error handling
 *
 * @param url - The URL to fetch the title from
 * @param timeoutMs - Timeout in milliseconds (default: 5000)
 * @returns The page title or null if fetching fails
 */
export async function fetchPageTitle(url: string, timeoutMs: number = 5000): Promise<string | null> {
  try {
    // Validate URL
    const parsedUrl = new URL(url);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      console.log(`[fetchPageTitle] Invalid protocol for ${url}`);
      return null;
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      // Fetch the page with timeout and common headers to avoid blocking
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ReadLater/1.0; +http://readlater.app)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
        },
        // Follow redirects automatically
        redirect: 'follow',
        // Limit to 10 redirects
        // @ts-ignore - Next.js fetch supports this but TypeScript doesn't know
        follow: 10,
      });

      clearTimeout(timeoutId);

      // Check if response is ok
      if (!response.ok) {
        console.log(`[fetchPageTitle] HTTP ${response.status} for ${url}`);
        return null;
      }

      // Check content type - only process HTML
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('text/html')) {
        console.log(`[fetchPageTitle] Non-HTML content type (${contentType}) for ${url}`);
        return null;
      }

      // Get the HTML content
      const html = await response.text();

      // Extract title using regex
      // This handles various cases: <title>, <TITLE>, with attributes, etc.
      const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);

      if (titleMatch && titleMatch[1]) {
        // Clean up the title: decode HTML entities, trim whitespace, normalize spaces
        let title = titleMatch[1]
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();

        // Decode common HTML entities
        title = title
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'")
          .replace(/&nbsp;/g, ' ');

        // Return title if it's not empty after cleaning
        if (title.length > 0) {
          console.log(`[fetchPageTitle] Found title for ${url}: "${title}"`);
          return title;
        }
      }

      console.log(`[fetchPageTitle] No title tag found for ${url}`);
      return null;

    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      if (fetchError.name === 'AbortError') {
        console.log(`[fetchPageTitle] Timeout (${timeoutMs}ms) fetching ${url}`);
      } else {
        console.log(`[fetchPageTitle] Fetch error for ${url}:`, fetchError.message);
      }
      return null;
    }

  } catch (error: any) {
    // URL parsing or other errors
    console.log(`[fetchPageTitle] Error for ${url}:`, error.message);
    return null;
  }
}
