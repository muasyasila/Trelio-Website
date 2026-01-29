// =========================================
// UTILITY FUNCTIONS
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

// Check if element is in viewport
const isElementInViewport = (el) => {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};
// =========================================
// THEME MANAGEMENT
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

// Initialize theme on page load
const initializeTheme = () => {
    setTheme(savedTheme);
    updateThemeToggleLabel();
    
    if (themeSwitch) {
        themeSwitch.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }
};
// =========================================
// MODAL MANAGEMENT
// =========================================

// Signup Modal Functions
const signupModal = document.getElementById('signup-modal');
const openSignupBtns = document.querySelectorAll('.open-modal');
const closeSignupBtn = document.querySelector('.close-modal');

const toggleSignupModal = (show) => {
    if (signupModal) {
        signupModal.classList.toggle('modal-active', show);
        document.body.style.overflow = show ? 'hidden' : 'auto';
    }
};

const initializeSignupModal = () => {
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
};

// Card Modal Functions
const cardModal = document.getElementById('cardModal');
const closeCardBtn = document.querySelector('.close-btn');

const overlayHandler = (e) => {
    if (e.target === cardModal) closeCardModal();
};

const escHandler = (e) => {
    if (e.key === 'Escape') closeCardModal();
};

const openCardModal = () => {
    if (!cardModal) return;
    cardModal.classList.add('show');
    document.body.classList.add('modal-open');
    cardModal.setAttribute('aria-hidden', 'false');
    cardModal.addEventListener('click', overlayHandler);
    document.addEventListener('keydown', escHandler);
    
    // Accessibility: focus first interactive element
    const firstFocusable = cardModal.querySelector('button, a, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) firstFocusable.focus();
};

const closeCardModal = () => {
    if (!cardModal) return;
    cardModal.classList.remove('show');
    document.body.classList.remove('modal-open');
    cardModal.setAttribute('aria-hidden', 'true');
    cardModal.removeEventListener('click', overlayHandler);
    document.removeEventListener('keydown', escHandler);
};

const initializeCardModal = () => {
    if (closeCardBtn) {
        closeCardBtn.addEventListener('click', closeCardModal);
    }
};

// Mood Gallery Functions
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

const initializeMoodGallery = () => {
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
};
// =========================================
// NAVIGATION
// =========================================

const initializeMobileNavigation = () => {
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
};
// =========================================
// CAROUSEL SYSTEM (Fixed Laptop View)
// =========================================

let carouselIndex = 2;
let autoPlayInterval;

const carouselCards = Array.from(document.querySelectorAll('.carousel-card, .card'));
const carouselNextBtn = document.getElementById('nextBtn');
const carouselPrevBtn = document.getElementById('prevBtn');
const indicatorContainer = document.getElementById('indicators');

// Create indicator dots
const createIndicators = () => {
    if (!indicatorContainer || carouselCards.length === 0) return;
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

// Update active indicator
const updateIndicators = () => {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === carouselIndex);
    });
};

// Fixed Laptop/Mobile Dimensions
const getCarouselDimensions = () => {
    const width = window.innerWidth;
    const isMobileDevice = width < 768; // Changed variable name to avoid conflict with utility function
    
    return {
        radiusX: isMobileDevice ? width * 0.45 : 420, // Tightened spread for laptop
        radiusY: 10                             // FIXED: Set to 10 for both to stop the dip
    };
};

// Update carousel positions and styling
const updateCarousel = () => {
    if (carouselCards.length === 0) return;
    
    const { radiusX, radiusY } = getCarouselDimensions();
    const width = window.innerWidth;
    const isMobileDevice = width < 768; // Changed variable name
    const isSmallMobile = width < 480;
    
    carouselCards.forEach((card, i) => {
        let offset = i - carouselIndex;
        
        if (offset > carouselCards.length / 2) offset -= carouselCards.length;
        if (offset < -carouselCards.length / 2) offset += carouselCards.length;
        
        const angle = (offset * 0.4) + 4.712;
        const x = Math.cos(angle) * radiusX;
        
// ... inside the carouselCards.forEach loop ...

const isCenter = i === carouselIndex;

// Change this to 20 or 30 to physically push the cards down 
// if they are still touching the title.
const verticalLift = 30; 

const tilt = isMobileDevice ? offset * -5 : offset * -10; // Slightly reduced tilt for laptop
const baseScale = isMobileDevice ? 0.7 : 0.85; 
const centerScale = isMobileDevice ? 1.0 : 1.05;
card.style.position = 'absolute';
card.style.left = '50%';
// Add this line to ensure it starts from the middle vertically
card.style.top = '50%'; 

card.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';

// Apply the transform - notice the use of verticalLift to move cards down
card.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${verticalLift}px)) scale(${isCenter ? centerScale : baseScale}) rotate(${tilt}deg)`;
        
        card.style.zIndex = isCenter ? 100 : String(50 - Math.abs(offset));
        
        if (isSmallMobile && Math.abs(offset) > 1) {
            card.style.opacity = '0';
            card.style.pointerEvents = 'none';
        } else {
            card.style.opacity = !isCenter && isMobileDevice ? '0.5' : '1';
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
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
};

// Carousel navigation
const initializeCarouselNavigation = () => {
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
};

// Card click behavior
const initializeCardClickHandlers = () => {
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
};

const initializeCarousel = () => {
    createIndicators();
    updateCarousel();
    startAutoPlay();
    initializeCarouselNavigation();
    initializeCardClickHandlers();
};
// =========================================
// SHARE FUNCTIONALITY
// =========================================

const initializeShareButton = () => {
    const shareBtn = document.querySelector('.share-btn');
    if (!shareBtn || !navigator.clipboard) return;
    
    shareBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            const shareText = shareBtn.querySelector('span');
            if (shareText) {
                const original = shareText.innerText;
                shareText.innerText = "Link Copied!";
                setTimeout(() => {
                    shareText.innerText = original;
                }, 2000);
            }
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    });
};
// =========================================
// SCROLL ANIMATIONS
// =========================================

const initializeScrollAnimations = () => {
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
    
    // Initial reveal
    revealOnScroll();
    
    // Add scroll listener
    window.addEventListener('scroll', revealOnScroll);
    
    return revealOnScroll;
};
// =========================================
// VIDEO CONTROLS
// =========================================

const initializeVideoControls = () => {
    const videos = document.querySelectorAll('video');
    
    // Function to handle video playback based on visibility
    const handleVideoPlayback = () => {
        videos.forEach(video => {
            const isInViewport = isElementInViewport(video);
            const shouldPlay = video.hasAttribute('data-user-unmuted') || isInViewport;
            
            if (isInViewport && shouldPlay) {
                // Video is in viewport and should play
                if (video.paused) {
                    video.play().catch(e => console.log("Video play failed:", e));
                }
            } else {
                // Video is out of viewport - pause it
                if (!video.paused) {
                    video.pause();
                }
            }
        });
    };
    
    // Initialize each video
    videos.forEach(video => {
        // Start videos muted (browser requirement for autoplay)
        video.muted = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('autoplay', '');
        video.setAttribute('loop', '');
        
        // Store original mute state for reference
        video.setAttribute('data-originally-muted', 'true');
        
        // Try to autoplay muted video
        video.play().catch(e => {
            console.log("Autoplay muted failed, will play on interaction:", e);
            // Mark that we need user interaction
            video.setAttribute('data-needs-interaction', 'true');
        });
        
        // Add click listener for sound toggle buttons
        const soundButton = video.parentElement.querySelector('.sound-toggle, [data-sound-video]');
        if (soundButton) {
            soundButton.addEventListener('click', function() {
                if (video.muted) {
                    // Unmute video
                    video.muted = false;
                    video.removeAttribute('data-originally-muted');
                    video.setAttribute('data-user-unmuted', 'true');
                    
                    // Try to play if paused
                    if (video.paused) {
                        video.play().catch(e => console.log("Video play failed after unmute:", e));
                    }
                    
                    // Update button icon
                    this.innerHTML = '🔊';
                    this.setAttribute('aria-label', 'Mute video');
                } else {
                    // Mute video
                    video.muted = true;
                    video.setAttribute('data-originally-muted', 'true');
                    video.removeAttribute('data-user-unmuted');
                    
                    // Update button icon
                    this.innerHTML = '🔇';
                    this.setAttribute('aria-label', 'Unmute video');
                }
            });
            
            // Set initial button icon
            soundButton.innerHTML = video.muted ? '🔇' : '🔊';
            soundButton.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
        }
        
        // Also allow unmuting by clicking the video itself
        video.addEventListener('click', () => {
            if (video.hasAttribute('data-needs-interaction')) {
                video.removeAttribute('data-needs-interaction');
                video.play().catch(e => console.log("Video play failed on click:", e));
            }
            
            // If still muted, toggle mute
            if (video.muted && soundButton) {
                soundButton.click();
            }
        });
        
        // Handle video errors
        video.addEventListener('error', () => {
            console.error('Video error:', video.error);
        });
        
        // Track time update to save position (optional)
        video.addEventListener('timeupdate', () => {
            // Store current time in case we need to restore
            localStorage.setItem(`video-${video.src}-time`, video.currentTime);
        });
    });
    
    // Initial check
    handleVideoPlayback();
    
    // Listen for scroll events
    window.addEventListener('scroll', handleVideoPlayback);
    
    // Also check when resizing
    window.addEventListener('resize', handleVideoPlayback);
    
    // Handle page visibility (when user switches tabs)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Page is hidden - pause all videos
            document.querySelectorAll('video').forEach(v => {
                if (!v.paused) v.pause();
            });
        } else {
            // Page is visible again - check which videos should play
            handleVideoPlayback();
        }
    });
    
    // Also handle when user interacts with page (for autoplay policies)
    document.addEventListener('click', () => {
        document.querySelectorAll('video[data-needs-interaction]').forEach(v => {
            if (isElementInViewport(v)) {
                v.removeAttribute('data-needs-interaction');
                v.play().catch(e => console.log("Video play failed on page interaction:", e));
            }
        });
    });
};
// =========================================
// MAIN INITIALIZATION
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize utility functions
    adjustPhoneUIForMobile();
    preventHorizontalScroll();
    updateMobileClass();
    
    // Initialize theme
    initializeTheme();
    
    // Initialize modals
    initializeSignupModal();
    initializeCardModal();
    initializeMoodGallery();
    
    // Initialize navigation
    initializeMobileNavigation();
    
    // Initialize carousel (with delay for DOM readiness)
    setTimeout(initializeCarousel, 100);
    
    // Initialize share button
    initializeShareButton();
    
    // Initialize scroll animations
    const revealOnScroll = initializeScrollAnimations();
    
    // Initialize video controls (with slight delay)
    setTimeout(initializeVideoControls, 500);
    
    // =========================================
    // EVENT LISTENERS FOR RESIZE/SCROLL
    // =========================================
    
    // Store resize handler to avoid duplicate listeners
    const handleResize = () => {
        // Update mobile adjustments
        adjustPhoneUIForMobile();
        preventHorizontalScroll();
        updateMobileClass();
        
        // Update carousel
        updateCarousel();
        createIndicators();
        
        // Re-run scroll animations
        if (typeof revealOnScroll === 'function') {
            revealOnScroll();
        }
    };
    
    // Add resize event listener (only once)
    window.addEventListener('resize', handleResize);
});




// =========================================
// TRELIO MOOD FLOW - FINAL PERFECTED VERSION
// =========================================

class TrelioMoodFlow {
    constructor() {
        this.cloud = document.getElementById('moodCloud');
        this.combinedLabel = document.getElementById('combinedLabel');
        this.moodStatus = document.getElementById('moodStatus');
        this.nodes = document.querySelectorAll('.flow-node');
        this.titleEl = document.getElementById('explanationTitle');
        this.textEl = document.getElementById('explanationText');
        this.tryBtn = document.getElementById('tryAppBtn');
        this.demoBtn = document.getElementById('watchDemoBtn');
        
        this.moodData = {
            'happy': {
                color: '#38bdf8',
                emoji: '😊',
                name: 'Happy',
                status: 'Ready to connect',
                title: 'Ready to Connect',
                text: 'When you feel happy, Trelio helps you build positive habits and connect with uplifting communities.',
                action: 'Explore Happy Features'
            },
            'calm': {
                color: '#0ea5e9',
                emoji: '😌',
                name: 'Calm',
                status: 'Feeling peaceful',
                title: 'Maintain Your Peace',
                text: 'Feeling calm? Trelio helps you preserve this state with mindfulness exercises and peaceful communities.',
                action: 'Try Calm Features'
            },
            'stressed': {
                color: '#f59e0b',
                emoji: '😰',
                name: 'Stressed',
                status: 'Need relief',
                title: 'Immediate Relief',
                text: 'When stress hits, Trelio activates breathing exercises, stress journals, and calming music.',
                action: 'Get Stress Relief'
            },
            'anxious': {
                color: '#ef4444',
                emoji: '😥',
                name: 'Anxious',
                status: 'Seeking support',
                title: 'Anxiety Support',
                text: 'Feeling anxious? Access immediate grounding techniques and connect with supportive peers.',
                action: 'Find Anxiety Help'
            },
            'peaceful': {
                color: '#10b981',
                emoji: '☮️',
                name: 'Peaceful',
                status: 'Feeling balanced',
                title: 'Deep Relaxation',
                text: 'In peaceful moments, Trelio offers meditation guides and gratitude journaling.',
                action: 'Explore Peace Tools'
            },
            'supported': {
                color: '#8b5cf6',
                emoji: '🤗',
                name: 'Supported',
                status: 'Getting help',
                title: 'Professional Care',
                text: 'When you need extra support, Trelio connects you with licensed therapists.',
                action: 'Get Professional Help'
            },
            'connected': {
                color: '#ec4899',
                emoji: '💞',
                name: 'Connected',
                status: 'With community',
                title: 'Community Support',
                text: 'Feeling connected? Join peer support circles and share experiences safely.',
                action: 'Join Community'
            }
        };
        
        this.currentMood = 'happy';
        this.isDemoRunning = false;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.animateCloud();
        this.setDefaultMood();
        this.autoRotateMoods();
    }
    
    setupEventListeners() {
        // Node hover interactions
        this.nodes.forEach(node => {
            node.addEventListener('mouseenter', () => {
                const mood = node.dataset.mood;
                this.changeMood(mood);
                this.highlightNode(node);
            });
            
            node.addEventListener('mouseleave', () => {
                this.resetHighlights();
            });
            
            node.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showFeaturePopup(node.dataset.node);
            });
            
            // Touch support
            node.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const mood = node.dataset.mood;
                this.changeMood(mood);
                this.highlightNode(node);
            });
        });
        
        // Cloud interactions
        this.cloud.addEventListener('click', () => {
            this.randomMood();
        });
        
        this.cloud.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.randomMood();
        });
        
        // Button interactions
        this.tryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.triggerTryApp();
        });
        
        this.demoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.triggerMoodDemo();
        });
        
        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'm' || e.key === 'M') {
                this.randomMood();
            }
            if (e.key === 'Escape') {
                this.resetToDefault();
            }
        });
    }
    
    setDefaultMood() {
        this.changeMood('happy');
    }
    
    changeMood(moodType) {
        if (!this.moodData[moodType] || this.isDemoRunning) return;
        
        this.currentMood = moodType;
        const moodInfo = this.moodData[moodType];
        
        // Remove all mood classes
        Object.keys(this.moodData).forEach(mood => {
            this.cloud.classList.remove(mood);
        });
        
        // Add new mood class
        this.cloud.classList.add(moodType);
        
        // Update combined label (EMOJI + MOOD TOGETHER)
        const emojiSpan = this.combinedLabel.querySelector('.label-emoji');
        const textSpan = this.combinedLabel.querySelector('.label-text');
        
        if (emojiSpan) emojiSpan.textContent = moodInfo.emoji;
        if (textSpan) textSpan.textContent = moodInfo.name;
        
        // Update status
        this.moodStatus.textContent = moodInfo.status;
        this.moodStatus.style.color = moodInfo.color;
        this.moodStatus.style.borderColor = moodInfo.color + '40';
        this.moodStatus.style.background = moodInfo.color + '15';
        
        // Update explanation
        this.updateExplanation(moodInfo);
        
        // Animations
        this.animateCloudChange();
        this.animateLabel();
    }
    
    updateExplanation(moodInfo) {
        if (this.titleEl && this.textEl) {
            this.titleEl.textContent = moodInfo.title;
            this.textEl.textContent = moodInfo.text;
            
            // Update buttons
            this.tryBtn.innerHTML = `<span>${moodInfo.action}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>`;
            
            this.demoBtn.innerHTML = `<span>See ${moodInfo.name} Demo</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>`;
        }
    }
    
    animateCloudChange() {
        this.cloud.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.cloud.style.transform = 'scale(1)';
        }, 300);
    }
    
    animateLabel() {
        this.combinedLabel.style.animation = 'none';
        setTimeout(() => {
            this.combinedLabel.style.animation = 'labelBounce 0.6s ease';
        }, 10);
    }
    
    highlightNode(node) {
        this.nodes.forEach(n => {
            n.style.zIndex = '10';
            n.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.05)';
        });
        
        node.style.zIndex = '100';
        node.style.boxShadow = '0 16px 40px rgba(56, 189, 248, 0.25)';
    }
    
    resetHighlights() {
        this.nodes.forEach(node => {
            node.style.zIndex = '10';
            node.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.05)';
        });
    }
    
    resetToDefault() {
        this.changeMood('happy');
        this.resetHighlights();
    }
    
    randomMood() {
        const moods = Object.keys(this.moodData);
        let randomMood;
        do {
            randomMood = moods[Math.floor(Math.random() * moods.length)];
        } while (randomMood === this.currentMood && moods.length > 1);
        
        this.changeMood(randomMood);
    }
    
    animateCloud() {
        setInterval(() => {
            if (!this.isDemoRunning && 
                (this.cloud.classList.contains('happy') || 
                 this.cloud.classList.contains('calm') ||
                 this.cloud.classList.contains('peaceful'))) {
                this.cloud.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    this.cloud.style.transform = 'scale(1)';
                }, 500);
            }
        }, 4000);
    }
    
    autoRotateMoods() {
        let currentIndex = Object.keys(this.moodData).indexOf(this.currentMood);
        const moods = Object.keys(this.moodData);
        
        setInterval(() => {
            if (!this.isDemoRunning && 
                !document.querySelector('.flow-node:hover') && 
                !this.cloud.matches(':hover')) {
                currentIndex = (currentIndex + 1) % moods.length;
                this.changeMood(moods[currentIndex]);
            }
        }, 10000);
    }
    
    showFeaturePopup(nodeId) {
        const features = {
            1: {
                title: "📱 Download & Setup",
                description: "Get started in minutes with a secure, personalized profile. Set your preferences and goals from day one.",
                action: "Download Now",
                color: "#38bdf8"
            },
            2: {
                title: "😌 Mood Tracking",
                description: "Daily emotional check-ins that adapt to your patterns. Your cloud changes color based on how you feel.",
                action: "Track Your Mood",
                color: "#0ea5e9"
            },
            3: {
                title: "📊 Smart Dashboard",
                description: "Monitor progress and access immediate relief tools. Breathing exercises are just one tap away.",
                action: "Explore Dashboard",
                color: "#f59e0b"
            },
            4: {
                title: "👥 Peer Community",
                description: "Connect with students who understand your journey. Join safe, moderated spaces for genuine connection.",
                action: "Join Community",
                color: "#ec4899"
            },
            5: {
                title: "🩺 Professional Support",
                description: "Get matched with licensed therapists specializing in student mental health. Schedule sessions easily.",
                action: "Find Therapist",
                color: "#8b5cf6"
            },
            6: {
                title: "🤖 Trelio AI Companion",
                description: "Available 24/7 to listen, ask thoughtful questions, and provide immediate empathetic support.",
                action: "Chat with AI",
                color: "#10b981"
            }
        };
        
        const feature = features[nodeId];
        if (!feature) return;
        
        this.createFeaturePopup(feature);
    }
    
    createFeaturePopup(feature) {
        // Remove existing popup
        const existingPopup = document.querySelector('.feature-popup');
        if (existingPopup) existingPopup.remove();
        
        // Create popup
        const popup = document.createElement('div');
        popup.className = 'feature-popup';
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 30px;
            z-index: 1000;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: popupFadeIn 0.3s ease;
        `;
        
        popup.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 15px;">${feature.title.split(' ')[0]}</div>
                <h3 style="color: var(--text-main); margin-bottom: 15px; font-size: 1.4rem;">${feature.title}</h3>
                <p style="color: var(--text-muted); line-height: 1.6; margin-bottom: 25px; font-size: 1rem;">${feature.description}</p>
                <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                    <button class="popup-close-btn" style="
                        background: transparent;
                        border: 1px solid var(--border);
                        color: var(--text-muted);
                        padding: 12px 24px;
                        border-radius: 50px;
                        cursor: pointer;
                        font-weight: 600;
                        transition: all 0.3s ease;
                        min-width: 100px;
                    ">Close</button>
                    <button class="popup-action-btn" style="
                        background: ${feature.color};
                        border: none;
                        color: white;
                        padding: 12px 28px;
                        border-radius: 50px;
                        cursor: pointer;
                        font-weight: 600;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px ${feature.color}40;
                        min-width: 140px;
                    ">${feature.action}</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Overlay
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(4px);
            z-index: 999;
            animation: overlayFadeIn 0.3s ease;
        `;
        
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        
        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes popupFadeIn {
                from { opacity: 0; transform: translate(-50%, -60%); }
                to { opacity: 1; transform: translate(-50%, -50%); }
            }
            @keyframes overlayFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // Event listeners
        const closeBtn = popup.querySelector('.popup-close-btn');
        const actionBtn = popup.querySelector('.popup-action-btn');
        
        const closePopup = () => {
            popup.remove();
            overlay.remove();
            style.remove();
            document.body.style.overflow = '';
        };
        
        closeBtn.addEventListener('click', closePopup);
        actionBtn.addEventListener('click', () => {
            alert(`Opening: ${feature.action}`);
            closePopup();
        });
        
        overlay.addEventListener('click', closePopup);
        
        // Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closePopup();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
    
    triggerTryApp() {
        const downloadBtn = document.querySelector('.open-modal');
        if (downloadBtn) {
            downloadBtn.click();
        } else {
            alert("🚀 Launching Trelio...");
        }
    }
    
    triggerMoodDemo() {
        if (this.isDemoRunning) return;
        
        this.isDemoRunning = true;
        const moods = Object.keys(this.moodData);
        let demoIndex = 0;
        
        // Disable interactions
        this.nodes.forEach(node => {
            node.style.pointerEvents = 'none';
        });
        
        const demoInterval = setInterval(() => {
            this.changeMood(moods[demoIndex]);
            demoIndex++;
            
            if (demoIndex >= moods.length) {
                clearInterval(demoInterval);
                setTimeout(() => {
                    this.resetToDefault();
                    this.nodes.forEach(node => {
                        node.style.pointerEvents = 'auto';
                    });
                    this.isDemoRunning = false;
                }, 2000);
            }
        }, 1000);
        
        setTimeout(() => {
            clearInterval(demoInterval);
            this.isDemoRunning = false;
        }, moods.length * 1000 + 1000);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new TrelioMoodFlow();
    }, 300);
});