import React from 'react';
import { render, screen } from '@testing-library/react';
import Container from './Container';

// Mock the parseCSS helper to return joined class names
jest.mock('@/utils/parse', () => ({
   parseCSS: (...args: unknown[]) => args.filter(Boolean).join(' '),
   parsePadding: (size: string) => size ? `padding-${size}` : '',
}));

describe('Container component', () => {
   it('renders children', () => {
      render(<Container>Test Content</Container>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
   });

   it('applies default Container class', () => {
      render(<Container>Test</Container>);
      const container = screen.getByTestId('container');
      expect(container.className).toMatch('Container');
   });

   it('applies custom className', () => {
      render(<Container className="my-container">Test</Container>);
      const container = screen.getByTestId('container');
      expect(container.className).toMatch('my-container');
      expect(container.className).toMatch('Container');
   });
});
