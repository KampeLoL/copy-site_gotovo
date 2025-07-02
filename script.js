// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Инициализация
    initNavigation();
    initCookieNotice();
    initSmoothScrolling();
    initMobileMenu();
    
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

// Экспорт функций для глобального доступа
window.acceptCookies = acceptCookies;
window.closeCookieNotice = closeCookieNotice;
window.searchCemetery = searchCemetery; 