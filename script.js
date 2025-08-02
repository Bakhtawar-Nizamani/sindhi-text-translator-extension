// Sindhi Translator Web Application JavaScript

class SindhiTranslator {
    constructor() {
        this.apiKey = null;
        this.isTranslating = false;
        this.translationHistory = [];
        
        this.initializeElements();
        this.bindEvents();
        this.loadSettings();
        this.setupMockTranslations();
    }

    initializeElements() {
        // Main elements
        this.inputText = document.getElementById('input-text');
        this.outputText = document.getElementById('output-text');
        this.translateBtn = document.getElementById('translate-btn');
        this.charCount = document.getElementById('char-count');
        
        // Action buttons
        this.clearBtn = document.getElementById('clear-btn');
        this.pasteBtn = document.getElementById('paste-btn');
        this.copyBtn = document.getElementById('copy-btn');
        this.speakBtn = document.getElementById('speak-btn');
        
        // UI elements
        this.loadingOverlay = document.getElementById('loading-overlay');
        this.notification = document.getElementById('notification');
        
        // Quick phrases
        this.phraseButtons = document.querySelectorAll('.phrase-btn');
    }

    bindEvents() {
        // Main functionality
        this.translateBtn.addEventListener('click', () => this.translateText());
        this.inputText.addEventListener('input', () => this.updateCharCount());
        this.inputText.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.translateText();
            }
        });

        // Action buttons
        this.clearBtn.addEventListener('click', () => this.clearText());
        this.pasteBtn.addEventListener('click', () => this.pasteText());
        this.copyBtn.addEventListener('click', () => this.copyTranslation());
        this.speakBtn.addEventListener('click', () => this.speakTranslation());

        // Quick phrases
        this.phraseButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const text = btn.dataset.text;
                this.inputText.value = text;
                this.updateCharCount();
                this.translateText();
            });
        });

        // Notification close
        const notificationClose = document.querySelector('.notification-close');
        if (notificationClose) {
            notificationClose.addEventListener('click', () => this.hideNotification());
        }

        // Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupMockTranslations() {
        // Mock translations for demo purposes
        this.mockTranslations = {
            'hello': 'سلام',
            'thank you': 'توهان جو شكريو',
            'good morning': 'صبح جو سلام',
            'how are you': 'توهان ڪيئن آهيو',
            'how are you?': 'توهان ڪيئن آهيو؟',
            'welcome': 'ڀلي ڪري آيا',
            'please': 'مهرباني',
            'excuse me': 'معاف ڪجو',
            'i love you': 'مان توهان سان پيار ڪريان ٿو',
            'goodbye': 'الوداع',
            'yes': 'ها',
            'no': 'نه',
            'water': 'پاڻي',
            'food': 'کاڌو',
            'house': 'گهر',
            'family': 'خاندان',
            'friend': 'دوست',
            'book': 'ڪتاب',
            'school': 'اسڪول',
            'work': 'ڪم',
            'time': 'وقت',
            'day': 'ڏينهن',
            'night': 'رات',
            'sun': 'سج',
            'moon': 'چنڊ',
            'beautiful': 'خوبصورت',
            'good': 'سٺو',
            'bad': 'خراب',
            'help': 'مدد',
            'sorry': 'معاف ڪجو',
            'computer': 'ڪمپيوٽر',
            'internet': 'انٽرنيٽ',
            'website': 'ويب سائيٽ',
            'application': 'ايپليڪيشن',
            'software': 'سافٽ ويئر'
        };
    }

    async translateText() {
        const text = this.inputText.value.trim();
        
        if (!text) {
            this.showNotification('Please enter text to translate', 'warning');
            return;
        }

        if (this.isTranslating) {
            return;
        }

        this.isTranslating = true;
        this.showLoading();
        this.updateTranslateButton(true);

        try {
            let translation;
            
            if (this.apiKey) {
                translation = await this.callOpenAIAPI(text);
            } else {
                translation = await this.getMockTranslation(text);
            }

            this.displayTranslation(translation);
            this.addToHistory(text, translation);
            this.showNotification('Translation completed successfully!', 'success');
            
        } catch (error) {
            console.error('Translation error:', error);
            this.showNotification('Translation failed. Please try again.', 'error');
            this.displayError();
        } finally {
            this.isTranslating = false;
            this.hideLoading();
            this.updateTranslateButton(false);
        }
    }

    async callOpenAIAPI(text) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a professional translator. Translate the given text to Sindhi language. Provide only the translation without any additional text or explanation. Use proper Sindhi script (Arabic script).'
                    },
                    {
                        role: 'user',
                        content: `Translate this text to Sindhi: "${text}"`
                    }
                ],
                max_tokens: 500,
                temperature: 0.3
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content?.trim() || 'Translation unavailable';
    }

    async getMockTranslation(text) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        
        const lowerText = text.toLowerCase().trim();
        
        // Check for exact matches first
        if (this.mockTranslations[lowerText]) {
            return this.mockTranslations[lowerText];
        }
        
        // Check for partial matches
        for (const [english, sindhi] of Object.entries(this.mockTranslations)) {
            if (lowerText.includes(english)) {
                return sindhi;
            }
        }
        
        // Generic response for unknown text
        if (text.length < 50) {
            return `[${text} جو سنڌي ترجمو]`;
        } else {
            return 'هي متن سنڌي ۾ ترجمو ڪيو ويو آهي. مڪمل ترجمي لاءِ OpenAI API key جي ضرورت آهي.';
        }
    }

    displayTranslation(translation) {
        this.outputText.innerHTML = `<div class="translation-result fade-in">${translation}</div>`;
        this.outputText.classList.add('has-content');
    }

    displayError() {
        this.outputText.innerHTML = `
            <div class="error-content">
                <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                <p>Translation failed</p>
                <span>Please try again</span>
            </div>
        `;
    }

    updateCharCount() {
        const count = this.inputText.value.length;
        this.charCount.textContent = `${count} character${count !== 1 ? 's' : ''}`;
        
        // Enable/disable translate button
        this.translateBtn.disabled = count === 0 || this.isTranslating;
    }

    updateTranslateButton(isLoading) {
        if (isLoading) {
            this.translateBtn.innerHTML = `
                <div class="loading-spinner-small"></div>
                Translating...
            `;
            this.translateBtn.disabled = true;
        } else {
            this.translateBtn.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 0 1 6.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
                </svg>
                Translate
            `;
            this.translateBtn.disabled = this.inputText.value.trim().length === 0;
        }
    }

    clearText() {
        this.inputText.value = '';
        this.outputText.innerHTML = `
            <div class="placeholder-content">
                <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 0 1 6.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
                </svg>
                <p>Translation will appear here</p>
                <span>Enter text above and click translate</span>
            </div>
        `;
        this.outputText.classList.remove('has-content');
        this.updateCharCount();
        this.inputText.focus();
    }

    async pasteText() {
        try {
            const text = await navigator.clipboard.readText();
            this.inputText.value = text;
            this.updateCharCount();
            this.showNotification('Text pasted successfully!', 'success');
        } catch (error) {
            this.showNotification('Failed to paste text', 'error');
        }
    }

    async copyTranslation() {
        const translationElement = this.outputText.querySelector('.translation-result');
        
        if (!translationElement) {
            this.showNotification('No translation to copy', 'warning');
            return;
        }

        try {
            await navigator.clipboard.writeText(translationElement.textContent);
            this.showNotification('Translation copied to clipboard!', 'success');
            
            // Visual feedback
            const originalIcon = this.copyBtn.innerHTML;
            this.copyBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
            `;
            this.copyBtn.style.background = '#10b981';
            
            setTimeout(() => {
                this.copyBtn.innerHTML = originalIcon;
                this.copyBtn.style.background = '';
            }, 2000);
            
        } catch (error) {
            this.showNotification('Failed to copy translation', 'error');
        }
    }

    speakTranslation() {
        const translationElement = this.outputText.querySelector('.translation-result');
        
        if (!translationElement) {
            this.showNotification('No translation to speak', 'warning');
            return;
        }

        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(translationElement.textContent);
            utterance.lang = 'ur'; // Use Urdu as closest language for Sindhi
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
            
            this.showNotification('Playing pronunciation...', 'info');
        } else {
            this.showNotification('Speech synthesis not supported', 'warning');
        }
    }

    addToHistory(original, translated) {
        const historyItem = {
            original,
            translated,
            timestamp: Date.now()
        };
        
        this.translationHistory.unshift(historyItem);
        
        // Keep only last 10 translations
        if (this.translationHistory.length > 10) {
            this.translationHistory = this.translationHistory.slice(0, 10);
        }
        
        this.saveToLocalStorage();
    }

    showLoading() {
        this.loadingOverlay.style.display = 'flex';
    }

    hideLoading() {
        this.loadingOverlay.style.display = 'none';
    }

    showNotification(message, type = 'info') {
        const notificationText = this.notification.querySelector('.notification-text');
        notificationText.textContent = message;
        
        // Update notification style based on type
        const notificationContent = this.notification.querySelector('.notification-content');
        notificationContent.className = `notification-content notification-${type}`;
        
        this.notification.style.display = 'block';
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
            this.hideNotification();
        }, 4000);
    }

    hideNotification() {
        this.notification.style.display = 'none';
    }

    loadSettings() {
        // Load API key from localStorage
        const savedApiKey = localStorage.getItem('sindhi-translator-api-key');
        if (savedApiKey) {
            this.apiKey = savedApiKey;
        }
        
        // Load translation history
        const savedHistory = localStorage.getItem('sindhi-translator-history');
        if (savedHistory) {
            try {
                this.translationHistory = JSON.parse(savedHistory);
            } catch (error) {
                console.error('Failed to load translation history:', error);
            }
        }
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('sindhi-translator-history', JSON.stringify(this.translationHistory));
        } catch (error) {
            console.error('Failed to save translation history:', error);
        }
    }

    // Public method to set API key
    setApiKey(apiKey) {
        this.apiKey = apiKey;
        if (apiKey) {
            localStorage.setItem('sindhi-translator-api-key', apiKey);
        } else {
            localStorage.removeItem('sindhi-translator-api-key');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const translator = new SindhiTranslator();
    
    // Make translator globally accessible for debugging
    window.sindhiTranslator = translator;
    
    // Add API key configuration functionality
    const apiKeyPrompt = () => {
        const apiKey = prompt('Enter your OpenAI API key for better translations (optional):');
        if (apiKey) {
            translator.setApiKey(apiKey.trim());
            translator.showNotification('API key saved! You can now use advanced translations.', 'success');
        }
    };
    
    // Add keyboard shortcut for API key configuration
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'K') {
            e.preventDefault();
            apiKeyPrompt();
        }
    });
    
    // Add settings button functionality (if needed in future)
    window.configureApiKey = apiKeyPrompt;
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .about-content, .visual-card').forEach(el => {
        observer.observe(el);
    });
});

// Add additional CSS for loading spinner and notifications
const additionalStyles = `
    .loading-spinner-small {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s ease-in-out infinite;
        display: inline-block;
        margin-right: 0.5rem;
    }
    
    .notification-success {
        background: #10b981 !important;
    }
    
    .notification-error {
        background: #ef4444 !important;
    }
    
    .notification-warning {
        background: #f59e0b !important;
    }
    
    .notification-info {
        background: #3b82f6 !important;
    }
    
    .error-content {
        text-align: center;
        color: #ef4444;
    }
    
    .error-icon {
        width: 48px;
        height: 48px;
        margin: 0 auto 1rem;
        stroke: #ef4444;
    }
    
    .error-content p {
        font-weight: 500;
        margin-bottom: 0.5rem;
    }
    
    .error-content span {
        font-size: 0.875rem;
        opacity: 0.8;
    }
    
    .has-content {
        background: white !important;
        border-color: #10b981 !important;
    }
    
    .translation-result {
        width: 100%;
        text-align: right;
        direction: rtl;
        font-size: 1.125rem;
        line-height: 1.6;
        color: #1f2937;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

