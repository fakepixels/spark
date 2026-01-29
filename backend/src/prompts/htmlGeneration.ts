export function getHTMLGenerationPrompt(
  purpose: string,
  length: string,
  content: string,
  styleDescription: string
): string {
  const slideCount = length === 'short' ? '5-10' : length === 'medium' ? '10-20' : '20+';

  return `You are a master presentation designer. Generate a complete, standalone HTML presentation.

USER REQUIREMENTS:
- Purpose: ${purpose}
- Length: ${slideCount} slides
- Style: ${styleDescription}
- Content: ${content}

CRITICAL REQUIREMENTS:

1. **Single HTML File**
   - All CSS inline in <style> tag
   - All JavaScript inline in <script> tag
   - No external dependencies
   - Must work when saved as .html file

2. **Structure**
   - Multiple <section class="slide"> elements
   - Each section is one slide
   - Full viewport height slides
   - Semantic HTML5

3. **Styling System**
   - Use CSS custom properties for theming
   - Base the design on the selected style
   - Make it unique and beautiful
   - Avoid generic designs

4. **Navigation**
   - Keyboard: Arrow keys (← →) and Space
   - Touch: Swipe gestures
   - Mouse: Scroll wheel
   - Progress bar at top
   - Navigation dots on right side

5. **Animations**
   - Use .reveal class for elements
   - Intersection Observer for triggering
   - Smooth, professional transitions
   - Support prefers-reduced-motion

6. **Accessibility**
   - Semantic HTML
   - Proper ARIA labels
   - Keyboard navigation
   - Screen reader friendly
   - Good color contrast

7. **Responsive**
   - Mobile-friendly (min 320px)
   - Tablet optimized
   - Desktop polished
   - Use clamp() for fluid typography

8. **Code Quality**
   - Well-commented
   - Clean, readable code
   - Production-ready
   - No console.logs in final code

CONTENT STRUCTURE:
1. Title slide (main title + subtitle)
2. ${slideCount} content slides based on user's content
3. Closing slide (call-to-action or thank you)

Return ONLY the complete HTML code. No explanations, no markdown code blocks, just the raw HTML starting with <!DOCTYPE html>.

Generate the presentation now:`;
}
