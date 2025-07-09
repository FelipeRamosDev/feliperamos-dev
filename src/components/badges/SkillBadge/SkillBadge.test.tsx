import { render, screen } from '@testing-library/react';
import SkillBadge from './SkillBadge';
import type { SkillBadgeProps } from './SkillBadge.types';

describe('SkillBadge', () => {
   const defaultProps: SkillBadgeProps = {
      value: 'JavaScript'
   };

   it('renders with default props', () => {
      render(<SkillBadge {...defaultProps} />);
      
      const badge = screen.getByText('JavaScript');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('SkillBadge');
      expect(badge).toHaveClass('padding-s'); // default padding
      expect(badge).toHaveClass('radius-xs'); // default radius
      expect(badge).toHaveAttribute('aria-label', 'JavaScript');
   });

   it('renders with custom value', () => {
      render(<SkillBadge {...defaultProps} value="TypeScript" />);
      
      const badge = screen.getByText('TypeScript');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute('aria-label', 'TypeScript');
   });

   it('renders with empty value', () => {
      render(<SkillBadge {...defaultProps} value="" />);
      
      const badge = screen.getByLabelText('');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('');
      expect(badge).toHaveAttribute('aria-label', '');
   });

   it('applies custom padding', () => {
      render(<SkillBadge {...defaultProps} padding="l" />);
      
      const badge = screen.getByText('JavaScript');
      expect(badge).toHaveClass('padding-l');
      expect(badge).not.toHaveClass('padding-s');
   });

   it('applies custom radius', () => {
      render(<SkillBadge {...defaultProps} radius="m" />);
      
      const badge = screen.getByText('JavaScript');
      expect(badge).toHaveClass('radius-m');
      expect(badge).not.toHaveClass('radius-xs');
   });

   it('applies strong styling when strong prop is true', () => {
      render(<SkillBadge {...defaultProps} strong={true} />);
      
      const badge = screen.getByText('JavaScript');
      expect(badge).toHaveClass('strong');
   });

   it('does not apply strong styling when strong prop is false', () => {
      render(<SkillBadge {...defaultProps} strong={false} />);
      
      const badge = screen.getByText('JavaScript');
      expect(badge).not.toHaveClass('strong');
   });

   it('applies disabled styling when disabled prop is true', () => {
      render(<SkillBadge {...defaultProps} disabled={true} />);
      
      const badge = screen.getByText('JavaScript');
      expect(badge).toHaveClass('disabled');
   });

   it('does not apply disabled styling when disabled prop is false', () => {
      render(<SkillBadge {...defaultProps} disabled={false} />);
      
      const badge = screen.getByText('JavaScript');
      expect(badge).not.toHaveClass('disabled');
   });

   it('applies both strong and disabled classes when both props are true', () => {
      render(<SkillBadge {...defaultProps} strong={true} disabled={true} />);
      
      const badge = screen.getByText('JavaScript');
      expect(badge).toHaveClass('strong');
      expect(badge).toHaveClass('disabled');
   });

   it('applies custom className as string', () => {
      render(<SkillBadge {...defaultProps} className="custom-class" />);
      
      const badge = screen.getByText('JavaScript');
      expect(badge).toHaveClass('custom-class');
      expect(badge).toHaveClass('SkillBadge');
   });

   it('applies custom className as array', () => {
      render(<SkillBadge {...defaultProps} className={['custom-class-1', 'custom-class-2']} />);
      
      const badge = screen.getByText('JavaScript');
      expect(badge).toHaveClass('custom-class-1');
      expect(badge).toHaveClass('custom-class-2');
      expect(badge).toHaveClass('SkillBadge');
   });

   it('renders as a span element', () => {
      render(<SkillBadge {...defaultProps} />);
      
      const badge = screen.getByText('JavaScript');
      expect(badge.tagName).toBe('SPAN');
   });

   it('applies all size variations for padding', () => {
      const paddingSizes = ['xs', 's', 'm', 'l', 'xl', 'none'] as const;
      
      paddingSizes.forEach(size => {
         const { rerender } = render(<SkillBadge {...defaultProps} padding={size} />);
         
         const badge = screen.getByText('JavaScript');
         
         if (size === 'none') {
            // When padding is 'none', no padding class should be applied
            expect(badge).not.toHaveClass('padding-xs');
            expect(badge).not.toHaveClass('padding-s');
            expect(badge).not.toHaveClass('padding-m');
            expect(badge).not.toHaveClass('padding-l');
            expect(badge).not.toHaveClass('padding-xl');
         } else {
            expect(badge).toHaveClass(`padding-${size}`);
         }
         
         rerender(<div />); // Clear between tests
      });
   });

   it('applies all size variations for radius', () => {
      const radiusSizes = ['xs', 's', 'm', 'l', 'xl', 'none'] as const;
      
      radiusSizes.forEach(size => {
         const { rerender } = render(<SkillBadge {...defaultProps} radius={size} />);
         
         const badge = screen.getByText('JavaScript');
         
         if (size === 'none') {
            // When radius is 'none', no radius class should be applied
            expect(badge).not.toHaveClass('radius-xs');
            expect(badge).not.toHaveClass('radius-s');
            expect(badge).not.toHaveClass('radius-m');
            expect(badge).not.toHaveClass('radius-l');
            expect(badge).not.toHaveClass('radius-xl');
         } else {
            expect(badge).toHaveClass(`radius-${size}`);
         }
         
         rerender(<div />); // Clear between tests
      });
   });

   it('handles complex skill names', () => {
      const complexSkills = [
         'React.js',
         'Node.js',
         'C++',
         'ASP.NET',
         'Vue.js 3',
         'TypeScript 5.0',
         'Material-UI v5'
      ];

      complexSkills.forEach(skill => {
         const { rerender } = render(<SkillBadge {...defaultProps} value={skill} />);
         
         const badge = screen.getByText(skill);
         expect(badge).toBeInTheDocument();
         expect(badge).toHaveAttribute('aria-label', skill);
         
         rerender(<div />); // Clear between tests
      });
   });

   it('combines all props correctly', () => {
      render(
         <SkillBadge
            {...defaultProps}
            value="Full Stack Developer"
            padding="xl"
            radius="l"
            strong={true}
            disabled={false}
            className="featured-skill"
         />
      );
      
      const badge = screen.getByText('Full Stack Developer');
      expect(badge).toHaveClass('SkillBadge');
      expect(badge).toHaveClass('padding-xl');
      expect(badge).toHaveClass('radius-l');
      expect(badge).toHaveClass('strong');
      expect(badge).toHaveClass('featured-skill');
      expect(badge).not.toHaveClass('disabled');
      expect(badge).toHaveAttribute('aria-label', 'Full Stack Developer');
   });
});

