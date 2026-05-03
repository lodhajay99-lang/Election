# Bharat Votes — Testing & Quality Assurance 🛡️

This document outlines the testing strategy, coverage, and manual test cases for the Bharat Votes application.

## 🧪 Testing Strategy

The project uses a multi-layered testing approach:
1.  **Manual UI/UX Testing**: Verification of responsive design across different viewports (Mobile, Tablet, Desktop).
2.  **Logic Validation**: Checking the Eligibility Checker and Regional Hub filters.
3.  **Integration Testing**: Verifying the Gemini AI Assistant's request/response flow.
4.  **Localization Testing**: Ensuring all strings are correctly translated in English, Hindi, and Marathi.

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
