import { render } from '@testing-library/react';
import React from 'react';
import Markdown from './Markdown';
import { parseCSS } from '@/helpers/parse.helpers';
import { marked } from 'marked';

// Mock the parseCSS helper
jest.mock('@/helpers/parse.helpers', () => ({
   parseCSS: jest.fn()
}));

// Mock the marked library
jest.mock('marked', () => ({
   marked: jest.fn()
}));

// Mock the SCSS module
jest.mock('./Markdown.module.scss', () => ({
   Markdown: 'markdown-module-class'
}));

const mockParseCSS = parseCSS as jest.MockedFunction<typeof parseCSS>;
const mockMarked = marked as jest.MockedFunction<typeof marked>;

describe('Markdown', () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockParseCSS.mockReturnValue('Markdown markdown-module-class test-class');
      mockMarked.mockReturnValue('<p>Test content</p>');
   });

   describe('Basic rendering', () => {
      it('renders with minimal props', () => {
         const { container } = render(<Markdown />);
         
         const markdownContainer = container.firstChild as HTMLElement;
         expect(markdownContainer).toBeInTheDocument();
         expect(markdownContainer.tagName).toBe('DIV');
      });

      it('renders with empty value', () => {
         const { container } = render(<Markdown value="" />);
         
         expect(mockMarked).toHaveBeenCalledWith('');
         
         const markdownContainer = container.firstChild as HTMLElement;
         expect(markdownContainer).toBeInTheDocument();
      });

      it('renders with undefined value', () => {
         const { container } = render(<Markdown value={undefined} />);
         
         expect(mockMarked).toHaveBeenCalledWith('');
         
         const markdownContainer = container.firstChild as HTMLElement;
         expect(markdownContainer).toBeInTheDocument();
      });

      it('applies CSS classes correctly', () => {
         const { container } = render(<Markdown className="custom-class" />);
         
         expect(mockParseCSS).toHaveBeenCalledWith('custom-class', [
            'Markdown',
            'markdown-module-class'
         ]);
         
         const markdownContainer = container.firstChild as HTMLElement;
         expect(markdownContainer).toHaveClass('Markdown markdown-module-class test-class');
      });

      it('handles no className', () => {
         render(<Markdown />);
         
         expect(mockParseCSS).toHaveBeenCalledWith(undefined, [
            'Markdown',
            'markdown-module-class'
         ]);
      });
   });

   describe('Markdown processing', () => {
      it('processes simple text', () => {
         const simpleText = 'Hello world';
         mockMarked.mockReturnValue('<p>Hello world</p>');
         
         const { container } = render(<Markdown value={simpleText} />);
         
         expect(mockMarked).toHaveBeenCalledWith(simpleText);
         
         const markdownContainer = container.firstChild as HTMLElement;
         expect(markdownContainer.innerHTML).toBe('<p>Hello world</p>');
      });

      it('processes markdown with headers', () => {
         const markdownText = '# Main Title\n## Subtitle';
         const expectedHTML = '<h1>Main Title</h1>\n<h2>Subtitle</h2>';
         mockMarked.mockReturnValue(expectedHTML);
         
         const { container } = render(<Markdown value={markdownText} />);
         
         expect(mockMarked).toHaveBeenCalledWith(markdownText);
         
         const markdownContainer = container.firstChild as HTMLElement;
         expect(markdownContainer.innerHTML).toBe(expectedHTML);
      });

      it('processes markdown with lists', () => {
         const markdownText = '- Item 1\n- Item 2\n- Item 3';
         const expectedHTML = '<ul>\n<li>Item 1</li>\n<li>Item 2</li>\n<li>Item 3</li>\n</ul>';
         mockMarked.mockReturnValue(expectedHTML);
         
         const { container } = render(<Markdown value={markdownText} />);
         
         expect(mockMarked).toHaveBeenCalledWith(markdownText);
         
         const markdownContainer = container.firstChild as HTMLElement;
         expect(markdownContainer.innerHTML).toBe(expectedHTML);
      });

      it('processes markdown with links', () => {
         const markdownText = '[Google](https://google.com)';
         const expectedHTML = '<p><a href="https://google.com">Google</a></p>';
         mockMarked.mockReturnValue(expectedHTML);
         
         const { container } = render(<Markdown value={markdownText} />);
         
         expect(mockMarked).toHaveBeenCalledWith(markdownText);
         
         const markdownContainer = container.firstChild as HTMLElement;
         expect(markdownContainer.innerHTML).toBe(expectedHTML);
      });

      it('processes markdown with emphasis', () => {
         const markdownText = '**bold** and *italic* text';
         const expectedHTML = '<p><strong>bold</strong> and <em>italic</em> text</p>';
         mockMarked.mockReturnValue(expectedHTML);
         
         const { container } = render(<Markdown value={markdownText} />);
         
         expect(mockMarked).toHaveBeenCalledWith(markdownText);
         
         const markdownContainer = container.firstChild as HTMLElement;
         expect(markdownContainer.innerHTML).toBe(expectedHTML);
      });

      it('processes markdown with code blocks', () => {
         const markdownText = '```javascript\nconsole.log("hello");\n```';
         const expectedHTML = '<pre><code class="language-javascript">console.log("hello");\n</code></pre>';
         mockMarked.mockReturnValue(expectedHTML);
         
         const { container } = render(<Markdown value={markdownText} />);
         
         expect(mockMarked).toHaveBeenCalledWith(markdownText);
         
         const markdownContainer = container.firstChild as HTMLElement;
         expect(markdownContainer.innerHTML).toBe(expectedHTML);
      });
   });

   describe('HTML output and security', () => {
      it('uses dangerouslySetInnerHTML correctly', () => {
         const markdownText = '# Test';
         const expectedHTML = '<h1>Test</h1>';
         mockMarked.mockReturnValue(expectedHTML);
         
         const { container } = render(<Markdown value={markdownText} />);
         
         const markdownDiv = container.firstChild as HTMLElement;
         expect(markdownDiv.innerHTML).toBe(expectedHTML);
      });

      it('handles HTML entities in markdown', () => {
         const markdownText = 'A & B < C > D';
         const expectedHTML = '<p>A &amp; B &lt; C &gt; D</p>';
         mockMarked.mockReturnValue(expectedHTML);
         
         const { container } = render(<Markdown value={markdownText} />);
         
         expect(mockMarked).toHaveBeenCalledWith(markdownText);
         
         const markdownContainer = container.firstChild as HTMLElement;
         expect(markdownContainer.innerHTML).toBe(expectedHTML);
      });

      it('preserves HTML returned by marked', () => {
         const complexHTML = '<div><p>Complex <strong>HTML</strong></p><ul><li>Item 1</li></ul></div>';
         mockMarked.mockReturnValue(complexHTML);
         
         const { container } = render(<Markdown value="some markdown" />);
         
         const markdownContainer = container.firstChild as HTMLElement;
         expect(markdownContainer.innerHTML).toBe(complexHTML);
      });
   });

   describe('Edge cases', () => {
      it('handles very long markdown text', () => {
         const longText = 'Lorem ipsum '.repeat(1000);
         const longHTML = `<p>${longText.trim()}</p>`;
         mockMarked.mockReturnValue(longHTML);
         
         const { container } = render(<Markdown value={longText} />);
         
         expect(mockMarked).toHaveBeenCalledWith(longText);
         
         const markdownContainer = container.firstChild as HTMLElement;
         expect(markdownContainer.innerHTML).toBe(longHTML);
      });

      it('handles markdown with special characters', () => {
         const specialText = '# Title with émojis 🚀 and spëcial chars!';
         const expectedHTML = '<h1>Title with émojis 🚀 and spëcial chars!</h1>';
         mockMarked.mockReturnValue(expectedHTML);
         
         const { container } = render(<Markdown value={specialText} />);
         
         expect(mockMarked).toHaveBeenCalledWith(specialText);
         
         const markdownContainer = container.firstChild as HTMLElement;
         expect(markdownContainer.innerHTML).toBe(expectedHTML);
      });

      it('handles markdown with line breaks', () => {
         const textWithBreaks = 'Line 1\n\nLine 2\n\nLine 3';
         const expectedHTML = '<p>Line 1</p>\n<p>Line 2</p>\n<p>Line 3</p>';
         mockMarked.mockReturnValue(expectedHTML);
         
         const { container } = render(<Markdown value={textWithBreaks} />);
         
         expect(mockMarked).toHaveBeenCalledWith(textWithBreaks);
         
         const markdownContainer = container.firstChild as HTMLElement;
         expect(markdownContainer.innerHTML).toBe(expectedHTML);
      });

      it('handles empty string gracefully', () => {
         mockMarked.mockReturnValue('');
         
         const { container } = render(<Markdown value="" />);
         
         expect(mockMarked).toHaveBeenCalledWith('');
         
         const markdownContainer = container.firstChild as HTMLElement;
         expect(markdownContainer.innerHTML).toBe('');
      });

      it('handles null value gracefully', () => {
         const { container } = render(<Markdown value={null as unknown as string} />);
         
         expect(mockMarked).toHaveBeenCalledWith('');
         
         const markdownContainer = container.firstChild as HTMLElement;
         expect(markdownContainer).toBeInTheDocument();
      });
   });

   describe('CSS class integration', () => {
      it('integrates with parseCSS helper correctly', () => {
         mockParseCSS.mockReturnValue('custom-parsed-classes');
         
         const { container } = render(<Markdown className="integration-test" />);
         
         expect(mockParseCSS).toHaveBeenCalledWith('integration-test', [
            'Markdown',
            'markdown-module-class'
         ]);
         
         const markdownContainer = container.firstChild as HTMLElement;
         expect(markdownContainer).toHaveClass('custom-parsed-classes');
      });

      it('includes module styles in CSS parsing', () => {
         render(<Markdown className="custom" />);
         
         expect(mockParseCSS).toHaveBeenCalledWith('custom', [
            'Markdown',
            'markdown-module-class'
         ]);
      });

      it('works without custom className', () => {
         render(<Markdown />);
         
         expect(mockParseCSS).toHaveBeenCalledWith(undefined, [
            'Markdown',
            'markdown-module-class'
         ]);
      });
   });

   describe('Integration tests', () => {
      it('works with complex markdown and custom classes', () => {
         const complexMarkdown = '# Title\n\n**Bold text** and *italic*\n\n- List item 1\n- List item 2';
         const complexHTML = '<h1>Title</h1>\n<p><strong>Bold text</strong> and <em>italic</em></p>\n<ul>\n<li>List item 1</li>\n<li>List item 2</li>\n</ul>';
         mockMarked.mockReturnValue(complexHTML);
         mockParseCSS.mockReturnValue('Markdown markdown-module-class complex-class');
         
         const { container } = render(<Markdown value={complexMarkdown} className="complex-class" />);
         
         expect(mockMarked).toHaveBeenCalledWith(complexMarkdown);
         expect(mockParseCSS).toHaveBeenCalledWith('complex-class', [
            'Markdown',
            'markdown-module-class'
         ]);
         
         const markdownContainer = container.firstChild as HTMLElement;
         expect(markdownContainer).toHaveClass('Markdown markdown-module-class complex-class');
         expect(markdownContainer.innerHTML).toBe(complexHTML);
      });

      it('handles all markdown features together', () => {
         const fullMarkdown = `# Main Title
## Subtitle

This is a paragraph with **bold** and *italic* text.

### Code Example
\`\`\`javascript
function hello() {
  console.log("Hello World!");
}
\`\`\`

### List
- Item 1
- Item 2
  - Nested item
- Item 3

[Link to Google](https://google.com)

> This is a blockquote
`;
         
         const fullHTML = '<h1>Main Title</h1><h2>Subtitle</h2><p>This is a paragraph...</p>';
         mockMarked.mockReturnValue(fullHTML);
         
         const { container } = render(<Markdown value={fullMarkdown} />);
         
         expect(mockMarked).toHaveBeenCalledWith(fullMarkdown);
         
         const markdownContainer = container.firstChild as HTMLElement;
         expect(markdownContainer.innerHTML).toBe(fullHTML);
      });
   });

   describe('Performance and reliability', () => {
      it('calls marked only once per render', () => {
         const testValue = '# Test';
         render(<Markdown value={testValue} />);
         
         expect(mockMarked).toHaveBeenCalledTimes(1);
         expect(mockMarked).toHaveBeenCalledWith(testValue);
      });

      it('calls parseCSS only once per render', () => {
         const testClass = 'test-class';
         render(<Markdown className={testClass} />);
         
         expect(mockParseCSS).toHaveBeenCalledTimes(1);
         expect(mockParseCSS).toHaveBeenCalledWith(testClass, [
            'Markdown',
            'markdown-module-class'
         ]);
      });

      it('re-renders correctly when value changes', () => {
         const { rerender } = render(<Markdown value="Initial" />);
         
         expect(mockMarked).toHaveBeenCalledWith('Initial');
         
         mockMarked.mockClear();
         mockMarked.mockReturnValue('<p>Updated</p>');
         
         rerender(<Markdown value="Updated" />);
         
         expect(mockMarked).toHaveBeenCalledWith('Updated');
      });
   });
});
