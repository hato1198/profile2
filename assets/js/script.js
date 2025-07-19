// --- Page Load Handler ---
if (window.location.hash) {
    window.location.replace(window.location.pathname + window.location.search);
} else {
    // --- The main script runs only when the page loads without a hash ---

    document.addEventListener('DOMContentLoaded', () => {

        const body = document.body;
        const mobileNav = document.querySelector('.mobile-nav');

        // --- On Load: Force scroll to top and start intro animation ---
        const initPage = () => {
            if (history.scrollRestoration) {
                history.scrollRestoration = 'manual';
            }
            window.scrollTo(0, 0);

            body.classList.add('no-scroll');

            // Intro Animation Sequence
            setTimeout(() => body.classList.add('anim-step-1'), 100);    // 1. Image wipe in
            setTimeout(() => body.classList.add('anim-step-2'), 1100);   // 2. Name slide in
            setTimeout(() => body.classList.add('loaded'), 2200);        // 3. Shrink hero
            setTimeout(() => body.classList.remove('no-scroll'), 3000);  // 4. Enable scroll
        };
        
        initPage();

        // --- Scroll Animation Logic ---
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');

                    // Apply staggered delay to children if any
                    const staggerChildren = entry.target.querySelectorAll('.stagger-child');
                    if (staggerChildren.length > 0) {
                        staggerChildren.forEach((child, index) => {
                            child.style.transitionDelay = `${index * 100}ms`;
                            child.addEventListener('transitionend', () => {
                                child.style.transitionDelay = null;
                            }, { once: true });
                        });
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            rootMargin: "0px 0px -250px 0px",
            threshold: 0
        });
        document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));


        // --- Sidebar Logic ---
        const sidebar = document.querySelector('.sidebar');
        const hero = document.querySelector('#hero');
        if (sidebar && hero) {
            const handleScroll = () => {
                const heroBottom = hero.getBoundingClientRect().bottom;
                sidebar.classList.toggle('scrolled', heroBottom < 20);
            };
            window.addEventListener('scroll', handleScroll, { passive: true });
        }

        // --- Hamburger Menu Logic ---
        const hamburgerBtn = document.querySelector('.hamburger-button');
        const navOverlay = document.querySelector('.nav-overlay');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

        const toggleMenu = () => {
            hamburgerBtn.classList.toggle('active');
            mobileNav.classList.toggle('active');
            navOverlay.classList.toggle('active');
            body.classList.toggle('no-scroll');
        };

        if (hamburgerBtn && mobileNav && navOverlay) {
            hamburgerBtn.addEventListener('click', toggleMenu);
            navOverlay.addEventListener('click', toggleMenu);
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (mobileNav.classList.contains('active')) {
                        toggleMenu();
                    }
                });
            });
        }

        // --- Downloads & Websites Modal Logic ---
        const modalTriggerCards = document.querySelectorAll('.download-card, .website-card');
        const modalContainer = document.getElementById('modal-container');
        const modalCloseBtn = document.querySelector('.modal-close-button');
        
        if (modalContainer) {
            modalTriggerCards.forEach(card => {
                card.addEventListener('click', () => {
                    const title = card.dataset.title;
                    const imgSrc = card.querySelector('img').src;
                    const bodyHTML = card.querySelector('.card-body-hidden').innerHTML;
                    const linkHref = card.dataset.link;
                    const linkText = card.dataset.linkText;

                    document.getElementById('modal-image').src = imgSrc;
                    document.getElementById('modal-title').textContent = title;
                    document.getElementById('modal-body').innerHTML = bodyHTML;
                    const modalLink = document.getElementById('modal-link');
                    modalLink.href = linkHref;
                    modalLink.textContent = linkText;
                    
                    // If link is empty (e.g., for "開発中" items), disable the button or change its style
                    if (linkHref === "") {
                        modalLink.style.pointerEvents = "none";
                        modalLink.style.opacity = "0.5";
                        modalLink.style.cursor = "not-allowed";
                    } else {
                        modalLink.style.pointerEvents = "auto";
                        modalLink.style.opacity = "1";
                        modalLink.style.cursor = "pointer";
                    }


                    modalContainer.classList.add('visible');
                    body.classList.add('no-scroll');
                });
            });

            const closeModal = () => {
                modalContainer.classList.remove('visible');
                // Only remove no-scroll if mobile menu is not active
                if (!mobileNav.classList.contains('active')) {
                    body.classList.remove('no-scroll');
                }
            };

            modalCloseBtn.addEventListener('click', closeModal);
            modalContainer.addEventListener('click', (e) => {
                if (e.target === modalContainer) {
                    closeModal();
                }
            });
        }

        // --- Link Favicon Logic ---
        const linkList = document.querySelector('.link-list');
        if (linkList) {
            linkList.querySelectorAll('a').forEach(link => {
                try {
                    const domain = new URL(link.href).hostname;
                    let faviconUrl;

                    if (domain === 'booth.pm' || domain.endsWith('.booth.pm')) {
                        faviconUrl = `https://www.google.com/s2/favicons?sz=32&domain_url=booth.pm`; 
                    } else {
                        faviconUrl = `https://www.google.com/s2/favicons?sz=32&domain_url=${domain}`;
                    }
                    
                    const faviconImg = document.createElement('img');
                    faviconImg.src = faviconUrl;
                    faviconImg.alt = ``;
                    faviconImg.style.width = '16px';
                    faviconImg.style.height = '16px';
                    faviconImg.style.verticalAlign = 'middle';

                    link.prepend(faviconImg);
                } catch (error) {
                    console.error('Invalid URL for favicon:', link.href, error);
                }
            });
        }

        // --- Page Top Button Logic ---
        const pageTopBtn = document.getElementById('page-top-btn');
        if (pageTopBtn) {
            const showOnPx = 400;

            const handleScrollForBtn = () => {
                if (window.scrollY > showOnPx) {
                    pageTopBtn.classList.add('visible');
                } else {
                    pageTopBtn.classList.remove('visible');
                }
            };
            
            window.addEventListener('scroll', handleScrollForBtn, { passive: true });
        }
    });
}