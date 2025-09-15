// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initNavigation();
    initScrollEffects();
    initMenuTabs();
    initGalleryTabs();
    initCart();
    initForms();
    initAnimations();
    initFloatingElements();
    createScrollToTop();
});

// Navigation Functions
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Hamburger menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Effects
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add stagger effect for menu items
                if (entry.target.classList.contains('menu-item')) {
                    const items = entry.target.parentElement.querySelectorAll('.menu-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Menu Tab Functions
function initMenuTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const menuCategories = document.querySelectorAll('.menu-category');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Remove active class from all buttons and categories
            tabButtons.forEach(btn => btn.classList.remove('active'));
            menuCategories.forEach(cat => cat.classList.remove('active'));
            
            // Add active class to clicked button and corresponding category
            this.classList.add('active');
            document.getElementById(category).classList.add('active');
            
            // Animate menu items
            const activeCategory = document.getElementById(category);
            const items = activeCategory.querySelectorAll('.menu-item');
            items.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.transition = 'all 0.5s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            });
        });
    });
}

// Gallery Tab Functions
function initGalleryTabs() {
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-gallery');
            
            // Remove active class from all tabs
            galleryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (category === 'all' || itemCategory === category) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Gallery item click effect
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Shopping Cart Functions
function initCart() {
    let cart = [];
    let cartTotal = 0;
    
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartSummary = document.getElementById('cart-summary');
    const cartItems = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const item = this.getAttribute('data-item');
            const price = parseInt(this.getAttribute('data-price'));
            
            // Add to cart
            const existingItem = cart.find(cartItem => cartItem.name === item);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name: item,
                    price: price,
                    quantity: 1
                });
            }
            
            updateCart();
            
            // Button animation
            const originalText = this.textContent;
            this.textContent = 'Added!';
            this.style.background = '#28a745';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = '';
            }, 1000);
        });
    });

    function updateCart() {
        cartItems.innerHTML = '';
        cartTotal = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            cartTotal += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span>${item.name}</span>
                    <button onclick="removeFromCart(${index})" style="background: #dc3545; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer;">×</button>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: rgba(255,255,255,0.8);">
                    <span>Qty: ${item.quantity}</span>
                    <span>Rp ${itemTotal.toLocaleString()}</span>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        cartTotalElement.textContent = cartTotal.toLocaleString();
        
        if (cart.length > 0) {
            cartSummary.style.display = 'block';
        } else {
            cartSummary.style.display = 'none';
        }
    }

    // Make removeFromCart global
    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        updateCart();
    };

    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Cart is empty!');
                return;
            }
            
            const orderDetails = cart.map(item => 
                `${item.name} x${item.quantity} = Rp ${(item.price * item.quantity).toLocaleString()}`
            ).join('\n');
            
            const message = `Order Details:\n${orderDetails}\n\nTotal: Rp ${cartTotal.toLocaleString()}`;
            const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
        });
    }
}

// Form Functions
function initForms() {
    // Reservation Form
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (!validateReservationForm(data)) {
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                const message = `Reservation Request:\n\nName: ${data.name}\nPhone: ${data.phone}\nDate: ${data.date}\nTime: ${data.time}\nGuests: ${data.guests}\nNotes: ${data.notes || 'None'}`;
                const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
                
                window.open(whatsappUrl, '_blank');
                
                // Reset form
                this.reset();
                submitBtn.textContent = 'Reservation Sent!';
                submitBtn.style.background = '#28a745';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 2000);
                
                showNotification('Reservation request sent via WhatsApp!', 'success');
            }, 1500);
        });
    }

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                const message = `Contact Message:\n\nName: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\nMessage: ${data.message}`;
                const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
                
                window.open(whatsappUrl, '_blank');
                
                // Reset form
                this.reset();
                submitBtn.textContent = 'Message Sent!';
                submitBtn.style.background = '#28a745';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 2000);
                
                showNotification('Message sent via WhatsApp!', 'success');
            }, 1500);
        });
    }

    // Set minimum date for reservation
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        // Set max date to 7 days from now
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 7);
        dateInput.max = maxDate.toISOString().split('T')[0];
    }
}

// Form Validation
function validateReservationForm(data) {
    const errors = [];
    
    if (!data.name.trim()) errors.push('Name is required');
    if (!data.phone.trim()) errors.push('Phone is required');
    if (!data.date) errors.push('Date is required');
    if (!data.time) errors.push('Time is required');
    if (!data.guests) errors.push('Number of guests is required');
    
    // Validate phone number format
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    if (data.phone && !phoneRegex.test(data.phone.replace(/\s+/g, ''))) {
        errors.push('Please enter a valid Indonesian phone number');
    }
    
    // Validate time (business hours)
    if (data.time) {
        const [hours, minutes] = data.time.split(':').map(Number);
        const timeInMinutes = hours * 60 + minutes;
        const openTime = 7 * 60; // 07:00
        const closeTime = 22 * 60; // 22:00
        
        if (timeInMinutes < openTime || timeInMinutes > closeTime) {
            errors.push('Please select a time during business hours (07:00 - 22:00)');
        }
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('\n'), 'error');
        return false;
    }
    
    return true;
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
        white-space: pre-line;
    `;
    
    switch(type) {
        case 'success':
            notification.style.background = '#28a745';
            break;
        case 'error':
            notification.style.background = '#dc3545';
            break;
        default:
            notification.style.background = '#d4a574';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    });
}

// Animation Functions
function initAnimations() {
    // Menu item hover effects
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Testimonial rotation
    const testimonials = document.querySelectorAll('.testimonial');
    if (testimonials.length > 0) {
        let currentTestimonial = 0;
        
        setInterval(() => {
            testimonials[currentTestimonial].classList.remove('pulse');
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            testimonials[currentTestimonial].classList.add('pulse');
        }, 5000);
    }

    // Counter animation for numbers
    animateCounters();
}

function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start animation when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Floating Elements
function initFloatingElements() {
    // Add floating coffee beans animation
    function createFloatingBean() {
        const bean = document.createElement('div');
        bean.style.cssText = `
            position: fixed;
            font-size: ${Math.random() * 10 + 15}px;
            color: rgba(212, 165, 116, 0.6);
            pointer-events: none;
            z-index: 1;
            animation: float 8s linear infinite;
            left: ${Math.random() * 100}vw;
            top: 100vh;
        `;
        bean.innerHTML = '☕';
        
        document.body.appendChild(bean);
        
        setTimeout(() => {
            if (document.body.contains(bean)) {
                document.body.removeChild(bean);
            }
        }, 8000);
    }

    // Create floating beans periodically
    setInterval(createFloatingBean, 4000);

    // Cursor trail effect
    let mouseTrail = [];
    const maxTrailLength = 10;

    document.addEventListener('mousemove', function(e) {
        mouseTrail.push({
            x: e.clientX,
            y: e.clientY,
            time: Date.now()
        });

        if (mouseTrail.length > maxTrailLength) {
            mouseTrail.shift();
        }
    });

    function animateTrail() {
        const trailElements = document.querySelectorAll('.mouse-trail');
        trailElements.forEach(el => el.remove());

        mouseTrail.forEach((point, index) => {
            if (Date.now() - point.time < 500) {
                const trailDot = document.createElement('div');
                trailDot.className = 'mouse-trail';
                trailDot.style.cssText = `
                    position: fixed;
                    width: ${(index + 1) * 2}px;
                    height: ${(index + 1) * 2}px;
                    background: rgba(212, 165, 116, ${0.8 - index * 0.08});
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1;
                    left: ${point.x - (index + 1)}px;
                    top: ${point.y - (index + 1)}px;
                    transition: opacity 0.5s ease;
                `;
                
                document.body.appendChild(trailDot);
            }
        });

        requestAnimationFrame(animateTrail);
    }

    // Start trail animation only on desktop
    if (window.innerWidth > 768) {
        animateTrail();
    }
}

// Scroll to Top Button
function createScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    if (!scrollTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Utility Functions
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

// Performance optimized scroll handler
const optimizedScrollHandler = throttle(function() {
    // Scroll-based animations and effects
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Update navbar
    const navbar = document.getElementById('navbar');
    if (scrolled > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Parallax effect for hero
    const hero = document.querySelector('.hero');
    if (hero && scrolled < windowHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
    
    // Progress bar (optional)
    updateProgressBar(scrolled);
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

function updateProgressBar(scrolled) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrolled / docHeight) * 100;
    
    let progressBar = document.querySelector('.progress-bar');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(45deg, #d4a574, #b8935f);
            z-index: 10001;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
    }
    
    progressBar.style.width = `${scrollPercent}%`;
}

// Image Lazy Loading
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('loading');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.classList.add('loading');
        imageObserver.observe(img);
    });
}

// Search Functionality (if needed)
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            const itemName = item.querySelector('h3').textContent.toLowerCase();
            const itemDesc = item.querySelector('p').textContent.toLowerCase();
            
            if (itemName.includes(searchTerm) || itemDesc.includes(searchTerm)) {
                item.style.display = 'block';
                item.classList.add('search-match');
            } else {
                item.style.display = 'none';
                item.classList.remove('search-match');
            }
        });
    }, 300));
}

// Dark Mode Toggle (optional feature)
function initDarkMode() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (!darkModeToggle) return;
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', currentTheme);
    
    darkModeToggle.addEventListener('click', function() {
        const theme = document.body.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Animate the transition
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
}

// Error Handling
window.addEventListener('error', function(e) {
    console.warn('JavaScript error occurred:', e.error);
    // Could send error to analytics service
});

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Online/Offline Detection
window.addEventListener('online', function() {
    showNotification('Connection restored!', 'success');
});

window.addEventListener('offline', function() {
    showNotification('You are offline. Some features may not work.', 'error');
});

// Touch Events for Mobile
function initTouchEvents() {
    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    
    document.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        isDragging = true;
    });
    
    document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        currentY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        isDragging = false;
        
        const diffY = startY - currentY;
        
        // Pull to refresh (swipe down at top)
        if (diffY < -100 && window.scrollY === 0) {
            showNotification('Refreshing...', 'info');
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
    });
}

// Initialize touch events on mobile
if ('ontouchstart' in window) {
    initTouchEvents();
}

// Page Visibility API
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden (user switched tabs/apps)
        document.title = '☕ Come back for coffee!';
    } else {
        // Page is visible again
        document.title = 'Point Coffee - Premium Coffee Experience';
    }
});

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    // ESC key to close modals/menus
    if (e.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
    
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

// Initialize additional features after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initLazyLoading();
    initSearch();
    initDarkMode();
});

// Loading Animation
window.addEventListener('load', function() {
    // Hide loading screen if exists
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
    
    // Fade in body content
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Initialize performance monitoring
    if (window.performance) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    }
});

// Analytics Event Tracking (placeholder)
function trackEvent(category, action, label) {
    // Google Analytics or other analytics service
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
    
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
}

// Track menu interactions
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const itemName = this.getAttribute('data-item');
        trackEvent('Menu', 'Add to Cart', itemName);
    });
});

// Track form submissions
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function() {
        const formType = this.id || 'Unknown Form';
        trackEvent('Form', 'Submit', formType);
    });
});

console.log('Point Coffee website loaded successfully! ☕');