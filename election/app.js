// ── Utils ──
const Utils = {
  sanitizeHTML: (str) => {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  },
  
  debounce: (fn, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  }
};

// ── Particles ──
function createParticles() {
  const container = document.querySelector('.particles');
  if (!container) return;
  const colors = ['#FF9933', '#138808', '#3b82f6', '#a855f7'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 4 + 2;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDuration = (Math.random() * 15 + 10) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    container.appendChild(p);
  }
}

// ── Navbar scroll ──
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  toggle?.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.textContent = links.classList.contains('open') ? '✕' : '☰';
  });

  // Active link highlight
  const sections = document.querySelectorAll('.section[id]');
  const navAs = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 200) current = s.id;
    });
    navAs.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });

  // Close mobile menu on link click
  navAs.forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.textContent = '☰';
  }));
}

// ── Scroll Animations ──
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.timeline-item, .process-card, .stat-card').forEach(el => {
    observer.observe(el);
  });
}

// ── Counter Animation ──
function animateCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffixKey = el.getAttribute('data-suffix-i18n');
        const currentLang = document.documentElement.lang || 'en';
        const trans = window.translations ? window.translations[currentLang] : (typeof translations !== 'undefined' ? translations[currentLang] : null);
        const suffix = (trans && suffixKey && trans[suffixKey]) ? trans[suffixKey] : (el.dataset.suffix || '');
        const prefix = el.dataset.prefix || '';
        let current = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          
          // Re-fetch suffix inside timer in case language changes during animation
          const activeLang = document.documentElement.lang || 'en';
          const activeTrans = window.translations ? window.translations[activeLang] : (typeof translations !== 'undefined' ? translations[activeLang] : null);
          const activeSuffix = (activeTrans && suffixKey && activeTrans[suffixKey]) ? activeTrans[suffixKey] : (el.dataset.suffix || '');
          
          el.textContent = prefix + Math.floor(current).toLocaleString('en-IN') + activeSuffix;
        }, 20);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));
}

// ── Timeline Expand ──
function initTimeline() {
  document.querySelectorAll('.expand-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.timeline-card');
      const expand = card.querySelector('.timeline-expand');
      const isOpen = expand.classList.contains('open');
      // Close all
      document.querySelectorAll('.timeline-expand').forEach(ex => ex.classList.remove('open'));
      document.querySelectorAll('.expand-btn').forEach(b => b.innerHTML = 'Learn more <span>→</span>');
      if (!isOpen) {
        expand.classList.add('open');
        btn.innerHTML = 'Show less <span>↑</span>';
      }
    });
  });
}

// ── FAQ Accordion ──
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(fi => {
        fi.classList.remove('active');
        fi.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

// ── Eligibility Checker ──
function initChecker() {
  const form = document.getElementById('eligibility-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const age = parseInt(document.getElementById('checker-age').value);
    const citizen = document.getElementById('checker-citizen').value;
    const resultBox = document.getElementById('checker-result');

    resultBox.className = 'result-box';

    if (isNaN(age) || !citizen) {
      resultBox.className = 'result-box not-eligible';
      resultBox.innerHTML = '<strong>⚠️ Please fill in all fields.</strong>';
      return;
    }

    if (age >= 18 && citizen === 'yes') {
      resultBox.className = 'result-box eligible';
      resultBox.innerHTML = `
        <strong>✅ You are eligible to vote!</strong>
        <p style="margin-top:8px;">As an Indian citizen aged ${age}, you meet the eligibility criteria.
        Make sure you are registered on the electoral roll. Visit <a href="https://voters.eci.gov.in" target="_blank" style="color:#4ade80;">voters.eci.gov.in</a> to check or register.</p>`;
    } else if (age < 18) {
      resultBox.className = 'result-box not-eligible';
      resultBox.innerHTML = `
        <strong>❌ You are not yet eligible.</strong>
        <p style="margin-top:8px;">You must be at least 18 years old on the qualifying date. You can apply 6 months before you turn 18.</p>`;
    } else {
      resultBox.className = 'result-box not-eligible';
      resultBox.innerHTML = `
        <strong>❌ Only Indian citizens can vote in Indian elections.</strong>
        <p style="margin-top:8px;">Overseas citizens of India (OCI) cardholders are not eligible to vote. Only Indian passport holders can register.</p>`;
    }
  });
}

// ── Voter Journey Tabs ──
function initJourneyTabs() {
  const tabs = document.querySelectorAll('.journey-tab');
  const panels = document.querySelectorAll('.journey-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.panel).classList.add('active');
    });
  });
}

// ── Ashoka Chakra SVG ──
function createAshokaSVG() {
  return `<svg class="ashoka" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="none" stroke="#FF9933" stroke-width="2"/>
    <circle cx="50" cy="50" r="8" fill="#000080"/>
    ${Array.from({length: 24}, (_, i) => {
      const angle = (i * 15) * Math.PI / 180;
      const x1 = 50 + 12 * Math.cos(angle);
      const y1 = 50 + 12 * Math.sin(angle);
      const x2 = 50 + 44 * Math.cos(angle);
      const y2 = 50 + 44 * Math.sin(angle);
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#000080" stroke-width="1.5"/>`;
    }).join('')}
    <circle cx="50" cy="50" r="44" fill="none" stroke="#000080" stroke-width="1.5"/>
  </svg>`;
}

// ── Google Translate API Config ──
// Replace with your actual API key from https://console.cloud.google.com/
const GOOGLE_TRANSLATE_API_KEY = 'YOUR_API_KEY_HERE';
const translateCache = {};

// ── Apply Translations from object ──
function applyTranslations(trans, lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (trans[key]) el.innerHTML = trans[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (trans[key]) el.setAttribute('placeholder', trans[key]);
  });
  document.querySelectorAll('.stat-number').forEach(el => {
    const suffixKey = el.getAttribute('data-suffix-i18n');
    if (suffixKey && trans[suffixKey]) {
      const target = el.getAttribute('data-target');
      const prefix = el.getAttribute('data-prefix') || '';
      el.textContent = prefix + parseInt(target).toLocaleString('en-IN') + trans[suffixKey];
    }
  });
  document.documentElement.lang = lang;
}

// ── Google Translate API ──
async function translateWithGoogle(texts, targetLang) {
  const cacheKey = targetLang + ':' + texts.slice(0, 3).join('|');
  if (translateCache[cacheKey]) return translateCache[cacheKey];

  const body = { q: texts, target: targetLang, source: 'en', format: 'html' };
  const res = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  );
  if (!res.ok) throw new Error('Google Translate API error: ' + res.status);
  const data = await res.json();
  const result = data.data.translations.map(t => t.translatedText);
  translateCache[cacheKey] = result;
  return result;
}

// ── Language Switcher ──
function initLanguageSwitcher() {
  const langSwitch = document.getElementById('lang-switch');
  if (!langSwitch) return;

  langSwitch.addEventListener('change', async (e) => {
    const lang = e.target.value;

    // Always try static translations first
    const staticTrans = window.translations && window.translations[lang];
    if (staticTrans) {
      applyTranslations(staticTrans, lang);
      return;
    }

    // For unsupported langs (or if API key set), try Google Translate
    if (GOOGLE_TRANSLATE_API_KEY === 'YOUR_API_KEY_HERE') {
      console.warn('Google Translate API key not set. Add your key to app.js.');
      return;
    }

    // Show loading state on lang switcher
    langSwitch.disabled = true;
    const originalLabel = langSwitch.options[langSwitch.selectedIndex].text;

    try {
      // Collect all English text to translate
      const enTrans = window.translations && window.translations['en'];
      if (!enTrans) throw new Error('English base translations not found');

      const keys = Object.keys(enTrans);
      const values = keys.map(k => enTrans[k]);

      // Batch into chunks of 100 (API limit)
      const CHUNK = 100;
      const translated = [];
      for (let i = 0; i < values.length; i += CHUNK) {
        const chunk = values.slice(i, i + CHUNK);
        const results = await translateWithGoogle(chunk, lang);
        translated.push(...results);
      }

      // Build translated object
      const dynamicTrans = {};
      keys.forEach((k, i) => { dynamicTrans[k] = translated[i]; });

      // Cache in window.translations for subsequent switches
      if (window.translations) window.translations[lang] = dynamicTrans;

      applyTranslations(dynamicTrans, lang);
    } catch (err) {
      console.error('Translation failed:', err);
      // Fallback: switch back to English
      if (window.translations && window.translations['en']) {
        applyTranslations(window.translations['en'], 'en');
        langSwitch.value = 'en';
      }
    } finally {
      langSwitch.disabled = false;
    }
  });
}

// ── Fetch Election News ──
async function fetchElectionNews() {
  const loading = document.getElementById('news-loading');
  const error = document.getElementById('news-error');
  const grid = document.getElementById('news-grid');
  if (!grid) return;

  try {
    const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms');
    const data = await response.json();
    
    if (data.status === 'ok') {
      loading.style.display = 'none';
      error.style.display = 'none';
      
      const items = data.items.slice(0, 3); // Get top 3 news
      
      grid.innerHTML = items.map(item => {
        // Extract a clean image if possible, otherwise placeholder
        const imgMatch = item.content.match(/src="(https:\/\/[^"]+)"/);
        let imgUrl = item.thumbnail || (imgMatch ? imgMatch[1] : 'assets/parliament_hero.png');
        if (imgUrl.includes('photo/')) imgUrl = imgUrl; // ToI specific tweak
        
        // Clean description text
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = item.description;
        const cleanDesc = tempDiv.textContent || tempDiv.innerText || "";
        const shortDesc = cleanDesc.substring(0, 120) + '...';
        
        // Format date
        const date = new Date(item.pubDate).toLocaleDateString('en-IN', {
          day: 'numeric', month: 'short', year: 'numeric'
        });
        
        const currentLang = document.documentElement.lang || 'en';
        const trans = window.translations ? window.translations[currentLang] : null;
        const readMoreText = trans && trans['read_more'] ? trans['read_more'] : 'Read more →';

        return `
          <div class="news-card">
            <img src="${imgUrl}" alt="News Image" class="news-img" onerror="this.src='assets/parliament_hero.png'" loading="lazy">
            <div class="news-content">
              <div class="news-date">${Utils.sanitizeHTML(date)}</div>
              <h3 class="news-title">${Utils.sanitizeHTML(item.title)}</h3>
              <p class="news-desc">${Utils.sanitizeHTML(shortDesc)}</p>
              <a href="${item.link}" target="_blank" rel="noopener" class="news-link"><span data-i18n="read_more">${readMoreText}</span></a>
            </div>
          </div>
        `;
      }).join('');
    } else {
      throw new Error('API Error');
    }
  } catch (err) {
    console.error('Failed to fetch news:', err);
    loading.style.display = 'none';
    error.style.display = 'block';
  }
}

// ── Regional Hub Logic ──
function initRegionalHub() {
  const stateSelect = document.getElementById('state-select');
  const districtSelect = document.getElementById('district-select');
  const talukaSelect = document.getElementById('taluka-select');
  const getInfoBtn = document.getElementById('get-regional-info');
  const regionalContent = document.getElementById('regional-content');
  
  if (!stateSelect || typeof regionalData === 'undefined') return;

  // Populate States
  Object.keys(regionalData).forEach(state => {
    const option = document.createElement('option');
    option.value = state;
    option.textContent = state;
    stateSelect.appendChild(option);
  });

  // State Change
  stateSelect.addEventListener('change', (e) => {
    const state = e.target.value;
    
    // Reset child dropdowns
    districtSelect.innerHTML = '<option value="" data-i18n="option_district">-- Select District --</option>';
    talukaSelect.innerHTML = '<option value="" data-i18n="option_taluka">-- Select Taluka --</option>';
    talukaSelect.disabled = true;
    getInfoBtn.disabled = true;
    regionalContent.style.display = 'none';

    if (state && regionalData[state]) {
      districtSelect.disabled = false;
      Object.keys(regionalData[state]).forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
      });
    } else {
      districtSelect.disabled = true;
    }
  });

  // District Change
  districtSelect.addEventListener('change', (e) => {
    const state = stateSelect.value;
    const district = e.target.value;

    // Reset child dropdown
    talukaSelect.innerHTML = '<option value="" data-i18n="option_taluka">-- Select Taluka --</option>';
    getInfoBtn.disabled = true;
    regionalContent.style.display = 'none';

    if (state && district && regionalData[state][district]) {
      talukaSelect.disabled = false;
      regionalData[state][district].forEach(taluka => {
        const option = document.createElement('option');
        option.value = taluka;
        option.textContent = taluka;
        talukaSelect.appendChild(option);
      });
    } else {
      talukaSelect.disabled = true;
    }
  });

  // Taluka Change
  talukaSelect.addEventListener('change', (e) => {
    getInfoBtn.disabled = !e.target.value;
    regionalContent.style.display = 'none';
  });

  // Get Info Button Click
  getInfoBtn.addEventListener('click', () => {
    const state = stateSelect.value;
    const district = districtSelect.value;
    const taluka = talukaSelect.value;

    if (state && district && taluka) {
      document.getElementById('display-location').textContent = taluka;
      
      const currentLang = document.documentElement.lang || 'en';
      const trans = window.translations ? window.translations[currentLang] : null;

      // Setup Local Instructions
      const boothText = trans && trans['booth_instruction'] ? trans['booth_instruction'] : 'Find polling stations under {taluka} taluka on the ECI portal.';
      const helplineText = trans && trans['helpline_instruction'] ? trans['helpline_instruction'] : 'Contact {district} District Collectorate election helpline for assistance.';
      
      // Add Google Maps link for booth locator
      const mapsUrl = `https://www.google.com/maps/search/polling+station+near+${encodeURIComponent(taluka + ', ' + district)}`;
      const mapsLink = `<br/><a href="${mapsUrl}" target="_blank" rel="noopener" style="color:var(--accent-saffron); font-size:0.85rem; text-decoration:underline;">📍 View on Google Maps</a>`;
      
      document.getElementById('regional-booth-text').innerHTML = Utils.sanitizeHTML(boothText.replace('{taluka}', taluka)) + mapsLink;
      document.getElementById('regional-helpline-text').textContent = helplineText.replace('{district}', district);

      regionalContent.style.display = 'block';
      fetchRegionalNews(taluka, district, state);
      
      // Scroll to content
      setTimeout(() => {
        regionalContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  });
}

async function fetchRegionalNews(taluka, district, state) {
  const loading = document.getElementById('regional-news-loading');
  const error = document.getElementById('regional-news-error');
  const grid = document.getElementById('regional-news-grid');
  
  if (!grid) return;
  
  loading.style.display = 'block';
  error.style.display = 'none';
  grid.innerHTML = '';

  try {
    // Construct search query for Google News
    const query = encodeURIComponent(`election ${taluka} OR ${district} OR ${state}`);
    const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=en-IN&gl=IN&ceid=IN:en`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (data.status === 'ok' && data.items && data.items.length > 0) {
      loading.style.display = 'none';
      
      const items = data.items.slice(0, 3);
      
      grid.innerHTML = items.map(item => {
        const currentLang = document.documentElement.lang || 'en';
        const trans = window.translations ? window.translations[currentLang] : null;
        const readMoreText = trans && trans['read_more'] ? trans['read_more'] : 'Read more →';
        
        // Google news RSS doesn't reliably give thumbnails, use fallback
        const imgUrl = 'assets/parliament_hero.png';
        
        // Clean description (Google News RSS puts HTML in description)
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = item.description;
        // Try to get just text, not links
        let cleanDesc = tempDiv.textContent || tempDiv.innerText || "";
        // Remove "Read full article" type text
        cleanDesc = cleanDesc.replace(/Read full article.+/gi, '').trim();
        const shortDesc = cleanDesc.length > 120 ? cleanDesc.substring(0, 120) + '...' : cleanDesc;
        
        const date = new Date(item.pubDate).toLocaleDateString('en-IN', {
          day: 'numeric', month: 'short', year: 'numeric'
        });

        return `
          <div class="news-card">
            <img src="${imgUrl}" alt="News Image" class="news-img">
            <div class="news-content">
              <div class="news-date">${date}</div>
              <h3 class="news-title" style="font-size: 1.05rem;">${item.title}</h3>
              <p class="news-desc">${shortDesc}</p>
              <a href="${item.link}" target="_blank" class="news-link"><span data-i18n="read_more">${readMoreText}</span></a>
            </div>
          </div>
        `;
      }).join('');
    } else {
      throw new Error('No news items found or API Error');
    }
  } catch (err) {
    console.error('Failed to fetch regional news:', err);
    loading.style.display = 'none';
    error.style.display = 'block';
  }
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  // Insert Ashoka Chakra
  const brand = document.querySelector('.nav-brand');
  if (brand) brand.insertAdjacentHTML('afterbegin', createAshokaSVG());

  createParticles();
  initNavbar();
  initScrollAnimations();
  animateCounters();
  initTimeline();
  initFAQ();
  initChecker();
  initJourneyTabs();
  initLanguageSwitcher();
  initRegionalHub();
  fetchElectionNews();
});
