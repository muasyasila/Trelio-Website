// Full updated script.js
// - Replaces inline style show/hide of the card modal with class-based open/close helpers
// - Keeps all original functionality (theme toggle, signup modal, carousel, mood gallery)
// - Adds overlay click & ESC-to-close for the card modal and prevents body scroll while open

document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle Logic (robust + accessible)
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
        // Label describes the action that will happen when pressed
        themeSwitch.setAttribute('aria-label', `Switch to ${current === 'dark' ? 'light' : 'dark'} mode`);
    };

    setTheme(savedTheme);
    updateThemeToggleLabel();

    if (themeSwitch) {
        themeSwitch.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    // 2. Modal Logic (Signup)
    const modal = document.getElementById('signup-modal');
    const openBtns = document.querySelectorAll('.open-modal');
    const closeBtn = document.querySelector('.close-modal');
    const toggleModal = (show) => {
        if (modal) {
            modal.classList.toggle('modal-active', show);
            document.body.style.overflow = show ? 'hidden' : 'auto';
        }
    };
    openBtns.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); toggleModal(true); }));
    if (closeBtn) closeBtn.addEventListener('click', () => toggleModal(false));
    window.addEventListener('click', (e) => { if (e.target === modal) toggleModal(false); });

    // 3. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
        });
    }
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks) navLinks.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // 4. SMILE CURVE CAROUSEL LOGIC
    const carouselCards = Array.from(document.querySelectorAll('.card'));
    const carouselNextBtn = document.getElementById('nextBtn');
    const carouselPrevBtn = document.getElementById('prevBtn');
    const track = document.getElementById('track');
    const cardModal = document.getElementById('cardModal');
    const closeCardBtn = document.querySelector('.close-btn');
    const indicatorContainer = document.getElementById('indicators');

    let carouselIndex = 2;
    let autoPlayInterval;

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

    const updateIndicators = () => {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === carouselIndex);
        });
    };

    const updateCarousel = () => {
        if (carouselCards.length === 0) return;
        const isMobile = window.innerWidth < 768;
        const isSmallMobile = window.innerWidth < 480;
        const radiusX = isSmallMobile ? window.innerWidth * 0.35 : (isMobile ? window.innerWidth * 0.42 : 550); 
        const radiusY = isSmallMobile ? 30 : (isMobile ? 50 : 100); 

        carouselCards.forEach((card, i) => {
            let offset = i - carouselIndex;
            if (offset > carouselCards.length / 2) offset -= carouselCards.length;
            if (offset < -carouselCards.length / 2) offset += carouselCards.length;
            const angle = (offset * 0.4) + 4.712; 
            const x = Math.cos(angle) * radiusX;
            const y = Math.sin(angle) * radiusY;
            const isCenter = i === carouselIndex;
            const tilt = offset * -12; 

            card.style.position = 'absolute';
            card.style.left = '50%';
            card.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
            const baseScale = isMobile ? 0.65 : 0.75;
            const centerScale = isMobile ? 1.0 : 1.15;

            card.style.transform = `translate(calc(-50% + ${x}px), ${y + 50}px) scale(${isCenter ? centerScale : baseScale}) rotate(${tilt}deg)`;
            card.style.zIndex = isCenter ? 100 : String(50 - Math.abs(offset));
            if (isSmallMobile && Math.abs(offset) > 1) {
                card.style.opacity = '0'; card.style.pointerEvents = 'none';
            } else {
                card.style.opacity = isMobile && Math.abs(offset) > 1 ? '0.4' : '1';
                card.style.pointerEvents = 'auto';
            }
            card.classList.toggle('active', isCenter);
        });
        updateIndicators();
    };

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

    // Prev / Next buttons for carousel
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

    // ===== ADD: modal open/close helpers for card modal (class-based) =====
    // overlay and esc handlers will be attached only while modal is open
    function overlayHandler(e) {
      if (e.target === cardModal) closeCardModal();
    }
    function escHandler(e) {
      if (e.key === 'Escape') closeCardModal();
    }

    function openCardModal() {
      if (!cardModal) return;
      cardModal.classList.add('show');                // CSS should have .details-modal.show { display:flex; ... }
      document.body.classList.add('modal-open');      // prevents page scroll behind modal
      cardModal.setAttribute('aria-hidden', 'false');
      cardModal.addEventListener('click', overlayHandler);
      document.addEventListener('keydown', escHandler);
      stopAutoPlay();
      // ensure focus lands inside modal for accessibility
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
    // ===== end helpers =====

    // Card click behaviour: fill modal and open via openCardModal()
    carouselCards.forEach(card => {
        card.addEventListener('click', () => {
            if (card.classList.contains('active')) {
                stopAutoPlay();
                const titleEl = card.querySelector('.title');
                const imgEl = card.querySelector('img');
                const title = titleEl ? titleEl.innerText : (card.querySelector('h3')?.innerText || '');
                const imgSrc = imgEl ? imgEl.src : '';
                const category = card.querySelector('.category-tag')?.innerText || "CONTENT";
                const longDesc = card.querySelector('.hidden-data')?.getAttribute('data-full');
                const downloadLink = card.getAttribute('data-download-url') || "#";
                const featuresStr = card.getAttribute('data-features') || "Cloud Sync, AI-Driven, Multi-Channel Support";
                const featuresArray = featuresStr.split(',');

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

                // OPEN modal via class-based helper (instead of inline style)
                openCardModal();
            } else {
                carouselIndex = Array.from(carouselCards).indexOf(card);
                updateCarousel();
            }
        });
    });

    // close button inside card modal
    if (closeCardBtn) {
        closeCardBtn.addEventListener('click', () => {
            closeCardModal();
        });
    }

    // Share button copy feedback (works within modal)
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            if (!navigator.clipboard) return;
            navigator.clipboard.writeText(window.location.href).then(() => {
                const shareText = shareBtn.querySelector('span');
                if (shareText) {
                    const original = shareText.innerText;
                    shareText.innerText = "Link Copied!";
                    setTimeout(() => { shareText.innerText = original; }, 2000);
                }
            });
        });
    }

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

    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('resize', () => { updateCarousel(); createIndicators(); });
    updateCarousel();
    startAutoPlay();
    revealOnScroll();
});

/* =========================================
   MOOD & GALLERY LOGIC
   (kept outside DOMContentLoaded as in original)
   ========================================= */
const moodData = {
    Happy: [{ title: "Keep the Momentum", type: "Article", icon: "✍️" }, { title: "High Energy Beats", type: "Playlist", icon: "🎵" }, { title: "Gratitude Journaling", type: "Exercise", icon: "📓" }],
    Anxious: [{ title: "4-7-8 Breathing", type: "Exercise", icon: "🌬️" }, { title: "Grounding Techniques", type: "Guide", icon: "🧘" }, { title: "Lo-fi for Calm", type: "Audio", icon: "🎧" }],
    Tired: [{ title: "Power Nap Guide", type: "Tips", icon: "💤" }, { title: "Digital Detox", type: "Article", icon: "📱" }, { title: "Soft Instrumental", type: "Audio", icon: "🎹" }],
    Angry: [{ title: "Box Breathing", type: "Exercise", icon: "📦" }, { title: "Physical Release", type: "Tips", icon: "🏃" }, { title: "Calm the Storm", type: "Playlist", icon: "⛈️" }],
    Sad: [{ title: "Self-Compassion", type: "Guide", icon: "❤️" }, { title: "Comfort Audio", type: "Audio", icon: "📻" }, { title: "Small Wins List", type: "Exercise", icon: "✅" }],
    Peaceful: [{ title: "Mindfulness Walk", type: "Guide", icon: "🍃" }, { title: "Deep Zen", type: "Audio", icon: "🏮" }, { title: "Maintain Peace", type: "Article", icon: "🌊" }]
};

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
        galleryContent.innerHTML = ''; 
        resources.forEach(res => {
            const card = document.createElement('div');
            card.className = 'card'; card.style.opacity = '1'; card.style.transform = 'none';
            card.innerHTML = `<div style="font-size: 2rem;">${res.icon}</div><h4 style="margin: 10px 0;">${res.title}</h4><span class="badge" style="font-size: 0.6rem;">${res.type}</span>`;
            galleryContent.appendChild(card);
        });
        gallery.classList.add('modal-active');
    });
});
const closeGalleryBtn = document.querySelector('.close-gallery');
if (closeGalleryBtn) {
    closeGalleryBtn.addEventListener('click', () => {
        const g = document.getElementById('mood-gallery');
        if (g) g.classList.remove('modal-active');
    });
}