/**
 * Accessibility Testing Configuration
 * This file sets up automated accessibility testing using axe-core
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

declare module 'vitest' {
    export interface Assertion {
        toHaveNoViolations(): Promise<void>;
    }
}

/**
 * Helper function to test component accessibility
 * @param component - The React component to test
 * @param options - Optional axe configuration
 */
export const testAccessibility = async (
    component: React.ReactElement,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: any
) => {
    const { container } = render(component);
    const results = await axe(container, options);
    expect(results).toHaveNoViolations();
};

/**
 * Common accessibility test suite for components
 * @param ComponentName - Name of the component being tested
 * @param Component - The component to test
 * @param props - Props to pass to the component
 */
export const runAccessibilityTests = (
    ComponentName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Component: React.ComponentType<any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props: any = {}
) => {
    describe(`${ComponentName} Accessibility`, () => {
        it('should not have any automatically detectable accessibility issues', async () => {
            await testAccessibility(<Component {...props} />);
        });

        it('should have proper ARIA labels on interactive elements', async () => {
            const { container } = render(<Component {...props} />);
            const buttons = container.querySelectorAll('button');
            const links = container.querySelectorAll('a');
            const inputs = container.querySelectorAll('input, textarea, select');

            // Check buttons have accessible names
            buttons.forEach((button) => {
                const hasAccessibleName =
                    button.getAttribute('aria-label') ||
                    button.getAttribute('aria-labelledby') ||
                    button.textContent?.trim();
                expect(hasAccessibleName).toBeTruthy();
            });

            // Check links have accessible names
            links.forEach((link) => {
                const hasAccessibleName =
                    link.getAttribute('aria-label') ||
                    link.getAttribute('aria-labelledby') ||
                    link.textContent?.trim();
                expect(hasAccessibleName).toBeTruthy();
            });

            // Check form inputs have labels
            inputs.forEach((input) => {
                const hasLabel =
                    input.getAttribute('aria-label') ||
                    input.getAttribute('aria-labelledby') ||
                    input.getAttribute('placeholder');
                expect(hasLabel).toBeTruthy();
            });
        });

        it('should have proper heading hierarchy', () => {
            const { container } = render(<Component {...props} />);
            const headings = Array.from(
                container.querySelectorAll('h1, h2, h3, h4, h5, h6')
            );

            let previousLevel = 0;
            headings.forEach((heading) => {
                const currentLevel = parseInt(heading.tagName.charAt(1));

                // First heading should be h1 or h2
                if (previousLevel === 0) {
                    expect(currentLevel).toBeLessThanOrEqual(2);
                } else {
                    // Subsequent headings shouldn't skip levels
                    expect(currentLevel).toBeLessThanOrEqual(previousLevel + 1);
                }

                previousLevel = currentLevel;
            });
        });

        it('should have proper focus management', () => {
            const { container } = render(<Component {...props} />);
            const focusableElements = container.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            focusableElements.forEach((element) => {
                // Elements should be keyboard accessible
                const tabIndex = element.getAttribute('tabindex');
                if (tabIndex !== null) {
                    expect(parseInt(tabIndex)).toBeGreaterThanOrEqual(-1);
                }
            });
        });
    });
};

export default {
    testAccessibility,
    runAccessibilityTests,
};
