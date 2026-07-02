// Global Progress Bar Logic with Strict Flashing Prevention
    (function () {
        const isVisited = sessionStorage.getItem('page_already_visited');
        
        if (isVisited) {
            // Repeat visit: Target and scrub the hidden element from the DOM tree entirely
            document.addEventListener('DOMContentLoaded', function() {
                const loader = document.getElementById('global-loader');
                if (loader) loader.remove();
            });
        } else {
            // First time loading: Force display properties before the browser paints the first frame
            const loaderStyle = document.createElement('style');
            loaderStyle.innerHTML = '#global-loader { display: flex !important; }';
            document.documentElement.appendChild(loaderStyle);

            window.addEventListener('DOMContentLoaded', function () {
                const loader = document.getElementById('global-loader');
                const progressBar = document.getElementById('loader-progress-bar');
                const progressCounter = document.getElementById('loader-counter');
                
                if (loader && progressBar && progressCounter) {
                    const duration = 2000; // Total duration: 2 seconds
                    const intervalTime = 20; // Step refresh loop rate
                    const totalSteps = duration / intervalTime;
                    let currentStep = 0;

                    const progressInterval = setInterval(function () {
                        currentStep++;
                        
                        // Calculate percentage value
                        const percentage = Math.min(Math.round((currentStep / totalSteps) * 100), 100);
                        
                        // Render updates
                        progressBar.style.width = percentage + '%';
                        progressCounter.textContent = percentage;

                        if (currentStep >= totalSteps) {
                            clearInterval(progressInterval);
                            
                            // Save session flag to bypass next loads
                            sessionStorage.setItem('page_already_visited', 'true');
                            
                            // Fade out layer masks smoothly
                            setTimeout(function () {
                                loader.style.opacity = '0';
                                loader.style.visibility = 'hidden';
                                
                                // Clean up tracking resources
                                setTimeout(function() {
                                    loader.remove();
                                    loaderStyle.remove();
                                }, 400);
                            }, 150);
                        }
                    }, intervalTime);
                }
            });
        }
    })();

    // Year update
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Fix offcanvas gap: add/remove class for navbar border control
    const mobileDrawer = document.getElementById('mobileMenuDrawer');
    const navbar = document.querySelector('.iisc-navbar');

    if (mobileDrawer && navbar) {
        mobileDrawer.addEventListener('show.bs.offcanvas', function () {
            navbar.classList.add('offcanvas-active');
        });
        mobileDrawer.addEventListener('hidden.bs.offcanvas', function () {
            navbar.classList.remove('offcanvas-active');
        });
    }

    // Force offcanvas positioning
    if (mobileDrawer) {
        mobileDrawer.addEventListener('shown.bs.offcanvas', function () {
            this.style.top = '0px';
            this.style.marginTop = '0px';
            this.style.paddingTop = '0px';
            this.style.bottom = '0px';
        });
    }

    // Dark Mode System
    (function () {
        const html = document.documentElement;

        // Select Desktop Elements
        const desktopToggle = document.querySelector('.utility-theme-toggle');
        const desktopIcon = desktopToggle ? desktopToggle.querySelector('i') : null;

        // Select Mobile Elements
        const mobileToggle = document.querySelector('.utility-theme-toggle-mobile');
        const mobileIcon = mobileToggle ? mobileToggle.querySelector('i') : null;
        const mobileText = document.getElementById('theme-text-mobile');

        // 1. Determine Initial Theme
        const savedTheme = localStorage.getItem('theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');

        // 2. The Master Apply Function
        function applyTheme(theme) {
            if (theme === 'dark') {
                html.setAttribute('data-theme', 'dark');

                // Update Desktop UI
                if (desktopIcon) {
                    desktopIcon.classList.remove('bi-moon');
                    desktopIcon.classList.add('bi-sun');
                }

                // Update Mobile UI
                if (mobileIcon) {
                    mobileIcon.classList.remove('bi-moon');
                    mobileIcon.classList.add('bi-sun');
                }
                if (mobileText) mobileText.textContent = 'Light Mode';

            } else {
                html.removeAttribute('data-theme');

                // Update Desktop UI
                if (desktopIcon) {
                    desktopIcon.classList.remove('bi-sun');
                    desktopIcon.classList.add('bi-moon');
                }

                // Update Mobile UI
                if (mobileIcon) {
                    mobileIcon.classList.remove('bi-sun');
                    mobileIcon.classList.add('bi-moon');
                }
                if (mobileText) mobileText.textContent = 'Dark Mode';
            }

            localStorage.setItem('theme', theme);
        }

        // 3. Initialize on Load
        applyTheme(initialTheme);

        // 4. Toggle Logic for both click events
        const handleToggle = function () {
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
        };

        if (desktopToggle) {
            desktopToggle.addEventListener('click', handleToggle);
        }

        if (mobileToggle) {
            mobileToggle.addEventListener('click', handleToggle);
        }

        // 5. Listen for System changes (if user hasn't set a preference)
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
            if (!localStorage.getItem('theme')) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    })();

    var form = document.getElementById("contact-form");
    
async function handleSubmit(event) {
    event.preventDefault();
    var status = document.getElementById("form-status");
    var btn = document.getElementById("submit-btn");
    var data = new FormData(event.target);

    btn.disabled = true;
    btn.innerHTML = "SENDING...";

    fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            status.style.display = "block";
            status.style.color = "#16a34a"; // Green for success
            status.innerHTML = "Success! Your message has been sent to Shreesha.";
            form.reset();
            btn.innerHTML = "MESSAGE SENT";
        } else {
            response.json().then(data => {
                status.style.display = "block";
                status.style.color = "#dc3545"; // Red for error
                status.innerHTML = "Oops! There was a problem submitting your form.";
                btn.disabled = false;
                btn.innerHTML = "RETRY SENDING";
            })
        }
    }).catch(error => {
        status.style.display = "block";
        status.style.color = "#dc3545";
        status.innerHTML = "Oops! Connection error. Please try again later.";
        btn.disabled = false;
        btn.innerHTML = "RETRY SENDING";
    });
}
form.addEventListener("submit", handleSubmit);

/**
 * Unified Viewer System
 * Detects layout context and triggers either Side-Panel or Fullscreen Modal
 */
/**
 * openReportModal - Consolidated & Scroll Locked
 */
function openReportModal(title, filePath) {
    const modalElement = document.getElementById('reportViewerModal');
    if (!modalElement) return;

    const modalTitle = document.getElementById('modalReportTitle');
    const modalFrame = document.getElementById('reportFrame');

    // 1. Set Dynamic Content
    modalTitle.innerHTML = `<i class="bi bi-shield-check me-2 text-primary"></i> ${title.toUpperCase()}`;
    modalFrame.src = filePath;

    // 2. Initialize and Show
    const reportModal = new bootstrap.Modal(modalElement);
    reportModal.show();
}

/**
 * Global Scroll Management & Cleanup
 */
document.addEventListener('DOMContentLoaded', function () {
    const modalElement = document.getElementById('reportViewerModal');
    
    if (modalElement) {
        // TRIGGERED WHEN MODAL STARTS TO OPEN
        modalElement.addEventListener('show.bs.modal', function () {
            // Record current scroll position to prevent "jump" on mobile
            const scrollY = window.scrollY;
            document.body.style.top = `-${scrollY}px`;
            document.body.classList.add('modal-open');
        });

        // TRIGGERED WHEN MODAL IS COMPLETELY CLOSED
        modalElement.addEventListener('hidden.bs.modal', function () {
            const modalFrame = document.getElementById('reportFrame');
            
            // 1. Clear Iframe to stop background loading
            if (modalFrame) modalFrame.src = "";
            
            // 2. Unlock Body Scrolling
            const scrollY = document.body.style.top;
            document.body.classList.remove('modal-open');
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.top = "";
            
            // 3. Restore scroll position
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        });
    }
});