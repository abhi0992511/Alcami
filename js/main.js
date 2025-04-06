// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navbar element
    const navbar = document.querySelector('.navbar');

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add scroll event listener for navbar
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
            // Scroll Down
            navbar.classList.remove('scroll-up');
            navbar.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
            // Scroll Up
            navbar.classList.remove('scroll-down');
            navbar.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Add animation to stats when they come into view
    const stats = document.querySelectorAll('.stat');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => {
        observer.observe(stat);
    });

    // Mobile menu toggle (if needed in responsive design)
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Search functionality
    const searchButton = document.getElementById('searchButton');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = searchOverlay.querySelector('.search-input');

    searchButton.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        navbar.classList.add('search-active');
        searchInput.focus();
    });

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
        if (searchOverlay.classList.contains('active') && 
            !searchOverlay.contains(e.target) && 
            !searchButton.contains(e.target)) {
            closeSearch();
        }
    });

    // Close search on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            closeSearch();
        }
    });

    // Function to close search
    function closeSearch() {
        searchOverlay.classList.remove('active');
        navbar.classList.remove('search-active');
    }

    // Mobile menu functionality
    const hamburger = document.getElementById('hamburgerMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-nav a');

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeMenu.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close mobile menu when clicking a link
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Product Gallery Functionality
    const mainImage = document.querySelector('.main-product-image img');
    const thumbnails = document.querySelectorAll('.thumbnail-container img');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentImageIndex = 0;

    // Update main image
    function updateMainImage(index) {
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnails[index].classList.add('active');
        mainImage.src = thumbnails[index].src;
        currentImageIndex = index;
    }

    // Thumbnail click handlers
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => updateMainImage(index));
    });

    // Navigation buttons
    prevBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + thumbnails.length) % thumbnails.length;
        updateMainImage(currentImageIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % thumbnails.length;
        updateMainImage(currentImageIndex);
    });

    // Product Options and Add to Cart Link
    const flavorOptions = document.querySelectorAll('input[name="flavor"]');
    const purchaseOptions = document.querySelectorAll('input[name="purchase-type"]');
    const addToCartBtn = document.querySelector('.add-to-cart');

    function updateAddToCartLink() {
        const selectedFlavor = document.querySelector('input[name="flavor"]:checked').value;
        const selectedPurchase = document.querySelector('input[name="purchase-type"]:checked').value;
        const baseUrl = 'https://alcami.com/cart/add';
        addToCartBtn.href = `${baseUrl}?flavor=${selectedFlavor}&type=${selectedPurchase}`;
    }

    flavorOptions.forEach(option => {
        option.addEventListener('change', updateAddToCartLink);
    });

    purchaseOptions.forEach(option => {
        option.addEventListener('change', updateAddToCartLink);
    });

    // Percentage Counter Animation
    const statsSection = document.querySelector('.results-stats');
    const statNumbers = document.querySelectorAll('.stat-item h3');
    let hasAnimated = false;

    function animateNumbers() {
        statNumbers.forEach(number => {
            const target = parseInt(number.textContent);
            let current = 0;
            const increment = target / 50; // Will take 50 steps to reach target
            const interval = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(interval);
                }
                number.textContent = Math.round(current) + '%';
            }, 20); // 20ms interval = 1 second total duration
        });
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                animateNumbers();
                hasAnimated = true;
            }
        });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);

    // Testimonial Slider
    const testimonialWrapper = document.querySelector('.testimonials-wrapper');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevTestimonial = document.querySelector('.nav-button.prev');
    const nextTestimonial = document.querySelector('.nav-button.next');
    const sliderDots = document.querySelector('.slider-dots');
    let currentSlide = 0;
    const cardsPerView = 3;
    const totalSlides = Math.ceil(testimonialCards.length / cardsPerView);

    // Create dots based on total number of slides
    sliderDots.innerHTML = ''; // Clear existing dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        sliderDots.appendChild(dot);
    }
    const dots = document.querySelectorAll('.dot');

    // Create a track div to wrap all testimonial cards
    const track = document.createElement('div');
    track.className = 'testimonials-track';
    while (testimonialWrapper.firstChild) {
        track.appendChild(testimonialWrapper.firstChild);
    }
    testimonialWrapper.appendChild(track);

    function updateTestimonialSlider(index) {
        const cardWidth = testimonialWrapper.offsetWidth;
        const maxTranslate = (testimonialCards.length - cardsPerView) * (cardWidth / cardsPerView);
        const slidePosition = Math.min(
            (cardWidth / cardsPerView) * index * cardsPerView,
            maxTranslate
        );
        track.style.transform = `translateX(-${slidePosition}px)`;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }

    // Auto-slide functionality
    let autoSlideInterval;

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            const nextSlide = (currentSlide + 1) % totalSlides;
            updateTestimonialSlider(nextSlide);
        }, 5000); // 5 seconds interval
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Navigation buttons
    prevTestimonial.addEventListener('click', () => {
        stopAutoSlide();
        const prevSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateTestimonialSlider(prevSlide);
        startAutoSlide();
    });

    nextTestimonial.addEventListener('click', () => {
        stopAutoSlide();
        const nextSlide = (currentSlide + 1) % totalSlides;
        updateTestimonialSlider(nextSlide);
        startAutoSlide();
    });

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            updateTestimonialSlider(index);
            startAutoSlide();
        });
    });

    // Start auto-sliding
    startAutoSlide();

    // Pause auto-slide when hovering over testimonials
    testimonialWrapper.addEventListener('mouseenter', stopAutoSlide);
    testimonialWrapper.addEventListener('mouseleave', startAutoSlide);
}); 