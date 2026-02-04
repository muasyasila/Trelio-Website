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
// THEME MANAGEMENT - FIXED DUPLICATE FUNCTION
// =========================================

const themeSwitch = document.getElementById('theme-switch');

const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeToggleLabel();
};

// SINGLE DECLARATION of updateThemeToggleLabel
const updateThemeToggleLabel = () => {
    if (!themeSwitch) return;
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    themeSwitch.setAttribute('aria-label', `Switch to ${current === 'dark' ? 'light' : 'dark'} mode`);
    themeSwitch.setAttribute('aria-pressed', current === 'dark');
};

// Initialize theme on page load
const initializeTheme = () => {
    // Check if theme exists in localStorage, otherwise use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Default to dark if no preference
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    
    if (themeSwitch) {
        themeSwitch.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const newTheme = current === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
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
    const isMobileDevice = width < 768;
    
    return {
        radiusX: isMobileDevice ? width * 0.45 : 420,
        radiusY: 10
    };
};

// Update carousel positions and styling
const updateCarousel = () => {
    if (carouselCards.length === 0) return;
    
    const { radiusX, radiusY } = getCarouselDimensions();
    const width = window.innerWidth;
    const isMobileDevice = width < 768;
    const isSmallMobile = width < 480;
    
    carouselCards.forEach((card, i) => {
        let offset = i - carouselIndex;
        
        if (offset > carouselCards.length / 2) offset -= carouselCards.length;
        if (offset < -carouselCards.length / 2) offset += carouselCards.length;
        
        const angle = (offset * 0.4) + 4.712;
        const x = Math.cos(angle) * radiusX;
        const y = Math.sin(angle) * radiusY;
        
        const isCenter = i === carouselIndex;
        const verticalLift = 30;
        const tilt = isMobileDevice ? offset * -5 : offset * -10;
        const baseScale = isMobileDevice ? 0.7 : 0.85;
        const centerScale = isMobileDevice ? 1.0 : 1.05;
        
        card.style.position = 'absolute';
        card.style.left = '50%';
        card.style.top = '50%';
        card.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        
        card.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px + ${verticalLift}px)) scale(${isCenter ? centerScale : baseScale}) rotate(${tilt}deg)`;
        
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
                if (video.paused) {
                    video.play().catch(e => console.log("Video play failed:", e));
                }
            } else {
                if (!video.paused) {
                    video.pause();
                }
            }
        });
    };
    
    // Initialize each video
    videos.forEach(video => {
        video.muted = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('autoplay', '');
        video.setAttribute('loop', '');
        
        video.setAttribute('data-originally-muted', 'true');
        
        video.play().catch(e => {
            console.log("Autoplay muted failed, will play on interaction:", e);
            video.setAttribute('data-needs-interaction', 'true');
        });
        
        const soundButton = video.parentElement.querySelector('.sound-toggle, [data-sound-video]');
        if (soundButton) {
            soundButton.addEventListener('click', function() {
                if (video.muted) {
                    video.muted = false;
                    video.removeAttribute('data-originally-muted');
                    video.setAttribute('data-user-unmuted', 'true');
                    
                    if (video.paused) {
                        video.play().catch(e => console.log("Video play failed after unmute:", e));
                    }
                    
                    this.innerHTML = '🔊';
                    this.setAttribute('aria-label', 'Mute video');
                } else {
                    video.muted = true;
                    video.setAttribute('data-originally-muted', 'true');
                    video.removeAttribute('data-user-unmuted');
                    
                    this.innerHTML = '🔇';
                    this.setAttribute('aria-label', 'Unmute video');
                }
            });
            
            soundButton.innerHTML = video.muted ? '🔇' : '🔊';
            soundButton.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
        }
        
        video.addEventListener('click', () => {
            if (video.hasAttribute('data-needs-interaction')) {
                video.removeAttribute('data-needs-interaction');
                video.play().catch(e => console.log("Video play failed on click:", e));
            }
            
            if (video.muted && soundButton) {
                soundButton.click();
            }
        });
        
        video.addEventListener('error', () => {
            console.error('Video error:', video.error);
        });
        
        video.addEventListener('timeupdate', () => {
            localStorage.setItem(`video-${video.src}-time`, video.currentTime);
        });
    });
    
    // Initial check
    handleVideoPlayback();
    
    window.addEventListener('scroll', handleVideoPlayback);
    window.addEventListener('resize', handleVideoPlayback);
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.querySelectorAll('video').forEach(v => {
                if (!v.paused) v.pause();
            });
        } else {
            handleVideoPlayback();
        }
    });
    
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
    
    const handleResize = () => {
        adjustPhoneUIForMobile();
        preventHorizontalScroll();
        updateMobileClass();
        
        updateCarousel();
        createIndicators();
        
        if (typeof revealOnScroll === 'function') {
            revealOnScroll();
        }
    };
    
    window.addEventListener('resize', handleResize);
});

// =========================================
// TRELIO How it works MOOD FLOW - FINAL PERFECT POSITIONS
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
        this.cloudSvg = this.cloud.querySelector('.cloud-svg');
        
        this.leftPupil = null;
        this.rightPupil = null;
        this.leftEye = null;
        this.rightEye = null;
        this.leftHighlight = null;
        this.rightHighlight = null;
        
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
        this.isMouseTracking = false;
        this.eyeMovementFactor = 0.15;
        this.maxPupilMovement = 0.8;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.animateCloud();
        this.setDefaultMood();
        this.autoRotateMoods();
        this.setupEyeTracking();
    }
    
    setupEventListeners() {
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
                const mood = node.dataset.mood;
                this.changeMood(mood);
                this.highlightNode(node);
                
                node.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    node.style.transform = '';
                }, 200);
            });
            
            node.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const mood = node.dataset.mood;
                this.changeMood(mood);
                this.highlightNode(node);
            });
        });
        
        this.cloud.addEventListener('click', () => {
            this.randomMood();
        });
        
        this.cloud.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.randomMood();
        });
        
        this.tryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.triggerTryApp();
        });
        
        this.demoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.triggerMoodDemo();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'm' || e.key === 'M') {
                this.randomMood();
            }
            if (e.key === 'Escape') {
                this.resetToDefault();
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.isMouseTracking && this.leftPupil && this.rightPupil) {
                this.updateEyeMovement(e);
            }
        });
        
        this.cloud.addEventListener('mouseenter', () => {
            this.isMouseTracking = true;
        });
        
        this.cloud.addEventListener('mouseleave', () => {
            this.isMouseTracking = false;
            this.resetEyePositions();
        });
    }
    
    setupEyeTracking() {
        setTimeout(() => {
            this.leftPupil = this.cloud.querySelector('.left-pupil');
            this.rightPupil = this.cloud.querySelector('.right-pupil');
            this.leftEye = this.cloud.querySelector('.left-eye');
            this.rightEye = this.cloud.querySelector('.right-eye');
            this.leftHighlight = this.cloud.querySelector('.left-highlight');
            this.rightHighlight = this.cloud.querySelector('.right-highlight');
            
            this.resetEyePositions();
        }, 100);
    }
    
    updateEyeMovement(e) {
        if (!this.leftPupil || !this.rightPupil || !this.cloudSvg) return;
        
        const cloudRect = this.cloud.getBoundingClientRect();
        
        const mouseX = e.clientX - cloudRect.left;
        const mouseY = e.clientY - cloudRect.top;
        
        const relX = (mouseX / cloudRect.width) - 0.5;
        const relY = (mouseY / cloudRect.height) - 0.5;
        
        const leftEyeX = parseFloat(this.leftEye.getAttribute('cx'));
        const leftEyeY = parseFloat(this.leftEye.getAttribute('cy'));
        const rightEyeX = parseFloat(this.rightEye.getAttribute('cx'));
        const rightEyeY = parseFloat(this.rightEye.getAttribute('cy'));
        
        const leftPupilNewX = leftEyeX + Math.max(-this.maxPupilMovement, 
                                                 Math.min(this.maxPupilMovement, relX * this.eyeMovementFactor * 100));
        const leftPupilNewY = leftEyeY + Math.max(-this.maxPupilMovement, 
                                                 Math.min(this.maxPupilMovement, relY * this.eyeMovementFactor * 100));
        
        const rightPupilNewX = rightEyeX + Math.max(-this.maxPupilMovement, 
                                                  Math.min(this.maxPupilMovement, relX * this.eyeMovementFactor * 100));
        const rightPupilNewY = rightEyeY + Math.max(-this.maxPupilMovement, 
                                                  Math.min(this.maxPupilMovement, relY * this.eyeMovementFactor * 100));
        
        this.leftPupil.setAttribute('cx', leftPupilNewX);
        this.leftPupil.setAttribute('cy', leftPupilNewY);
        this.rightPupil.setAttribute('cx', rightPupilNewX);
        this.rightPupil.setAttribute('cy', rightPupilNewY);
        
        const highlightFactor = 0.7;
        if (this.leftHighlight) {
            const leftHighlightNewX = leftEyeX - 1 + (leftPupilNewX - leftEyeX) * highlightFactor;
            const leftHighlightNewY = leftEyeY - 1 + (leftPupilNewY - leftEyeY) * highlightFactor;
            this.leftHighlight.setAttribute('cx', leftHighlightNewX);
            this.leftHighlight.setAttribute('cy', leftHighlightNewY);
        }
        
        if (this.rightHighlight) {
            const rightHighlightNewX = rightEyeX - 1 + (rightPupilNewX - rightEyeX) * highlightFactor;
            const rightHighlightNewY = rightEyeY - 1 + (rightPupilNewY - rightEyeY) * highlightFactor;
            this.rightHighlight.setAttribute('cx', rightHighlightNewX);
            this.rightHighlight.setAttribute('cy', rightHighlightNewY);
        }
    }
    
    resetEyePositions() {
        if (this.leftPupil && this.rightPupil) {
            const mood = this.currentMood;
            let eyeY = 43;
            let pupilY = 43;
            
            switch(mood) {
                case 'happy':
                    eyeY = 43;
                    pupilY = 43;
                    break;
                case 'stressed':
                    eyeY = 44;
                    pupilY = 44;
                    break;
                case 'anxious':
                    eyeY = 44.5;
                    pupilY = 44.5;
                    break;
                case 'connected':
                    eyeY = 42.5;
                    pupilY = 42.5;
                    break;
                default:
                    eyeY = 43;
                    pupilY = 43;
            }
            
            this.leftPupil.setAttribute('cx', 38);
            this.leftPupil.setAttribute('cy', pupilY);
            this.rightPupil.setAttribute('cx', 62);
            this.rightPupil.setAttribute('cy', pupilY);
            
            if (this.leftHighlight) {
                this.leftHighlight.setAttribute('cx', 37);
                this.leftHighlight.setAttribute('cy', pupilY - 1);
            }
            if (this.rightHighlight) {
                this.rightHighlight.setAttribute('cx', 61);
                this.rightHighlight.setAttribute('cy', pupilY - 1);
            }
            
            if (this.leftEye && this.rightEye) {
                this.leftEye.setAttribute('cy', eyeY);
                this.rightEye.setAttribute('cy', eyeY);
            }
        }
    }
    
    setDefaultMood() {
        this.changeMood('happy');
    }
    
    changeMood(moodType) {
        if (!this.moodData[moodType] || this.isDemoRunning) return;
        
        this.currentMood = moodType;
        const moodInfo = this.moodData[moodType];
        
        Object.keys(this.moodData).forEach(mood => {
            this.cloud.classList.remove(mood);
        });
        
        this.cloud.classList.add(moodType);
        
        const emojiSpan = this.combinedLabel.querySelector('.label-emoji');
        const textSpan = this.combinedLabel.querySelector('.label-text');
        
        if (emojiSpan) emojiSpan.textContent = moodInfo.emoji;
        if (textSpan) textSpan.textContent = moodInfo.name;
        
        this.moodStatus.textContent = moodInfo.status;
        this.moodStatus.style.color = moodInfo.color;
        this.moodStatus.style.borderColor = moodInfo.color + '40';
        this.moodStatus.style.background = moodInfo.color + '15';
        
        this.updateExplanation(moodInfo);
        this.updateCloudExpression(moodType);
        
        setTimeout(() => this.resetEyePositions(), 50);
        
        this.animateCloudChange();
        this.animateLabel();
    }
    
    updateCloudExpression(moodType) {
        const mouth = this.cloud.querySelector('.cloud-mouth');
        const eyes = this.cloud.querySelectorAll('.cloud-eye');
        const pupils = this.cloud.querySelectorAll('.eye-pupil');
        const blush = this.cloud.querySelectorAll('.cloud-blush');
        
        if (!mouth) return;
        
        const expressions = {
            'happy': {
                mouth: 'M40 54c2.5 0 3.5 2 3.5 2s1-2 4.5-2',
                mouthWidth: 2.5,
                eyeRadius: 3.5,
                eyeY: 43,
                pupilRadius: 1.5,
                pupilY: 43,
                blushOpacity: 0.7,
                blushRadius: 3.2,
                blushY: 50
            },
            'calm': {
                mouth: 'M43 55c1.5 0 2.5 1 2.5 1s0.5-1 2.5-1',
                mouthWidth: 2,
                eyeRadius: 3.5,
                eyeY: 43,
                pupilRadius: 1.5,
                pupilY: 43,
                blushOpacity: 0.4,
                blushRadius: 3.2,
                blushY: 50,
                blushColor: '#0EA5E9'
            },
            'stressed': {
                mouth: 'M43 58c2.5 0 3.5 -1 3.5 -1s1 1 4.5 1',
                mouthWidth: 2,
                eyeRadius: 3,
                eyeY: 44,
                pupilRadius: 1.3,
                pupilY: 44,
                blushOpacity: 0.3,
                blushRadius: 3,
                blushY: 50,
                blushColor: '#F59E0B'
            },
            'anxious': {
                mouth: 'M40 58 Q50 54 60 58',
                mouthWidth: 2.5,
                eyeRadius: 2.8,
                eyeY: 44.5,
                pupilRadius: 1.2,
                pupilY: 44.5,
                blushOpacity: 0.8,
                blushRadius: 2.8,
                blushY: 50,
                blushColor: '#EF4444'
            },
            'peaceful': {
                mouth: 'M42 55 Q50 53 58 55',
                mouthWidth: 2,
                eyeRadius: 3.5,
                eyeY: 43,
                pupilRadius: 1.5,
                pupilY: 43,
                blushOpacity: 0.5,
                blushRadius: 3.2,
                blushY: 50,
                blushColor: '#10B981'
            },
            'supported': {
                mouth: 'M40 54c3 0 4 1.5 4 1.5s1-1.5 5-1.5',
                mouthWidth: 2.5,
                eyeRadius: 3.5,
                eyeY: 43,
                pupilRadius: 1.5,
                pupilY: 43,
                blushOpacity: 0.6,
                blushRadius: 3.2,
                blushY: 50,
                blushColor: '#8B5CF6'
            },
            'connected': {
                mouth: 'M38 54c4 0 5 2 5 2s2-2 6-2',
                mouthWidth: 2.5,
                eyeRadius: 3.8,
                eyeY: 42.5,
                pupilRadius: 1.6,
                pupilY: 42.5,
                blushOpacity: 0.7,
                blushRadius: 3.5,
                blushY: 50,
                blushColor: '#EC4899'
            }
        };
        
        const expr = expressions[moodType] || expressions.happy;
        
        if (mouth) {
            mouth.setAttribute('d', expr.mouth);
            mouth.setAttribute('stroke-width', expr.mouthWidth);
        }
        
        if (eyes.length > 0) {
            eyes.forEach(eye => {
                eye.setAttribute('r', expr.eyeRadius);
                eye.setAttribute('cy', expr.eyeY);
            });
        }
        
        if (pupils.length > 0) {
            pupils.forEach(pupil => {
                pupil.setAttribute('r', expr.pupilRadius);
                pupil.setAttribute('cy', expr.pupilY);
            });
        }
        
        if (blush.length > 0) {
            blush.forEach(blushCircle => {
                blushCircle.setAttribute('opacity', expr.blushOpacity);
                blushCircle.setAttribute('r', expr.blushRadius);
                blushCircle.setAttribute('cy', expr.blushY);
                if (expr.blushColor) {
                    blushCircle.setAttribute('fill', expr.blushColor);
                } else {
                    blushCircle.setAttribute('fill', '#FFB4C2');
                }
            });
        }
    }
    
    updateExplanation(moodInfo) {
        if (this.titleEl && this.textEl) {
            this.titleEl.textContent = moodInfo.title;
            this.textEl.textContent = moodInfo.text;
            
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
        this.resetEyePositions();
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
    
    triggerTryApp() {
        const downloadBtn = document.querySelector('.open-modal');
        if (downloadBtn) {
            downloadBtn.click();
        } else {
            this.tryBtn.innerHTML = `<span>Opening...</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>`;
            
            setTimeout(() => {
                this.tryBtn.innerHTML = `<span>Try Trelio</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>`;
            }, 1500);
        }
    }
    
    triggerMoodDemo() {
        if (this.isDemoRunning) return;
        
        this.isDemoRunning = true;
        const moods = Object.keys(this.moodData);
        let demoIndex = 0;
        
        this.demoBtn.innerHTML = `<span>Demo Running...</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>`;
        
        this.nodes.forEach(node => {
            node.style.pointerEvents = 'none';
        });
        
        this.isMouseTracking = false;
        
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
                    
                    this.demoBtn.innerHTML = `<span>See Demo</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>`;
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


// =========================================
// UPDATE CURRENT YEAR IN FOOTER
// =========================================
const updateCurrentYear = () => {
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', updateCurrentYear);

// Also update if the element appears dynamically
if (document.getElementById('current-year')) {
    updateCurrentYear();
}

// Mission Section Counter Animation - FAST VERSION WITH FIXED PROGRESS BARS
function animateMissionCounters() {
    const stats = document.querySelectorAll('.tre-stat');
    
    stats.forEach(stat => {
        const numberElement = stat.querySelector('.tre-stat-number');
        const target = parseInt(numberElement.getAttribute('data-count'));
        const suffix = numberElement.getAttribute('data-suffix') || '';
        
        // Start progress bar animation using CSS animation
        stat.classList.add('animate-progress');
        
        // Fast animation (1 second)
        const duration = 1000; // 1 second - FAST!
        const steps = 30; // 30 frames for smoothness
        const stepDuration = duration / steps;
        let current = 0;
        const increment = target / steps;
        
        // Add pop animation to number
        numberElement.classList.add('animating');
        
        const counter = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                current = target;
                clearInterval(counter);
                
                // Mark as completed to keep progress bar filled
                stat.classList.add('completed');
                stat.classList.remove('animate-progress');
                
                // Remove number animation after completion
                setTimeout(() => {
                    numberElement.classList.remove('animating');
                }, 300);
            }
            
            // Format the number
            let displayNumber;
            if (target >= 1000) {
                // For 10000, show as 10k
                const value = Math.floor(current);
                if (value >= 1000) {
                    displayNumber = (value/1000).toFixed(value >= 10000 ? 0 : 1) + 'k';
                } else {
                    displayNumber = value;
                }
            } else {
                displayNumber = Math.floor(current);
            }
            
            // Update display
            if (current === target) {
                numberElement.textContent = displayNumber + suffix;
            } else {
                numberElement.textContent = displayNumber;
            }
            
        }, stepDuration);
    });
}

// Initialize counter when mission section is visible
const missionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Start animation immediately
            animateMissionCounters();
            missionObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.3, // Trigger when 30% visible
    rootMargin: '0px 0px -50px 0px' // Trigger 50px early
});

// Start observing the mission section
const missionSection = document.querySelector('.tre-minimal-mission');
if (missionSection) {
    missionObserver.observe(missionSection);
}

// Optional: Add hover effect to show progress bar pulse
document.querySelectorAll('.tre-stat').forEach(stat => {
    stat.addEventListener('mouseenter', () => {
        const numberElement = stat.querySelector('.tre-stat-number');
        if (!numberElement.classList.contains('animating')) {
            // Add a subtle pulse effect to completed progress bars
            const progressBar = stat.querySelector('.tre-stat-progress');
            if (progressBar && stat.classList.contains('completed')) {
                progressBar.style.transform = 'scaleX(1.1)';
                setTimeout(() => {
                    progressBar.style.transform = 'scaleX(1)';
                }, 200);
            }
            
            // Bounce the number
            numberElement.classList.add('animating');
            setTimeout(() => {
                numberElement.classList.remove('animating');
            }, 500);
        }
    });
});