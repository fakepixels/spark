export function getStyleGenerationPrompt(purpose: string, mood: string): string {
  return `You are a creative presentation designer. Generate JavaScript code that returns an array of 3 distinct HTML style previews for title slides.

CONTEXT:
- Presentation purpose: ${purpose}
- Desired mood: ${mood}

REQUIREMENTS:
1. Generate CODE that returns an array of 3 HTML strings
2. Each preview should be a complete HTML title slide (single slide only)
3. Each must have:
   - Unique typography (use fonts from Fontshare or Google Fonts)
   - Distinctive color palette (avoid generic purple gradients!)
   - Characteristic animations (CSS @keyframes)
   - Memorable aesthetic

4. Avoid "AI slop" aesthetics:
   - NO purple gradients on white
   - NO Inter, Roboto, or system fonts (use unique fonts!)
   - NO generic blue (#007bff)
   - NO predictable fade-ins

5. Each preview should be 300-500 lines of HTML with inline CSS
6. Include proper metadata in each: name, description

STYLE VARIETY:
- Style 1: Bold and modern (e.g., "Dark Executive" - dark bg, gold accents, Cormorant Garamond)
- Style 2: Clean and minimal (e.g., "Swiss Minimal" - white, black, one accent color, Helvetica)
- Style 3: Energetic and unique (e.g., "Neon Cyber" - dark, neon accents, Space Mono)

Return CODE like this:

\`\`\`javascript
return [
  \`<!DOCTYPE html>
<html>
<head>
  <style>
    /* Style 1 CSS */
  </style>
</head>
<body>
  <h1>Style 1</h1>
</body>
</html>\`,

  \`<!DOCTYPE html>
<html>
<head>
  <style>
    /* Style 2 CSS */
  </style>
</head>
<body>
  <h1>Style 2</h1>
</body>
</html>\`,

  \`<!DOCTYPE html>
<html>
<head>
  <style>
    /* Style 3 CSS */
  </style>
</head>
<body>
  <h1>Style 3</h1>
</body>
</html>\`
];
\`\`\`

Generate the CODE now. Remember: Return code that RETURNS an array of 3 HTML strings.`;
}

export const STYLE_MOODS = {
  pitch: 'confident and impressive',
  teaching: 'clear and approachable',
  conference: 'engaging and memorable',
  internal: 'professional and informative',
};
