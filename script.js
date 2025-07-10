// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.8)';
        navbar.style.backdropFilter = 'blur(20px)';
    }
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add fade-in class to elements and observe them
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.project-card, .testimonial-card, .skill-tag, .contact-method, .work-item');
    
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Initialize video interactions
    initializeVideoInteractions();
});

// Parallax effect for floating elements
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-element');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
    });
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title .title-line:first-child');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 80);
        }, 500);
    }
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Ask for email provider
        const provider = await askEmailProvider();
        if (!provider) {
            showNotification('Email sending cancelled.', 'error');
            return;
        }
        
        // Prepare email details
        const recipient = 'Saintmadecreation@gmail.com';
        const subject = encodeURIComponent('New Contact from 68k Portfolio');
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
        let url = '';
        switch (provider) {
            case 'gmail':
                url = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;
                break;
            case 'yahoo':
                url = `https://compose.mail.yahoo.com/?to=${recipient}&subject=${subject}&body=${body}`;
                break;
            case 'outlook':
                url = `https://outlook.live.com/mail/0/deeplink/compose?to=${recipient}&subject=${subject}&body=${body}`;
                break;
            case 'icloud':
                url = `https://www.icloud.com/mail/compose?to=${recipient}&subject=${subject}&body=${body}`;
                break;
            case 'proton':
                url = `https://mail.proton.me/u/0/all-mail#?compose&to=${recipient}&subject=${subject}&body=${body}`;
                break;
            default:
                url = `mailto:${recipient}?subject=${subject}&body=${body}`;
        }
        window.open(url, '_blank');
        showNotification('Your email draft has been opened in your provider. Please review and send!', 'success');
        this.reset();
    });
}

// Modern provider picker
async function askEmailProvider() {
    return new Promise((resolve) => {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'provider-modal';
        modal.innerHTML = `
            <div class="provider-modal-content">
                <h3>Select your email provider</h3>
                <div class="provider-options">
                    <button data-provider="gmail">Gmail</button>
                    <button data-provider="yahoo">Yahoo</button>
                    <button data-provider="outlook">Outlook</button>
                    <button data-provider="icloud">iCloud</button>
                    <button data-provider="proton">Proton</button>
                    <button data-provider="other">Other</button>
                </div>
                <button class="provider-cancel">Cancel</button>
            </div>
        `;
        document.body.appendChild(modal);
        // Handle selection
        modal.querySelectorAll('button[data-provider]').forEach(btn => {
            btn.onclick = () => {
                document.body.removeChild(modal);
                resolve(btn.getAttribute('data-provider'));
            };
        });
        modal.querySelector('.provider-cancel').onclick = () => {
            document.body.removeChild(modal);
            resolve(null);
        };
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Skill tags animation
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.05)';
    });
    
    tag.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Project cards hover effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Testimonial cards stagger animation
document.querySelectorAll('.testimonial-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

// Gradient text animation
function animateGradientText() {
    const gradientTexts = document.querySelectorAll('.logo-text, .title-line, .section-title');
    
    gradientTexts.forEach(text => {
        text.addEventListener('mouseenter', function() {
            this.style.background = 'var(--gradient-2)';
            this.style.backgroundSize = '200% 200%';
            this.style.animation = 'gradientShift 2s ease infinite';
        });
        
        text.addEventListener('mouseleave', function() {
            this.style.background = 'var(--gradient-1)';
            this.style.animation = 'none';
        });
    });
}

// Add gradient shift animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
`;
document.head.appendChild(style);

// Initialize gradient text animation
document.addEventListener('DOMContentLoaded', animateGradientText);

// Smooth reveal animation for sections
function revealOnScroll() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;
        
        if (scrollY + windowHeight > sectionTop + 100) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
}

// Initialize section reveal
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Trigger initial reveal
    setTimeout(revealOnScroll, 100);
});

// Add scroll event listener for section reveal
window.addEventListener('scroll', revealOnScroll);

// Cursor trail effect (optional)
function createCursorTrail() {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: var(--gradient-1);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.7;
        transition: all 0.1s ease;
    `;
    document.body.appendChild(trail);
    
    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateTrail() {
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        
        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
}

// Uncomment the line below to enable cursor trail effect
// createCursorTrail();

// Performance optimization: Throttle scroll events
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
    }
}

// Video interaction functionality
function initializeVideoInteractions() {
    const videoItems = document.querySelectorAll('.video-item');
    
    videoItems.forEach(item => {
        const video = item.querySelector('.work-video');
        
        // Play video on hover
        item.addEventListener('mouseenter', () => {
            if (video) {
                video.play().catch(e => console.log('Video autoplay prevented:', e));
            }
        });
        
        // Pause video when not hovering
        item.addEventListener('mouseleave', () => {
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });
        
        // Click to play/pause
        item.addEventListener('click', () => {
            if (video) {
                if (video.paused) {
                    video.play().catch(e => console.log('Video play prevented:', e));
                } else {
                    video.pause();
                }
            }
        });
    });
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    revealOnScroll();
}, 16)); // ~60fps

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero elements
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.2}s`;
    });
});

// Add CSS for loading state
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded) .hero-content > * {
        opacity: 0;
        transform: translateY(30px);
    }
    
    body.loaded .hero-content > * {
        animation: slideInUp 0.8s ease-out forwards;
    }
`;
document.head.appendChild(loadingStyle); 