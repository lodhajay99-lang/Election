/**
 * Bharat Votes — AI Election Assistant
 * Powered by Google Gemini API (free tier: gemini-1.5-flash)
 *
 * Features:
 *  - Gemini 1.5 Flash (free tier, no billing required)
 *  - API key stored in localStorage (browser-only, never sent to our servers)
 *  - Election-focused system prompt (refuses off-topic questions)
 *  - Chat history context (last 10 turns)
 *  - Auto-resizing textarea, Enter to send, Shift+Enter for newline
 *  - Typing indicator animation
 *  - Suggestion chips hide after first message
 *  - Clear chat button
 *  - Basic markdown rendering (bold, lists, links)
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     Constants
  ───────────────────────────────────────── */
  const GEMINI_MODEL = 'gemini-1.5-flash';
  const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
  const STORAGE_KEY = 'bharat_votes_gemini_key';
  const DEFAULT_API_KEY = 'AIzaSyBRFxWMZ8uyWdwS_B5R2e2HmasugwQPP0c';
  const MAX_HISTORY_TURNS = 10; // last N user+AI pairs kept in context

  const SYSTEM_INSTRUCTION = `You are "Bharat AI", a friendly and knowledgeable election assistant for the "Bharat Votes" web app — an interactive guide to Indian democracy.

Your ONLY purpose is to help voters with questions about:
- Indian elections (Lok Sabha, Rajya Sabha, State Assemblies, Local Body)
- Voter registration and eligibility
- The voting process (EVMs, VVPAT, polling booths, ink, NOTA)
- Election Commission of India (ECI) rules and guidelines
- Model Code of Conduct
- Election timelines and phases
- How to find polling stations or check voter rolls
- Candidate nominations and campaign rules
- Counting and government formation process
- Voter rights and grievance redressal (cVIGIL, helpline 1950)
- NRI voting
- Panchayati Raj, municipal elections and structure of government

If a user asks something completely unrelated to elections, democracy, or voter rights in India, politely decline and redirect them to an election-related question. Keep your response friendly, concise, and accurate. Use bullet points where helpful. Always encourage civic participation.

When citing official sources, refer users to eci.gov.in or voters.eci.gov.in.`;

  /* ─────────────────────────────────────────
     State
  ───────────────────────────────────────── */
  let apiKey = localStorage.getItem(STORAGE_KEY) || DEFAULT_API_KEY;
  let chatHistory = []; // Array of {role:'user'|'model', parts:[{text}]}
  let isStreaming = false;

  /* ─────────────────────────────────────────
     DOM References
  ───────────────────────────────────────── */
  const fab = document.getElementById('ai-fab');
  const panel = document.getElementById('ai-panel');
  const closeBtn = document.getElementById('ai-close');
  const clearBtn = document.getElementById('ai-clear');
  const sendBtn = document.getElementById('ai-send');
  const inputEl = document.getElementById('ai-input');
  const messagesEl = document.getElementById('ai-messages');
  const keySetup = document.getElementById('ai-key-setup');
  const keyInput = document.getElementById('ai-api-key-input');
  const keySave = document.getElementById('ai-key-save');
  const suggestionsEl = document.getElementById('ai-suggestions');
  const micBtn = document.getElementById('ai-mic');

  /* ─────────────────────────────────────────
     Panel open / close
  ───────────────────────────────────────── */
  function openPanel() {
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    fab.classList.add('panel-open');
    // Key is always available (embedded); only show setup if explicitly cleared
    if (!apiKey) {
      showKeySetup();
    } else {
      hideKeySetup();
      if (messagesEl.children.length === 0) renderWelcome();
      setTimeout(() => inputEl.focus(), 300);
    }
  }

  function closePanel() {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    fab.classList.remove('panel-open');
  }

  fab.addEventListener('click', openPanel);
  closeBtn.addEventListener('click', closePanel);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('open')) closePanel();
  });

  /* ─────────────────────────────────────────
     API Key Management
  ───────────────────────────────────────── */
  function showKeySetup() {
    keySetup.classList.add('visible');
    messagesEl.style.display = 'none';
    suggestionsEl.style.display = 'none';
    document.querySelector('.ai-input-bar').style.display = 'none';
    document.querySelector('.ai-disclaimer').style.display = 'none';
    setTimeout(() => keyInput.focus(), 300);
  }

  function hideKeySetup() {
    keySetup.classList.remove('visible');
    messagesEl.style.display = 'flex';
    suggestionsEl.style.display = 'flex';
    document.querySelector('.ai-input-bar').style.display = 'flex';
    document.querySelector('.ai-disclaimer').style.display = 'block';
  }

  keySave.addEventListener('click', () => {
    const val = keyInput.value.trim();
    if (!val || !val.startsWith('AIza')) {
      keyInput.style.borderColor = '#f87171';
      keyInput.placeholder = 'Must start with "AIza..."';
      setTimeout(() => {
        keyInput.style.borderColor = '';
        keyInput.placeholder = 'AIza...';
      }, 2500);
      return;
    }
    apiKey = val;
    localStorage.setItem(STORAGE_KEY, apiKey);
    hideKeySetup();
    if (messagesEl.children.length === 0) renderWelcome();
    setTimeout(() => inputEl.focus(), 300);
  });

  keyInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') keySave.click();
  });

  /* ─────────────────────────────────────────
     Clear Chat
  ───────────────────────────────────────── */
  clearBtn.addEventListener('click', () => {
    chatHistory = [];
    messagesEl.innerHTML = '';
    suggestionsEl.style.display = 'flex';
    renderWelcome();
  });

  /* ─────────────────────────────────────────
     Welcome Message
  ───────────────────────────────────────── */
  function renderWelcome() {
    const div = document.createElement('div');
    div.className = 'ai-welcome';
    div.innerHTML = `
      <span class="ai-welcome-emoji">🗳️</span>
      <strong style="color:#fff;font-family:'Outfit',sans-serif;font-size:1rem;">Hi! I'm Bharat AI</strong><br/>
      Ask me anything about <strong style="color:var(--accent-saffron)">Indian elections</strong> — voter registration, eligibility, EVMs, election process, and more.<br/>
      <span style="font-size:0.78rem;color:var(--text-muted);margin-top:6px;display:inline-block;">Try one of the suggestions below ↓</span>
    `;
    messagesEl.appendChild(div);
  }

  /* ─────────────────────────────────────────
     Suggestion Chips
  ───────────────────────────────────────── */
  suggestionsEl.querySelectorAll('.ai-suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-q');
      inputEl.value = q;
      sendMessage();
    });
  });

  /* ─────────────────────────────────────────
     Input Handling
  ───────────────────────────────────────── */
  inputEl.addEventListener('input', () => {
    // Auto-resize
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px';
  });

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  sendBtn.addEventListener('click', sendMessage);

  /* ─────────────────────────────────────────
     Send & API Call
  ───────────────────────────────────────── */
  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || isStreaming) return;
    if (!apiKey) { openPanel(); return; }

    // Hide suggestions after first message
    suggestionsEl.style.display = 'none';

    // Render user message
    appendMessage('user', text);
    inputEl.value = '';
    inputEl.style.height = 'auto';

    // Add to history
    chatHistory.push({ role: 'user', parts: [{ text }] });
    if (chatHistory.length > MAX_HISTORY_TURNS * 2) {
      chatHistory = chatHistory.slice(-MAX_HISTORY_TURNS * 2);
    }

    // Show typing indicator
    const typingEl = appendTyping();
    sendBtn.disabled = true;
    isStreaming = true;

    try {
      const responseText = await callGemini(chatHistory);
      typingEl.remove();
      appendMessage('ai', responseText);
      chatHistory.push({ role: 'model', parts: [{ text: responseText }] });
    } catch (err) {
      typingEl.remove();
      let errMsg = '⚠️ Something went wrong. ';
      const isKeyError = err.message && (err.message.includes('API_KEY_INVALID') || err.message.toLowerCase().includes('api key not valid'));
      const isQuotaError = err.message && (err.message.includes('QUOTA') || err.message.toLowerCase().includes('rate limit'));

      if (isKeyError) {
        errMsg += 'Your API key seems invalid. Click 🔑 below to update it.';
        // Clear stored key so setup shows again
        apiKey = '';
        localStorage.removeItem(STORAGE_KEY);
      } else if (isQuotaError) {
        errMsg += 'You have exceeded the free quota. Please wait a moment and try again.';
      } else {
        errMsg += err.message || 'Please check your internet connection and try again.';
      }
      appendMessage('ai', errMsg, true);
    } finally {
      sendBtn.disabled = false;
      isStreaming = false;
    }
  }

  /* ─────────────────────────────────────────
     Gemini API Call
  ───────────────────────────────────────── */
  async function callGemini(history) {
    const body = {
      contents: [
        { role: 'user', parts: [{ text: `INSTRUCTION: ${SYSTEM_INSTRUCTION}` }] },
        { role: 'model', parts: [{ text: "Understood. I am Bharat AI, your knowledgeable election assistant for Bharat Votes. I will only answer questions related to Indian elections and democracy as per your instructions. How can I help you today?" }] },
        ...history
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800,
        candidateCount: 1
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
      ]
    };

    const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const msg = errData?.error?.message || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    const data = await res.json();
    const candidate = data?.candidates?.[0];
    if (!candidate) throw new Error('No response from Gemini');

    // Handle safety blocks
    if (candidate.finishReason === 'SAFETY') {
      return "I'm sorry, I can't provide a response to that. Please ask an election-related question.";
    }

    return candidate.content?.parts?.[0]?.text || 'Sorry, I could not generate a response. Please try again.';
  }

  /* ─────────────────────────────────────────
     Message Rendering
  ───────────────────────────────────────── */
  function appendMessage(role, text, isError = false) {
    const wrapper = document.createElement('div');
    wrapper.className = `ai-msg ${role}${isError ? ' ai-msg-error' : ''}`;

    const avatarEl = document.createElement('div');
    avatarEl.className = 'ai-msg-avatar';
    avatarEl.textContent = role === 'ai' ? '🤖' : '👤';

    const bubble = document.createElement('div');
    bubble.className = 'ai-msg-bubble';
    bubble.innerHTML = renderMarkdown(text);

    wrapper.appendChild(avatarEl);
    wrapper.appendChild(bubble);
    messagesEl.appendChild(wrapper);
    scrollToBottom();
    return wrapper;
  }

  function appendTyping() {
    const wrapper = document.createElement('div');
    wrapper.className = 'ai-msg ai ai-typing';

    const avatarEl = document.createElement('div');
    avatarEl.className = 'ai-msg-avatar';
    avatarEl.textContent = '🤖';

    const bubble = document.createElement('div');
    bubble.className = 'ai-msg-bubble';
    bubble.innerHTML = '<div class="ai-typing-dots"><span></span><span></span><span></span></div>';

    wrapper.appendChild(avatarEl);
    wrapper.appendChild(bubble);
    messagesEl.appendChild(wrapper);
    scrollToBottom();
    return wrapper;
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  /* ─────────────────────────────────────────
     Lightweight Markdown Renderer
     Supports: **bold**, *italic*, ## headers,
     - bullet lists, numbered lists, [links](url)
  ───────────────────────────────────────── */
  function renderMarkdown(text) {
    // Escape HTML first
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Headers
    html = html.replace(/^### (.+)$/gm, '<strong style="font-size:0.95rem">$1</strong>');
    html = html.replace(/^## (.+)$/gm, '<strong style="font-size:1rem">$1</strong>');
    html = html.replace(/^# (.+)$/gm, '<strong style="font-size:1.05rem">$1</strong>');

    // Bold and italic
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Links
    html = html.replace(/\[(.+?)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // Process lines for lists and paragraphs
    const lines = html.split('\n');
    const result = [];
    let inUL = false;
    let inOL = false;

    lines.forEach((line) => {
      const ulMatch = line.match(/^[\-\*] (.+)/);
      const olMatch = line.match(/^\d+\. (.+)/);

      if (ulMatch) {
        if (!inUL) { result.push('<ul>'); inUL = true; }
        if (inOL) { result.push('</ol>'); inOL = false; }
        result.push(`<li>${ulMatch[1]}</li>`);
      } else if (olMatch) {
        if (!inOL) { result.push('<ol>'); inOL = true; }
        if (inUL) { result.push('</ul>'); inUL = false; }
        result.push(`<li>${olMatch[1]}</li>`);
      } else {
        if (inUL) { result.push('</ul>'); inUL = false; }
        if (inOL) { result.push('</ol>'); inOL = false; }
        if (line.trim() === '') {
          result.push('<br/>');
        } else {
          result.push(`<p>${line}</p>`);
        }
      }
    });

    if (inUL) result.push('</ul>');
    if (inOL) result.push('</ol>');

    return result.join('');
  }

  /* ─────────────────────────────────────────
     Key change button (in header clear area)
     Let users update their API key via clear
     then re-setup if key is missing
  ───────────────────────────────────────── */
  // Long-press or double-click clear to change API key
  let clearPressTimer = null;
  clearBtn.addEventListener('mousedown', () => {
    clearPressTimer = setTimeout(() => {
      if (confirm('Do you want to change your Gemini API key?\n\nLeave blank to restore the default key.')) {
        apiKey = '';
        localStorage.removeItem(STORAGE_KEY);
        chatHistory = [];
        messagesEl.innerHTML = '';
        showKeySetup();
      }
    }, 800);
  });
  clearBtn.addEventListener('mouseup', () => clearTimeout(clearPressTimer));
  clearBtn.addEventListener('mouseleave', () => clearTimeout(clearPressTimer));

  /* ─────────────────────────────────────────
     Voice Typing (Speech Recognition)
  ───────────────────────────────────────── */
  function initVoiceTyping() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      micBtn.style.display = 'none';
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN'; // Optimized for Indian accent

    let isRecording = false;

    micBtn.addEventListener('click', () => {
      if (isRecording) {
        recognition.stop();
      } else {
        try {
          recognition.start();
          isRecording = true;
          micBtn.classList.add('recording');
          const currentLang = document.documentElement.lang || 'en';
          const trans = window.translations ? window.translations[currentLang] : null;
          inputEl.placeholder = trans && trans['ai_listening'] ? trans['ai_listening'] : 'Listening...';
        } catch (err) {
          console.error('Speech recognition error:', err);
        }
      }
    });

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      inputEl.value = transcript;
      // Trigger auto-resize
      inputEl.style.height = 'auto';
      inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px';
    };

    recognition.onend = () => {
      isRecording = false;
      micBtn.classList.remove('recording');
      const currentLang = document.documentElement.lang || 'en';
      const trans = window.translations ? window.translations[currentLang] : null;
      inputEl.placeholder = trans && trans['ai_placeholder'] ? trans['ai_placeholder'] : 'Ask anything about Indian elections...';
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      isRecording = false;
      micBtn.classList.remove('recording');
      const currentLang = document.documentElement.lang || 'en';
      const trans = window.translations ? window.translations[currentLang] : null;
      inputEl.placeholder = trans && trans['ai_placeholder'] ? trans['ai_placeholder'] : 'Ask anything about Indian elections...';
    };
  }

  initVoiceTyping();
})();
