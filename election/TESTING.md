# Bharat Votes — Testing & Quality Assurance 🛡️

This document outlines the testing strategy, coverage, and manual test cases for the Bharat Votes application.

## 🧪 Testing Strategy

The project uses a professional multi-layered testing approach:
1.  **Automated Unit Testing**: Logic verification for core components using **Vitest**.
2.  **Integration Testing**: Verification of Gemini AI payload structures and error handling.
3.  **Manual UI/UX Testing**: Verification of responsive design across viewports.
4.  **Localization Testing**: Ensuring cross-language string consistency.

## 🤖 Automated Tests

We have implemented an automated test suite located in the `tests/` directory:
- `tests/eligibility.test.js`: Validates the age and citizenship logic for the voter eligibility checker.
- `tests/ai.test.js`: Validates the integration flow and prompt structure for the Gemini AI assistant.

To run the tests:
```bash
npm test
```

## 📋 Core Test Cases

| ID | Feature | Test Case | Expected Result | Status |
|---|---|---|---|---|
| TC01 | Navigation | Click all links in the navbar | Smooth scroll to the correct section | ✅ Pass |
| TC02 | Language | Switch between En/Hi/Mr | All text elements update immediately | ✅ Pass |
| TC03 | Eligibility | Enter age 17 + Citizen | "Not eligible" message appears | ✅ Pass |
| TC04 | Eligibility | Enter age 18 + Citizen | "Eligible" message with registration link appears | ✅ Pass |
| TC05 | AI Assistant | Ask "How to vote?" | AI provides accurate election info | ✅ Pass |
| TC06 | AI Assistant | Ask "What is the weather?" | AI politely declines (off-topic guardrail) | ✅ Pass |

## ⚠️ Edge Cases & Safeguards

-   **Invalid API Key**: Handled gracefully in `ai-assistant.js` with a clear error message and setup prompt.
-   **No Internet**: News feed and AI assistant show offline/retry states.
-   **Rapid Clicks**: Button debouncing in the Regional Hub and AI input prevents multiple requests.
-   **Empty Input**: Form validation on Eligibility Checker prevents submission without data.

## ♿ Accessibility (A11y) Tests

-   **Keyboard Nav**: Tab through the entire site (including the AI drawer).
-   **Screen Readers**: Verified ARIA labels and semantic HTML tags.
-   **Color Contrast**: Met WCAG AA standards for readability on glassmorphism backgrounds.

---
*Created for the #PromptWar Submission.*
