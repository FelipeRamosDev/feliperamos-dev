import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CTAButton from './CTAButton';

describe('CTAButton', () => {
   it('Renders children', () => {
      render(<CTAButton>Click me</CTAButton>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
   });

   it('Applies custom className', () => {
      render(<CTAButton className="my-class">Test</CTAButton>);
      const button = screen.getByRole('button', { name: /test/i });
      expect(button).toHaveClass('my-class');
      expect(button).toHaveClass('cta-button');
   });

   it('Passes props to MUI Button', () => {
      render(<CTAButton color="primary" disabled>Test</CTAButton>);
      const button = screen.getByRole('button', { name: /test/i });
      expect(button).toBeDisabled();
   });

   it('Calls onClick handler', () => {
      const handleClick = jest.fn();
      render(<CTAButton onClick={handleClick}>Click</CTAButton>);
      const button = screen.getByRole('button', { name: /click/i });
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalled();
   });
});