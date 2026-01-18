/**
 * Accessibility Utility Functions
 * Provides helper functions for improving accessibility across the application
 */

/**
 * Announces dynamic content changes to screen readers
 * @param message - The message to announce
 * @param priority - The priority level ('polite' | 'assertive')
 */
export const announceToScreenReader = (
    message: string,
    priority: 'polite' | 'assertive' = 'polite'
): void => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
};

/**
 * Manages focus trap for modals and dialogs
 * @param container - The container element to trap focus within
 */
export const trapFocus = (container: HTMLElement): (() => void) => {
    const focusableElements = container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement?.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement?.focus();
                e.preventDefault();
            }
        }
    };

    container.addEventListener('keydown', handleTabKey);

    // Return cleanup function
    return () => {
        container.removeEventListener('keydown', handleTabKey);
    };
};

/**
 * Generates a unique ID for ARIA relationships
 * @param prefix - Optional prefix for the ID
 */
export const generateAriaId = (prefix: string = 'aria'): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Checks if an element is visible to screen readers
 * @param element - The element to check
 */
export const isVisibleToScreenReader = (element: HTMLElement): boolean => {
    return (
        element.getAttribute('aria-hidden') !== 'true' &&
        !element.classList.contains('sr-only') &&
        element.offsetParent !== null
    );
};

/**
 * Creates a skip link for keyboard navigation
 * @param targetId - The ID of the target element to skip to
 * @param label - The label for the skip link
 */
export const createSkipLink = (targetId: string, label: string): HTMLAnchorElement => {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.textContent = label;
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground';

    skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(targetId);
        if (target) {
            target.focus();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    return skipLink;
};

/**
 * Validates form field and announces errors to screen readers
 * @param fieldId - The ID of the form field
 * @param errorMessage - The error message to display
 */
export const announceFormError = (fieldId: string, errorMessage: string): void => {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const errorId = `${fieldId}-error`;
    let errorElement = document.getElementById(errorId);

    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.id = errorId;
        errorElement.className = 'text-destructive text-sm mt-1';
        errorElement.setAttribute('role', 'alert');
        errorElement.setAttribute('aria-live', 'assertive');
        field.parentElement?.appendChild(errorElement);
    }

    errorElement.textContent = errorMessage;
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', errorId);
};

/**
 * Clears form field error
 * @param fieldId - The ID of the form field
 */
export const clearFormError = (fieldId: string): void => {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const errorId = `${fieldId}-error`;
    const errorElement = document.getElementById(errorId);

    if (errorElement) {
        errorElement.remove();
    }

    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
};

/**
 * Ensures proper heading hierarchy
 * @param container - The container to check
 */
export const validateHeadingHierarchy = (container: HTMLElement = document.body): boolean => {
    const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let previousLevel = 0;
    let isValid = true;

    headings.forEach((heading) => {
        const currentLevel = parseInt(heading.tagName.charAt(1));

        if (previousLevel > 0 && currentLevel > previousLevel + 1) {
            console.warn(`Heading hierarchy skip detected: ${heading.tagName} after h${previousLevel}`);
            isValid = false;
        }

        previousLevel = currentLevel;
    });

    return isValid;
};

/**
 * Adds keyboard navigation support to a list
 * @param listElement - The list element (ul/ol)
 */
export const enableKeyboardNavigation = (listElement: HTMLElement): (() => void) => {
    const items = Array.from(listElement.querySelectorAll<HTMLElement>('[role="listitem"], li'));

    const handleKeyDown = (e: KeyboardEvent) => {
        const currentIndex = items.findIndex(item => item === document.activeElement);
        if (currentIndex === -1) return;

        let nextIndex = currentIndex;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                nextIndex = Math.min(currentIndex + 1, items.length - 1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                nextIndex = Math.max(currentIndex - 1, 0);
                break;
            case 'Home':
                e.preventDefault();
                nextIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                nextIndex = items.length - 1;
                break;
            default:
                return;
        }

        items[nextIndex]?.focus();
    };

    listElement.addEventListener('keydown', handleKeyDown);

    // Make items focusable
    items.forEach((item, index) => {
        if (!item.hasAttribute('tabindex')) {
            item.setAttribute('tabindex', index === 0 ? '0' : '-1');
        }
    });

    return () => {
        listElement.removeEventListener('keydown', handleKeyDown);
    };
};
