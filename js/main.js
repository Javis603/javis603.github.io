/* ========================================
   Javis Ng — Portfolio v2 Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initTilt();
    initDecrypt();
    initMagnetic();
    initMobileMenu();
    initSmoothScroll();
});

/* ── 1. Scroll Reveal ──────────────────── */
function initReveal() {
    const els = document.querySelectorAll('[data-reveal]');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => entry.target.classList.add('visible'), delay);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    els.forEach(el => obs.observe(el));
}

/* ── 2. 3D Tilt ────────────────────────── */
function initTilt() {
    if ('ontouchstart' in window) return;
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width;
            const y = (e.clientY - r.top) / r.height;
            card.style.transform =
                `perspective(800px) rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * 5}deg) scale3d(1.01,1.01,1.01)`;
        });
        card.addEventListener('mouseenter', () => { card.style.transition = 'transform .15s ease-out'; });
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform .4s var(--ease)';
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)';
        });
    });
}

/* ── 3. Decrypted Text ─────────────────── */
function initDecrypt() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    document.querySelectorAll('[data-decrypt]').forEach(el => {
        const original = el.textContent;
        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { scramble(el, original, chars); obs.unobserve(el); }
            });
        }, { threshold: 0.5 });
        obs.observe(el);
    });
}

function scramble(el, original, chars) {
    let i = 0;
    const iv = setInterval(() => {
        el.textContent = original.split('').map((c, idx) => {
            if (c === ' ') return ' ';
            return idx < i ? original[idx] : chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        i += 0.5;
        if (i >= original.length) { el.textContent = original; clearInterval(iv); }
    }, 30);
}

/* ── 4. Magnetic Buttons ───────────────── */
function initMagnetic() {
    if ('ontouchstart' in window) return;
    document.querySelectorAll('[data-magnetic]').forEach(el => {
        el.addEventListener('mousemove', e => {
            const r = el.getBoundingClientRect();
            el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.15}px,${(e.clientY - r.top - r.height / 2) * 0.15}px)`;
        });
        el.addEventListener('mouseenter', () => { el.style.transition = 'transform .15s ease-out'; });
        el.addEventListener('mouseleave', () => {
            el.style.transition = 'transform .4s var(--ease)';
            el.style.transform = 'translate(0,0)';
        });
    });
}

/* ── 5. Mobile Menu — Dropdown card ────── */
function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const dropdown = document.querySelector('.nav-dropdown');
    if (!toggle || !dropdown) return;

    const shut = () => { dropdown.classList.remove('open'); toggle.classList.remove('open'); };

    toggle.addEventListener('click', e => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
        toggle.classList.toggle('open');
    });

    dropdown.querySelectorAll('a').forEach(a => a.addEventListener('click', shut));

    document.addEventListener('click', e => {
        if (!toggle.contains(e.target) && !dropdown.contains(e.target)) shut();
    });
}

/* ── 6. Smooth Scroll ──────────────────── */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            const id = this.getAttribute('href');
            if (id === '#') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
            const el = document.querySelector(id);
            if (el) {
                window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
            }
        });
    });
}
