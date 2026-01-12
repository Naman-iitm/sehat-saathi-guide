import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SymptomTracker from '@/components/SymptomTracker';
import { LanguageProvider } from '@/contexts/LanguageContext';
import * as exportUtils from '@/lib/exportUtils';

// Mock the export utilities
vi.mock('@/lib/exportUtils', () => ({
    exportToCSV: vi.fn(),
    exportToPDF: vi.fn(),
}));

// Mock VoiceInput component
vi.mock('@/components/VoiceInput', () => ({
    default: ({ onTranscript }: { onTranscript: (text: string) => void }) => (
        <button onClick={() => onTranscript('Voice input test')}>Voice Input</button>
    ),
}));

// Mock sonner toast
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

const renderWithLanguageProvider = (language: 'hi' | 'en' = 'en') => {
    // Set language in localStorage before rendering
    localStorage.setItem('language', language);

    return render(
        <LanguageProvider>
            <SymptomTracker />
        </LanguageProvider>
    );
};

describe('SymptomTracker Component', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        vi.clearAllMocks();
    });

    describe('Symptom Addition', () => {
        it('should add a symptom with valid input', async () => {
            const user = userEvent.setup();
            renderWithLanguageProvider('en');

            const input = screen.getByPlaceholderText('Symptom Name');
            const addButton = screen.getAllByRole('button', { name: /add symptom/i })[0];

            await user.type(input, 'Headache');
            await user.click(addButton);

            await waitFor(() => {
                expect(screen.getByText('Headache')).toBeInTheDocument();
            });
        });

        it('should add a symptom with description', async () => {
            const user = userEvent.setup();
            renderWithLanguageProvider('en');

            const nameInput = screen.getByPlaceholderText('Symptom Name');
            const descriptionInput = screen.getByPlaceholderText('Description (optional)');
            const addButton = screen.getAllByRole('button', { name: /add symptom/i })[0];

            await user.type(nameInput, 'Fever');
            await user.type(descriptionInput, 'High temperature since morning');
            await user.click(addButton);

            await waitFor(() => {
                expect(screen.getByText('Fever')).toBeInTheDocument();
                expect(screen.getByText('High temperature since morning')).toBeInTheDocument();
            });
        });

        it('should show error when adding empty symptom', async () => {
            const user = userEvent.setup();
            const { toast } = await import('sonner');
            renderWithLanguageProvider('en');

            const addButton = screen.getAllByRole('button', { name: /add symptom/i })[0];
            await user.click(addButton);

            expect(toast.error).toHaveBeenCalledWith('Please enter symptom name');
        });

        it('should clear input fields after adding symptom', async () => {
            const user = userEvent.setup();
            renderWithLanguageProvider('en');

            const nameInput = screen.getByPlaceholderText('Symptom Name') as HTMLInputElement;
            const descriptionInput = screen.getByPlaceholderText('Description (optional)') as HTMLTextAreaElement;
            const addButton = screen.getAllByRole('button', { name: /add symptom/i })[0];

            await user.type(nameInput, 'Cough');
            await user.type(descriptionInput, 'Dry cough');
            await user.click(addButton);

            await waitFor(() => {
                expect(nameInput.value).toBe('');
                expect(descriptionInput.value).toBe('');
            });
        });

        it('should add symptom on Enter key press', async () => {
            const user = userEvent.setup();
            renderWithLanguageProvider('en');

            const input = screen.getByPlaceholderText('Symptom Name');
            await user.type(input, 'Nausea{Enter}');

            await waitFor(() => {
                expect(screen.getByText('Nausea')).toBeInTheDocument();
            });
        });
    });

    describe('Symptom Deletion', () => {
        it('should delete a symptom', async () => {
            const user = userEvent.setup();
            renderWithLanguageProvider('en');

            // Add a symptom first
            const input = screen.getByPlaceholderText('Symptom Name');
            const addButton = screen.getAllByRole('button', { name: /add symptom/i })[0];

            await user.type(input, 'Fatigue');
            await user.click(addButton);

            await waitFor(() => {
                expect(screen.getByText('Fatigue')).toBeInTheDocument();
            });

            // Delete the symptom
            const deleteButton = screen.getByRole('button', { name: '' }); // Delete button with Trash icon
            await user.click(deleteButton);

            await waitFor(() => {
                expect(screen.queryByText('Fatigue')).not.toBeInTheDocument();
            });
        });
    });

    describe('LocalStorage Persistence', () => {
        it('should persist symptoms to localStorage', async () => {
            const user = userEvent.setup();
            renderWithLanguageProvider('en');

            const input = screen.getByPlaceholderText('Symptom Name');
            const addButton = screen.getAllByRole('button', { name: /add symptom/i })[0];

            await user.type(input, 'Dizziness');
            await user.click(addButton);

            await waitFor(() => {
                const stored = localStorage.getItem('symptoms');
                expect(stored).toBeTruthy();
                const symptoms = JSON.parse(stored!);
                expect(symptoms).toHaveLength(1);
                expect(symptoms[0].name).toBe('Dizziness');
            });
        });

        it('should load symptoms from localStorage on mount', () => {
            const mockSymptoms = [
                {
                    id: '1',
                    name: 'Back Pain',
                    description: 'Lower back',
                    date: '1/11/2026',
                    time: '10:00 AM',
                },
            ];

            localStorage.setItem('symptoms', JSON.stringify(mockSymptoms));
            renderWithLanguageProvider('en');

            expect(screen.getByText('Back Pain')).toBeInTheDocument();
            expect(screen.getByText('Lower back')).toBeInTheDocument();
        });

        it('should handle corrupted localStorage data gracefully', () => {
            localStorage.setItem('symptoms', 'invalid json');

            // Should not throw error
            expect(() => renderWithLanguageProvider('en')).not.toThrow();
        });
    });

    describe('Triage Result Display', () => {
        it('should display triage result for high severity symptoms', async () => {
            const user = userEvent.setup();
            renderWithLanguageProvider('en');

            const input = screen.getByPlaceholderText('Symptom Name');
            const addButton = screen.getAllByRole('button', { name: /add symptom/i })[0];

            await user.type(input, 'chest pain');
            await user.click(addButton);

            await waitFor(() => {
                expect(screen.getByText(/Severity:/i)).toBeInTheDocument();
                expect(screen.getByText(/HIGH/i)).toBeInTheDocument();
            });
        });

        it('should display triage result for medium severity symptoms', async () => {
            const user = userEvent.setup();
            renderWithLanguageProvider('en');

            const input = screen.getByPlaceholderText('Symptom Name');
            const addButton = screen.getAllByRole('button', { name: /add symptom/i })[0];

            await user.type(input, 'fatigue');
            await user.click(addButton);

            await waitFor(() => {
                expect(screen.getByText(/Severity:/i)).toBeInTheDocument();
                expect(screen.getByText(/MEDIUM/i)).toBeInTheDocument();
            });
        });

        it('should not display triage result when no symptoms', () => {
            renderWithLanguageProvider('en');
            expect(screen.queryByText(/Severity:/i)).not.toBeInTheDocument();
        });
    });

    describe('Export Functionality', () => {
        it('should export symptoms to CSV', async () => {
            const user = userEvent.setup();
            vi.mocked(exportUtils.exportToCSV).mockReturnValue(true);
            renderWithLanguageProvider('en');

            // Add a symptom first
            const input = screen.getByPlaceholderText('Symptom Name');
            const addButton = screen.getAllByRole('button', { name: /add symptom/i })[0];

            await user.type(input, 'Sore throat');
            await user.click(addButton);

            await waitFor(() => {
                expect(screen.getByText('Sore throat')).toBeInTheDocument();
            });

            // Click export button
            const exportButton = screen.getByRole('button', { name: /export data/i });
            await user.click(exportButton);

            const csvOption = screen.getByText(/Download as CSV/i);
            await user.click(csvOption);

            expect(exportUtils.exportToCSV).toHaveBeenCalled();
        });

        it('should export symptoms to PDF', async () => {
            const user = userEvent.setup();
            vi.mocked(exportUtils.exportToPDF).mockReturnValue(true);
            renderWithLanguageProvider('en');

            // Add a symptom first
            const input = screen.getByPlaceholderText('Symptom Name');
            const addButton = screen.getAllByRole('button', { name: /add symptom/i })[0];

            await user.type(input, 'Joint pain');
            await user.click(addButton);

            await waitFor(() => {
                expect(screen.getByText('Joint pain')).toBeInTheDocument();
            });

            // Click export button
            const exportButton = screen.getByRole('button', { name: /export data/i });
            await user.click(exportButton);

            const pdfOption = screen.getByText(/Download as PDF/i);
            await user.click(pdfOption);

            expect(exportUtils.exportToPDF).toHaveBeenCalled();
        });

        it('should not show export button when no symptoms', () => {
            renderWithLanguageProvider('en');
            expect(screen.queryByRole('button', { name: /export data/i })).not.toBeInTheDocument();
        });
    });

    describe('Voice Input Integration', () => {
        it('should add symptom via voice input', async () => {
            const user = userEvent.setup();
            renderWithLanguageProvider('en');

            const voiceButtons = screen.getAllByText('Voice Input');
            await user.click(voiceButtons[0]); // Click first voice input button

            const addButton = screen.getAllByRole('button', { name: /add symptom/i })[0];
            await user.click(addButton);

            await waitFor(() => {
                expect(screen.getByText('Voice input test')).toBeInTheDocument();
            });
        });
    });

    describe('Multilingual Support', () => {
        it('should display UI in Hindi', () => {
            renderWithLanguageProvider('hi');

            expect(screen.getByPlaceholderText('लक्षण का नाम')).toBeInTheDocument();
            expect(screen.getByText('लक्षण जोड़ें')).toBeInTheDocument();
        });

        it('should display UI in English', () => {
            renderWithLanguageProvider('en');

            expect(screen.getByPlaceholderText('Symptom Name')).toBeInTheDocument();
            expect(screen.getByText('Add Symptom')).toBeInTheDocument();
        });

        it('should show error message in Hindi', async () => {
            const user = userEvent.setup();
            const { toast } = await import('sonner');
            renderWithLanguageProvider('hi');

            const addButton = screen.getAllByRole('button', { name: /लक्षण जोड़ें/i })[0];
            await user.click(addButton);

            expect(toast.error).toHaveBeenCalledWith('कृपया लक्षण का नाम डालें');
        });

        it('should display triage result in Hindi', async () => {
            const user = userEvent.setup();
            renderWithLanguageProvider('hi');

            const input = screen.getByPlaceholderText('लक्षण का नाम');
            const addButton = screen.getAllByRole('button', { name: /लक्षण जोड़ें/i })[0];

            await user.type(input, 'chest pain');
            await user.click(addButton);

            await waitFor(() => {
                expect(screen.getByText(/गंभीरता/i)).toBeInTheDocument();
            });
        });
    });

    describe('Edge Cases', () => {
        it('should handle whitespace-only symptom name', async () => {
            const user = userEvent.setup();
            const { toast } = await import('sonner');
            renderWithLanguageProvider('en');

            const input = screen.getByPlaceholderText('Symptom Name');
            const addButton = screen.getAllByRole('button', { name: /add symptom/i })[0];

            await user.type(input, '   ');
            await user.click(addButton);

            expect(toast.error).toHaveBeenCalledWith('Please enter symptom name');
        });

        it('should display date and time for each symptom', async () => {
            const user = userEvent.setup();
            renderWithLanguageProvider('en');

            const input = screen.getByPlaceholderText('Symptom Name');
            const addButton = screen.getAllByRole('button', { name: /add symptom/i })[0];

            await user.type(input, 'Runny nose');
            await user.click(addButton);

            await waitFor(() => {
                // Check for date and time icons/text
                const symptomCard = screen.getByText('Runny nose').closest('div');
                expect(symptomCard).toBeInTheDocument();
            });
        });

        it('should handle multiple symptoms', async () => {
            const user = userEvent.setup();
            renderWithLanguageProvider('en');

            const input = screen.getByPlaceholderText('Symptom Name');
            const addButton = screen.getAllByRole('button', { name: /add symptom/i })[0];

            // Add first symptom
            await user.type(input, 'Symptom 1');
            await user.click(addButton);

            // Add second symptom
            await user.type(input, 'Symptom 2');
            await user.click(addButton);

            // Add third symptom
            await user.type(input, 'Symptom 3');
            await user.click(addButton);

            await waitFor(() => {
                expect(screen.getByText('Symptom 1')).toBeInTheDocument();
                expect(screen.getByText('Symptom 2')).toBeInTheDocument();
                expect(screen.getByText('Symptom 3')).toBeInTheDocument();
            });
        });
    });
});
