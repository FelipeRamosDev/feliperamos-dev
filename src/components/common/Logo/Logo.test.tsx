import { render, screen } from '@testing-library/react';
import Logo from './Logo';

// Mock Next.js Image component
jest.mock('next/image', () => {
   const MockImage = ({ src, alt, className, width, height, ...props }: any) => (
      <img
         src={src}
         alt={alt}
         className={className}
         width={width}
         height={height}
         data-testid="logo-image"
         {...props}
      />
   );
   MockImage.displayName = 'Image';
   return MockImage;
});

// Mock the logo SVG
jest.mock('./logo.svg', () => '/mocked-logo.svg');

// Mock parse helpers
jest.mock('@/helpers/parse.helpers', () => ({
   parseCSS: jest.fn((className, defaultClass) => {
      if (Array.isArray(className)) {
         return [defaultClass, ...className].join(' ');
      }
      return className ? `${defaultClass} ${className}` : defaultClass;
   })
}));

describe('Logo', () => {
   it('renders the logo image with default props', () => {
      render(<Logo />);

      const logoImage = screen.getByTestId('logo-image');
      expect(logoImage).toBeInTheDocument();
      expect(logoImage).toHaveAttribute('src', '/mocked-logo.svg');
      expect(logoImage).toHaveAttribute('alt', 'Logo');
      expect(logoImage).toHaveClass('Logo');
   });

   it('renders with custom className as string', () => {
      render(<Logo className="custom-class" />);

      const logoImage = screen.getByTestId('logo-image');
      expect(logoImage).toHaveClass('Logo custom-class');
   });

   it('renders with custom className as array', () => {
      render(<Logo className={['custom-class', 'another-class']} />);

      const logoImage = screen.getByTestId('logo-image');
      expect(logoImage).toHaveClass('Logo custom-class another-class');
   });

   it('renders with custom width and height', () => {
      render(<Logo width={100} height={50} />);

      const logoImage = screen.getByTestId('logo-image');
      expect(logoImage).toHaveAttribute('width', '100');
      expect(logoImage).toHaveAttribute('height', '50');
   });

   it('passes through additional props', () => {
      render(<Logo data-custom="test-value" />);

      const logoImage = screen.getByTestId('logo-image');
      expect(logoImage).toHaveAttribute('data-custom', 'test-value');
   });

   it('renders with combined props', () => {
      render(
         <Logo 
            className="brand-logo" 
            width={200} 
            height={100} 
            data-custom="test-value"
         />
      );

      const logoImage = screen.getByTestId('logo-image');
      expect(logoImage).toBeInTheDocument();
      expect(logoImage).toHaveClass('Logo brand-logo');
      expect(logoImage).toHaveAttribute('width', '200');
      expect(logoImage).toHaveAttribute('height', '100');
      expect(logoImage).toHaveAttribute('data-custom', 'test-value');
   });
});
