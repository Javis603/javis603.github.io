// Main JavaScript file - Extract scripts from index.html to make it more maintainable

// Wait until DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tilt effect for project cards
    const tiltCards = document.querySelectorAll('.tilt-effect');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', tiltEffect);
        card.addEventListener('mouseleave', resetTilt);
    });
    
    function tiltEffect(e) {
        const card = this;
        const cardRect = card.getBoundingClientRect();
        const cardWidth = cardRect.width;
        const cardHeight = cardRect.height;
        const centerX = cardRect.left + cardWidth / 2;
        const centerY = cardRect.top + cardHeight / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        const rotateY = (mouseX / (cardWidth / 2)) * 5;
        const rotateX = -((mouseY / (cardHeight / 2)) * 5);
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
    
    function resetTilt() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    }
    
    // Add project badges
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const categories = card.getAttribute('data-category');
        
        if (categories && categories.includes('ai')) {
            const badge = document.createElement('div');
            badge.className = 'project-badge';
            badge.textContent = 'AI';
            card.appendChild(badge);
        }
    });
    
    // Dynamic copyright year
    const currentYear = new Date().getFullYear();
    const copyrightEl = document.querySelector('.copyright-year');
    
    if (copyrightEl) {
        copyrightEl.textContent = currentYear;
    }
    
    // Fix any navigation issues
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        if (href.startsWith('#')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offset = 100; // Account for fixed header
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without triggering page reload
                    history.pushState(null, null, href);
                }
            });
        }
    });

    // 檢查是否是移動設備
    if (!isMobileDevice()) {
        // 添加跟隨鼠標的元素
        const cursor = document.createElement('div');
        cursor.className = 'cursor-follower';
        document.body.appendChild(cursor);
        
        // 跟隨鼠標移動
        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // 鼠標懸停在鏈接上時的效果
        document.querySelectorAll('a, button, .project-card, .theme-toggle, .back-to-top').forEach(item => {
            item.addEventListener('mouseenter', function() {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.opacity = '0.35';
            });
            
            item.addEventListener('mouseleave', function() {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.opacity = '0.5';
            });
        });
        
        // 鼠標點擊時的效果
        document.addEventListener('mousedown', function() {
            cursor.style.transform = 'translate(-50%, -50%) scale(0.9)';
        });
        
        document.addEventListener('mouseup', function() {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    }
    
    // 添加翻轉卡片效果
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.classList.add('tilt-effect');
    });

    // 確保項目卡片的結構正確
    fixProjectCards();
    
    // 確認 favicon 是否能夠正確載入
    checkFavicon();

    // 確保 favicon 載入
    ensureFaviconLoaded();
    
    function initializePage() {
        initScrollAnimations();
        initProjectFilters();
        initThemeToggle();
        initBackToTop();
        initSmoothScrolling();
        addProjectBadges();
        updateCopyrightYear();
        fixMobileMenuIssues();
        handleResponsiveNavigation();
    }
    
    // 調用初始化函數
    initializePage();
});

// Add page visit counter using localStorage
document.addEventListener('DOMContentLoaded', function() {
    // Check if counter exists in localStorage
    let visitCount = localStorage.getItem('visitCount');
    
    // If it doesn't exist, initialize it
    if (!visitCount) {
        visitCount = 0;
    }
    
    // Increment the counter
    visitCount = parseInt(visitCount) + 1;
    
    // Save the new count to localStorage
    localStorage.setItem('visitCount', visitCount);
    
    // Display the count if the element exists
    const visitCountElement = document.getElementById('visitCount');
    if (visitCountElement) {
        visitCountElement.textContent = visitCount;
    }
});

// 檢查是否是移動設備
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
}

// 優化頁面載入體驗
window.addEventListener('load', function() {
    // 在載入完成後延遲短時間再隱藏 preloader，使過渡更平滑
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
        
        // 添加頁面入場動畫
        document.querySelectorAll('section').forEach((section, index) => {
            setTimeout(() => {
                section.classList.add('appear');
            }, 100 * index);
        });
    }, 300);
});

// 動態調整淺色模式下的配色方案
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            
            // 動態調整項目卡片顏色
            const cards = document.querySelectorAll('.project-card');
            if (document.body.classList.contains('light-theme')) {
                cards.forEach(card => {
                    card.style.boxShadow = '0 10px 30px -15px rgba(0, 0, 0, 0.1)';
                });
            } else {
                cards.forEach(card => {
                    card.style.boxShadow = '';
                });
            }
        });
    }
});

// 修復項目卡片結構
function fixProjectCards() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    
    // 檢查項目卡片的子元素結構
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        // 確保卡片有 tilt-effect 類
        if (!card.classList.contains('tilt-effect')) {
            card.classList.add('tilt-effect');
        }
        
        // 檢查卡片結構是否完整
        if (!card.querySelector('.project-top') || 
            !card.querySelector('.project-title') || 
            !card.querySelector('.project-description') ||
            !card.querySelector('.project-tech')) {
            console.warn('項目卡片結構不完整:', card);
        }
    });
}

// 檢查 favicon 是否能夠載入
function checkFavicon() {
    // 更新路徑檢查，指向 favicon 資料夾
    const faviconLink = document.querySelector('link[rel="shortcut icon"]');
    if (!faviconLink) return;
    
    const img = new Image();
    img.onerror = function() {
        console.warn('Favicon 載入失敗，使用替代 favicon');
        const fallbackFavicon = document.createElement('link');
        fallbackFavicon.rel = 'icon';
        fallbackFavicon.type = 'image/svg+xml';
        fallbackFavicon.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>J</text></svg>';
        document.head.appendChild(fallbackFavicon);
    };
    
    // 碩士使用完整路徑
    img.src = (faviconLink.href.startsWith('http') ? '' : window.location.origin) + faviconLink.href;
}

// 修復移動菜單功能
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('overlay');
    
    if(menuToggle && mobileMenu && overlay) {
        // 確保點擊事件正確觸發
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            mobileMenu.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
            
            const icon = menuToggle.querySelector('i');
            if(mobileMenu.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        // 確保點擊連結時關閉選單
        const mobileLinks = document.querySelectorAll('.mobile-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                overlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
                menuToggle.querySelector('i').className = 'fas fa-bars';
            });
        });
        
        // 點擊覆蓋層時關閉選單
        overlay.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
            menuToggle.querySelector('i').className = 'fas fa-bars';
        });
    }
    
    // 修復主題切換功能
    const themeToggle = document.getElementById('themeToggle');
    if(themeToggle) {
        const themeIcon = themeToggle.querySelector('i');
        
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            
            // 更新圖示
            if(document.body.classList.contains('light-theme')) {
                themeIcon.className = 'fas fa-sun';
            } else {
                themeIcon.className = 'fas fa-moon';
            }
            
            // 儲存主題選擇
            localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
            
            // 調整淺色模式下的樣式
            adjustLightModeStyles();
        });
        
        // 載入保存的主題設定
        const savedTheme = localStorage.getItem('theme');
        if(savedTheme === 'light') {
            document.body.classList.add('light-theme');
            themeIcon.className = 'fas fa-sun';
            
            // 應用淺色模式樣式
            adjustLightModeStyles();
        }
    }
});

// 修改主題切換函數 - 確保顏色正確重置
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const themeIcon = themeToggle.querySelector('i');
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-theme');
        
        // 更新圖示
        if (document.body.classList.contains('light-theme')) {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
        
        // 儲存主題選擇
        localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
        
        // 重要: 移除所有可能的內聯樣式，使用CSS變量來處理
        document.querySelectorAll('nav a, .logo, .project-card, .social-links a').forEach(el => {
            el.removeAttribute('style');
        });
    });
    
    // 載入保存的主題設定
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeIcon.className = 'fas fa-sun';
    }
}

// 淺色模式下調整樣式
function adjustLightModeStyles() {
    // 使用CSS變量和類來控制樣式，而不是內聯樣式
}

// 頁面加載時確保樣式正確設置
document.addEventListener('DOMContentLoaded', function() {
    // 應用當前主題的樣式
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
    }
});

// 改進對手機裝置的適配性
window.addEventListener('load', function() {
    // 判斷是否為手機裝置
    if(window.innerWidth <= 768) {
        // 手機裝置專用調整
        adjustForMobileDevices();
    }
    
    // 調整大小時重新檢查
    window.addEventListener('resize', function() {
        if(window.innerWidth <= 768) {
            adjustForMobileDevices();
        }
    });
});

// 手機裝置專用調整
function adjustForMobileDevices() {
    // 調整項目卡片顯示
    document.querySelectorAll('.project-card').forEach(card => {
        card.style.height = 'auto';
        // 確保卡片有適當的邊距和佈局
        card.style.margin = '0 auto 2rem';
        card.style.width = '94%';
        card.style.maxWidth = '400px';
    });
    
    // 確保漢堡選單在正確位置
    const menuToggle = document.getElementById('menuToggle');
    if(menuToggle) {
        menuToggle.style.display = 'flex';
        menuToggle.style.zIndex = '110';
        menuToggle.style.position = 'absolute';
        menuToggle.style.right = '1.5rem';
        menuToggle.style.top = '50%';
        menuToggle.style.transform = 'translateY(-50%)';
    }
    
    // 調整 hero 區塊的間距，確保不貼邊
    const heroContent = document.querySelector('.hero-content');
    if(heroContent) {
        heroContent.style.margin = '0 auto';
        heroContent.style.width = '94%';
        heroContent.style.maxWidth = '800px';
    }
    
    // 調整內容區塊，避免貼邊
    document.querySelectorAll('.section').forEach(section => {
        const container = section.querySelector('.container');
        if(container) {
            container.style.padding = '0 1rem';
        }
    });
    
    // 調整社交連結顯示
    const socialLinks = document.querySelector('.social-links');
    if(socialLinks) {
        socialLinks.style.position = 'static';
        socialLinks.style.margin = '3rem auto 1rem';
        socialLinks.style.padding = '1rem 0';
        socialLinks.style.background = 'none';
        socialLinks.style.boxShadow = 'none';
    }
}

// 優化頁面滾動體驗
window.addEventListener('load', function() {
    // 針對移動設備的專門調整
    if(window.innerWidth <= 768) {
        adjustForMobileDevices();
    }
});

// 調整窗口大小時重新適配
window.addEventListener('resize', function() {
    if(window.innerWidth <= 768) {
        adjustForMobileDevices();
    }
});

// 改進手機裝置上的菜單處理
function handleMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('overlay');
    
    if (!menuToggle || !mobileMenu || !overlay) return;
    
    // 移除之前可能存在的事件監聴器以避免重複
    menuToggle.removeEventListener('click', toggleMobileMenu);
    menuToggle.addEventListener('click', toggleMobileMenu);
    
    // 為移動菜單添加社交鏈接
    addSocialLinksToMobileMenu();
    
    function toggleMobileMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        
        mobileMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        
        // 更改漢堡圖標，保持在原位置
        const icon = menuToggle.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    }
    
    // 點擊背景關閉菜單
    overlay.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
        
        const icon = menuToggle.querySelector('i');
        icon.className = 'fas fa-bars';
        icon.style.transform = 'rotate(0deg)';
    });
    
    // 點擊鏈接時關閉菜單
    const mobileLinks = document.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
            
            const icon = menuToggle.querySelector('i');
            icon.className = 'fas fa-bars';
            icon.style.transform = 'rotate(0deg)';
        });
    });
}

// 為移動菜單添加社交鏈接
function addSocialLinksToMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (!mobileMenu) return;
    
    // 移除已有的社交鏈接區塊以避免重複
    const existingSocialLinks = mobileMenu.querySelector('.mobile-social-links');
    if (existingSocialLinks) {
        existingSocialLinks.remove();
    }
    
    // 從頁腳複製社交鏈接
    const footerSocialLinks = document.querySelector('footer .social-links');
    if (!footerSocialLinks) return;
    
    const socialLinksContainer = document.createElement('div');
    socialLinksContainer.className = 'mobile-social-links';
    socialLinksContainer.innerHTML = footerSocialLinks.innerHTML;
    
    mobileMenu.appendChild(socialLinksContainer);
}

// 調整頁面初始載入時的行為
window.addEventListener('load', function() {
    // 處理移動菜單
    handleMobileMenu();
    
    // 當窗口大小改變時重新處理菜單
    window.addEventListener('resize', function() {
        handleMobileMenu();
        
        // 調整內容對齊
        adjustContentMargins();
    });
    
    // 立即調整內容邊距
    adjustContentMargins();
});

// 優化內容邊距，避免太貼近邊緣
function adjustContentMargins() {
    if (window.innerWidth <= 768) {
        // 調整 Hero 區塊
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.margin = '0 auto';
            heroContent.style.maxWidth = '100%';
            heroContent.style.width = 'calc(100% - 1rem)';
        }
        
        // 調整項目卡片
        document.querySelectorAll('.project-card').forEach(card => {
            card.style.margin = '0 auto 2rem';
        });
    }
}

// 確保 favicon 能夠正常加載，如果不能則提供一個備用方案
function ensureFaviconLoaded() {
    // 檢查是否有 favicon
    const faviconLink = document.querySelector('link[rel="shortcut icon"]');
    if (!faviconLink) return;
    
    // 測試 favicon 是否能夠載入
    const img = new Image();
    img.onerror = function() {
        console.warn('Favicon 載入失敗，使用備用方案');
        
        // 創建備用 favicon (內嵌 SVG)
        const fallbackFavicon = document.createElement('link');
        fallbackFavicon.rel = 'icon';
        fallbackFavicon.type = 'image/svg+xml';
        fallbackFavicon.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90" font-weight="bold" font-family="monospace" text-anchor="middle" x="50" dominant-baseline="middle" fill="%2364ffda">J</text></svg>';
        document.head.appendChild(fallbackFavicon);
    };
    
    // 嘗試加載 favicon
    img.src = (faviconLink.href.startsWith('http') ? '' : window.location.origin) + faviconLink.href;
}

// 光明/黑暗模式切換時更新 favicon 顏色
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const isLightTheme = document.body.classList.contains('light-theme');
            
            // 檢查是否使用的是 SVG favicon (備用方案)
            const svgFavicon = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
            if (svgFavicon) {
                // 根據主題更新 SVG favicon 顏色
                const fillColor = isLightTheme ? '%23007ea7' : '%2364ffda';
                svgFavicon.href = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90" font-weight="bold" font-family="monospace" text-anchor="middle" x="50" dominant-baseline="middle" fill="${fillColor}">J</text></svg>`;
            }
        });
    }
});

// 主題切換功能修復
document.addEventListener('DOMContentLoaded', function() {
    // 獲取主題切換按鈕
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        // 移除可能的多重事件監聽器
        themeToggle.replaceWith(themeToggle.cloneNode(true));
        
        // 重新獲取複製後的元素
        const newThemeToggle = document.getElementById('themeToggle');
        const themeIcon = newThemeToggle.querySelector('i');
        
        // 檢查當前主題
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'light') {
            document.body.classList.add('light-theme');
            if (themeIcon) themeIcon.className = 'fas fa-sun';
        }
        
        // 綁定點擊事件
        newThemeToggle.addEventListener('click', function() {
            console.log('Theme toggle clicked');
            document.body.classList.toggle('light-theme');
            
            // 更新圖示
            if (document.body.classList.contains('light-theme')) {
                themeIcon.className = 'fas fa-sun';
            } else {
                themeIcon.className = 'fas fa-moon';
            }
            
            // 儲存到 localStorage
            const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('theme', theme);
            
            // 應用主題變數
            applyThemeColors();
        });
    }
});

// 套用主題顏色
function applyThemeColors() {
    if (document.body.classList.contains('light-theme')) {
        document.documentElement.style.setProperty('--dark-bg', '#f8f9fa');
        document.documentElement.style.setProperty('--light-bg', '#ffffff');
        document.documentElement.style.setProperty('--text-primary', '#2d3748');
        document.documentElement.style.setProperty('--text-secondary', '#4a5568');
        document.documentElement.style.setProperty('--highlight', '#0f83adde');
    } else {
        document.documentElement.style.setProperty('--dark-bg', '#0a192f');
        document.documentElement.style.setProperty('--light-bg', '#112240');
        document.documentElement.style.setProperty('--text-primary', '#e6f1ff');
        document.documentElement.style.setProperty('--text-secondary', '#a8b2d1');
        document.documentElement.style.setProperty('--highlight', '#64ffda');
    }
}

// 修復行動裝置上終端機顯示
document.addEventListener('DOMContentLoaded', function() {
    // 檢測是否為行動裝置
    if (window.innerWidth <= 768) {
        const typingText = document.querySelector('.typing-text');
        if (typingText) {
            // 移除打字動畫效果，直接顯示全部文字
            typingText.style.animation = 'blink 1s infinite';
            typingText.style.width = '100%';
            typingText.style.whiteSpace = 'pre-wrap';
            typingText.style.borderRight = '2px solid var(--highlight)';
        }
    }
    
    // 也處理窗口大小改變的情況
    window.addEventListener('resize', function() {
        const typingText = document.querySelector('.typing-text');
        if (!typingText) return;
        
        if (window.innerWidth <= 768) {
            typingText.style.animation = 'blink 1s infinite';
            typingText.style.width = '100%';
            typingText.style.whiteSpace = 'pre-wrap';
        } else {
            typingText.style.animation = 'typing 4s steps(44) 1s forwards, blink 1s infinite';
            typingText.style.width = '0';
            typingText.style.whiteSpace = 'nowrap';
        }
    });
});

// 添加處理視窗大小變化的函數
window.addEventListener('resize', function() {
    handleResponsiveNavigation();
    
    // 保留現有功能
    if(window.innerWidth <= 768) {
        adjustForMobileDevices();
    }
});

// 處理響應式導航
function handleResponsiveNavigation() {
    const hamburger = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (window.innerWidth > 768) {
        // 電腦版模式
        if (hamburger) hamburger.style.display = 'none';
        if (navLinks) navLinks.style.display = 'flex';
        
        // 如果手機選單是打開的，則關閉它
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            document.getElementById('overlay').classList.remove('active');
            document.body.classList.remove('no-scroll');
            
            // 重置漢堡按鈕圖標
            if (hamburger && hamburger.querySelector('i')) {
                hamburger.querySelector('i').className = 'fas fa-bars';
            }
        }
    } else {
        // 手機版模式
        if (hamburger) {
            hamburger.style.display = 'flex';
            // 調整漢堡按鈕位置
            hamburger.style.position = 'absolute';
            hamburger.style.right = '1.5rem';
            hamburger.style.top = '50%';
            hamburger.style.transform = 'translateY(-50%)';
        }
        if (navLinks) navLinks.style.display = 'none';
    }
}

// 頁面載入時初始化導航設置
document.addEventListener('DOMContentLoaded', function() {
    // 初始化導航設置
    handleResponsiveNavigation();
    
    // 改進漢堡按鈕的點擊事件，確保關閉按鈕在相同位置
    const menuToggle = document.getElementById('menuToggle');
    if(menuToggle) {
        menuToggle.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon) {
                // 切換圖標並保持位置不變
                if (icon.className.includes('fa-bars')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            }
        });
    }
});

// 提供更流暢的導航欄縮放體驗
function smoothNavbarTransition() {
    // 先判斷當前視窗大小
    const currentWidth = window.innerWidth;
    const hamburger = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (currentWidth > 768) {
        // 電腦版: 隱藏漢堡按鈕，顯示導航鏈接
        if (hamburger) {
            hamburger.style.opacity = '0';
            setTimeout(() => {
                hamburger.style.display = 'none';
                hamburger.style.opacity = '1';
            }, 200);
        }
        
        if (navLinks) {
            navLinks.style.display = 'flex';
            setTimeout(() => {
                navLinks.style.opacity = '1';
            }, 50);
        }
    } else {
        // 手機版: 顯示漢堡按鈕，隱藏導航鏈接
        if (hamburger) {
            hamburger.style.display = 'flex';
            hamburger.style.position = 'absolute';
            hamburger.style.right = '1.5rem';
            hamburger.style.top = '50%';
            hamburger.style.transform = 'translateY(-50%)';
        }
        
        if (navLinks) {
            navLinks.style.opacity = '0';
            setTimeout(() => {
                navLinks.style.display = 'none';
            }, 200);
        }
    }
}

// 改進頁面加載時的導航處理
window.addEventListener('load', function() {
    handleResponsiveNavigation();
    
    // 針對移動設備的專門調整
    if(window.innerWidth <= 768) {
        adjustForMobileDevices();
    }
});
