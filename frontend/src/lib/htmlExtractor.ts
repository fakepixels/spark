/**
 * Extract HTML content from Claude's response
 * Looks for HTML starting with <!DOCTYPE html> or <html>
 */
export function extractHTML(text: string): string | null {
  // Look for HTML document markers
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
 */
export function containsHTML(text: string): boolean {
  return text.includes('<!DOCTYPE html>') || text.includes('<html>');
}
