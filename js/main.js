/**
 * AL FAHD SEAFOOD - MAIN JAVASCRIPT FILE
 * Modern interactive features with smooth animations and performance optimization
 */

// ==========================================================================
// GLOBAL VARIABLES & CONFIGURATION
// ==========================================================================

const CONFIG = {
    // Animation settings
    animationDuration: 300,
    scrollThreshold: 100,
    
    // Testimonials
    testimonialAutoplay: true,
    testimonialInterval: 5000,
    
    // Statistics counter
    counterSpeed: 2000,
    
    // Form validation
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phoneRegex: /^[\+]?[0-9\s\-\(\)]{10,}$/,
    
    // WhatsApp settings
    whatsappNumber: '201234567890',
    
    // Performance
    debounceDelay: 100,
    throttleDelay: 16
};

// Global state management
const STATE = {
    currentTestimonial: 0,
    isScrolling: false,
    isMobileMenuOpen: false,
    countersAnimated: false,
    isFormSubmitting: false
};

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

/**
 * Debounce function to limit function execution frequency
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to limit function execution rate
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element, threshold = 0.1) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    return (
        rect.top < windowHeight * (1 + threshold) &&
        rect.bottom > -windowHeight * threshold &&
        rect.left < windowWidth * (1 + threshold) &&
        rect.right > -windowWidth * threshold
    );
}

/**
 * Animate number counter
 */
function animateCounter(element, target, duration = 2000) {
    if (!element || isNaN(target)) return;
    
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(target, offset = 80) {
    if (!target) return;
    
    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
    if (!targetElement) return;
    
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

/**
 * Add CSS class with animation
 */
function addClassWithAnimation(element, className, delay = 0) {
    if (!element) return;
    
    setTimeout(() => {
        element.classList.add(className);
    }, delay);
}

/**
 * Generate WhatsApp URL
 */
function generateWhatsAppURL(message = '') {
    const baseURL = 'https://wa.me/';
    const encodedMessage = encodeURIComponent(message);
    return `${baseURL}${CONFIG.whatsappNumber}${message ? '?text=' + encodedMessage : ''}`;
}

// ==========================================================================
// MAGNETIC BUTTONS EFFECT
// ==========================================================================
class MagneticFx {
    constructor(elements) {
        if (!elements || elements.length === 0) return;
        this.elements = Array.from(elements);
        this.threshold = 80;
        this.animationFrameId = null;

        if (window.innerWidth < 1024 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return; // Disable on tablets/mobile and for users who prefer reduced motion
        }

        window.addEventListener('mousemove', (e) => this.handleMove(e), { passive: true });
    }

    handleMove(e) {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        this.animationFrameId = requestAnimationFrame(() => {
            const { clientX, clientY } = e;

            for (const el of this.elements) {
                const rect = el.getBoundingClientRect();
                const elCenterX = rect.left + rect.width / 2;
                const elCenterY = rect.top + rect.height / 2;

                const distance = Math.hypot(clientX - elCenterX, clientY - elCenterY);

                if (distance < this.threshold) {
                    const dx = (clientX - elCenterX) * 0.3;
                    const dy = (clientY - elCenterY) * 0.3;
                    el.style.transform = `translate(${dx}px, ${dy}px)`;
                    el.style.transition = 'transform 0.1s ease-out';
                } else {
                    el.style.transform = 'translate(0, 0)';
                    el.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
                }
            }
        });
    }
}

// ==========================================================================
// THEME MANAGEMENT (Dark/Light Mode)
// ==========================================================================

class ThemeManager {
    constructor() {
        this.themeToggleBtn = document.getElementById('theme-toggle-btn');
        this.init();
    }

    init() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        let currentTheme;
        if (savedTheme) {
            currentTheme = savedTheme;
        } else {
            const hour = new Date().getHours();
            // Auto dark mode from 6 PM to 6 AM, or if system prefers dark
            if ((hour < 6 || hour >= 18) || systemPrefersDark) {
                currentTheme = 'dark';
            } else {
                currentTheme = 'light';
            }
        }

        this.applyTheme(currentTheme);
        this.setupEventListeners();
    }

    applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }

        if (this.themeToggleBtn) {
            this.themeToggleBtn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
            this.themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
        }

        localStorage.setItem('theme', theme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    setupEventListeners() {
        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for changes in system preference
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            this.applyTheme(e.matches ? 'dark' : 'light');
        });
    }
}

// ==========================================================================
// SCROLL REVEAL ANIMATIONS
// ==========================================================================
class AnimationKit {
    constructor() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        this.initScrollReveal();
        this.initStaggerReveal();
    }

    initScrollReveal() {
        const elementsToReveal = document.querySelectorAll('[data-animation]:not(.stagger-child)');
        if (elementsToReveal.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = el.dataset.delay || 0;
                    setTimeout(() => {
                        el.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.1 });

        elementsToReveal.forEach(el => observer.observe(el));
    }

    initStaggerReveal() {
        const containers = document.querySelectorAll('.stagger-container');
        if (containers.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const container = entry.target;
                    const children = container.querySelectorAll('.stagger-child[data-animation]');
                    const baseDelay = parseInt(container.dataset.staggerDelay) || 100;

                    children.forEach((child, index) => {
                        child.style.transitionDelay = `${index * baseDelay}ms`;
                        child.classList.add('is-visible');
                    });
                    observer.unobserve(container);
                }
            });
        }, { threshold: 0.2 });

        containers.forEach(container => observer.observe(container));
    }
}

// ==========================================================================
// PARALLAX CONTROLLER
// ==========================================================================
class ParallaxController {
    constructor(elementsSelector) {
        this.elements = document.querySelectorAll(elementsSelector);
        if (this.elements.length === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        this.animationFrameId = null;
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    }

    handleScroll() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        this.animationFrameId = requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            this.elements.forEach(el => {
                const speed = parseFloat(el.dataset.parallaxSpeed) || 0.4;
                el.style.transform = `translateY(${scrollY * speed}px)`;
            });
        });
    }
}

// ==========================================================================
// CARD TILT EFFECT
// ==========================================================================
class CardTilt {
    constructor(selector) {
        this.elements = document.querySelectorAll(selector);
        if (this.elements.length === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        this.elements.forEach(el => {
            el.addEventListener('mousemove', (e) => this.handleMove(e, el));
            el.addEventListener('mouseleave', (e) => this.handleLeave(e, el));
            el.addEventListener('mouseenter', (e) => this.handleEnter(e, el));
        });
    }

    handleEnter(e, el) {
        el.style.transition = 'transform 0.1s ease-out';
    }

    handleMove(e, el) {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const width = el.clientWidth;
        const height = el.clientHeight;

        const rotateX = (y / height - 0.5) * -20; // Max rotation 10deg
        const rotateY = (x / width - 0.5) * 20;   // Max rotation 10deg

        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    }

    handleLeave(e, el) {
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        el.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    }
}

// ==========================================================================
// CHAT WIDGET
// ==========================================================================
class ChatWidget {
    constructor() {
        this.fab = document.getElementById('chat-fab');
        this.panel = document.getElementById('chat-panel');
        this.chatBody = document.getElementById('chat-body');
        this.chatInput = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('chat-send-btn');
        this.closeBtn = document.getElementById('close-chat-btn');
        this.emailBtn = document.getElementById('email-transcript-btn');
        this.typingIndicator = document.getElementById('typing-indicator');
        this.fabOpenIcon = this.fab?.querySelector('.chat-icon-open');
        this.fabCloseIcon = this.fab?.querySelector('.chat-icon-close');
        this.isOpen = false;
        this.messages = [];
        this.storageKey = 'chat_history';
        this.maxMessagesInStorage = 10;
        if (!this.fab || !this.panel) return;
        this.init();
    }
    init() {
        this.loadMessages();
        this.addEventListeners();
    }
    addEventListeners() {
        this.fab.addEventListener('click', () => this.togglePanel());
        this.closeBtn.addEventListener('click', () => this.closePanel());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.sendMessage();
            }
        });
        this.emailBtn.addEventListener('click', () => this.emailTranscript());
    }
    togglePanel() {
        this.isOpen = !this.isOpen;
        this.panel.classList.toggle('active');
        if (this.fabOpenIcon && this.fabCloseIcon) {
            this.fabOpenIcon.style.display = this.isOpen ? 'none' : 'block';
            this.fabCloseIcon.style.display = this.isOpen ? 'block' : 'none';
        }
        if (this.isOpen) {
            this.chatInput.focus();
            this.scrollToBottom();
            this.trapFocus(this.panel);
        }
    }

    trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
    closePanel() {
        if (!this.isOpen) return;
        this.isOpen = false;
        this.panel.classList.remove('active');
        if (this.fabOpenIcon && this.fabCloseIcon) {
            this.fabOpenIcon.style.display = 'block';
            this.fabCloseIcon.style.display = 'none';
        }
    }
    async sendMessage() {
        const messageText = this.chatInput.value.trim();
        if (!messageText) return;

        this.addMessage(messageText, 'user');
        this.chatInput.value = '';
        this.showTypingIndicator();

        try {
            const response = await fetch('/.netlify/functions/gemini-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: messageText,
                    history: this.messages.slice(-11, -1) // Send last 10 messages (excluding current one)
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Server error: ${response.status}`);
            }

            const data = await response.json();
            this.addMessage(data.reply, 'bot');

        } catch (error) {
            console.error('Error fetching chat response:', error);
            this.addMessage(error.message || 'Sorry, I am having trouble connecting. Please try again in a moment.', 'bot');
        } finally {
            this.hideTypingIndicator();
        }
    }
    addMessage(text, sender) {
        const message = { text, sender };
        this.messages.push(message);
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}`;
        messageElement.innerHTML = `<p>${text}</p>`;
        this.chatBody.appendChild(messageElement);
        this.scrollToBottom();
        this.saveMessages();
    }
    scrollToBottom() {
        this.chatBody.scrollTop = this.chatBody.scrollHeight;
    }
    showTypingIndicator() {
        this.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }
    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }
    saveMessages() {
        const recentMessages = this.messages.slice(-this.maxMessagesInStorage);
        localStorage.setItem(this.storageKey, JSON.stringify(recentMessages));
    }
    loadMessages() {
        const savedMessages = localStorage.getItem(this.storageKey);
        if (savedMessages) {
            this.messages = JSON.parse(savedMessages);
            if (this.messages.length > 0) {
                 this.chatBody.innerHTML = '';
            }
            this.messages.forEach(msg => {
                const messageElement = document.createElement('div');
                messageElement.className = `chat-message ${msg.sender}`;
                messageElement.innerHTML = `<p>${msg.text}</p>`;
                this.chatBody.appendChild(messageElement);
            });
        }
    }
    async emailTranscript() {
        const email = prompt("Please enter your email address to receive the transcript:");
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            if (email !== null) { // Don't alert if user cancelled
               alert("Invalid email address.");
            }
            return;
        }

        const transcript = this.messages.map(msg => `${msg.sender.toUpperCase()}: ${msg.text}`).join('\n');

        try {
            // Show some feedback to the user
            this.emailBtn.disabled = true;
            this.emailBtn.innerText = '⏳';

            const response = await fetch('/.netlify/functions/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, transcript }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send email.');
            }

            alert("Transcript sent successfully!");

        } catch (error) {
            console.error('Error sending transcript:', error);
            alert(`Error: ${error.message}`);
        } finally {
            // Restore button icon
            this.emailBtn.disabled = false;
            this.emailBtn.innerText = '✉️';
        }
    }
}


// ==========================================================================
// PRELOADER MANAGEMENT
// ==========================================================================

class PreloaderManager {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.minDisplayTime = 1000; // Minimum time to show preloader
        this.startTime = Date.now();
    }
    
    hide() {
        if (!this.preloader) return;
        
        const elapsedTime = Date.now() - this.startTime;
        const remainingTime = Math.max(0, this.minDisplayTime - elapsedTime);
        
        setTimeout(() => {
            this.preloader.classList.add('fade-out');
            
            setTimeout(() => {
                this.preloader.style.display = 'none';
                document.body.classList.remove('no-scroll');
                this.triggerPageAnimations();
            }, 500);
        }, remainingTime);
    }
    
    triggerPageAnimations() {
        // Trigger hero animations
        const heroElements = document.querySelectorAll('.hero-text > *, .hero-visual');
        heroElements.forEach((element, index) => {
            addClassWithAnimation(element, 'animate-in', index * 100);
        });
    }
}

// ==========================================================================
// NAVIGATION MANAGEMENT
// ==========================================================================

class NavigationManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        this.handleScroll();
        this.handleMobileMenu();
        this.handleNavLinkClicks();
        this.updateActiveLink();
        
        // Event listeners
        window.addEventListener('scroll', throttle(() => this.handleScroll(), CONFIG.throttleDelay));
        window.addEventListener('resize', debounce(() => this.handleResize(), CONFIG.debounceDelay));
    }
    
    handleScroll() {
        if (!this.navbar) return;
        
        const scrollY = window.pageYOffset;
        
        // Add scrolled class for navbar styling
        if (scrollY > CONFIG.scrollThreshold) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        // Update active navigation link
        this.updateActiveLink();
    }
    
    handleMobileMenu() {
        if (!this.navToggle || !this.navMenu) return;
        
        this.navToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target) && STATE.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && STATE.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        STATE.isMobileMenuOpen = !STATE.isMobileMenuOpen;
        
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = STATE.isMobileMenuOpen ? 'hidden' : '';
        
        // Animate menu items
        if (STATE.isMobileMenuOpen) {
            this.animateMenuItems();
        }
    }
    
    closeMobileMenu() {
        STATE.isMobileMenuOpen = false;
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    animateMenuItems() {
        const menuItems = this.navMenu.querySelectorAll('.nav-link');
        menuItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('animate-slide-in');
        });
    }
    
    handleNavLinkClicks() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Handle internal anchor links
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        smoothScrollTo(target);
                        this.closeMobileMenu();
                        
                        // Update active state
                        this.setActiveLink(link);
                    }
                }
                
                // Close mobile menu for all clicks
                if (STATE.isMobileMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        });
    }
    
    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos <= sectionTop + sectionHeight) {
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    this.setActiveLink(activeLink);
                }
            }
        });
    }
    
    setActiveLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }
    
    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth >= 768 && STATE.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
    }
}

// ==========================================================================
// TESTIMONIALS CAROUSEL
// ==========================================================================

class TestimonialsCarousel {
    constructor() {
        this.container = document.querySelector('.testimonials-slider');
        this.cards = document.querySelectorAll('.testimonial-card');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        
        this.currentIndex = 0;
        this.isAutoplay = CONFIG.testimonialAutoplay;
        this.autoplayTimer = null;
        
        this.init();
    }
    
    init() {
        if (!this.container || this.cards.length === 0) return;
        
        this.setupEventListeners();
        this.startAutoplay();
        this.showTestimonial(0);
    }
    
    setupEventListeners() {
        // Previous/Next buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousTestimonial());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextTestimonial());
        }
        
        // Dots navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToTestimonial(index));
        });
        
        // Pause autoplay on hover
        this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
        
        // Touch/swipe support
        this.setupTouchEvents();
    }
    
    setupTouchEvents() {
        let startX = 0;
        let endX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextTestimonial();
            } else {
                this.previousTestimonial();
            }
        }
    }
    
    showTestimonial(index) {
        if (index < 0 || index >= this.cards.length) return;
        
        // Hide all cards
        this.cards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Update dots
        this.dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current card and update dot
        if (this.cards[index]) {
            this.cards[index].classList.add('active');
        }
        
        if (this.dots[index]) {
            this.dots[index].classList.add('active');
        }
        
        this.currentIndex = index;
    }
    
    nextTestimonial() {
        const nextIndex = (this.currentIndex + 1) % this.cards.length;
        this.showTestimonial(nextIndex);
        this.resetAutoplay();
    }
    
    previousTestimonial() {
        const prevIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
        this.showTestimonial(prevIndex);
        this.resetAutoplay();
    }
    
    goToTestimonial(index) {
        this.showTestimonial(index);
        this.resetAutoplay();
    }
    
    startAutoplay() {
        if (!this.isAutoplay) return;
        
        this.autoplayTimer = setInterval(() => {
            this.nextTestimonial();
        }, CONFIG.testimonialInterval);
    }
    
    pauseAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
    }
    
    resetAutoplay() {
        this.pauseAutoplay();
        this.startAutoplay();
    }
}

// Global functions for testimonials (for inline onclick handlers)
function changeTestimonial(direction) {
    if (window.testimonialsCarousel) {
        if (direction > 0) {
            window.testimonialsCarousel.nextTestimonial();
        } else {
            window.testimonialsCarousel.previousTestimonial();
        }
    }
}

function currentTestimonial(index) {
    if (window.testimonialsCarousel) {
        window.testimonialsCarousel.goToTestimonial(index - 1);
    }
}

// ==========================================================================
// STATISTICS COUNTER
// ==========================================================================

class StatisticsCounter {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number[data-target]');
        this.hasAnimated = false;
        
        this.init();
    }
    
    init() {
        if (this.counters.length === 0) return;
        
        // Use Intersection Observer for better performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.animateCounters();
                    this.hasAnimated = true;
                    observer.disconnect();
                }
            });
        }, {
            threshold: 0.5
        });
        
        // Observe the first counter element
        if (this.counters[0]) {
            observer.observe(this.counters[0]);
        }
    }
    
    animateCounters() {
        this.counters.forEach((counter, index) => {
            const target = parseInt(counter.dataset.target);
            
            setTimeout(() => {
                animateCounter(counter, target, CONFIG.counterSpeed);
            }, index * 200); // Stagger animation
        });
    }
}

// ==========================================================================
// PRODUCT CARD RENDERER
// ==========================================================================
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card stagger-child';
    card.dataset.animation = 'fade-in';
    card.dataset.category = product.category;

    // 1. Initial skeleton UI
    card.innerHTML = `
        <div class="product-image skeleton skeleton-image"></div>
        <div class="product-info">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
        </div>
    `;

    // 2. Preload the image in memory
    const img = new Image();
    img.src = product.image.fallback; // Preload the fallback, as it's guaranteed to work.

    img.onload = () => {
        // 3. Once loaded, replace the entire card content
        const whatsappMessage = encodeURIComponent(`Hello, I’d like to inquire about ${product.name}.`);
            const whatsappLink = `https://wa.me/${CONFIG.whatsappNumber}?text=${whatsappMessage}`;

        // Using a template literal for the final content is clean and efficient.
        card.innerHTML = `
            <div class="product-image">
                <picture>
                  <source srcset="${product.image.webp}" type="image/webp">
                  <img src="${product.image.fallback}" alt="${product.name}" loading="lazy" class="product-img-real">
                </picture>
                <div class="product-overlay">
                    <button class="btn btn-sm btn-outline quick-view-btn">Quick View</button>
                    <a href="${whatsappLink}" class="btn btn-sm btn-whatsapp" target="_blank">Order Now</a>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
            </div>
        `;

        // Find the button we just created and add the listener
        const quickViewBtn = card.querySelector('.quick-view-btn');
        if (quickViewBtn) {
            quickViewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                quickView(product); // Pass the full product object.
            });
        }
    };

    img.onerror = () => {
        // Fallback content if image fails to load
        card.innerHTML = `
            <div class="product-image" style="height: 250px; display: flex; align-items: center; justify-content: center; background: #f0f0f0;">
                <span>Image not found</span>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
            </div>
        `;
    };

    return card;
}


// ==========================================================================
// PRODUCTS FILTER (For Products Page)
// ==========================================================================

class ProductsFilter {
    constructor(products) {
        this.allProducts = products || [];
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.productsGrid = document.getElementById('products-grid');
        this.searchInput = document.getElementById('search-input');

        this.currentCategory = 'all';
        this.currentSearchTerm = '';

        this.init();
    }

    init() {
        if (!this.productsGrid) return;
        this.setupEventListeners();
        this.renderProducts(this.allProducts);
    }

    setupEventListeners() {
        // Category filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentCategory = btn.dataset.category;
                this.updateActiveFilter(btn);
                this.filterAndRender();
            });
        });

        // Search input
        if (this.searchInput) {
            this.searchInput.addEventListener('input', debounce((e) => {
                this.currentSearchTerm = e.target.value.toLowerCase().trim();
                this.filterAndRender();
            }, 300));
        }
    }

    filterAndRender() {
        let filteredProducts = this.allProducts;

        // Filter by category
        if (this.currentCategory !== 'all') {
            filteredProducts = filteredProducts.filter(product => product.category === this.currentCategory);
        }

        // Filter by search term
        if (this.currentSearchTerm) {
            filteredProducts = filteredProducts.filter(product =>
                product.name.toLowerCase().includes(this.currentSearchTerm)
            );
        }

        this.renderProducts(filteredProducts);
    }

    renderProducts(products) {
        this.productsGrid.innerHTML = ''; // Clear existing products

        if (products.length === 0) {
            this.productsGrid.innerHTML = '<p class="no-products-found">لا توجد منتجات تطابق بحثك.</p>';
            return;
        }

        const fragment = document.createDocumentFragment();
        products.forEach(product => {
            const card = createProductCard(product);
            fragment.appendChild(card);
        });
        this.productsGrid.appendChild(fragment);
    }

    updateActiveFilter(activeBtn) {
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }
}

// ==========================================================================
// PRODUCTS PREVIEW (For Home Page)
// ==========================================================================
class ProductsPreview {
    constructor(products) {
        this.grid = document.getElementById('products-preview-grid');
        if (!this.grid || !products || products.length === 0) return;

        this.products = products;
        this.productsToShow = 4;
        this.renderPreview();
    }

    renderPreview() {
        const previewProducts = this.products.slice(0, this.productsToShow);
        const fragment = document.createDocumentFragment();

        previewProducts.forEach(product => {
            const card = createProductCard(product);
            fragment.appendChild(card);
        });

        this.grid.appendChild(fragment);
    }
}

// ==========================================================================
// MODAL MANAGEMENT
// ==========================================================================

class ModalManager {
    constructor() {
        this.modals = document.querySelectorAll('.modal');
        this.activeModal = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeModal(this.activeModal);
            }
        });
        
        // Close modal on backdrop click
        this.modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
            
            // Close button
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.closeModal(modal);
                });
            }
        });
    }
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        this.activeModal = modal;
        
        // Focus trap
        this.trapFocus(modal);
    }
    
    closeModal(modal) {
        if (!modal) return;
        
        modal.classList.remove('show');
        document.body.style.overflow = '';
        this.activeModal = null;
    }
    
    trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        firstFocusable.focus();
        
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
}

// Global functions for modal management
function quickView(product) {
    const modal = document.getElementById('quickViewModal');
    if (!modal || !product) return;

    // Get modal elements
    const modalTitle = modal.querySelector('#modalTitle');
    const modalImage = modal.querySelector('#modalImage');
    const modalDescription = modal.querySelector('#modalDescription');
    const modalPrice = modal.querySelector('#modalPrice');
    const modalWhatsappBtn = modal.querySelector('#modalWhatsappBtn');

    // Populate modal content with data from the product object
    if (modalTitle) modalTitle.textContent = product.name;

    if (modalImage) {
        // Use the actual product image
        modalImage.src = product.image.fallback;
        modalImage.alt = product.name;
    }

    if (modalDescription) {
        modalDescription.textContent = product.description;
    }

    if (modalPrice) {
        modalPrice.textContent = product.price;
    }

    // Update WhatsApp button link
    if (modalWhatsappBtn) {
        const message = `أهلاً، أريد الاستفسار عن منتج: ${product.name}`;
        modalWhatsappBtn.href = `https://wa.me/201143343338?text=${encodeURIComponent(message)}`;
    }

    // Open modal
    if (window.modalManager) {
        window.modalManager.openModal('quickViewModal');
    }
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal && window.modalManager) {
        window.modalManager.closeModal(modal);
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal && window.modalManager) {
        window.modalManager.closeModal(modal);
    }
}

// ==========================================================================
// FORM VALIDATION & SUBMISSION
// ==========================================================================

class FormManager {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }
    
    init() {
        this.forms.forEach(form => {
            this.setupFormValidation(form);
        });
        
        // Contact form specific setup
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            this.setupContactForm(contactForm);
        }
    }
    
    setupFormValidation(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
        
        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });
    }
    
    setupContactForm(form) {
        // WhatsApp form button
        const whatsappBtn = document.getElementById('whatsappFormBtn');
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', () => {
                this.sendViaWhatsApp(form);
            });
        }
    }
    
    validateField(field) {
        const fieldGroup = field.closest('.form-group');
        const errorElement = fieldGroup?.querySelector('.error-message');
        
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'هذا الحقل مطلوب';
        }
        
        // Email validation
        if (field.type === 'email' && field.value.trim() && !CONFIG.emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'يرجى إدخال بريد إلكتروني صحيح';
        }
        
        // Phone validation
        if (field.type === 'tel' && field.value.trim() && !CONFIG.phoneRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'يرجى إدخال رقم تليفون صحيح';
        }
        
        // Update field state
        this.updateFieldState(fieldGroup, errorElement, isValid, errorMessage);
        
        return isValid;
    }
    
    updateFieldState(fieldGroup, errorElement, isValid, errorMessage) {
        if (!fieldGroup) return;
        
        if (isValid) {
            fieldGroup.classList.remove('error');
            fieldGroup.classList.add('success');
            if (errorElement) {
                errorElement.textContent = '';
            }
        } else {
            fieldGroup.classList.remove('success');
            fieldGroup.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errorMessage;
            }
            
            // Shake animation for error
            fieldGroup.classList.add('shake');
            setTimeout(() => {
                fieldGroup.classList.remove('shake');
            }, 500);
        }
    }
    
    clearFieldError(field) {
        const fieldGroup = field.closest('.form-group');
        if (fieldGroup) {
            fieldGroup.classList.remove('error');
        }
    }
    
    validateForm(form) {
        const fields = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isFormValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });
        
        return isFormValid;
    }
    
    handleFormSubmission(form) {
        if (STATE.isFormSubmitting) return;
        
        if (!this.validateForm(form)) {
            return;
        }
        
        STATE.isFormSubmitting = true;
        
        // Show loading state
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            this.handleFormSuccess(form);
            STATE.isFormSubmitting = false;
            
            // Reset button state
            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        }, 2000);
    }
    
    handleFormSuccess(form) {
        // Reset form
        form.reset();
        
        // Clear validation states
        const fieldGroups = form.querySelectorAll('.form-group');
        fieldGroups.forEach(group => {
            group.classList.remove('success', 'error');
        });
        
        // Show success modal
        if (window.modalManager) {
            window.modalManager.openModal('successModal');
        }
    }
    
    sendViaWhatsApp(form) {
        if (!this.validateForm(form)) {
            return;
        }
        
        const formData = new FormData(form);
        let message = 'أهلاً، أريد التواصل معكم:\n\n';
        
        // Build message from form data
        for (let [key, value] of formData.entries()) {
            if (value.trim()) {
                const fieldLabel = this.getFieldLabel(form, key);
                message += `${fieldLabel}: ${value}\n`;
            }
        }
        
        // Open WhatsApp
        const whatsappURL = generateWhatsAppURL(message);
        window.open(whatsappURL, '_blank');
    }
    
    getFieldLabel(form, fieldName) {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!field) return fieldName;
        
        const label = form.querySelector(`label[for="${field.id}"]`) || 
                     field.closest('.form-group')?.querySelector('label');
        
        return label ? label.textContent.replace('*', '').trim() : fieldName;
    }
}

// ==========================================================================
// FAQ ACCORDION
// ==========================================================================

class FAQAccordion {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.init();
    }
    
    init() {
        if (this.faqItems.length === 0) return;
        
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    this.toggleFAQ(item);
                });
            }
        });
    }
    
    toggleFAQ(item) {
        const isActive = item.classList.contains('active');
        
        // Close all other FAQs
        this.faqItems.forEach(faq => {
            faq.classList.remove('active');
        });
        
        // Toggle current FAQ
        if (!isActive) {
            item.classList.add('active');
        }
        
        // Smooth scroll to FAQ if needed
        if (!isActive && !isInViewport(item)) {
            setTimeout(() => {
                smoothScrollTo(item, 100);
            }, 300);
        }
    }
}

// Global function for FAQ toggle (for inline onclick handlers)
function toggleFaq(element) {
    const faqItem = element.closest('.faq-item');
    if (faqItem && window.faqAccordion) {
        window.faqAccordion.toggleFAQ(faqItem);
    }
}

// ==========================================================================
// SCROLL TO TOP BUTTON
// ==========================================================================

class ScrollToTop {
    constructor() {
        this.button = document.getElementById('back-to-top');
        this.init();
    }
    
    init() {
        if (!this.button) return;
        
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        window.addEventListener('scroll', throttle(() => {
            this.handleScroll();
        }, CONFIG.throttleDelay));
    }
    
    handleScroll() {
        const scrollY = window.pageYOffset;
        
        if (scrollY > window.innerHeight) {
            this.button.classList.add('show');
        } else {
            this.button.classList.remove('show');
        }
    }
}

// ==========================================================================
// WHATSAPP INTEGRATION
// ==========================================================================

class WhatsAppManager {
    constructor() {
        this.floatButton = document.querySelector('.whatsapp-float');
        this.whatsappLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.trackWhatsAppClicks();
    }
    
    setupEventListeners() {
        // Float button animation
        if (this.floatButton) {
            this.floatButton.addEventListener('mouseenter', () => {
                this.floatButton.style.transform = 'scale(1.1) translateY(-5px)';
            });
            
            this.floatButton.addEventListener('mouseleave', () => {
                this.floatButton.style.transform = 'scale(1) translateY(0)';
            });
        }
    }
    
    trackWhatsAppClicks() {
        this.whatsappLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Track WhatsApp clicks for analytics
                this.trackEvent('WhatsApp', 'Click', link.textContent || 'Float Button');
            });
        });
    }
    
    trackEvent(category, action, label) {
        // Analytics tracking (replace with your preferred analytics service)
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
        
        console.log(`Analytics: ${category} - ${action} - ${label}`);
    }
}

// ==========================================================================
// PERFORMANCE OPTIMIZATION
// ==========================================================================

class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.optimizeImages();
        this.preloadCriticalResources();
        this.setupPrefetch();
    }
    
    optimizeImages() {
        // Lazy loading for images
        if ('IntersectionObserver' in window) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
    
    preloadCriticalResources() {
        // Preload critical fonts
        const criticalFonts = [
            'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;600;700&display=swap'
        ];
        
        criticalFonts.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = font;
            document.head.appendChild(link);
        });
    }
    
    setupPrefetch() {
        // Prefetch likely next pages
        const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="./"]');
        
        const linkObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const link = entry.target;
                    this.prefetchPage(link.href);
                    linkObserver.unobserve(link);
                }
            });
        });
        
        internalLinks.forEach(link => {
            linkObserver.observe(link);
        });
    }
    
    prefetchPage(url) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
    }
}

// ==========================================================================
// ACCESSIBILITY ENHANCEMENTS
// ==========================================================================

class AccessibilityManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupARIALabels();
        this.respectReducedMotion();
    }
    
    setupKeyboardNavigation() {
        // Enhanced keyboard navigation for interactive elements
        const interactiveElements = document.querySelectorAll(
            'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        interactiveElements.forEach(element => {
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    if (element.tagName === 'BUTTON' || element.getAttribute('role') === 'button') {
                        e.preventDefault();
                        element.click();
                    }
                }
            });
        });
    }
    
    setupFocusManagement() {
        // Skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'تخطي إلى المحتوى الرئيسي';
        skipLink.className = 'skip-link sr-only';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
            skipLink.classList.remove('sr-only');
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
            skipLink.classList.add('sr-only');
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    setupARIALabels() {
        // Add ARIA labels to interactive elements without proper labels
        const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
        
        buttons.forEach(button => {
            const text = button.textContent.trim();
            if (!text) {
                // Try to infer purpose from context
                if (button.classList.contains('nav-toggle')) {
                    button.setAttribute('aria-label', 'فتح/إغلاق القائمة');
                } else if (button.classList.contains('modal-close')) {
                    button.setAttribute('aria-label', 'إغلاق النافذة');
                }
            }
        });
    }
    
    respectReducedMotion() {
        // Respect user's reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition-fast', '0.01ms');
            document.documentElement.style.setProperty('--transition-base', '0.01ms');
            document.documentElement.style.setProperty('--transition-slow', '0.01ms');
            
            // Disable autoplay for testimonials
            CONFIG.testimonialAutoplay = false;
        }
    }
}

// ==========================================================================
// MAIN APPLICATION INITIALIZATION
// ==========================================================================

class AlFahdApp {
    constructor() {
        this.components = {};
        this.init();
    }
    
    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }
    
    initializeComponents() {
        try {
            // Initialize core components
            this.components.theme = new ThemeManager();
            this.components.preloader = new PreloaderManager();
            this.components.navigation = new NavigationManager();
            this.components.modal = new ModalManager();
            this.components.form = new FormManager();
            this.components.scrollToTop = new ScrollToTop();
            this.components.whatsapp = new WhatsAppManager();
            this.components.accessibility = new AccessibilityManager();
            this.components.performance = new PerformanceOptimizer();
            
            // Initialize page-specific components
            this.initializePageSpecificComponents();

            // Initialize micro-interactions
            const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-whatsapp, .btn-whatsapp-large, .btn-outline');
            this.components.magneticFx = new MagneticFx(magneticButtons);
            this.components.animationKit = new AnimationKit();
            this.components.parallaxController = new ParallaxController('.parallax-bg');
            this.components.cardTilt = new CardTilt('.product-card');
            this.components.chatWidget = new ChatWidget();
            
            // Make components globally available
            this.exposeGlobalComponents();
            
            // Hide preloader after initialization
            setTimeout(() => {
                this.components.preloader.hide();
            }, 500);
            
            console.log('Al Fahd Seafood website initialized successfully');
            
        } catch (error) {
            console.error('Error initializing Al Fahd website:', error);
        }
    }
    
    async initializePageSpecificComponents() {
        try {
            const response = await fetch('data/products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const products = await response.json();

            // Testimonials (Home page)
            if (document.querySelector('.testimonials-slider')) {
                this.components.testimonials = new TestimonialsCarousel();
            }

            // Products Preview (Home page)
            if (document.getElementById('products-preview-grid')) {
                this.components.productsPreview = new ProductsPreview(products);
            }

            // Statistics counter (About page)
            if (document.querySelector('.stat-number[data-target]')) {
                this.components.statistics = new StatisticsCounter();
            }

            // Products filter (Products page)
            if (document.querySelector('.products-filter')) {
                this.components.productsFilter = new ProductsFilter(products);
            }

            // FAQ accordion (Contact page)
            if (document.querySelector('.faq-item')) {
                this.components.faq = new FAQAccordion();
            }
        } catch (error) {
            console.error("Could not load product data:", error);
        }
    }
    
    exposeGlobalComponents() {
        // Make components available globally for inline event handlers
        window.testimonialsCarousel = this.components.testimonials;
        window.modalManager = this.components.modal;
        window.faqAccordion = this.components.faq;
        window.alFahdApp = this;
    }
}

// ==========================================================================
// ERROR HANDLING & FALLBACKS
// ==========================================================================

// Global error handler
window.addEventListener('error', (event) => {
    console.error('JavaScript Error:', event.error);
    
    // Fallback for critical functionality
    if (event.error.message.includes('IntersectionObserver')) {
        // Fallback for browsers without IntersectionObserver
        console.warn('IntersectionObserver not supported, using fallback');
        // Implement fallback logic here
    }
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    event.preventDefault();
});

// ==========================================================================
// INITIALIZE APPLICATION
// ==========================================================================

// Initialize the application
const app = new AlFahdApp();

// ==========================================================================
// LEGACY BROWSER SUPPORT
// ==========================================================================

// Polyfill for older browsers
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || 
                                Element.prototype.webkitMatchesSelector;
}

// ==========================================================================
// SERVICE WORKER REGISTRATION (Future Enhancement)
// ==========================================================================

// Register service worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ==========================================================================
// END OF MAIN.JS
// ==========================================================================