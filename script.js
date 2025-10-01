// ===== СОВРЕМЕННЫЙ JAVASCRIPT ДЛЯ САЙТА ВАГАНЬКОВСКОГО КЛАДБИЩА =====

// Конфигурация
const CONFIG = {
    API_ENDPOINTS: {
        ai: '/api/ai-chat',
        analytics: '/api/analytics',
        forms: '/api/forms'
    },
    AI_MODEL: 'llama2', // или другая модель Ollama
    THEME_KEY: 'cemetery-theme',
    ANIMATIONS: {
        duration: 300,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    CHATBOT: {
        responses: {
            greeting: '👋 Привет! Я AI-помощник Ваганьковского кладбища. Как могу помочь?',
            services: '💼 Мы предоставляем полный спектр услуг: памятники, колумбарий, благоустройство. Что вас интересует?',
            prices: '💰 Стоимость зависит от вида услуг. Могу рассчитать для вас примерную стоимость. Опишите что вам нужно?',
            contact: '📞 Лучше всего связаться по телефону +7 (495) 123-45-67 или оставить заявку на бесплатную консультацию.',
            default: '🤔 Не совсем понял ваш вопрос. Можете рассказать подробнее? Или обратитесь к нашим специалистам для подробной консультации.'
        }
    }
};

// Класс для управления темой
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem(CONFIG.THEME_KEY) || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.createToggleButton();
        this.bindEvents();
    }

    createToggleButton() {
        const button = document.createElement('button');
        button.className = 'theme-toggle';
        button.innerHTML = this.currentTheme === 'light' ? '🌙' : '☀️';
        button.setAttribute('aria-label', 'Переключить тему');
        document.body.appendChild(button);
        
        this.toggleButton = button;
    }

    bindEvents() {
        this.toggleButton.addEventListener('click', () => this.toggleTheme());
        
        // Автоматическое переключение по времени
        this.checkTimeBasedTheme();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem(CONFIG.THEME_KEY, this.currentTheme);
        this.updateToggleButton();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Обновляем meta тег для мобильных браузеров
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.content = theme === 'dark' ? '#1a1a1a' : '#ffffff';
        }
    }

    updateToggleButton() {
        if (this.toggleButton) {
            this.toggleButton.innerHTML = this.currentTheme === 'light' ? '🌙' : '☀️';
        }
    }

    checkTimeBasedTheme() {
        const hour = new Date().getHours();
        if (hour >= 20 || hour <= 6) {
            if (this.currentTheme === 'light') {
                this.toggleTheme();
            }
        }
    }
}

// AI Чат-бот
class AIChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.bindEvents();
        this.loadWelcomeMessage();
    }

    createChatbotHTML() {
        // Toggle кнопка
        const toggleButton = document.createElement('button');
        toggleButton.className = 'chatbot-toggle';
        toggleButton.innerHTML = '🤖';
        toggleButton.setAttribute('aria-label', 'Открыть чат-бот');
        document.body.appendChild(toggleButton);
        
        // Окно чата
        const chatWindow = document.createElement('div');
        chatWindow.className = 'ai-chatbot';
        chatWindow.innerHTML = `
            <div class="chatbot-header">
                <h4>🤖 AI-Помощник</h4>
                <button class="chatbot-close" aria-label="Закрыть">&times;</button>
            </div>
            <div class="chatbot-messages" id="chatbot-messages"></div>
            <div class="chatbot-input">
                <input type="text" id="chatbot-input" placeholder="Напишите сообщение..." autocomplete="off">
                <button id="chatbot-send">➤</button>
            </div>
        `;
        document.body.appendChild(chatWindow);
        
        this.toggleButton = toggleButton;
        this.chatWindow = chatWindow;
        this.messagesContainer = document.getElementById('chatbot-messages');
        this.inputField = document.getElementById('chatbot-input');
        this.sendButton = document.getElementById('chatbot-send');
    }

    bindEvents() {
        this.toggleButton.addEventListener('click', () => this.toggle());
        this.chatWindow.querySelector('.chatbot-close').addEventListener('click', () => this.close());
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.chatWindow.classList.add('active');
        this.isOpen = true;
        this.inputField.focus();
        
        // Аналитика
        this.trackEvent('chatbot_opened');
    }

    close() {
        this.chatWindow.classList.remove('active');
        this.isOpen = false;
    }

    loadWelcomeMessage() {
        setTimeout(() => {
            this.addMessage('bot', CONFIG.CHATBOT.responses.greeting);
        }, 1000);
    }

    sendMessage() {
        const message = this.inputField.value.trim();
        if (!message) return;
        
        this.addMessage('user', message);
        this.inputField.value = '';
        
        // Показываем индикатор печати
        this.showTypingIndicator();
        
        // Отправляем в AI
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.hideTypingIndicator();
            this.addMessage('bot', response);
        }, 1500);
    }

    addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;
        
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Анимация появления
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        });
    }

    showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'message bot typing-indicator';
        indicator.innerHTML = 'Печатает <span class="dots"><span>.</span><span>.</span><span>.</span></span>';
        indicator.id = 'typing-indicator';
        
        this.messagesContainer.appendChild(indicator);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Простая логика распознавания намерений
        if (lowerMessage.includes('услуг') || lowerMessage.includes('сервис') || lowerMessage.includes('памятник')) {
            return CONFIG.CHATBOT.responses.services;
        }
        
        if (lowerMessage.includes('цен') || lowerMessage.includes('стоимост') || lowerMessage.includes('сколько')) {
            return CONFIG.CHATBOT.responses.prices;
        }
        
        if (lowerMessage.includes('контакт') || lowerMessage.includes('телефон') || lowerMessage.includes('связ')) {
            return CONFIG.CHATBOT.responses.contact;
        }
        
        if (lowerMessage.includes('привет') || lowerMessage.includes('здравств')) {
            return CONFIG.CHATBOT.responses.greeting;
        }
        
        return CONFIG.CHATBOT.responses.default;
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    trackEvent(eventName, data = {}) {
        // Отправка аналитики
        console.log(`Event: ${eventName}`, data);
        
        // Здесь можно интегрировать с Google Analytics, Yandex.Metrica и т.д.
    }
}

// Класс для управления анимациями
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupParallax();
        this.setupParticles();
        this.setupProgressBar();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Добавляем задержку для элементов в гриде
                    const gridItems = entry.target.querySelectorAll('.link-item, .offer-card, .review-card');
                    gridItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);
        
        // Наблюдаем за элементами
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
            observer.observe(el);
        });
    }

    setupParallax() {
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }

    setupParticles() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        hero.appendChild(particlesContainer);
        
        // Создаем частицы
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particlesContainer.appendChild(particle);
        }
    }

    setupProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        document.body.appendChild(progressBar);
        
        const updateProgressBar = () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = Math.min(scrolled, 100) + '%';
        };
        
        window.addEventListener('scroll', updateProgressBar, { passive: true });
    }
}

// Класс для управления формами
class FormManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupPhoneFormatting();
        this.setupFormValidation();
        this.setupCalculator();
    }

    setupPhoneFormatting() {
        document.addEventListener('input', (e) => {
            if (e.target.type === 'tel') {
                this.formatPhoneNumber(e.target);
            }
        });
    }

    formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            if (value[0] === '8') {
                value = '7' + value.slice(1);
            }
            if (value[0] !== '7') {
                value = '7' + value;
            }
        }
        
        let formatted = '';
        if (value.length > 0) {
            formatted = '+7';
            if (value.length > 1) {
                formatted += ' (' + value.slice(1, 4);
                if (value.length > 4) {
                    formatted += ') ' + value.slice(4, 7);
                    if (value.length > 7) {
                        formatted += '-' + value.slice(7, 9);
                        if (value.length > 9) {
                            formatted += '-' + value.slice(9, 11);
                        }
                    }
                }
            }
        }
        
        input.value = formatted;
    }

    setupFormValidation() {
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('contact-form')) {
                e.preventDefault();
                this.handleFormSubmit(e.target);
            }
        });
    }

    async handleFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Показываем индикатор загрузки
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        submitButton.textContent = 'Отправляем...';
        
        try {
            // Симуляция отправки
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Показываем успех
            this.showNotification('Успешно отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
            
            // Очищаем форму
            form.reset();
            
            // Закрываем модальное окно
            this.closeModal();
            
        } catch (error) {
            this.showNotification('Ошибка отправки. Попробуйте позже.', 'error');
        } finally {
            // Восстанавливаем кнопку
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }

    setupCalculator() {
        const selects = document.querySelectorAll('#serviceType, #material, #size');
        selects.forEach(select => {
            select.addEventListener('change', this.updateCalculator.bind(this));
        });
    }

    updateCalculator() {
        const serviceType = document.getElementById('serviceType')?.value;
        const material = document.getElementById('material')?.value;
        const size = document.getElementById('size')?.value;
        const priceElement = document.getElementById('calculatedPrice');
        
        if (!priceElement) return;
        
        if (!serviceType || !material || !size) {
            priceElement.textContent = 'Выберите все параметры';
            return;
        }
        
        const prices = this.getBasePrices();
        const price = prices[serviceType]?.[material]?.[size];
        
        if (price) {
            // Анимация обновления цены
            priceElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                priceElement.textContent = `от ${price.toLocaleString()} ₽`;
                priceElement.style.transform = 'scale(1)';
            }, 150);
        } else {
            priceElement.textContent = 'Уточните у менеджера';
        }
    }

    getBasePrices() {
        return {
            monument: {
                granite: { small: 15000, medium: 25000, large: 40000 },
                marble: { small: 20000, medium: 30000, large: 50000 },
                bronze: { small: 30000, medium: 45000, large: 70000 }
            },
            columbarium: {
                granite: { small: 8000, medium: 12000, large: 18000 },
                marble: { small: 10000, medium: 15000, large: 22000 },
                bronze: { small: 15000, medium: 20000, large: 30000 }
            },
            maintenance: {
                granite: { small: 3000, medium: 5000, large: 8000 },
                marble: { small: 3500, medium: 5500, large: 9000 },
                bronze: { small: 4000, medium: 6000, large: 10000 }
            },
            landscaping: {
                granite: { small: 5000, medium: 8000, large: 12000 },
                marble: { small: 6000, medium: 9000, large: 14000 },
                bronze: { small: 7000, medium: 10000, large: 16000 }
            }
        };
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
                <span class="notification-text">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Автоудаление
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        // Обработка клика по кнопке закрытия
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    closeModal() {
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
}

// Класс для управления навигацией
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        this.setupHeaderScroll();
        this.bindNavigationEvents();
    }

    setupSmoothScrolling() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    this.scrollToElement(target);
                }
            }
        });
    }

    scrollToElement(element) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = element.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    setupMobileMenu() {
        const header = document.querySelector('header .container');
        const nav = document.querySelector('.main-nav');
        
        // Создаем кнопку бургер
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '<span></span><span></span><span></span>';
        mobileMenuBtn.setAttribute('aria-label', 'Меню');
        
        header.style.position = 'relative';
        header.appendChild(mobileMenuBtn);
        
        // Обработчик клика
        mobileMenuBtn.addEventListener('click', () => {
            const navUl = nav.querySelector('ul');
            const isOpen = navUl.classList.contains('active');
            
            navUl.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
        
        // Закрываем меню при клике по ссылке
        nav.addEventListener('click', (e) => {
            if (e.target.matches('a')) {
                nav.querySelector('ul').classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
        
        this.mobileMenuBtn = mobileMenuBtn;
        
        // Проверяем размер экрана
        this.checkScreenSize();
        window.addEventListener('resize', () => this.checkScreenSize());
    }

    checkScreenSize() {
        const isMobile = window.innerWidth <= 768;
        const navUl = document.querySelector('.main-nav ul');
        
        if (isMobile) {
            this.mobileMenuBtn.style.display = 'flex';
            if (!navUl.classList.contains('active')) {
                navUl.style.display = 'none';
            }
        } else {
            this.mobileMenuBtn.style.display = 'none';
            navUl.style.display = 'flex';
            navUl.classList.remove('active');
            this.mobileMenuBtn.classList.remove('active');
        }
    }

    setupHeaderScroll() {
        let lastScrollTop = 0;
        const header = document.querySelector('header');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Добавляем класс при скролле
            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        }, { passive: true });
    }

    bindNavigationEvents() {
        // Обработка кликов по ссылкам навигации
        document.addEventListener('click', (e) => {
            if (e.target.matches('.main-nav a, .link-item')) {
                const href = e.target.getAttribute('href');
                
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.showSection(href.substring(1));
                    
                    // Плавная прокрутка наверх
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        });
    }

    showSection(sectionId) {
        // Скрываем все секции
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });
        
        document.querySelectorAll('.main-content, .quick-links, .comments-section, .special-offers').forEach(section => {
            section.style.display = 'none';
        });
        
        // Показываем нужную секцию
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
            targetSection.classList.add('fade-in');
        } else {
            // Показываем главную страницу
            this.showMainContent();
        }
    }

    showMainContent() {
        document.querySelectorAll('.main-content, .quick-links, .comments-section, .special-offers').forEach(section => {
            section.style.display = 'block';
        });
    }
}

// Класс для управления производительностью
class PerformanceManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.preloadCriticalResources();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    setupImageOptimization() {
        // Поддержка WebP
        const supportsWebP = this.checkWebPSupport();
        
        if (supportsWebP) {
            document.querySelectorAll('img').forEach(img => {
                if (img.src && img.src.includes('.jpg') || img.src.includes('.png')) {
                    const webpSrc = img.src.replace(/\.(jpg|png)$/, '.webp');
                    
                    // Проверяем существование WebP файла
                    fetch(webpSrc, { method: 'HEAD' })
                        .then(response => {
                            if (response.ok) {
                                img.src = webpSrc;
                            }
                        })
                        .catch(() => {
                            // WebP файл не найден, оставляем оригинал
                        });
                }
            });
        }
    }

    checkWebPSupport() {
        return new Promise(resolve => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    preloadCriticalResources() {
        // Предварительная загрузка критических ресурсов
        const criticalImages = [
            'images/hero-background.svg',
            'images/administration.svg'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
}

// Основной класс приложения
class CemeteryWebsite {
    constructor() {
        this.init();
    }

    async init() {
        // Проверяем готовность DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        // Инициализируем все менеджеры
        this.themeManager = new ThemeManager();
        this.aiChatbot = new AIChatbot();
        this.animationManager = new AnimationManager();
        this.formManager = new FormManager();
        this.navigationManager = new NavigationManager();
        this.performanceManager = new PerformanceManager();
        
        // Инициализируем легаси функционал
        this.initLegacyFeatures();
        
        // Устанавливаем глобальные обработчики
        this.setupGlobalEventListeners();
        
        // Показываем главную страницу
        this.navigationManager.showMainContent();
        
        console.log('🎆 Cemetery Website успешно инициализирован!');
    }

    initLegacyFeatures() {
        // Обратная совместимость с существующими функциями
        this.initCookieNotice();
        this.initFloatingWidget();
        this.initModals();
    }

    initCookieNotice() {
        const cookieNotice = document.querySelector('.cookie-notice');
        if (!cookieNotice) return;
        
        if (localStorage.getItem('cookiesAccepted') === 'true') {
            cookieNotice.style.display = 'none';
        }
        
        // Обновляем обработчики
        const acceptBtn = cookieNotice.querySelector('button:not(:last-child)');
        const closeBtn = cookieNotice.querySelector('button:last-child');
        
        acceptBtn?.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieNotice.style.display = 'none';
        });
        
        closeBtn?.addEventListener('click', () => {
            cookieNotice.style.display = 'none';
        });
    }

    initFloatingWidget() {
        setTimeout(() => {
            const widget = document.getElementById('floatingWidget');
            if (widget && !localStorage.getItem('widgetClosed')) {
                widget.style.display = 'block';
            }
        }, 10000);
    }

    initModals() {
        // Обработка модальных окон
        document.addEventListener('click', (e) => {
            if (e.target.matches('[onclick*="openModal"]')) {
                e.preventDefault();
                const modalType = e.target.getAttribute('onclick').match(/openModal\('([^']+)'/)?.[1];
                if (modalType) {
                    this.openModal(modalType);
                }
            }
        });
    }

    openModal(modalType, service = null) {
        const overlay = document.getElementById('modal-overlay');
        const modalBody = document.getElementById('modal-body');
        
        if (!overlay || !modalBody) return;
        
        const template = document.getElementById(modalType + '-template');
        if (!template) return;
        
        modalBody.innerHTML = template.innerHTML;
        
        if (modalType === 'order-service' && service) {
            const serviceSelect = modalBody.querySelector('select[name="service"]');
            if (serviceSelect) {
                serviceSelect.value = service;
            }
        }
        
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    setupGlobalEventListeners() {
        // ESC для закрытия модалок
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
        
        // Отслеживание производительности
        this.trackPerformance();
    }

    closeAllModals() {
        document.querySelectorAll('.modal-overlay, .ai-chatbot').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
    }

    trackPerformance() {
        // Отслеживание Core Web Vitals
        if ('web-vitals' in window) {
            // Используем web-vitals библиотеку если подключена
        } else {
            // Базовая метрика
            window.addEventListener('load', () => {
                const loadTime = performance.now();
                console.log(`⚙️ Сайт загрузился за: ${Math.round(loadTime)}ms`);
            });
        }
    }
}

// Глобальные функции для обратной совместимости
window.acceptCookies = function() {
    localStorage.setItem('cookiesAccepted', 'true');
    const notice = document.querySelector('.cookie-notice');
    if (notice) notice.style.display = 'none';
};

window.closeCookieNotice = function() {
    const notice = document.querySelector('.cookie-notice');
    if (notice) notice.style.display = 'none';
};

window.openModal = function(modalType, service = null) {
    if (window.cemeteryWebsite) {
        window.cemeteryWebsite.openModal(modalType, service);
    }
};

window.closeModal = function() {
    if (window.cemeteryWebsite) {
        window.cemeteryWebsite.closeAllModals();
    }
};

window.updateCalculator = function() {
    if (window.cemeteryWebsite?.formManager) {
        window.cemeteryWebsite.formManager.updateCalculator();
    }
};

window.closeFloatingWidget = function() {
    const widget = document.getElementById('floatingWidget');
    if (widget) {
        widget.style.display = 'none';
        localStorage.setItem('widgetClosed', 'true');
    }
};

// Service Worker регистрация
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('🚀 Service Worker зарегистрирован');
            })
            .catch(error => {
                console.log('❌ Service Worker не удалось зарегистрировать');
            });
    });
}

// Инициализация приложения
window.cemeteryWebsite = new CemeteryWebsite();

// Обработка ошибок
window.addEventListener('error', (e) => {
    console.error('❗ Ошибка JavaScript:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('❗ Необработанная ошибка Promise:', e.reason);
});