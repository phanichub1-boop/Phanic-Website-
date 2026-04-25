// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Hero Text Rotation
const heroTexts = [
    { line1: "Master Digital", line2: "Skills" },
    { line1: "Build Strong", line2: "Character" },
    { line1: "Transform Your", line2: "Future" }
];

let currentTextIndex = 0;
const heroTitle = document.getElementById('heroTitle');
const dots = document.querySelectorAll('.dot');

function updateHeroText(index) {
    const text = heroTexts[index];
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(-20px)';

    setTimeout(() => {
        heroTitle.innerHTML = `
            <span class="title-line">${text.line1}</span>
            <span class="title-line accent">${text.line2}</span>
        `;
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }, 300);
}

setInterval(() => {
    currentTextIndex = (currentTextIndex + 1) % heroTexts.length;
    updateHeroText(currentTextIndex);
}, 5000);

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentTextIndex = index;
        updateHeroText(index);
    });
});

// Smooth scroll for anchor links
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

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinkElements = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    navLinkElements.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            const statNumber = entry.target.querySelector('.stat-number[data-target]');
            if (statNumber) {
                animateCounter(statNumber);
            }
        }
    });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// Counter animation
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target.toLocaleString() + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Parallax effect for hero video
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo && scrolled < window.innerHeight) {
        heroVideo.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ============================================
// SINGLE REVIEW CAROUSEL
// ============================================

class ReviewCarousel {
    constructor() {
        this.track = document.getElementById('reviewCarouselTrack');
        this.slides = document.querySelectorAll('.review-carousel-slide');
        this.prevBtn = document.getElementById('reviewPrev');
        this.nextBtn = document.getElementById('reviewNext');
        this.dots = document.querySelectorAll('.review-carousel-dot');
        this.counterCurrent = document.getElementById('reviewCounterCurrent');
        this.counterTotal = document.getElementById('reviewCounterTotal');

        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 6000;

        this.init();
    }

    init() {
        // Set total counter
        if (this.counterTotal) {
            this.counterTotal.textContent = this.totalSlides;
        }

        // Bind events
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }

        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goTo(index));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        this.track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            this.stopAutoPlay();
        }, { passive: true });

        this.track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
            this.startAutoPlay();
        }, { passive: true });

        // Pause on hover
        const carousel = document.querySelector('.review-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
            carousel.addEventListener('mouseleave', () => this.startAutoPlay());
        }

        // Initial render
        this.update();
        this.startAutoPlay();
    }

    goTo(index) {
        if (index < 0) index = this.totalSlides - 1;
        if (index >= this.totalSlides) index = 0;
        this.currentIndex = index;
        this.update();
    }

    next() {
        this.goTo(this.currentIndex + 1);
    }

    prev() {
        this.goTo(this.currentIndex - 1);
    }

    update() {
        // Move track
        if (this.track) {
            this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        }

        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });

        // Update counter
        if (this.counterCurrent) {
            this.counterCurrent.textContent = this.currentIndex + 1;
        }

        // Update button states
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex === this.totalSlides - 1;
        }
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            if (this.currentIndex < this.totalSlides - 1) {
                this.next();
            } else {
                this.goTo(0);
            }
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Initialize review carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ReviewCarousel();
});

// ============================================
// END SINGLE REVIEW CAROUSEL
// ============================================

// Course Data
const courseData = {
    'basic-computer': {
        title: 'Basic Computer',
        description: 'Foundation course covering essential computer operations, MS Office, and internet fundamentals. Perfect for beginners with no prior experience.',
        duration: '3 Months',
        pricePhysical: '₦60,000',
        priceOnline: '₦50,000',
        video: 'https://assets.mixkit.co/videos/preview/mixkit-typing-on-a-laptop-keyboard-4356-large.mp4'
    },
    'graphics-design': {
        title: 'Graphics Design',
        description: 'Master design principles, color theory, and industry-standard tools like Photoshop, Illustrator, and Canva. Build a professional portfolio.',
        duration: '3 Months',
        pricePhysical: '₦80,000',
        priceOnline: '₦40,000',
        video: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-woman-typing-on-a-laptop-4358-large.mp4'
    },
    'ui-ux': {
        title: 'UI/UX Design',
        description: 'Learn user interface and experience design using Figma, prototyping, wireframing, and design systems. Create user-centered designs.',
        duration: '3 Months',
        pricePhysical: '₦100,000',
        priceOnline: '₦60,000',
        video: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-blue-lines-99785-large.mp4'
    },
    'ai-mastery': {
        title: 'AI Mastery',
        description: 'Explore artificial intelligence tools, prompt engineering, ChatGPT, Midjourney, and AI-powered productivity workflows for business.',
        duration: '1 Month',
        pricePhysical: '₦20,000',
        priceOnline: '₦10,000',
        video: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-futuristic-devices-99786-large.mp4'
    },
    'video-editing': {
        title: 'Mobile Video Editing',
        description: 'Create professional videos using mobile apps like CapCut, InShot, and VN. Perfect for content creators and social media managers.',
        duration: '1 Month',
        pricePhysical: '₦20,000',
        priceOnline: '₦10,000',
        video: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smart-phone-close-up-10898-large.mp4'
    },
    'knowledge-money': {
        title: 'Knowledge Money',
        description: 'Monetize your expertise through digital products, online courses, coaching, consulting services, and membership sites.',
        duration: '1 Month',
        pricePhysical: '₦20,000',
        priceOnline: '₦10,000',
        video: 'https://assets.mixkit.co/videos/preview/mixkit-counting-money-close-up-1089-large.mp4'
    },
    'social-media': {
        title: 'Social Media Marketing',
        description: 'Master social media strategy, content creation, advertising, analytics, and community management across all major platforms.',
        duration: '2 Months',
        pricePhysical: '₦50,000',
        priceOnline: '₦30,000',
        video: 'https://assets.mixkit.co/videos/preview/mixkit-woman-using-a-smartphone-while-sitting-on-a-sofa-4354-large.mp4'
    },
    'web-design-nocode': {
        title: 'Web Design (No Coding)',
        description: 'Build beautiful websites using WordPress, Webflow, Wix, and other no-code tools without writing a single line of code.',
        duration: '2 Months',
        pricePhysical: '₦120,000',
        priceOnline: '₦72,000',
        video: 'https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-a-laptop-at-the-office-4355-large.mp4'
    },
    'frontend-dev': {
        title: 'Frontend Web Development',
        description: 'Learn HTML, CSS, JavaScript, React, and modern frontend frameworks to build interactive, responsive websites and web apps.',
        duration: '3 Months',
        pricePhysical: '₦150,000',
        priceOnline: '₦90,000',
        video: 'https://assets.mixkit.co/videos/preview/mixkit-programming-code-running-on-a-screen-4357-large.mp4'
    },
    'fullstack-dev': {
        title: 'Fullstack Web Development',
        description: 'Complete web development covering frontend, backend (Node.js/Python), databases, APIs, and deployment. Become a full developer.',
        duration: '6 Months',
        pricePhysical: '₦250,000',
        priceOnline: '₦150,000',
        video: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-blue-lines-99785-large.mp4'
    }
};

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    const video = modal.querySelector('video');
    if (video) {
        video.pause();
    }
}

// Course Modal
const courseCards = document.querySelectorAll('.course-card');

courseCards.forEach(card => {
    card.addEventListener('click', () => {
        const courseKey = card.getAttribute('data-course');
        const course = courseData[courseKey];

        if (course) {
            document.getElementById('modalTitle').textContent = course.title;
            document.getElementById('modalDescription').textContent = course.description;
            document.getElementById('modalDuration').textContent = course.duration;
            document.getElementById('modalPricePhysical').textContent = course.pricePhysical;
            document.getElementById('modalPriceOnline').textContent = course.priceOnline;

            const video = document.getElementById('modalVideo');
            video.querySelector('source').src = course.video;
            video.load();

            openModal('courseModal');
        }
    });
});

// Leaderboard Modal
document.getElementById('leaderboardLink').addEventListener('click', (e) => {
    e.preventDefault();
    openModal('leaderboardModal');
});

// Portfolio Modal
document.getElementById('portfolioLink').addEventListener('click', (e) => {
    e.preventDefault();
    openModal('portfolioModal');
});

// Phanic Blog Coming Soon Modal
document.getElementById('phanicblog').addEventListener('click', (e) => {
    e.preventDefault();
    openModal('blogModal');
});

// Close modal handlers
document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        closeModal(modal);
    });
});

// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', () => {
        const modal = overlay.closest('.modal');
        closeModal(modal);
    });
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            closeModal(modal);
        });
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Handle reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    document.querySelectorAll('[data-aos]').forEach(el => {
        el.classList.add('aos-animate');
    });
}

// Performance: Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Form validation (if forms are added later)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Brochure link tracking
document.querySelector('.btn-brochure')?.addEventListener('click', () => {
    console.log('Brochure opened in new tab');
});

// Console easter egg
console.log('%cPhanic Computer Hub', 'font-size: 24px; font-weight: bold; color: #8B0000;');
console.log('%cEmpowering through digital education', 'font-size: 14px; color: #666;');
// ============================================
// HERO VIDEO — Dynamic iframe for autoplay
// Browsers require muted=1 for autoplay policy.
// We inject the iframe via JS so it auto-starts,
// then provide an Unmute button for user control.
// ============================================
(function () {
    const wrapper = document.getElementById('heroVideoWrapper');
    const unmuteBtn = document.getElementById('videoUnmuteBtn');
    const muteLabel = document.getElementById('videoMuteLabel');
    if (!wrapper) return;

    let isMuted = true;
    const VIDEO_ID = '3UDoHkrLbls';

    function buildSrc(muted) {
        return `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=${muted ? 1 : 0}&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
    }

    // Inject iframe dynamically — required for autoplay to fire in Chrome/Safari
    const iframe = document.createElement('iframe');
    iframe.id = 'heroYTIframe';
    iframe.src = buildSrc(true);
    iframe.title = 'Phanic Computer Hub — Intro Video';
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;
    wrapper.appendChild(iframe);

    // Unmute button: re-injects iframe with mute=0
    if (unmuteBtn) {
        unmuteBtn.addEventListener('click', () => {
            isMuted = !isMuted;
            iframe.src = buildSrc(isMuted);
            muteLabel.textContent = isMuted ? 'Unmute' : 'Mute';
            // Toggle icon paths
            unmuteBtn.querySelectorAll('.mute-line').forEach(el => {
                el.style.display = isMuted ? '' : 'none';
            });
            unmuteBtn.querySelectorAll('.unmute-wave').forEach(el => {
                el.style.display = isMuted ? 'none' : '';
            });
            unmuteBtn.classList.toggle('unmuted', !isMuted);
        });
    }
})();

// ============================================
// REVIEW "READ MORE" — expand/collapse long reviews
// ============================================
(function () {
    document.querySelectorAll('.review-carousel-text').forEach(textEl => {
        // Only add button if text is long enough to be clipped
        if (textEl.scrollHeight <= textEl.clientHeight + 10) return;

        const btn = document.createElement('button');
        btn.className = 'review-read-more';
        btn.innerHTML = 'Read more <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>';

        textEl.insertAdjacentElement('afterend', btn);

        btn.addEventListener('click', () => {
            const expanded = textEl.classList.toggle('expanded');
            btn.innerHTML = expanded
                ? 'Show less <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>'
                : 'Read more <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>';
        });
    });
})();