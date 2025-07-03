// Загрузчик страницы
window.addEventListener('load', () => {
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = '<div class="loader-spinner"></div>';
    document.body.appendChild(loader);
    
    setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.remove();
        }, 500);
    }, 1000);
});

// Навигация
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Скролл эффект для навбара
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Мобильное меню
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Закрытие мобильного меню при клике на ссылку
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scroll для навигации
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Анимация чисел в секции "О нас"
const animateNumbers = () => {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / 200;
        
        const updateCounter = () => {
            const current = +counter.innerText;
            
            if (current < target) {
                counter.innerText = Math.ceil(current + increment);
                setTimeout(updateCounter, 10);
            } else {
                counter.innerText = target;
            }
        };
        
        updateCounter();
    });
};

// Intersection Observer для анимаций при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('service-card')) {
                entry.target.style.animationDelay = `${entry.target.dataset.delay || 0}s`;
                entry.target.classList.add('animate-in');
            } else if (entry.target.classList.contains('portfolio-item')) {
                entry.target.style.animationDelay = `${entry.target.dataset.delay || 0}s`;
                entry.target.classList.add('fade-in');
            } else if (entry.target.classList.contains('stat-number')) {
                if (!entry.target.classList.contains('counted')) {
                    animateNumbers();
                    entry.target.classList.add('counted');
                }
            } else {
                entry.target.classList.add('animated');
            }
        }
    });
}, observerOptions);

// Наблюдение за элементами
document.addEventListener('DOMContentLoaded', () => {
    // Секция услуг
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.dataset.delay = index * 0.1;
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        observer.observe(card);
    });
    
    // Секция портфолио
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach((item, index) => {
        item.dataset.delay = index * 0.1;
        item.style.opacity = '0';
        observer.observe(item);
    });
    
    // Анимации при скролле
    const animatedElements = document.querySelectorAll('.section-title, .section-subtitle, .about-text, .contact-form, .contact-info');
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
    
    // Счетчики
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(num => observer.observe(num));
});

// CSS для анимаций
const style = document.createElement('style');
style.textContent = `
    .service-card.animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .portfolio-item.fade-in {
        animation: fadeIn 0.6s ease-out forwards;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);

// Параллакс эффект для hero секции
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-shape');
    
    parallaxElements.forEach((el, index) => {
        const speed = 0.5 + (index * 0.1);
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Магнитный эффект для кнопок
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// Отправка формы
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Анимация отправки
        const button = contactForm.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        
        button.innerHTML = '<span style="display: inline-block; animation: spin 1s linear infinite;">⏳</span> Отправка...';
        button.disabled = true;
        
        // Имитация отправки
        setTimeout(() => {
            button.innerHTML = '✅ Отправлено!';
            button.style.background = 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
            
            // Сброс формы
            setTimeout(() => {
                contactForm.reset();
                button.textContent = originalText;
                button.disabled = false;
                button.style.background = '';
            }, 3000);
        }, 2000);
    });
}

// Динамическое изменение цвета при скролле
let ticking = false;
function updateColors() {
    const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    const hue = scrollPercentage * 60; // От фиолетового к зеленому
    
    document.documentElement.style.setProperty('--dynamic-hue', hue);
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateColors);
        ticking = true;
    }
});

// Эффект печатания для заголовка
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Активация эффекта печатания при загрузке
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title .title-line:first-child');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 100);
        }, 1500);
    }
});

// Курсор с эффектом следования
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

const cursorFollower = document.createElement('div');
cursorFollower.className = 'cursor-follower';
document.body.appendChild(cursorFollower);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    const speed = 0.2;
    
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    
    followerX += (mouseX - followerX) * (speed * 0.5);
    followerY += (mouseY - followerY) * (speed * 0.5);
    cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Добавляем стили для курсора
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    .custom-cursor {
        width: 10px;
        height: 10px;
        background: var(--primary-color);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 10000;
        mix-blend-mode: difference;
    }
    
    .cursor-follower {
        width: 30px;
        height: 30px;
        border: 2px solid var(--primary-color);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.5;
    }
    
    @media (max-width: 768px) {
        .custom-cursor,
        .cursor-follower {
            display: none;
        }
    }
`;
document.head.appendChild(cursorStyle);

// Эффект волны при клике
document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 1000);
});

// Стили для эффекта волны
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple {
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.3), transparent);
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        animation: rippleEffect 1s ease-out;
        pointer-events: none;
        z-index: 9998;
    }
    
    @keyframes rippleEffect {
        to {
            transform: translate(-50%, -50%) scale(20);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Добавление частиц в hero секцию
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    document.querySelector('.hero-bg').appendChild(particlesContainer);
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.animationDuration = `${20 + Math.random() * 20}s`;
        particlesContainer.appendChild(particle);
    }
}

createParticles();

// Стили для частиц
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    .particles-container {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    
    .particle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(99, 102, 241, 0.3);
        border-radius: 50%;
        bottom: -10px;
        animation: floatUp linear infinite;
    }
    
    @keyframes floatUp {
        to {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);