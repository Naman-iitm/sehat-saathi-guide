import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AIAssistant from '@/components/AIAssistant';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Mock sonner toast
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

const STORAGE_KEY = 'sehat-saathi-chat-history';

const renderWithLanguageProvider = (language: 'hi' | 'en' = 'en') => {
    // Set language in localStorage before rendering
    localStorage.setItem('language', language);

    return render(
        <LanguageProvider>
            <AIAssistant />
        </LanguageProvider>
    );
};

describe('AIAssistant Component', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('Initial Render', () => {
        it('should render AI Assistant with welcome message', () => {
            renderWithLanguageProvider('en');

            expect(screen.getByText('AI Assistant')).toBeInTheDocument();
            expect(screen.getByText(/Hello! I am your health assistant/i)).toBeInTheDocument();
        });

        it('should render welcome message in Hindi', () => {
            renderWithLanguageProvider('hi');

            expect(screen.getByText('AI सहायक')).toBeInTheDocument();
            expect(screen.getByText(/नमस्ते! मैं आपका स्वास्थ्य सहायक हूं/i)).toBeInTheDocument();
        });

        it('should render input field and send button', () => {
            renderWithLanguageProvider('en');

            expect(screen.getByPlaceholderText(/Describe your health issue/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: '' })).toBeInTheDocument(); // Send button with icon
        });

        it('should create a new chat session on mount', () => {
            renderWithLanguageProvider('en');

            const stored = localStorage.getItem(STORAGE_KEY);
            expect(stored).toBeTruthy();

            const sessions = JSON.parse(stored!);
            expect(sessions).toHaveLength(1);
            expect(sessions[0].messages).toHaveLength(1);
            expect(sessions[0].messages[0].role).toBe('assistant');
        });
    });

    describe('Message Sending and Receiving', () => {
        it('should send a user message', async () => {
            const user = userEvent.setup({ delay: null });
            renderWithLanguageProvider('en');

            const input = screen.getByPlaceholderText(/Describe your health issue/i);
            const sendButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'));

            await user.type(input, 'I have a fever');
            await user.click(sendButton!);

            await waitFor(() => {
                expect(screen.getByText('I have a fever')).toBeInTheDocument();
            });
        });

        it('should display AI response after user message', async () => {
            const user = userEvent.setup({ delay: null });
            renderWithLanguageProvider('en');

            const input = screen.getByPlaceholderText(/Describe your health issue/i);
            const sendButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'));

            await user.type(input, 'I have a fever');
            await user.click(sendButton!);

            // Wait for user message
            await waitFor(() => {
                expect(screen.getByText('I have a fever')).toBeInTheDocument();
            });

            // Advance timers to simulate AI response delay
            vi.advanceTimersByTime(1500);

            await waitFor(() => {
                expect(screen.getByText(/How many days have you had fever/i)).toBeInTheDocument();
            });
        });

        it('should send message on Enter key press', async () => {
            const user = userEvent.setup({ delay: null });
            renderWithLanguageProvider('en');

            const input = screen.getByPlaceholderText(/Describe your health issue/i);

            await user.type(input, 'headache{Enter}');

            await waitFor(() => {
                expect(screen.getByText('headache')).toBeInTheDocument();
            });
        });

        it('should not send empty messages', async () => {
            const user = userEvent.setup({ delay: null });
            renderWithLanguageProvider('en');

            const sendButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'));
            await user.click(sendButton!);

            // Should only have the welcome message
            const messages = screen.getAllByText(/Hello! I am your health assistant/i);
            expect(messages).toHaveLength(1);
        });

        it('should clear input after sending message', async () => {
            const user = userEvent.setup({ delay: null });
            renderWithLanguageProvider('en');

            const input = screen.getByPlaceholderText(/Describe your health issue/i) as HTMLInputElement;
            const sendButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'));

            await user.type(input, 'cough');
            await user.click(sendButton!);

            await waitFor(() => {
                expect(input.value).toBe('');
            });
        });

        it('should show typing indicator while AI is responding', async () => {
            const user = userEvent.setup({ delay: null });
            renderWithLanguageProvider('en');

            const input = screen.getByPlaceholderText(/Describe your health issue/i);
            const sendButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'));

            await user.type(input, 'stomach pain');
            await user.click(sendButton!);

            await waitFor(() => {
                expect(screen.getByText(/AI is typing/i)).toBeInTheDocument();
            });
        });
    });

    describe('AI Response Generation', () => {
        it('should respond to fever query', async () => {
            const user = userEvent.setup({ delay: null });
            renderWithLanguageProvider('en');

            const input = screen.getByPlaceholderText(/Describe your health issue/i);
            const sendButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'));

            await user.type(input, 'I have fever');
            await user.click(sendButton!);

            vi.advanceTimersByTime(1500);

            await waitFor(() => {
                expect(screen.getByText(/How many days have you had fever/i)).toBeInTheDocument();
            });
        });

        it('should respond to stomach pain query', async () => {
            const user = userEvent.setup({ delay: null });
            renderWithLanguageProvider('en');

            const input = screen.getByPlaceholderText(/Describe your health issue/i);
            const sendButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'));

            await user.type(input, 'stomach pain');
            await user.click(sendButton!);

            vi.advanceTimersByTime(1500);

            await waitFor(() => {
                expect(screen.getByText(/Where is the stomach pain/i)).toBeInTheDocument();
            });
        });

        it('should respond to cold/cough query', async () => {
            const user = userEvent.setup({ delay: null });
            renderWithLanguageProvider('en');

            const input = screen.getByPlaceholderText(/Describe your health issue/i);
            const sendButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'));

            await user.type(input, 'I have a cough');
            await user.click(sendButton!);

            vi.advanceTimersByTime(1500);

            await waitFor(() => {
                expect(screen.getByText(/Do you have phlegm with cough/i)).toBeInTheDocument();
            });
        });

        it('should respond to headache query', async () => {
            const user = userEvent.setup({ delay: null });
            renderWithLanguageProvider('en');

            const input = screen.getByPlaceholderText(/Describe your health issue/i);
            const sendButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'));

            await user.type(input, 'headache');
            await user.click(sendButton!);

            vi.advanceTimersByTime(1500);

            await waitFor(() => {
                expect(screen.getByText(/How long have you had headache/i)).toBeInTheDocument();
            });
        });

        it('should provide default response for unknown symptoms', async () => {
            const user = userEvent.setup({ delay: null });
            renderWithLanguageProvider('en');

            const input = screen.getByPlaceholderText(/Describe your health issue/i);
            const sendButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'));

            await user.type(input, 'random symptom');
            await user.click(sendButton!);

            vi.advanceTimersByTime(1500);

            await waitFor(() => {
                expect(screen.getByText(/I understand. Please tell me more/i)).toBeInTheDocument();
            });
        });
    });

    describe('Chat Session Management', () => {
        it('should create a new chat session', async () => {
            const user = userEvent.setup({ delay: null });
            renderWithLanguageProvider('en');

            const newChatButton = screen.getByRole('button', { name: /New Chat/i });
            await user.click(newChatButton);

            const stored = localStorage.getItem(STORAGE_KEY);
            const sessions = JSON.parse(stored!);
            expect(sessions.length).toBeGreaterThan(1);
        });

        it('should switch between chat sessions', async () => {
            const user = userEvent.setup({ delay: null });
            renderWithLanguageProvider('en');

            // Send a message in first chat
            const input = screen.getByPlaceholderText(/Describe your health issue/i);
            const sendButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'));

            await user.type(input, 'First chat message');
            await user.click(sendButton!);

            await waitFor(() => {
                expect(screen.getByText('First chat message')).toBeInTheDocument();
            });

            // Create new chat
            const newChatButton = screen.getByRole('button', { name: /New Chat/i });
            await user.click(newChatButton);

            // Send message in second chat
            await user.type(input, 'Second chat message');
            await user.click(sendButton!);

            await waitFor(() => {
                expect(screen.getByText('Second chat message')).toBeInTheDocument();
                expect(screen.queryByText('First chat message')).not.toBeInTheDocument();
            });
        });

        it('should delete a chat session', async () => {
            const user = userEvent.setup({ delay: null });
            renderWithLanguageProvider('en');

            // Create a second chat
            const newChatButton = screen.getByRole('button', { name: /New Chat/i });
            await user.click(newChatButton);

            // Find and click delete button on chat history item
            const deleteButtons = screen.getAllByRole('button').filter(btn =>
                btn.querySelector('svg') && btn.className.includes('text-muted-foreground')
            );

            if (deleteButtons.length > 0) {
                await user.click(deleteButtons[0]);

                const stored = localStorage.getItem(STORAGE_KEY);
                const sessions = JSON.parse(stored!);
                expect(sessions.length).toBeLessThan(2);
            }
        });

        it('should update chat title based on first message', async () => {
            const user = userEvent.setup({ delay: null });
            renderWithLanguageProvider('en');

            const input = screen.getByPlaceholderText(/Describe your health issue/i);
            const sendButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'));

            await user.type(input, 'This is my health question');
            await user.click(sendButton!);

            await waitFor(() => {
                const stored = localStorage.getItem(STORAGE_KEY);
                const sessions = JSON.parse(stored!);
                expect(sessions[0].title).toContain('This is my health');
            });
        });
    });

    describe('Chat History Persistence', () => {
        it('should persist chat history to localStorage', async () => {
            const user = userEvent.setup({ delay: null });
            renderWithLanguageProvider('en');

            const input = screen.getByPlaceholderText(/Describe your health issue/i);
            const sendButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'));

            await user.type(input, 'Test message');
            await user.click(sendButton!);

            await waitFor(() => {
                const stored = localStorage.getItem(STORAGE_KEY);
                expect(stored).toBeTruthy();

                const sessions = JSON.parse(stored!);
                const userMessages = sessions[0].messages.filter((m: any) => m.role === 'user');
                expect(userMessages.some((m: any) => m.content === 'Test message')).toBe(true);
            });
        });

        it('should load chat history from localStorage on mount', () => {
            const mockHistory = [
                {
                    id: '123',
                    title: 'Previous Chat',
                    timestamp: new Date().toISOString(),
                    messages: [
                        {
                            id: '1',
                            role: 'assistant',
                            content: 'Hello!',
                            timestamp: new Date().toISOString(),
                        },
                        {
                            id: '2',
                            role: 'user',
                            content: 'Previous message',
                            timestamp: new Date().toISOString(),
                        },
                    ],
                },
            ];

            localStorage.setItem(STORAGE_KEY, JSON.stringify(mockHistory));
            renderWithLanguageProvider('en');

            expect(screen.getByText('Previous message')).toBeInTheDocument();
            expect(screen.getByText('Previous Chat')).toBeInTheDocument();
        });

        it('should handle corrupted localStorage data gracefully', () => {
            localStorage.setItem(STORAGE_KEY, 'invalid json');

            // Should not throw error and create new chat
            expect(() => renderWithLanguageProvider('en')).not.toThrow();
            expect(screen.getByText(/Hello! I am your health assistant/i)).toBeInTheDocument();
        });
    });

    describe('Multilingual Support', () => {
        it('should display UI in Hindi', () => {
            renderWithLanguageProvider('hi');

            expect(screen.getByText('AI सहायक')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /नई चैट/i })).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/अपनी स्वास्थ्य समस्या बताएं/i)).toBeInTheDocument();
        });

        it('should provide Hindi responses', async () => {
            const user = userEvent.setup({ delay: null });
            renderWithLanguageProvider('hi');

            const input = screen.getByPlaceholderText(/अपनी स्वास्थ्य समस्या बताएं/i);
            const sendButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'));

            await user.type(input, 'बुखार है');
            await user.click(sendButton!);

            vi.advanceTimersByTime(1500);

            await waitFor(() => {
                expect(screen.getByText(/बुखार कितने दिनों से है/i)).toBeInTheDocument();
            });
        });

        it('should create chat with Hindi title', async () => {
            const user = userEvent.setup({ delay: null });
            renderWithLanguageProvider('hi');

            const newChatButton = screen.getByRole('button', { name: /नई चैट/i });
            await user.click(newChatButton);

            const stored = localStorage.getItem(STORAGE_KEY);
            const sessions = JSON.parse(stored!);
            expect(sessions[0].title).toContain('नई चैट');
        });
    });

    describe('Error Handling', () => {
        it('should handle message sending while loading', async () => {
            const user = userEvent.setup({ delay: null });
            renderWithLanguageProvider('en');

            const input = screen.getByPlaceholderText(/Describe your health issue/i);
            const sendButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'));

            await user.type(input, 'First message');
            await user.click(sendButton!);

            // Try to send another message immediately
            await user.type(input, 'Second message');
            await user.click(sendButton!);

            // Should not send second message while first is loading
            await waitFor(() => {
                expect(screen.queryByText('Second message')).not.toBeInTheDocument();
            });
        });

        it('should disable send button while loading', async () => {
            const user = userEvent.setup({ delay: null });
            renderWithLanguageProvider('en');

            const input = screen.getByPlaceholderText(/Describe your health issue/i);
            const sendButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg')) as HTMLButtonElement;

            await user.type(input, 'Test');
            await user.click(sendButton);

            await waitFor(() => {
                expect(sendButton.disabled).toBe(true);
            });
        });

        it('should disable input while loading', async () => {
            const user = userEvent.setup({ delay: null });
            renderWithLanguageProvider('en');

            const input = screen.getByPlaceholderText(/Describe your health issue/i) as HTMLInputElement;
            const sendButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'));

            await user.type(input, 'Test');
            await user.click(sendButton!);

            await waitFor(() => {
                expect(input.disabled).toBe(true);
            });
        });
    });

    describe('Edge Cases', () => {
        it('should handle very long messages', async () => {
            const user = userEvent.setup({ delay: null });
            renderWithLanguageProvider('en');

            const longMessage = 'A'.repeat(500);
            const input = screen.getByPlaceholderText(/Describe your health issue/i);
            const sendButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'));

            await user.type(input, longMessage);
            await user.click(sendButton!);

            await waitFor(() => {
                expect(screen.getByText(longMessage)).toBeInTheDocument();
            });
        });

        it('should truncate long chat titles', async () => {
            const user = userEvent.setup({ delay: null });
            renderWithLanguageProvider('en');

            const longMessage = 'This is a very long message that should be truncated in the chat title';
            const input = screen.getByPlaceholderText(/Describe your health issue/i);
            const sendButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'));

            await user.type(input, longMessage);
            await user.click(sendButton!);

            await waitFor(() => {
                const stored = localStorage.getItem(STORAGE_KEY);
                const sessions = JSON.parse(stored!);
                expect(sessions[0].title.length).toBeLessThanOrEqual(28); // 25 chars + '...'
            });
        });

        it('should handle special characters in messages', async () => {
            const user = userEvent.setup({ delay: null });
            renderWithLanguageProvider('en');

            const specialMessage = 'Test <script>alert("xss")</script> & symbols!';
            const input = screen.getByPlaceholderText(/Describe your health issue/i);
            const sendButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'));

            await user.type(input, specialMessage);
            await user.click(sendButton!);

            await waitFor(() => {
                expect(screen.getByText(specialMessage)).toBeInTheDocument();
            });
        });
    });
});
