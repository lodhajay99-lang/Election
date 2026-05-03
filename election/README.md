# Bharat Votes 🇮🇳

**Bharat Votes** is a premium, interactive web application designed to educate and guide Indian citizens through the democratic process. It provides a comprehensive, multi-language experience covering everything from voter registration to election results.

![Bharat Votes Preview](assets/parliament_hero.png)

## ✨ Features

- **🏛️ Democratic Structure**: Visual hierarchy of Indian governance from Local Panchayats to the National Parliament.
- **📅 Interactive Timeline**: Step-by-step guide through the election phases with expandable detailed info.
- **🌍 Multi-Language Support**: Fully localized in **English**, **Hindi (हिंदी)**, and **Marathi (मराठी)** with Google Translate API integration.
- **🤖 Bharat AI Assistant**: A dedicated election expert powered by **Gemini 1.5 Flash** with custom system instructions and chat history.
- **📍 Regional Hub**: Localized election news and voting instructions based on State, District, and Taluka, featuring **Google Maps** integration.
- **🚶 Voter Journey**: A guided walk-through for new and existing voters with high-quality illustrations.
- **✅ Eligibility Checker**: A logic-based tool to check voting requirements.
- **📰 Live News Feed**: Real-time election news fetched via RSS from trusted sources.
- **🛡️ Security First**: Implemented Content Security Policy (CSP), HTML sanitization to prevent XSS, and local API key storage.
- **⚡ Performance Optimized**: Lazy loading, preconnect hints, and optimized assets for near-instant load times.
- **♿ Accessibility (A11y)**: WCAG AA compliant contrast, ARIA labels, and full keyboard navigation support.

## 🚀 Getting Started

### Prerequisites
- A modern web browser.
- (Optional) A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation & Deployment
1. **Local**: Open `index.html` or run `npm start`.
2. **Docker**: `docker build -t bharat-votes .`
3. **Cloud Run**: `npm run deploy` or use the included `cloudbuild.yaml` for automated CI/CD.

## 📁 Project Structure

```text
election/
├── assets/             # Images and premium illustrations
├── ai-assistant.js     # Gemini AI logic & UI
├── app.js              # Main app logic, News API, and Regional Hub
├── cloudbuild.yaml     # Google Cloud Build CI/CD configuration
├── data.js             # Regional data (States/Districts)
├── index.html          # Main entry point (SEO & A11y optimized)
├── package.json        # Project metadata and scripts
├── style.css           # Modern Design System (Glassmorphism)
├── TESTING.md          # Documentation of test cases and QA results
└── translations.js     # Static localization dictionary
```

## 🛡️ Security & Privacy

- **CSP**: Strict Content Security Policy implemented via meta tags.
- **Sanitization**: All dynamic content (AI responses, News) is sanitized before rendering.
- **Zero Server Storage**: API keys are stored locally in the browser's `localStorage`.

## ⚖️ Disclaimer

*This project is an independent educational tool and is **not affiliated** with the Election Commission of India (ECI). For official information, please always visit [eci.gov.in](https://eci.gov.in).*

---

Made with ❤️ for Indian Democracy.
