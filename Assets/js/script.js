document.addEventListener('DOMContentLoaded', () => {
    // 1. Set Current Year
    const yearSpan = document.getElementById('year');
    if(yearSpan) yearSpan.textContent = new Date().getFullYear();

    // 2. Theme Toggle Logic (Existing Code)
    const htmlEl = document.documentElement; 
    const icon = document.getElementById('theme-icon');
    const toggleBtn = document.getElementById('theme-toggle-btn');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    updateIcon(currentTheme);

    if(toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const current = htmlEl.getAttribute('data-theme');
            const newTheme = current === 'dark' ? 'light' : 'dark';
            htmlEl.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateIcon(newTheme);
        });
    }

    function updateIcon(theme) {
        if(theme === 'dark') {
            if(icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
        } else {
            if(icon) { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
        }
    }

    // 3. Highlight Active Links (Sidebar, Bottom Nav & Drop-up Menu)
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll('.nav-link, .bottom-nav-link, .menu-item').forEach(link => {
        // Handle clean URLs (e.g., netlify)
        const href = link.getAttribute('href');
        if(href === currentPath || href === "") {
            link.classList.add('active');
            
            // If the active link is inside the "More" menu, highlight the "More" button too
            if(link.classList.contains('menu-item')) {
                document.getElementById('mobile-menu-btn').classList.add('active');
            }
        }
    });

    // 4. Mobile Menu Toggle Logic
    const menuBtn = document.getElementById('mobile-menu-btn');
    const menuOverlay = document.getElementById('mobile-menu-overlay');

    if(menuBtn && menuOverlay) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent immediate closing
            menuOverlay.classList.toggle('show');
            
            // Toggle Icon style
            const icon = menuBtn.querySelector('i');
            if(menuOverlay.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuOverlay.contains(e.target) && !menuBtn.contains(e.target)) {
                menuOverlay.classList.remove('show');
                menuBtn.querySelector('i').classList.remove('fa-times');
                menuBtn.querySelector('i').classList.add('fa-bars');
            }
        });
    }

    // 5. Contact Form (Existing Code)
    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            window.location.href = `mailto:bsshreesha0511@gmail.com?subject=Contact from ${name}&body=${message}\n\nReply to: ${email}`;
        });
    }

    // 6. Security (Existing Code)
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
        if(e.key === "F12" || (e.ctrlKey && e.key === 'u') || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
            e.preventDefault();
        }
    });

    // ... existing code ...

    // =========================================================
    // 6. CUSTOM CURSOR LOGIC
    // =========================================================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // Only activate on Desktop
    if (window.matchMedia("(min-width: 992px)").matches && cursorDot && cursorOutline) {
        
        // Show cursors
        cursorDot.style.display = 'block';
        cursorOutline.style.display = 'block';

        window.addEventListener('mousemove', function (e) {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows immediately
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with slight lag (smooth animation)
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Add Hover Effect for Links & Buttons
        const interactables = document.querySelectorAll('a, button, .nav-link, .btn-resume, input, textarea');
        
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('hovering');
                // Optional: Scale up the dot slightly
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
            });
            
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovering');
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }
});