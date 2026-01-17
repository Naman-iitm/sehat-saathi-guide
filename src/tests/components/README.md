# Component Tests Documentation

This directory contains comprehensive unit tests for the Sehat Saathi Guide React components.

## Test Coverage

### SymptomTracker Component (`SymptomTracker.test.tsx`)

Tests cover the following functionality:

#### 1. **Symptom Addition**
- Adding symptoms with valid input
- Adding symptoms with descriptions
- Error handling for empty symptoms
- Input field clearing after addition
- Enter key press support

#### 2. **Symptom Deletion**
- Deleting individual symptoms
- UI updates after deletion

#### 3. **LocalStorage Persistence**
- Saving symptoms to localStorage
- Loading symptoms from localStorage on mount
- Handling corrupted localStorage data

#### 4. **Triage Result Display**
- High severity symptom detection (e.g., chest pain)
- Medium severity symptom detection (e.g., fatigue)
- No triage result when no symptoms exist

#### 5. **Export Functionality**
- CSV export
- PDF export
- Export button visibility

#### 6. **Voice Input Integration**
- Adding symptoms via voice input
- Voice input for descriptions

#### 7. **Multilingual Support**
- Hindi UI rendering
- English UI rendering
- Multilingual error messages
- Multilingual triage results

#### 8. **Edge Cases**
- Whitespace-only symptom names
- Multiple symptoms handling
- Date and time display

### AIAssistant Component (`AIAssistant.test.tsx`)

Tests cover the following functionality:

#### 1. **Initial Render**
- Welcome message display
- Input field and send button rendering
- Initial chat session creation

#### 2. **Message Sending and Receiving**
- User message sending
- AI response generation
- Enter key support
- Empty message prevention
- Input clearing after send
- Typing indicator display

#### 3. **AI Response Generation**
- Fever query responses
- Stomach pain query responses
- Cold/cough query responses
- Headache query responses
- Default responses for unknown symptoms

#### 4. **Chat Session Management**
- Creating new chat sessions
- Switching between sessions
- Deleting chat sessions
- Chat title updates

#### 5. **Chat History Persistence**
- Saving to localStorage
- Loading from localStorage on mount
- Handling corrupted data

#### 6. **Multilingual Support**
- Hindi UI rendering
- Hindi AI responses
- Hindi chat titles

#### 7. **Error Handling**
- Preventing messages while loading
- Button/input disabling during loading

#### 8. **Edge Cases**
- Very long messages
- Long chat title truncation
- Special characters handling

## Running Tests

### Run all tests:
```bash
npm run test
```

### Run tests in watch mode:
```bash
npm run test:watch
```

### Run tests with coverage:
```bash
npm run test:coverage
```

## Test Structure

Each test file follows this structure:

1. **Imports**: All necessary dependencies and mocks
2. **Mocking**: Mock external dependencies (toast, export utilities, etc.)
3. **Helper Functions**: Render functions with providers
4. **Test Suites**: Organized by functionality
5. **Setup/Teardown**: beforeEach/afterEach hooks for clean state

## Mocking Strategy

### External Libraries
- `sonner` (toast notifications): Mocked to verify calls
- `@/lib/exportUtils`: Mocked to test export functionality
- `VoiceInput`: Simplified mock component

### Browser APIs
- `localStorage`: Fully functional mock in `setup.ts`
- `matchMedia`: Mocked for responsive design tests
- `IntersectionObserver`: Mocked for scroll-based features
- `ResizeObserver`: Mocked for responsive components
- `scrollIntoView`: Mocked for auto-scroll features

## Coverage Goals

Both test suites aim for **>80% code coverage** including:
- Statement coverage
- Branch coverage
- Function coverage
- Line coverage

## Best Practices

1. **Isolation**: Each test is independent with clean state
2. **User-Centric**: Tests simulate real user interactions
3. **Async Handling**: Proper use of `waitFor` for async operations
4. **Accessibility**: Tests use accessible queries (getByRole, getByPlaceholderText)
5. **Multilingual**: Tests verify both English and Hindi functionality

## Troubleshooting

### Common Issues

1. **Timeout Errors**: Increase timeout or check async operations
2. **Element Not Found**: Ensure proper waiting with `waitFor`
3. **Mock Issues**: Verify mocks are properly cleared in `beforeEach`
4. **LocalStorage**: Check that localStorage is cleared between tests

## Contributing

When adding new tests:

1. Follow the existing structure
2. Add descriptive test names
3. Group related tests in describe blocks
4. Mock external dependencies
5. Clean up after tests
6. Verify multilingual support
7. Test edge cases
