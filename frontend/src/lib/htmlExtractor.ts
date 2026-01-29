/**
 * Extract HTML content from Claude's response
 * Looks for HTML starting with <!DOCTYPE html> or <html>
 * Also handles markdown code blocks (```html ... ```)
 */
export function extractHTML(text: string): string | null {
  // First, try to extract from markdown code blocks
  const codeBlockRegex = /```(?:html)?\s*(<!DOCTYPE html>[\s\S]*?<\/html>)\s*```/i;
  const codeBlockMatch = text.match(codeBlockRegex);

  if (codeBlockMatch && codeBlockMatch[1]) {
    return codeBlockMatch[1];
  }

  // Look for HTML document markers directly
  const htmlStart = text.indexOf('<!DOCTYPE html>');

  if (htmlStart !== -1) {
    // Find the closing </html> tag
    const htmlEnd = text.lastIndexOf('</html>');

    if (htmlEnd !== -1) {
      return text.substring(htmlStart, htmlEnd + 7); // +7 for '</html>'
    }
  }

  // Fallback: look for <html> tag
  const altHtmlStart = text.indexOf('<html>');
  if (altHtmlStart !== -1) {
    const altHtmlEnd = text.lastIndexOf('</html>');
    if (altHtmlEnd !== -1) {
      // Prepend DOCTYPE
      return '<!DOCTYPE html>\n' + text.substring(altHtmlStart, altHtmlEnd + 7);
    }
  }

  return null;
}

/**
 * Check if text contains HTML content
 * Also checks for markdown code blocks with HTML
 */
export function containsHTML(text: string): boolean {
  // Check for code blocks with HTML
  if (/```(?:html)?\s*<!DOCTYPE html>/i.test(text)) {
    return true;
  }

  // Check for direct HTML
  return text.includes('<!DOCTYPE html>') || text.includes('<html>');
}
