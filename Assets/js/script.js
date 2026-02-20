document.addEventListener('DOMContentLoaded', () => {
    // 1. Set Current Year Dynamically
    const yearSpan = document.getElementById('year');
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Theme Toggle Logic
    const htmlEl = document.documentElement; 
    const icon = document.getElementById('theme-icon');
    const toggleBtn = document.getElementById('theme-toggle-btn');
    
    // Check local storage or default to dark
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

    // =========================================================
    // 3. FIXED: Active Link Highlighting (Netlify Compatible)
    // =========================================================
    const path = window.location.pathname;
    // Get the last part of the URL (e.g., "about.html" or "about" or "")
    const page = path.split("/").pop(); 

    document.querySelectorAll('.nav-link, .bottom-nav-link').forEach(link => {
        const href = link.getAttribute('href'); 
        
        // Remove .html from both sides for comparison to handle Netlify "Clean URLs"
        // e.g., turns "about.html" into "about"
        const cleanHref = href.replace('.html', '');
        const cleanPage = page.replace('.html', '');

        // Case 1: Root URL ("/" or empty) maps to index.html
        if ((path === "/" || page === "") && href === "index.html") {
            link.classList.add('active');
        }
        // Case 2: Match filename (ignoring .html extension)
        else if (cleanPage === cleanHref) {
            link.classList.add('active');
        }
    });

    // 4. Contact Form (Mailto)
    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Construct Email Body
            const subject = `Portfolio Contact from ${name}`;
            const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
            
            // Open Email Client
            window.location.href = `mailto:bsshreesha0511@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    }

    // 5. Security (Disable Right Click / F12 / View Source)
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
        if(
            e.key === "F12" || 
            (e.ctrlKey && e.key === 'u') || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') || 
            (e.ctrlKey && e.shiftKey && e.key === 'J') ||
            (e.ctrlKey && e.key === 's')
        ) {
            e.preventDefault();
        }
    });
});