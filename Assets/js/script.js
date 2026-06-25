document.addEventListener('DOMContentLoaded', () => {

    const mainContent = document.getElementById('main-content');
    
    function normalizePath(path) {
        if (path === '/' || path === '') return '/home.html';
        if (path === '/index.html') return '/home.html';
        return path;
    }

    let currentPageUrl = normalizePath(window.location.pathname);

    // ===== CORE FUNCTION: FULL-PAGE AJAX PARSER ENGINE =====
    async function loadPage(targetUrl, pushHistory = true) {
        const fetchUrl = normalizePath(targetUrl);

        const currentContent = mainContent.querySelector('.page-content');
        if (currentContent) {
            currentContent.style.opacity = '0';
            currentContent.style.transform = 'translateY(-8px)';
            currentContent.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
        }

        setTimeout(async () => {
            try {
                const response = await fetch(fetchUrl);
                if (!response.ok) throw new Error(`HTTP Error tracking destination: ${fetchUrl}`);
                
                const fullHtmlText = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(fullHtmlText, 'text/html');
                const incomingContent = doc.getElementById('main-content');

                if (!incomingContent) throw new Error("Missing #main-content container.");

                mainContent.innerHTML = incomingContent.innerHTML;
                currentPageUrl = targetUrl;
                document.title = doc.title || "B S Shreesha";

                if (pushHistory) {
                    history.pushState({ url: targetUrl }, '', targetUrl);
                }

                updateActiveNav(targetUrl);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                if (targetUrl.includes('contact.html')) attachContactForm();
                if (targetUrl.includes('certifications.html')) attachModalTriggers();

            } catch (error) {
                console.warn("SPA Engine fallback triggered:", error);
                window.location.href = targetUrl;
            }
        }, currentContent ? 150 : 0);
    }

    // ===== CERTIFICATION CARDS MODAL INTERACTION HANDLING (MOBILE CLOSES) =====
    function attachModalTriggers() {
        const modal = document.getElementById('certModal');
        if (!modal) return;

        const modalCloseBtn = document.getElementById('modalCloseBtn');
        const overlayBg = modal.querySelector('.cert-modal-overlay');

        window.closeCertModal = function() {
            modal.classList.remove('show');
            document.body.classList.remove('cert-modal-open');
        };

        if (modalCloseBtn) {
            modalCloseBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); window.closeCertModal(); };
        }
        
        if (overlayBg) {
            overlayBg.onclick = (e) => { e.preventDefault(); e.stopPropagation(); window.closeCertModal(); };
        }
    }

    // ===== NAVIGATION ACTIVE CLASS MANAGEMENT =====
    function updateActiveNav(urlPath) {
        let pageKey = urlPath.split('/').pop().replace('.html', '');
        if (!pageKey || pageKey === 'index' || pageKey === 'home') pageKey = 'home';

        document.querySelectorAll('.nav-link, .bottom-nav-link, .menu-item').forEach(link => {
            const hrefAttr = link.getAttribute('href') || '';
            if (hrefAttr.includes(pageKey) || (pageKey === 'home' && (hrefAttr === '/' || hrefAttr.includes('index.html')))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        const menuBtn = document.getElementById('mobile-menu-btn');
        if (menuBtn) {
            const groupKeys = ['projects', 'experience', 'teaching', 'certifications', 'skills'];
            menuBtn.classList.toggle('active', groupKeys.includes(pageKey));
        }
    }

    // ===== GLOBAL DELEGATED CLICK HANDLER =====
    document.addEventListener('click', (e) => {
        
        // 1. INTERCEPT CERTIFICATION CARD CLICK - CHOOSE DESKTOP INLINE VS MOBILE OVERLAY
        const certCard = e.target.closest('.cert-card');
        if (certCard) {
            e.preventDefault();
            e.stopPropagation();

            // Extract inline properties directly from markup metadata nodes cleanly
            const title = certCard.getAttribute('data-title');
            const provider = certCard.getAttribute('data-provider');
            const category = certCard.getAttribute('data-category');
            const duration = certCard.getAttribute('data-duration');
            const credits = certCard.getAttribute('data-credits');
            const iconClass = certCard.getAttribute('data-icon') || 'fa-certificate';
            const description = certCard.getAttribute('data-description');
            const fileUrl = certCard.getAttribute('data-url') || '#';

            // DUAL EXPERIENTIAL VIEWPORT ROUTER
            if (window.innerWidth >= 992) {
                // ===== DESKTOP INLINE METADATA HYDRATION PANELS =====
                document.querySelectorAll('.cert-card').forEach(c => c.classList.remove('selected-desktop'));
                certCard.classList.add('selected-desktop');

                const metaPanel = document.getElementById('desktopMetaPanel');
                const desktopIframe = document.getElementById('desktopPdfIframe');
                const fallbackBlock = document.querySelector('.pdf-fallback');
                const downloadBtn = document.getElementById('desktopDownloadBtn');
                const nameLabel = document.getElementById('desktopPdfName');

                if (metaPanel) {
                    // Hydrate inline desktop textual context fields
                    document.getElementById('deckProvider').textContent = provider;
                    document.getElementById('deckCategory').textContent = category;
                    document.getElementById('deckDuration').textContent = duration;
                    document.getElementById('deckCredits').textContent = credits;
                    document.getElementById('deckDescription').textContent = description;
                    
                    // Display the content panel block element
                    metaPanel.style.display = 'block';
                }

                if (desktopIframe && fallbackBlock) {
                    if (nameLabel) nameLabel.textContent = title;
                    if (downloadBtn) {
                        downloadBtn.href = fileUrl;
                        downloadBtn.style.display = 'inline-flex';
                    }
                    fallbackBlock.style.display = 'none';
                    desktopIframe.src = fileUrl;
                }
            } else {
                // ===== MOBILE OVERLAY MODAL LOGIC =====
                const modal = document.getElementById('certModal');
                if (modal) {
                    attachModalTriggers();

                    document.getElementById('modalTitle').textContent = title;
                    document.getElementById('modalSubtitle').textContent = `${provider} | ${category}`;
                    document.getElementById('modalProvider').textContent = provider;
                    document.getElementById('modalCategory').textContent = category;
                    document.getElementById('modalDate').textContent = duration;
                    document.getElementById('modalCredential').textContent = credits;
                    document.getElementById('modalDescription').textContent = description;
                    
                    document.getElementById('modalIcon').className = `fas ${iconClass}`;
                    document.getElementById('modalPdfLink').href = fileUrl;

                    modal.classList.add('show');
                    document.body.classList.add('cert-modal-open');
                }
            }
            return;
        }

        // 2. INTERCEPT SPA WEB NAVIGATION LINKS
        const anchor = e.target.closest('a');
        if (anchor) {
            const targetHref = anchor.getAttribute('href');
            if (targetHref && !targetHref.startsWith('http') && !targetHref.startsWith('#')) {
                const isNavControl = anchor.hasAttribute('data-page') || 
                                     anchor.classList.contains('btn-resume') || 
                                     anchor.classList.contains('bottom-nav-link') ||
                                     anchor.classList.contains('menu-item') ||
                                     anchor.closest('.nav-menu') ||
                                     anchor.closest('.bottom-nav');

                if (isNavControl) {
                    e.preventDefault();
                    if (targetHref !== currentPageUrl) {
                        loadPage(targetHref, true);
                    }
                }
            }
        }
    });

    // ===== BROWSER BACK BUTTON HISTORIES TRACER =====
    window.addEventListener('popstate', () => {
        const currentRoutePath = window.location.pathname;
        if (currentRoutePath !== currentPageUrl) {
            loadPage(currentRoutePath, false);
        }
    });

    // ===== MASTER SYSTEMS SCHEDULER UTILITIES =====
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    const htmlEl = document.documentElement; 
    const icon = document.getElementById('theme-icon');
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const newTheme = htmlEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            htmlEl.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            if (icon) newTheme === 'dark' ? icon.classList.replace('fa-moon', 'fa-sun') : icon.classList.replace('fa-sun', 'fa-moon');
        });
    }

    const menuBtn = document.getElementById('mobile-menu-btn');
    const menuOverlay = document.getElementById('mobile-menu-overlay');
    if (menuBtn && menuOverlay) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = menuOverlay.classList.toggle('show');
            const menuIcon = menuBtn.querySelector('i');
            if (menuIcon) menuIcon.classList.toggle('fa-bars', !isOpen), menuIcon.classList.toggle('fa-times', isOpen);
        });
    }

    function attachContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                window.location.href = `mailto:bsshreesha0511@gmail.com?subject=Contact&body=${encodeURIComponent(document.getElementById('message').value)}`;
            });
        }
    }

    if (window.location.pathname.includes('contact.html')) attachContactForm();
    if (window.location.pathname.includes('certifications.html')) attachModalTriggers();
});