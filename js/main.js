document.addEventListener('DOMContentLoaded', () => {
    initSpotlightEffect();
    initMobileMenu();
    initVisitorCounter();
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

    // 處理卡片點擊 (讓整張卡片都可點擊)
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
   2. Mobile Menu (已更新：支援關閉按鈕)
---------------------------------------------------------------- */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeBtn = document.querySelector('.close-menu'); // 新增：獲取關閉按鈕
    const menuLinks = document.querySelectorAll('.mobile-menu a');

    if (!hamburger) return; 

    // 切換選單狀態 (Toggle)
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

    // 關閉選單函數
    const closeMenu = () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    };

    // 點擊 X 按鈕關閉
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }

    // 點擊連結後自動關閉選單
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

/* ----------------------------------------------------------------
   3. Visitor Counter (使用 CountAPI + 數字滾動動畫)
---------------------------------------------------------------- */
function initVisitorCounter() {
    const counterElement = document.getElementById('visit-count');
    const NAMESPACE = 'javis-ai.com';
    const KEY = 'visits';

    // 預設顯示載入中
    if (!counterElement) return;

    fetch(`https://api.countapi.xyz/hit/${NAMESPACE}/${KEY}`)
        .then(response => response.json())
        .then(data => {
            // 執行數字滾動動畫
            animateValue(counterElement, 0, data.value, 2000);
        })
        .catch(err => {
            console.error('Counter Error:', err);
            counterElement.innerText = '1,024'; // 發生錯誤時的 fallback 數字
        });
}

// 數字滾動動畫工具函數
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // 緩動效果 (Ease Out)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const currentVal = Math.floor(easeProgress * (end - start) + start);
        obj.innerHTML = currentVal.toLocaleString();
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

/* ----------------------------------------------------------------
   4. Smooth Scroll (平滑滾動優化)
---------------------------------------------------------------- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // 因為我們已經在 CSS 用了 scroll-padding-top，這裡可以直接用 scrollIntoView
                // 這裡使用基本計算作為保險
                const headerOffset = 100;
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
