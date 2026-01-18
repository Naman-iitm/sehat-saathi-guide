import React from 'react';

/**
 * SkipToContent Component
 * Provides a skip navigation link for keyboard users to bypass repetitive navigation
 * and jump directly to main content
 */
const SkipToContent: React.FC = () => {
    const skipToMain = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.focus();
            mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <a
            href="#main-content"
            onClick={skipToMain}
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
            aria-label="Skip to main content"
        >
            Skip to main content
        </a>
    );
};

export default SkipToContent;
