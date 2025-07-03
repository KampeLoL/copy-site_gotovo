// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Инициализация
    initNavigation();
    initCookieNotice();
    initSmoothScrolling();
    initMobileMenu();
    initLeadGeneration();
    
    // Показываем главную страницу по умолчанию
    showMainContent();
});

// Навигация по сайту
function initNavigation() {
    const navLinks = document.querySelectorAll('.main-nav a, .link-item');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Проверяем, является ли ссылка якорем
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                // Скрываем все секции
                hideAllSections();
                
                // Показываем нужную секцию
                const targetId = href.substring(1);
                showSection(targetId);
                
                // Плавная прокрутка к началу страницы
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                // Закрываем мобильное меню если оно открыто
                closeMobileMenu();
            }
        });
    });
}

// Скрыть все секции
function hideAllSections() {
    const sections = document.querySelectorAll('.content-section');
    const mainSections = document.querySelectorAll('.main-content, .quick-links, .comments-section');
    
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    mainSections.forEach(section => {
        section.style.display = 'none';
    });
}

// Показать секцию
function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
        section.style.animation = 'fadeIn 0.6s ease-out';
    }
}

// Показать главную страницу
function showMainContent() {
    const mainSections = document.querySelectorAll('.main-content, .quick-links, .comments-section');
    mainSections.forEach(section => {
        section.style.display = 'block';
    });
}

// Плавная прокрутка
function initSmoothScrolling() {
    // Уже включена в CSS через scroll-behavior: smooth
    // Дополнительная обработка для старых браузеров
    
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            
            const target = document.querySelector(href);
            if (target) {
                // Fallback для браузеров без поддержки scroll-behavior
                if (!CSS.supports('scroll-behavior', 'smooth')) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Мобильное меню
function initMobileMenu() {
    // Создаем кнопку мобильного меню
    const header = document.querySelector('header .container');
    const nav = document.querySelector('.main-nav');
    
    // Создаем кнопку бургер
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<span></span><span></span><span></span>';
    mobileMenuBtn.style.cssText = `
        display: none;
        flex-direction: column;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
    `;
    
    // Стили для полосок бургера
    const spans = mobileMenuBtn.querySelectorAll('span');
    spans.forEach(span => {
        span.style.cssText = `
            width: 25px;
            height: 3px;
            background: white;
            margin: 3px 0;
            transition: 0.3s;
            border-radius: 3px;
        `;
    });
    
    header.style.position = 'relative';
    header.appendChild(mobileMenuBtn);
    
    // Обработчик для мобильного меню
    mobileMenuBtn.addEventListener('click', function() {
        const navUl = nav.querySelector('ul');
        const isOpen = navUl.style.display === 'flex';
        
        if (isOpen) {
            navUl.style.display = 'none';
            this.classList.remove('active');
        } else {
            navUl.style.display = 'flex';
            this.classList.add('active');
        }
    });
    
    // Показываем кнопку на мобильных устройствах
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            mobileMenuBtn.style.display = 'flex';
            nav.querySelector('ul').style.display = 'none';
        } else {
            mobileMenuBtn.style.display = 'none';
            nav.querySelector('ul').style.display = 'flex';
        }
    }
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
}

function closeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.main-nav ul');
    
    if (window.innerWidth <= 768 && mobileMenuBtn) {
        nav.style.display = 'none';
        mobileMenuBtn.classList.remove('active');
    }
}

// Cookie уведомление
function initCookieNotice() {
    const cookieNotice = document.querySelector('.cookie-notice');
    const acceptBtn = cookieNotice.querySelector('button[onclick="acceptCookies()"]');
    const closeBtn = cookieNotice.querySelector('button[onclick="closeCookieNotice()"]');
    
    // Проверяем, принял ли пользователь cookies
    if (localStorage.getItem('cookiesAccepted') === 'true') {
        cookieNotice.style.display = 'none';
    }
    
    // Обновляем обработчики событий
    acceptBtn.removeAttribute('onclick');
    closeBtn.removeAttribute('onclick');
    
    acceptBtn.addEventListener('click', acceptCookies);
    closeBtn.addEventListener('click', closeCookieNotice);
}

function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    document.querySelector('.cookie-notice').style.display = 'none';
}

function closeCookieNotice() {
    document.querySelector('.cookie-notice').style.display = 'none';
}

// Анимации при прокрутке
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами
    const elementsToAnimate = document.querySelectorAll('.content-section, .comment, .link-item');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Инициализируем анимации прокрутки после загрузки
window.addEventListener('load', function() {
    initScrollAnimations();
});

// Функция поиска (заглушка)
function searchCemetery() {
    alert('Функция поиска в разработке. Обратитесь в администрацию кладбища для получения информации о захоронениях.');
}

// Обработка форм (если будут добавлены)
function handleFormSubmission() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Форма отправлена! Мы свяжемся с вами в ближайшее время.');
        });
    });
}

// Функция для динамического добавления контента
function addDynamicContent() {
    // Можно добавить динамическую загрузку новостей, объявлений и т.д.
    console.log('Сайт Ваганьковского кладбища загружен успешно');
}

// Инициализация всех функций
window.addEventListener('load', function() {
    addDynamicContent();
    handleFormSubmission();
});

// Обработка ошибок
window.addEventListener('error', function(e) {
    console.log('Произошла ошибка:', e.error);
});

// ===== НОВАЯ ФУНКЦИОНАЛЬНОСТЬ ДЛЯ ЛИДОВ =====

// Модальные окна
function openModal(modalType, service = null) {
    const overlay = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');
    
    // Получаем шаблон модального окна
    const template = document.getElementById(modalType + '-template');
    if (!template) {
        console.error('Template not found:', modalType);
        return;
    }
    
    // Клонируем содержимое шаблона
    modalBody.innerHTML = template.innerHTML;
    
    // Предзаполняем форму заказа услуги
    if (modalType === 'order-service' && service) {
        const serviceSelect = modalBody.querySelector('select[name="service"]');
        if (serviceSelect) {
            serviceSelect.value = service;
        }
    }
    
    // Показываем модальное окно
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Отправка форм
function submitForm(event, formType) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = {};
    
    // Собираем данные формы
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Симулируем отправку данных
    console.log('Отправка формы:', formType, data);
    
    // Показываем сообщение об успехе
    showSuccessMessage(formType);
    
    // Закрываем модальное окно
    closeModal();
    
    // Сбрасываем форму
    form.reset();
}

function showSuccessMessage(formType) {
    let message = '';
    switch (formType) {
        case 'consultation':
            message = 'Спасибо! Мы свяжемся с вами в течение 15 минут.';
            break;
        case 'callback':
            message = 'Заявка принята! Мы перезвоним вам в указанное время.';
            break;
        case 'order-service':
            message = 'Заявка отправлена! Наш менеджер подготовит индивидуальное предложение.';
            break;
        case 'review':
            message = 'Спасибо за отзыв! После модерации он будет опубликован.';
            break;
        default:
            message = 'Спасибо! Ваша заявка принята.';
    }
    
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">✅</span>
            <span class="notification-text">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Добавляем стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 11000;
        animation: slideInRight 0.3s ease;
    `;
    
    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
        background: #27ae60;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        max-width: 350px;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-left: auto;
    `;
    
    document.body.appendChild(notification);
    
    // Автоматически удаляем уведомление через 5 секунд
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Калькулятор стоимости
function updateCalculator() {
    const serviceType = document.getElementById('serviceType')?.value;
    const material = document.getElementById('material')?.value;
    const size = document.getElementById('size')?.value;
    const priceElement = document.getElementById('calculatedPrice');
    
    if (!priceElement) return;
    
    if (!serviceType || !material || !size) {
        priceElement.textContent = 'Выберите все параметры';
        return;
    }
    
    // Базовые цены
    const basePrices = {
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
    
    const price = basePrices[serviceType]?.[material]?.[size];
    
    if (price) {
        priceElement.textContent = `от ${price.toLocaleString()} ₽`;
    } else {
        priceElement.textContent = 'Уточните у менеджера';
    }
}

// Всплывающий виджет
function initFloatingWidget() {
    const widget = document.getElementById('floatingWidget');
    
    // Показываем виджет через 10 секунд после загрузки
    setTimeout(() => {
        if (widget && !localStorage.getItem('widgetClosed')) {
            widget.style.display = 'block';
        }
    }, 10000);
}

function closeFloatingWidget() {
    const widget = document.getElementById('floatingWidget');
    widget.style.display = 'none';
    localStorage.setItem('widgetClosed', 'true');
}

// Отслеживание действий пользователя
function trackUserActions() {
    // Отслеживание кликов по CTA кнопкам
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('cta-button')) {
            console.log('CTA клик:', e.target.textContent.trim());
        }
        
        if (e.target.classList.contains('contact-btn')) {
            console.log('Контакт клик:', e.target.textContent.trim());
        }
    });
    
    // Отслеживание времени на странице
    let startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        console.log('Время на сайте:', timeSpent, 'секунд');
    });
}

// Автозаполнение номера телефона
function formatPhoneNumber(input) {
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

// Инициализация новой функциональности
function initLeadGeneration() {
    // Инициализация всплывающего виджета
    initFloatingWidget();
    
    // Отслеживание действий пользователя
    trackUserActions();
    
    // Автоформатирование телефонных номеров
    document.addEventListener('input', function(e) {
        if (e.target.type === 'tel') {
            formatPhoneNumber(e.target);
        }
    });
    
    // Закрытие модальных окон по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Анимация появления элементов при прокрутке
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Наблюдаем за новыми элементами
    const elementsToAnimate = document.querySelectorAll('.offer-card, .review-card, .calculator-form');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Экспорт функций для глобального доступа
window.acceptCookies = acceptCookies;
window.closeCookieNotice = closeCookieNotice;
window.searchCemetery = searchCemetery;
window.openModal = openModal;
window.closeModal = closeModal;
window.submitForm = submitForm;
window.updateCalculator = updateCalculator;
window.closeFloatingWidget = closeFloatingWidget;

// Загрузчик страницы
window.addEventListener('load', () => {
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
        </div>
    `;
    document.body.appendChild(loader);
    
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 300);
    }, 1000);
});

// Навигация
const navbar = document.querySelector('.navbar');
const navMenu = document.querySelector('.nav-menu');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav-link');

// Обработчик прокрутки для навигации
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Мобильное меню
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Анимация чисел в статистике
const animateNumbers = () => {
    const numbers = document.querySelectorAll('.stat-number');
    
    numbers.forEach(number => {
        const target = parseInt(number.getAttribute('data-target'));
        const increment = target / 50;
        let current = 0;
        
        const updateNumber = () => {
            if (current < target) {
                current += increment;
                number.textContent = Math.ceil(current);
                requestAnimationFrame(updateNumber);
            } else {
                number.textContent = target;
            }
        };
        
        updateNumber();
    });
};

// Intersection Observer для анимаций при прокрутке
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            
            // Анимация чисел при появлении hero секции
            if (entry.target.classList.contains('hero')) {
                animateNumbers();
            }
        }
    });
}, observerOptions);

// Добавляем элементы для наблюдения
document.querySelectorAll('.feature-card, .service-item, .portfolio-item').forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
});

// Наблюдение за hero секцией для анимации чисел
const heroSection = document.querySelector('.hero');
observer.observe(heroSection);

// Анимация feature карточек при наведении
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) rotateX(5deg)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotateX(0)';
    });
});

// Параллакс эффект для hero фигур
window.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.hero-shape-1, .hero-shape-2, .hero-shape-3');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 20;
        const xPos = (x - 0.5) * speed;
        const yPos = (y - 0.5) * speed;
        shape.style.transform = `translate(${xPos}px, ${yPos}px)`;
    });
});

// Обработка формы контактов
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Получаем данные формы
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Показываем уведомление
    showNotification('Спасибо! Мы свяжемся с вами в ближайшее время.', 'success');
    
    // Очищаем форму
    contactForm.reset();
});

// Обработка формы подписки
const newsletterForm = document.querySelector('.newsletter-form');
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = newsletterForm.querySelector('input[type="email"]').value;
    
    showNotification('Вы успешно подписались на рассылку!', 'success');
    newsletterForm.reset();
});

// Функция показа уведомлений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Стили для уведомления
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        }
        
        .notification.success {
            border-left: 4px solid #10b981;
        }
        
        .notification.info {
            border-left: 4px solid #3b82f6;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .notification i {
            font-size: 1.5rem;
        }
        
        .notification.success i {
            color: #10b981;
        }
        
        .notification.info i {
            color: #3b82f6;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Добавляем CSS для анимации выхода
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(additionalStyles);

// Динамическое изменение цвета навигации при прокрутке разных секций
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
});

// Анимация печатания для заголовка
const heroTitle = document.querySelector('.hero-title');
const originalText = heroTitle.innerHTML;
heroTitle.innerHTML = '';

function typeWriter(element, html, index = 0) {
    if (index < html.length) {
        if (html[index] === '<') {
            const tagEnd = html.indexOf('>', index);
            element.innerHTML += html.substring(index, tagEnd + 1);
            index = tagEnd + 1;
        } else {
            element.innerHTML += html[index];
            index++;
        }
        setTimeout(() => typeWriter(element, html, index), 30);
    }
}

// Запускаем анимацию печатания после загрузки
window.addEventListener('load', () => {
    setTimeout(() => {
        typeWriter(heroTitle, originalText);
    }, 1500);
});

// Эффект частиц для hero секции
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Случайные свойства
    const size = Math.random() * 5 + 2;
    const duration = Math.random() * 3 + 2;
    const delay = Math.random() * 2;
    const startX = Math.random() * window.innerWidth;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(99, 102, 241, 0.5);
        border-radius: 50%;
        left: ${startX}px;
        bottom: -10px;
        animation: floatUp ${duration}s ease-in ${delay}s;
        z-index: 0;
    `;
    
    document.querySelector('.hero').appendChild(particle);
    
    // Удаляем частицу после анимации
    setTimeout(() => {
        particle.remove();
    }, (duration + delay) * 1000);
}

// Создаем частицы периодически
setInterval(createParticle, 300);

// Добавляем CSS для анимации частиц
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    @keyframes floatUp {
        0% {
            opacity: 0;
            transform: translateY(0) scale(0);
        }
        10% {
            opacity: 1;
            transform: translateY(-20px) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-100vh) scale(0.5);
        }
    }
    
    .nav-link.active {
        color: var(--primary-color);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(particleStyles);

// Lazy loading для изображений (подготовка для будущих изображений)
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Эффект ripple для кнопок
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            left: ${x}px;
            top: ${y}px;
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// CSS для ripple эффекта
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    @keyframes rippleEffect {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyles);

console.log('TechFlow website initialized successfully!'); 