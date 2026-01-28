// =========================================
// COMPLETE & ORGANIZED SCRIPT.JS
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // 1. UTILITY FUNCTIONS
    // =========================================
    
    // Check if device is mobile
    const isMobile = () => window.innerWidth <= 768;
    
    // Prevent horizontal scroll on mobile - FIXED VERSION
    const preventHorizontalScroll = () => {
        if (isMobile()) {
            // Apply only to body with less aggressive approach
            document.body.style.width = '100%';
            document.body.style.position = 'relative';
            document.body.style.overflowX = 'clip'; // 'clip' is better than 'hidden' for mobile
            
            // Also apply to specific containers that might overflow
            const carouselViewport = document.querySelector('.carousel-viewport');
            if (carouselViewport) {
                carouselViewport.style.overflowX = 'hidden';
            }
        } else {
            document.body.style.overflowX = '';
            document.body.style.width = '';
            document.body.style.position = '';
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
        
        // Ensure hero visual doesn't cause overflow
        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual) {
            heroVisual.style.maxWidth = '100%';
            heroVisual.style.overflow = 'hidden';
        }
        
        // Ensure navbar doesn't cause overflow
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.style.width = '100%';
            navbar.style.left = '0';
            navbar.style.right = '0';
        }
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
    // 5. CAROUSEL SYSTEM - FIXED FOR MOBILE
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
    
    // Calculate responsive carousel dimensions - FIXED VERSION
    const getCarouselDimensions = () => {
        const isMobile = window.innerWidth < 768;
        const isSmallMobile = window.innerWidth < 480;
        
        // Reduced radius values to prevent cards from flying off-screen
        // and overlapping vertically
        return {
            radiusX: isSmallMobile ? window.innerWidth * 0.25 : (isMobile ? window.innerWidth * 0.35 : 550),
            radiusY: isSmallMobile ? 15 : (isMobile ? 30 : 100)
        };
    };
    
    // Apply responsive card sizing for mobile
    const applyMobileCardSizing = () => {
        if (!isMobile()) return;
        
        carouselCards.forEach(card => {
            // Apply mobile-specific styles
            if (window.innerWidth < 768) {
                card.style.width = '80vw';
                card.style.maxWidth = '300px';
                card.style.height = 'auto';
                card.style.minHeight = '380px';
            } else {
                card.style.width = '';
                card.style.maxWidth = '';
                card.style.height = '';
                card.style.minHeight = '';
            }
        });
    };
    
    // Update carousel positions and styling - IMPROVED FOR MOBILE
    const updateCarousel = () => {
        if (carouselCards.length === 0) return;
        
        const { radiusX, radiusY } = getCarouselDimensions();
        
        // Apply mobile card sizing
        applyMobileCardSizing();
        
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
            
            // Handle visibility on small screens - IMPROVED
            // Use > 0.5 instead of > 1 to ensure only center card is fully visible
            const smallScreen = window.innerWidth < 480;
            const mediumScreen = window.innerWidth < 768 && window.innerWidth >= 480;
            
            if (smallScreen && Math.abs(offset) > 0.5) {
                // On very small screens, only show center card clearly
                card.style.opacity = '0';
                card.style.pointerEvents = 'none';
            } else if (mediumScreen && Math.abs(offset) > 1) {
                // On medium mobile screens, show nearby cards with reduced opacity
                card.style.opacity = '0.4';
                card.style.pointerEvents = 'auto';
            } else {
                // On desktop or for center card
                card.style.opacity = '1';
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
    applyMobileCardSizing();
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
        applyMobileCardSizing();
        updateCarousel();
        createIndicators();
        
        // Re-run scroll animations
        revealOnScroll();
    });
    
    // Initialize video playback control
    setTimeout(initializeVideoPlaybackControl, 500);
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
// 11. VIDEO AUTO-PAUSE/RESUME ON SCROLL
// =========================================

function isElementInViewport(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function handleVideoPlayback() {
    const videos = document.querySelectorAll('video');
    
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
}

function initializeVideoPlaybackControl() {
    const videos = document.querySelectorAll('video');
    
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
            document.querySelectorAll('video').forEach(video => {
                if (!video.paused) video.pause();
            });
        } else {
            // Page is visible again - check which videos should play
            handleVideoPlayback();
        }
    });
    
    // Also handle when user interacts with page (for autoplay policies)
    document.addEventListener('click', () => {
        document.querySelectorAll('video[data-needs-interaction]').forEach(video => {
            if (isElementInViewport(video)) {
                video.removeAttribute('data-needs-interaction');
                video.play().catch(e => console.log("Video play failed on page interaction:", e));
            }
        });
    });
}