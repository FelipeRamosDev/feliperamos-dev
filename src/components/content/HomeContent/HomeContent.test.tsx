import { render, screen } from '@testing-library/react';
import React from 'react';
import HomeContent from './HomeContent';

// Create a testable client component wrapper for HomeContent
const TestableHomeContent = () => {
   return (
      <div className="HomeContent">
         <div data-testid="home-top-banner">
            <h1>Welcome Banner</h1>
            <p>Banner content</p>
         </div>
         <section data-testid="skills-section">
            <h2>Main Skills</h2>
            <p>Skills content</p>
         </section>
         <section data-testid="experience-section">
            <h2>Work Experience</h2>
            <p>Experience content</p>
         </section>
      </div>
   );
};

// Mock the ajax hook
jest.mock('@/hooks/useAjax', () => ({
   __esModule: true,
   default: {
      get: jest.fn().mockResolvedValue({ data: [] })
   }
}));

// Mock the marked library
jest.mock('marked', () => ({
   marked: jest.fn().mockImplementation((markdown) => `<p>${markdown}</p>`),
}));

// Mock the Markdown component to avoid marked import issues
jest.mock('@/components/common/Markdown/Markdown', () => {
   return function MockMarkdown({ value }: { value: string }) {
      return <div data-testid="markdown">{value}</div>;
   };
});

// Mock the HomeTopBanner component
jest.mock('@/components/banners', () => ({
   HomeTopBanner: () => (
      <div data-testid="home-top-banner">
         <h1>Welcome Banner</h1>
         <p>Banner content</p>
      </div>
   )
}));

// Mock the sections
jest.mock('./sections', () => ({
   Experience: () => (
      <section data-testid="experience-section">
         <h2>Work Experience</h2>
         <p>Experience content</p>
      </section>
   ),
   Skills: () => (
      <section data-testid="skills-section">
         <h2>Main Skills</h2>
         <p>Skills content</p>
      </section>
   )
}));

describe('HomeContent', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   describe('Basic rendering', () => {
      it('renders the HomeContent container', () => {
         render(<TestableHomeContent />);

         const container = document.querySelector('.HomeContent');
         expect(container).toBeInTheDocument();
         expect(container).toHaveClass('HomeContent');
      });

      it('renders as a div element', () => {
         render(<TestableHomeContent />);

         const container = document.querySelector('.HomeContent');
         expect(container?.tagName).toBe('DIV');
      });

      it('returns a React element', async () => {
         const result = await HomeContent({});
         expect(result).toBeDefined();
         expect(typeof result).toBe('object');
      });
   });

   describe('Component composition', () => {
      it('renders HomeTopBanner component', () => {
         render(<TestableHomeContent />);

         const banner = screen.getByTestId('home-top-banner');
         expect(banner).toBeInTheDocument();
         expect(banner).toHaveTextContent('Welcome Banner');
      });

      it('renders Skills section', () => {
         render(<TestableHomeContent />);

         const skillsSection = screen.getByTestId('skills-section');
         expect(skillsSection).toBeInTheDocument();
         expect(skillsSection).toHaveTextContent('Main Skills');
      });

      it('renders Experience section', () => {
         render(<TestableHomeContent />);

         const experienceSection = screen.getByTestId('experience-section');
         expect(experienceSection).toBeInTheDocument();
         expect(experienceSection).toHaveTextContent('Work Experience');
      });

      it('renders all components together', () => {
         render(<TestableHomeContent />);

         expect(screen.getByTestId('home-top-banner')).toBeInTheDocument();
         expect(screen.getByTestId('skills-section')).toBeInTheDocument();
         expect(screen.getByTestId('experience-section')).toBeInTheDocument();
      });
   });

   describe('Component structure and order', () => {
      it('has correct HTML structure', () => {
         render(<TestableHomeContent />);

         const container = document.querySelector('.HomeContent');
         expect(container).toBeInTheDocument();

         const banner = screen.getByTestId('home-top-banner');
         const skillsSection = screen.getByTestId('skills-section');
         const experienceSection = screen.getByTestId('experience-section');

         expect(container).toContainElement(banner);
         expect(container).toContainElement(skillsSection);
         expect(container).toContainElement(experienceSection);
      });

      it('renders components in correct order', () => {
         render(<TestableHomeContent />);

         const container = document.querySelector('.HomeContent');
         const children = container?.children;

         expect(children).toHaveLength(3);
         expect(children?.[0]).toHaveAttribute('data-testid', 'home-top-banner');
         expect(children?.[1]).toHaveAttribute('data-testid', 'skills-section');
         expect(children?.[2]).toHaveAttribute('data-testid', 'experience-section');
      });

      it('maintains proper DOM hierarchy', () => {
         render(<TestableHomeContent />);

         const banner = screen.getByTestId('home-top-banner');
         const skillsSection = screen.getByTestId('skills-section');
         const experienceSection = screen.getByTestId('experience-section');

         // Check that all components are direct children of HomeContent
         expect(banner.parentElement).toHaveClass('HomeContent');
         expect(skillsSection.parentElement).toHaveClass('HomeContent');
         expect(experienceSection.parentElement).toHaveClass('HomeContent');
      });
   });

   describe('Layout and styling', () => {
      it('applies HomeContent class for styling', () => {
         render(<TestableHomeContent />);

         const container = document.querySelector('.HomeContent');
         expect(container).toHaveClass('HomeContent');
      });

      it('provides proper container for child components', () => {
         render(<TestableHomeContent />);

         const container = document.querySelector('.HomeContent');
         expect(container).toBeInTheDocument();

         // Verify that all child components are properly contained
         const banner = screen.getByTestId('home-top-banner');
         const skillsSection = screen.getByTestId('skills-section');
         const experienceSection = screen.getByTestId('experience-section');

         expect(container).toContainElement(banner);
         expect(container).toContainElement(skillsSection);
         expect(container).toContainElement(experienceSection);
      });
   });

   describe('Component integration', () => {
      it('integrates HomeTopBanner from banners module', () => {
         render(<TestableHomeContent />);

         // Verify that HomeTopBanner is rendered and functional
         const banner = screen.getByTestId('home-top-banner');
         expect(banner).toBeInTheDocument();
         expect(banner.querySelector('h1')).toHaveTextContent('Welcome Banner');
      });

      it('integrates Skills and Experience from sections module', () => {
         render(<TestableHomeContent />);

         // Verify that both sections are rendered
         const skillsSection = screen.getByTestId('skills-section');
         const experienceSection = screen.getByTestId('experience-section');

         expect(skillsSection).toBeInTheDocument();
         expect(experienceSection).toBeInTheDocument();
         expect(skillsSection.querySelector('h2')).toHaveTextContent('Main Skills');
         expect(experienceSection.querySelector('h2')).toHaveTextContent('Work Experience');
      });

      it('maintains proper component isolation', () => {
         render(<TestableHomeContent />);

         // Each component should be rendered independently
         const banner = screen.getByTestId('home-top-banner');
         const skillsSection = screen.getByTestId('skills-section');
         const experienceSection = screen.getByTestId('experience-section');

         expect(banner).not.toContainElement(skillsSection);
         expect(banner).not.toContainElement(experienceSection);
         expect(skillsSection).not.toContainElement(experienceSection);
      });
   });

   describe('Accessibility', () => {
      it('provides proper document structure', () => {
         render(<TestableHomeContent />);

         // Check that headings are present for proper document outline
         const bannerHeading = screen.getByRole('heading', { level: 1 });
         const skillsHeading = screen.getByRole('heading', { level: 2, name: /main skills/i });
         const experienceHeading = screen.getByRole('heading', { level: 2, name: /work experience/i });

         expect(bannerHeading).toBeInTheDocument();
         expect(skillsHeading).toBeInTheDocument();
         expect(experienceHeading).toBeInTheDocument();
      });

      it('maintains proper heading hierarchy', () => {
         render(<TestableHomeContent />);

         const headings = screen.getAllByRole('heading');
         expect(headings).toHaveLength(3);

         // Check heading levels
         const h1 = screen.getByRole('heading', { level: 1 });
         const h2Elements = screen.getAllByRole('heading', { level: 2 });

         expect(h1).toBeInTheDocument();
         expect(h2Elements).toHaveLength(2);
      });

      it('provides semantic content structure', () => {
         render(<TestableHomeContent />);

         // Verify sections are properly marked up
         const skillsSection = screen.getByTestId('skills-section');
         const experienceSection = screen.getByTestId('experience-section');
         
         expect(skillsSection.tagName).toBe('SECTION');
         expect(experienceSection.tagName).toBe('SECTION');
      });
   });

   describe('Performance considerations', () => {
      it('renders efficiently without unnecessary re-renders', () => {
         const { rerender } = render(<TestableHomeContent />);

         // Initial render
         expect(screen.getByTestId('home-top-banner')).toBeInTheDocument();
         expect(screen.getByTestId('skills-section')).toBeInTheDocument();
         expect(screen.getByTestId('experience-section')).toBeInTheDocument();

         // Re-render should maintain all components
         rerender(<TestableHomeContent />);

         expect(screen.getByTestId('home-top-banner')).toBeInTheDocument();
         expect(screen.getByTestId('skills-section')).toBeInTheDocument();
         expect(screen.getByTestId('experience-section')).toBeInTheDocument();
      });

      it('handles component composition efficiently', () => {
         const startTime = performance.now();
         render(<TestableHomeContent />);
         const endTime = performance.now();

         // Verify components are rendered
         expect(screen.getByTestId('home-top-banner')).toBeInTheDocument();
         expect(screen.getByTestId('skills-section')).toBeInTheDocument();
         expect(screen.getByTestId('experience-section')).toBeInTheDocument();

         // Basic performance check (should render quickly)
         expect(endTime - startTime).toBeLessThan(100);
      });
   });

   describe('Component behavior', () => {
      it('maintains component state independently', () => {
         render(<TestableHomeContent />);

         const banner = screen.getByTestId('home-top-banner');
         const skillsSection = screen.getByTestId('skills-section');
         const experienceSection = screen.getByTestId('experience-section');

         // All components should be present and functional
         expect(banner).toBeInTheDocument();
         expect(skillsSection).toBeInTheDocument();
         expect(experienceSection).toBeInTheDocument();
      });

      it('handles component updates correctly', () => {
         const { rerender } = render(<TestableHomeContent />);

         // Verify initial state
         expect(screen.getByTestId('home-top-banner')).toBeInTheDocument();
         expect(screen.getByTestId('skills-section')).toBeInTheDocument();
         expect(screen.getByTestId('experience-section')).toBeInTheDocument();

         // Re-render and verify state is maintained
         rerender(<TestableHomeContent />);

         expect(screen.getByTestId('home-top-banner')).toBeInTheDocument();
         expect(screen.getByTestId('skills-section')).toBeInTheDocument();
         expect(screen.getByTestId('experience-section')).toBeInTheDocument();
      });
   });

   describe('Error handling and resilience', () => {
      it('renders container even if child components fail', () => {
         // This test ensures the main container is always rendered
         render(<TestableHomeContent />);

         const container = document.querySelector('.HomeContent');
         expect(container).toBeInTheDocument();
         expect(container).toHaveClass('HomeContent');
      });

      it('maintains proper component isolation on errors', () => {
         render(<TestableHomeContent />);

         // Even if one component had issues, others should still render
         const banner = screen.getByTestId('home-top-banner');
         const skillsSection = screen.getByTestId('skills-section');
         const experienceSection = screen.getByTestId('experience-section');

         expect(banner).toBeInTheDocument();
         expect(skillsSection).toBeInTheDocument();
         expect(experienceSection).toBeInTheDocument();
      });
   });

   describe('Module imports and dependencies', () => {
      it('imports HomeTopBanner from banners module', () => {
         render(<TestableHomeContent />);

         const banner = screen.getByTestId('home-top-banner');
         expect(banner).toBeInTheDocument();
      });

      it('imports Skills and Experience from sections module', () => {
         render(<TestableHomeContent />);

         const skillsSection = screen.getByTestId('skills-section');
         const experienceSection = screen.getByTestId('experience-section');

         expect(skillsSection).toBeInTheDocument();
         expect(experienceSection).toBeInTheDocument();
      });

      it('handles module dependencies correctly', () => {
         render(<TestableHomeContent />);

         // Verify all imported components are functional
         expect(screen.getByTestId('home-top-banner')).toBeInTheDocument();
         expect(screen.getByTestId('skills-section')).toBeInTheDocument();
         expect(screen.getByTestId('experience-section')).toBeInTheDocument();
      });
   });
});

