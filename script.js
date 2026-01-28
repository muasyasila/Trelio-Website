// =========================================
// COMPLETE & ORGANIZED SCRIPT.JS
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // 1. UTILITY FUNCTIONS
    // =========================================
    
    // Check if device is mobile
    const isMobile = () => window.innerWidth <= 768;
    
    // Prevent horizontal scroll on mobile
    const preventHorizontalScroll = () => {
        if (isMobile()) {
            document.body.style.overflowX = 'hidden';
            document.documentElement.style.overflowX = 'hidden';
        } else {
            document.body.style.overflowX = '';
            document.documentElement.style.overflowX = '';
        }
    };
    
    // Add/remove mobile class for CSS targeting
    const updateMobileClass = () => {
        if (isMobile()) {
            document.body.classList.add('is-mobile');
        } else {
            document.body.classList.remove('is-mobile');
        }
    };
    
    // Adjust phone UI for mobile devices
    const adjustPhoneUIForMobile = () => {
        if (!isMobile()) return;
        
        // Fix mood tracker text overflow
        const moodTracker = document.querySelector('.app-ui-mood-tracker');
        if (moodTracker) {
            const moodText = moodTracker.querySelector('div:last-child');
            if (moodText) {
                moodText.style.fontSize = '0.75rem';
                moodText.style.padding = '0 5px';
                moodText.style.textAlign = 'center';
                moodText.style.overflow = 'visible';
                moodText.style.whiteSpace = 'nowrap';
            }
        }
        
        // Scale down floating cards on mobile
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach(card => {
            card.style.transform = 'scale(0.9)';
        });
    };
    
    // =========================================
    // 2. THEME TOGGLE LOGIC
    // =========================================
    
    const themeSwitch = document.getElementById('theme-switch');
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeToggleLabel();
    };
    
    const updateThemeToggleLabel = () => {
        if (!themeSwitch) return;
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        themeSwitch.setAttribute('aria-label', `Switch to ${current === 'dark' ? 'light' : 'dark'} mode`);
    };
    
    // Initialize theme
    setTheme(savedTheme);
    updateThemeToggleLabel();
    
    // Theme switch event listener
    if (themeSwitch) {
        themeSwitch.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }
    
    // =========================================
    // 3. MODAL MANAGEMENT SYSTEM
    // =========================================
    
    // Signup Modal
    const signupModal = document.getElementById('signup-modal');
    const openSignupBtns = document.querySelectorAll('.open-modal');
    const closeSignupBtn = document.querySelector('.close-modal');
    
    const toggleSignupModal = (show) => {
        if (signupModal) {
            signupModal.classList.toggle('modal-active', show);
            document.body.style.overflow = show ? 'hidden' : 'auto';
        }
    };
    
    // Signup modal event listeners
    openSignupBtns.forEach(btn => btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleSignupModal(true);
    }));
    
    if (closeSignupBtn) {
        closeSignupBtn.addEventListener('click', () => toggleSignupModal(false));
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === signupModal) toggleSignupModal(false);
    });
    
    // Card Modal Management
    const cardModal = document.getElementById('cardModal');
    const closeCardBtn = document.querySelector('.close-btn');
    
    // Card modal open/close handlers
    function overlayHandler(e) {
        if (e.target === cardModal) closeCardModal();
    }
    
    function escHandler(e) {
        if (e.key === 'Escape') closeCardModal();
    }
    
    function openCardModal() {
        if (!cardModal) return;
        cardModal.classList.add('show');
        document.body.classList.add('modal-open');
        cardModal.setAttribute('aria-hidden', 'false');
        cardModal.addEventListener('click', overlayHandler);
        document.addEventListener('keydown', escHandler);
        stopAutoPlay();
        
        // Accessibility: focus first interactive element
        const firstFocusable = cardModal.querySelector('button, a, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) firstFocusable.focus();
    }
    
    function closeCardModal() {
        if (!cardModal) return;
        cardModal.classList.remove('show');
        document.body.classList.remove('modal-open');
        cardModal.setAttribute('aria-hidden', 'true');
        cardModal.removeEventListener('click', overlayHandler);
        document.removeEventListener('keydown', escHandler);
        startAutoPlay();
    }
    
    // Card modal close button
    if (closeCardBtn) {
        closeCardBtn.addEventListener('click', () => {
            closeCardModal();
        });
    }
    
    // =========================================
    // 4. MOBILE NAVIGATION
    // =========================================
    
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
        });
    }
    
    // Close mobile menu when clicking nav links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks) navLinks.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // =========================================
    // 5. CAROUSEL SYSTEM
    // =========================================
    
    const carouselCards = Array.from(document.querySelectorAll('.card'));
    const carouselNextBtn = document.getElementById('nextBtn');
    const carouselPrevBtn = document.getElementById('prevBtn');
    const indicatorContainer = document.getElementById('indicators');
    
    let carouselIndex = 2;
    let autoPlayInterval;
    
    // Create indicator dots
    const createIndicators = () => {
        if (!indicatorContainer) return;
        indicatorContainer.innerHTML = '';
        
        carouselCards.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = `dot ${i === carouselIndex ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                stopAutoPlay();
                carouselIndex = i;
                updateCarousel();
                startAutoPlay();
            });
            indicatorContainer.appendChild(dot);
        });
    };
    
    createIndicators();
    
    // Update active indicator
    const updateIndicators = () => {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === carouselIndex);
        });
    };
    
    // Calculate responsive carousel dimensions
    const getCarouselDimensions = () => {
        const isMobile = window.innerWidth < 768;
        const isSmallMobile = window.innerWidth < 480;
        
        return {
            radiusX: isSmallMobile ? window.innerWidth * 0.35 : (isMobile ? window.innerWidth * 0.42 : 550),
            radiusY: isSmallMobile ? 30 : (isMobile ? 50 : 100)
        };
    };
    
    // Update carousel positions and styling
    const updateCarousel = () => {
        if (carouselCards.length === 0) return;
        
        const { radiusX, radiusY } = getCarouselDimensions();
        
        carouselCards.forEach((card, i) => {
            let offset = i - carouselIndex;
            
            // Handle circular wrapping
            if (offset > carouselCards.length / 2) offset -= carouselCards.length;
            if (offset < -carouselCards.length / 2) offset += carouselCards.length;
            
            const angle = (offset * 0.4) + 4.712;
            const x = Math.cos(angle) * radiusX;
            const y = Math.sin(angle) * radiusY;
            const isCenter = i === carouselIndex;
            const tilt = offset * -12;
            
            // Apply styles
            card.style.position = 'absolute';
            card.style.left = '50%';
            card.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
            
            const baseScale = window.innerWidth < 768 ? 0.65 : 0.75;
            const centerScale = window.innerWidth < 768 ? 1.0 : 1.15;
            
            card.style.transform = `translate(calc(-50% + ${x}px), ${y + 50}px) scale(${isCenter ? centerScale : baseScale}) rotate(${tilt}deg)`;
            card.style.zIndex = isCenter ? 100 : String(50 - Math.abs(offset));
            
            // Handle visibility on small screens
            if (window.innerWidth < 480 && Math.abs(offset) > 1) {
                card.style.opacity = '0';
                card.style.pointerEvents = 'none';
            } else {
                card.style.opacity = window.innerWidth < 768 && Math.abs(offset) > 1 ? '0.4' : '1';
                card.style.pointerEvents = 'auto';
            }
            
            card.classList.toggle('active', isCenter);
        });
        
        updateIndicators();
    };
    
    // Auto-play functionality
    const startAutoPlay = () => {
        stopAutoPlay();
        if (carouselCards.length === 0) return;
        
        autoPlayInterval = setInterval(() => {
            carouselIndex = (carouselIndex + 1) % carouselCards.length;
            updateCarousel();
        }, 3500);
    };
    
    const stopAutoPlay = () => {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
    };
    
    // Carousel navigation
    if (carouselNextBtn) {
        carouselNextBtn.addEventListener('click', () => {
            if (carouselCards.length === 0) return;
            stopAutoPlay();
            carouselIndex = (carouselIndex + 1) % carouselCards.length;
            updateCarousel();
            startAutoPlay();
        });
    }
    
    if (carouselPrevBtn) {
        carouselPrevBtn.addEventListener('click', () => {
            if (carouselCards.length === 0) return;
            stopAutoPlay();
            carouselIndex = (carouselIndex - 1 + carouselCards.length) % carouselCards.length;
            updateCarousel();
            startAutoPlay();
        });
    }
    
    // Card click behavior
    carouselCards.forEach(card => {
        card.addEventListener('click', () => {
            if (card.classList.contains('active')) {
                stopAutoPlay();
                
                // Extract card data
                const titleEl = card.querySelector('.title');
                const imgEl = card.querySelector('img');
                const title = titleEl ? titleEl.innerText : (card.querySelector('h3')?.innerText || '');
                const imgSrc = imgEl ? imgEl.src : '';
                const category = card.querySelector('.category-tag')?.innerText || "CONTENT";
                const longDesc = card.querySelector('.hidden-data')?.getAttribute('data-full');
                const downloadLink = card.getAttribute('data-download-url') || "#";
                const featuresStr = card.getAttribute('data-features') || "Cloud Sync, AI-Driven, Multi-Channel Support";
                const featuresArray = featuresStr.split(',');
                
                // Populate modal with card data
                const modalTitle = document.getElementById('modalTitle');
                const modalImg = document.getElementById('modalImg');
                const modalCategory = document.getElementById('modalCategory');
                const modalDesc = document.getElementById('modalDesc');
                const featureList = document.getElementById('modalFeatures');
                const dBtn = document.getElementById('downloadBtn');
                
                if (modalTitle) modalTitle.innerText = title;
                if (modalImg) modalImg.src = imgSrc;
                if (modalCategory) modalCategory.innerText = category;
                if (modalDesc) modalDesc.innerText = longDesc || "Unlock full potential with our advanced tools.";
                
                if (featureList) {
                    featureList.innerHTML = '';
                    featuresArray.forEach(f => {
                        const li = document.createElement('li');
                        li.innerText = f.trim();
                        featureList.appendChild(li);
                    });
                }
                
                if (dBtn) dBtn.href = downloadLink;
                
                // Open card modal
                openCardModal();
            } else {
                // Navigate to clicked card
                carouselIndex = Array.from(carouselCards).indexOf(card);
                updateCarousel();
            }
        });
    });
    
    // =========================================
    // 6. SHARE BUTTON FUNCTIONALITY
    // =========================================
    
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            if (!navigator.clipboard) return;
            
            navigator.clipboard.writeText(window.location.href).then(() => {
                const shareText = shareBtn.querySelector('span');
                if (shareText) {
                    const original = shareText.innerText;
                    shareText.innerText = "Link Copied!";
                    setTimeout(() => {
                        shareText.innerText = original;
                    }, 2000);
                }
            });
        });
    }
    
    // =========================================
    // 7. SCROLL ANIMATIONS
    // =========================================
    
    const revealOnScroll = () => {
        const elements = document.querySelectorAll('.card, .step-item');
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.85) {
                el.style.opacity = '1';
                el.style.transformOrigin = 'center';
            }
        });
    };
    
    // =========================================
    // 8. MOBILE OPTIMIZATION INITIALIZATION
    // =========================================
    
    // Run mobile adjustments
    adjustPhoneUIForMobile();
    preventHorizontalScroll();
    updateMobileClass();
    
    // Initialize carousel
    updateCarousel();
    startAutoPlay();
    revealOnScroll();
    
    // =========================================
    // 9. EVENT LISTENERS FOR RESIZE/SCROLL
    // =========================================
    
    window.addEventListener('scroll', revealOnScroll);
    
    window.addEventListener('resize', () => {
        // Update mobile adjustments
        adjustPhoneUIForMobile();
        preventHorizontalScroll();
        updateMobileClass();
        
        // Update carousel
        updateCarousel();
        createIndicators();
        
        // Re-run scroll animations
        revealOnScroll();
    });
});

// =========================================
// 10. MOOD GALLERY LOGIC (Outside DOMContentLoaded)
// =========================================

const moodData = {
    Happy: [
        { title: "Keep the Momentum", type: "Article", icon: "✍️" },
        { title: "High Energy Beats", type: "Playlist", icon: "🎵" },
        { title: "Gratitude Journaling", type: "Exercise", icon: "📓" }
    ],
    Anxious: [
        { title: "4-7-8 Breathing", type: "Exercise", icon: "🌬️" },
        { title: "Grounding Techniques", type: "Guide", icon: "🧘" },
        { title: "Lo-fi for Calm", type: "Audio", icon: "🎧" }
    ],
    Tired: [
        { title: "Power Nap Guide", type: "Tips", icon: "💤" },
        { title: "Digital Detox", type: "Article", icon: "📱" },
        { title: "Soft Instrumental", type: "Audio", icon: "🎹" }
    ],
    Angry: [
        { title: "Box Breathing", type: "Exercise", icon: "📦" },
        { title: "Physical Release", type: "Tips", icon: "🏃" },
        { title: "Calm the Storm", type: "Playlist", icon: "⛈️" }
    ],
    Sad: [
        { title: "Self-Compassion", type: "Guide", icon: "❤️" },
        { title: "Comfort Audio", type: "Audio", icon: "📻" },
        { title: "Small Wins List", type: "Exercise", icon: "✅" }
    ],
    Peaceful: [
        { title: "Mindfulness Walk", type: "Guide", icon: "🍃" },
        { title: "Deep Zen", type: "Audio", icon: "🏮" },
        { title: "Maintain Peace", type: "Article", icon: "🌊" }
    ]
};

// Mood gallery functionality
document.querySelectorAll('.orbiting-mood').forEach(item => {
    item.addEventListener('click', () => {
        const gallery = document.getElementById('mood-gallery');
        const galleryContent = document.getElementById('gallery-content');
        const galleryTitle = document.getElementById('gallery-title');
        
        if (!gallery) return;
        
        const mood = item.getAttribute('data-mood');
        const resources = moodData[mood] || moodData['Anxious'];
        
        if (galleryTitle) galleryTitle.innerText = `Focus: ${mood}`;
        
        if (!galleryContent) return;
        
        // Clear and populate gallery
        galleryContent.innerHTML = '';
        resources.forEach(res => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.opacity = '1';
            card.style.transform = 'none';
            
            card.innerHTML = `
                <div style="font-size: 2rem;">${res.icon}</div>
                <h4 style="margin: 10px 0;">${res.title}</h4>
                <span class="badge" style="font-size: 0.6rem;">${res.type}</span>
            `;
            
            galleryContent.appendChild(card);
        });
        
        // Show gallery
        gallery.classList.add('modal-active');
    });
});

// Close mood gallery
const closeGalleryBtn = document.querySelector('.close-gallery');
if (closeGalleryBtn) {
    closeGalleryBtn.addEventListener('click', () => {
        const gallery = document.getElementById('mood-gallery');
        if (gallery) gallery.classList.remove('modal-active');
    });
}
// =========================================
// 11. VIDEO AUTO-MUTE/UNMUTE ON SCROLL
// =========================================

// Function to check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Function to handle video visibility
function handleVideoVisibility() {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        // Check if video is in viewport
        if (isElementInViewport(video)) {
            // If video is muted and user previously unmuted it, unmute it
            if (video.hasAttribute('data-user-unmuted') && video.muted) {
                video.muted = false;
            }
        } else {
            // If video is out of viewport, mute it
            if (!video.muted) {
                video.muted = true;
            }
        }
    });
}

// Function to initialize video mute tracking
function initializeVideoMuteTracking() {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        // Add user interaction listener
        video.addEventListener('volumechange', function() {
            if (!this.muted) {
                // User manually unmuted the video
                this.setAttribute('data-user-unmuted', 'true');
            }
        });
        
        // Add click listener for mute/unmute buttons if they exist
        const muteButton = video.parentElement.querySelector('.mute-button, [data-mute-video]');
        if (muteButton) {
            muteButton.addEventListener('click', function() {
                video.muted = !video.muted;
                if (!video.muted) {
                    video.setAttribute('data-user-unmuted', 'true');
                } else {
                    video.removeAttribute('data-user-unmuted');
                }
            });
        }
    });
    
    // Initial check
    handleVideoVisibility();
    
    // Listen for scroll events
    window.addEventListener('scroll', handleVideoVisibility);
    
    // Also check when resizing
    window.addEventListener('resize', handleVideoVisibility);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure videos are loaded
    setTimeout(initializeVideoMuteTracking, 1000);
});