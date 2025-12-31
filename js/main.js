document.addEventListener('DOMContentLoaded', () => {
    initSpotlightEffect();
    initMobileMenu();
    // initVisitorCounter(); // 已移除：改用不蒜子 (Busuanzi) 外部腳本自動處理
    initSmoothScroll();
});

/* ----------------------------------------------------------------
   1. Spotlight Effect (Bento Grid 滑鼠追蹤光暈)
---------------------------------------------------------------- */
function initSpotlightEffect() {
    const spotlights = document.querySelectorAll('.spotlight');
    
    document.addEventListener('mousemove', (e) => {
        spotlights.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // 設定 CSS 變數，讓 radial-gradient 跟隨滑鼠
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 處理卡片點擊 (讓整張卡片都可點擊，但避開內部連結)
    document.querySelectorAll('.bento-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // 如果點擊的是裡面的連結或按鈕，不觸發整卡跳轉
            if (e.target.closest('a') || e.target.closest('button')) return;

            const url = card.getAttribute('data-url');
            if (url && url !== '#') {
                window.open(url, '_blank');
            }
        });
    });
}

/* ----------------------------------------------------------------
   2. Mobile Menu (手機版選單邏輯 - 含關閉按鈕)
---------------------------------------------------------------- */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeBtn = document.querySelector('.close-menu');
    const menuLinks = document.querySelectorAll('.mobile-menu a');

    if (!hamburger) return; 

    // 切換選單狀態 (開啟/關閉)
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // 鎖定/解鎖背景滾動
        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // 定義關閉選單函數
    const closeMenu = () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    };

    // 點擊 X 按鈕關閉
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }

    // 點擊任一連結後自動關閉選單
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

/* ----------------------------------------------------------------
   3. Smooth Scroll (平滑滾動優化)
---------------------------------------------------------------- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // 扣除導航列高度 (配合 CSS 的 scroll-padding-top)
                const headerOffset = 80; 
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
}
