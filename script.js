/* ═══════════════════════════════════════════════
   ELESCANO SOTO ABOGADOS — script.js
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. AOS ──────────────────────────────────
    AOS.init({ duration: 1000, once: true });


    // ── 2. NAVBAR SCROLL SHRINK ──────────────────
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (!nav) return;
        if (window.scrollY > 50) {
            nav.style.padding = '10px 0';
            nav.style.background = 'rgba(10,10,10,0.98)';
        } else {
            nav.style.padding = '15px 0';
            nav.style.background = 'rgba(15,15,15,0.95)';
        }
    });


    // ── 3. CERRAR MENÚ MÓVIL AL CLICK ───────────
    const navbarCollapse = document.getElementById('navbarNav');
    const navbarToggler = document.querySelector('.navbar-toggler');

    document.addEventListener('click', (e) => {
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
                bootstrap.Collapse.getInstance(navbarCollapse)?.hide();
            }
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                bootstrap.Collapse.getInstance(navbarCollapse)?.hide();
            }
        });
    });


    // ── 4. BACKDROP MÓVIL ───────────────────────
    const backdrop = document.getElementById('nav-backdrop');

    if (navbarCollapse && backdrop) {
        navbarCollapse.addEventListener('show.bs.collapse', () => {
            backdrop.classList.add('visible');
            document.body.style.overflow = 'hidden';
        });
        navbarCollapse.addEventListener('hide.bs.collapse', () => {
            backdrop.classList.remove('visible');
            document.body.style.overflow = '';
        });
        backdrop.addEventListener('click', () => {
            bootstrap.Collapse.getInstance(navbarCollapse)?.hide();
        });
    }


    // ── 5. ACTIVE NAV SECTION (IntersectionObserver) ──
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active-section');
                    if (link.dataset.section === entry.target.id) {
                        link.classList.add('active-section');
                    }
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(s => sectionObserver.observe(s));


    // ── 6. SCROLL PROGRESS BAR ───────────────────
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        if (!progressBar) return;
        const p = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = p + '%';
    });


    // ── 7. BACK TO TOP ───────────────────────────
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        });
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }


    // ── 8. COUNTER ANIMATION ─────────────────────
    function animateCounter(el) {
        const target = parseInt(el.dataset.target);
        const suffix = target === 9 ? '' : '+';
        let current = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = current + suffix;
        }, 25);
    }

    const statsStrip = document.getElementById('stats-strip');
    if (statsStrip) {
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.stat-number').forEach(el => animateCounter(el));
                    statObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        statObserver.observe(statsStrip);
    }


    // ── 9. GOLD PARTICLES ────────────────────────
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        function createParticle() {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.5 + 0.3,
                dx: (Math.random() - 0.5) * 0.3,
                dy: -Math.random() * 0.4 - 0.1,
                opacity: Math.random() * 0.5 + 0.1
            };
        }

        for (let i = 0; i < 60; i++) particles.push(createParticle());

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(194,163,93,${p.opacity})`;
                ctx.fill();
                p.x += p.dx; p.y += p.dy;
                if (p.y < 0 || p.x < 0 || p.x > canvas.width) {
                    Object.assign(p, createParticle());
                    p.y = canvas.height;
                }
            });
            requestAnimationFrame(drawParticles);
        }
        drawParticles();
    }


    // ── 10. SMOOTH SCROLL ────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });


    // ── 11. EXPERTISE TABS ───────────────────────
    document.querySelectorAll('.expertise-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.expertise-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.expertise-pane').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const pane = document.getElementById(tab.dataset.tab);
            if (pane) pane.classList.add('active');
        });
    });


    // ── 12. PROCESO ACCORDION ────────────────────
    window.toggleStep = function (id) {
        const step = document.getElementById(id);
        if (!step) return;
        const isOpen = step.classList.contains('open');
        document.querySelectorAll('.proceso-step').forEach(s => s.classList.remove('open'));
        if (!isOpen) step.classList.add('open');
    };


    // ── 13. PRACTICE CARD RIPPLE ─────────────────
    // Inyectar keyframe una sola vez
    const styleEl = document.createElement('style');
    styleEl.textContent = `@keyframes rippleAnim { to { transform: scale(3); opacity: 0; } }`;
    document.head.appendChild(styleEl);

    document.querySelectorAll('.practice-card').forEach(card => {
        card.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect   = card.getBoundingClientRect();
            ripple.style.cssText = `
                position: absolute; border-radius: 50%;
                width: 200px; height: 200px;
                background: rgba(194,163,93,0.15);
                left: ${e.clientX - rect.left - 100}px;
                top:  ${e.clientY - rect.top  - 100}px;
                transform: scale(0); pointer-events: none; z-index: 0;
                animation: rippleAnim 0.6s ease forwards;
            `;
            card.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });


    // ── 14. HERO PARALLAX ────────────────────────
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('#heroCarousel');
        if (hero && window.scrollY < window.innerHeight) {
            hero.style.transform = `translateY(${window.scrollY * 0.3}px)`;
        }
    });


    // ── 15. CONTACT MODAL → WHATSAPP ─────────────
    window.submitModal = function () {
        const nombre   = document.getElementById('modalNombre')?.value.trim();
        const telefono = document.getElementById('modalTelefono')?.value.trim();
        const email    = document.getElementById('modalEmail')?.value.trim();
        const area     = document.getElementById('modalArea')?.value;
        const mensaje  = document.getElementById('modalMensaje')?.value.trim();

        if (!nombre || !telefono || !area) {
            showToast('⚠ Por favor complete los campos requeridos.');
            return;
        }

        const text = [
            `*Consulta Legal — Elescano Soto Abogados*`,
            ``,
            `*Nombre:* ${nombre}`,
            `*Teléfono:* ${telefono}`,
            `*Email:* ${email || 'No indicado'}`,
            `*Área:* ${area}`,
            ``,
            `*Descripción:*`,
            mensaje || 'Sin descripción adicional.'
        ].map(encodeURIComponent).join('%0A');

        const modalEl = document.getElementById('contactModal');
        if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();

        showToast('✓ Redirigiendo a WhatsApp...');
        setTimeout(() => {
            window.open(`https://wa.me/51948251204?text=${text}`, '_blank');
        }, 800);
    };


    // ── 16. TOAST ────────────────────────────────
    window.showToast = function (msg) {
        const toast = document.getElementById('form-toast');
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    };

}); // end DOMContentLoaded