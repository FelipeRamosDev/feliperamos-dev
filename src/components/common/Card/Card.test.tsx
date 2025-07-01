import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card Component', () => {
   it('Renders children', () => {
      render(<Card testId="my-card">Test Content</Card>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
   });

   it('Applies custom className', () => {
      render(<Card testId="my-card" className="my-class">Content</Card>);
      const card = screen.getByTestId('my-card');
      expect(card).toHaveClass('my-class');
   });

   it('Applies multiple classNames', () => {
      render(<Card testId="my-card" className={['class1', 'class2']}>Content</Card>);
      const card = screen.getByTestId('my-card');
      expect(card).toHaveClass('class1');
      expect(card).toHaveClass('class2');
   });

   it('Applies data-testid', () => {
      render(<Card testId="my-card">Content</Card>);
      expect(screen.getByTestId('my-card')).toBeInTheDocument();
   });

   it('Applies custom style', () => {
      render(<Card testId="my-card" style={{ backgroundColor: '#FF0000' }}>Styled</Card>);
      const card = screen.getByTestId('my-card');
      expect(card).toHaveStyle('background-color: #FF0000');
   });

   it('Applies noRadius and noElevation', () => {
      render(<Card testId="my-card" noRadius noElevation>Props</Card>);
      const card = screen.getByTestId('my-card');
      expect(card.style.borderRadius).toBe('');
      expect(card.style.boxShadow).toBe('');
   });

   it('Applies noPadding', () => {
      render(<Card testId="my-card" noPadding>Padding</Card>);
      const card = screen.getByTestId('my-card');
      expect(card?.className).not.toContain('padding-');
   });

   it('Applies custom radius and elevation', () => {
      render(<Card testId="my-card" radius={10} elevation={20}>Custom</Card>);
      const card = screen.getByTestId('my-card');
      expect(card).toHaveStyle('border-radius: 10px');
      expect(card).toHaveStyle('box-shadow: 0 0 20px #222222');
   });

   it('Applies custom shadowColor', () => {
      render(<Card testId="my-card" elevation={15} shadowColor="#123456">Shadow</Card>);
      const card = screen.getByTestId('my-card');
      expect(card).toHaveStyle('box-shadow: 0 0 15px #123456');
   });
});
