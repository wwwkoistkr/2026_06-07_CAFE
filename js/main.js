/**
 * Slow Brew Cafe - Main Interactivity Engine
 */

import { menuItems, renderMenu } from './menu.js';

// Global state
let currentCategory = "all";
let searchQuery = "";
let dbReservations = JSON.parse(localStorage.getItem('slow_brew_reservations') || '[]');

document.addEventListener('DOMContentLoaded', () => {
  // Initialize standard controls
  initNavigation();
  initTheme();
  initMenuFilters();
  initReservations();
  initDirections();
  initBrandStory();
  
  // Render initial menu
  renderMenu(menuItems, "menu-items-grid", currentCategory, searchQuery);
});

/**
 * Navigation, Scroll Effect & Mobile Menu
 */
function initNavigation() {
  const nav = document.querySelector('nav');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Nav Scroll Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('shadow-md', 'py-3', 'bg-background/95');
      nav.classList.remove('py-stack-md', 'bg-background/80');
    } else {
      nav.classList.remove('shadow-md', 'py-3', 'bg-background/95');
      nav.classList.add('py-stack-md', 'bg-background/80');
    }
  });

  // Mobile menu toggle
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      const icon = mobileMenuBtn.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.textContent = mobileMenu.classList.contains('hidden') ? 'menu' : 'close';
      }
    });
  }

  // Smooth scroll and active state setup
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Close mobile menu if open
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        if (mobileMenuBtn) {
          const icon = mobileMenuBtn.querySelector('.material-symbols-outlined');
          if (icon) icon.textContent = 'menu';
        }
      }

      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 100;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });

          // Set active state visually
          navLinks.forEach(l => {
            l.className = l.className.replace('text-primary font-medium border-b border-primary pb-1', 'text-on-surface-variant hover:text-primary');
          });
          link.className = link.className.replace('text-on-surface-variant hover:text-primary', 'text-primary font-medium border-b border-primary pb-1');
        }
      }
    });
  });
}

/**
 * Light / Dark Mode Toggle using Tailwind document classes
 */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile-btn');
  const htmlEl = document.documentElement;

  // Initialize from preference
  const savedTheme = localStorage.getItem('slow-brew-theme') || 'light';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    if (theme === 'dark') {
      htmlEl.classList.add('dark');
      htmlEl.classList.remove('light');
    } else {
      htmlEl.classList.add('light');
      htmlEl.classList.remove('dark');
    }
    
    // Update labels/icons
    const updateIcon = (btn) => {
      if (!btn) return;
      const iconSpan = btn.querySelector('.material-symbols-outlined');
      const textSpan = btn.querySelector('.theme-text');
      if (iconSpan) {
        iconSpan.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
      }
      if (textSpan) {
        textSpan.textContent = theme === 'dark' ? '라이트 모드' : '다크 모드';
      }
    };
    updateIcon(themeToggleBtn);
    updateIcon(themeToggleMobileBtn);
    
    localStorage.setItem('slow-brew-theme', theme);
  }

  const toggleTheme = () => {
    const nextTheme = htmlEl.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(nextTheme);
  };

  if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
  if (themeToggleMobileBtn) themeToggleMobileBtn.addEventListener('click', toggleTheme);
}

/**
 * Menu Category Switching & Search Interaction
 */
function initMenuFilters() {
  const filterButtons = document.querySelectorAll('.menu-filter-btn');
  const searchInput = document.getElementById('menu-search');
  const clearSearchBtn = document.getElementById('clear-search-btn');

  // Filter Categories
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('bg-primary-container', 'text-on-primary', 'shadow-sm');
        b.classList.add('bg-surface-container-low', 'text-on-surface-variant', 'hover:bg-surface-container-high');
      });

      btn.classList.add('bg-primary-container', 'text-on-primary', 'shadow-sm');
      btn.classList.remove('bg-surface-container-low', 'text-on-surface-variant', 'hover:bg-surface-container-high');

      currentCategory = btn.getAttribute('data-category');
      renderMenu(menuItems, "menu-items-grid", currentCategory, searchQuery);
    });
  });

  // Live Search
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      
      if (searchQuery.length > 0) {
        clearSearchBtn.classList.remove('hidden');
      } else {
        clearSearchBtn.classList.add('hidden');
      }
      
      renderMenu(menuItems, "menu-items-grid", currentCategory, searchQuery);
    });
  }

  // Clear search input
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = "";
      searchQuery = "";
      clearSearchBtn.classList.add('hidden');
      searchInput.focus();
      renderMenu(menuItems, "menu-items-grid", currentCategory, searchQuery);
    });
  }
}

/**
 * Real Multi-Reservations System using localStorage
 */
function initReservations() {
  const bookingBtns = document.querySelectorAll('.booking-trigger-btn');
  const bookingModal = document.getElementById('booking-modal');
  const closeModalBtn = document.getElementById('close-booking-modal');
  const bookingForm = document.getElementById('booking-form');
  const viewReservationsBtn = document.getElementById('view-reservations-btn');
  const listModal = document.getElementById('reservations-list-modal');
  const closeListModalBtn = document.getElementById('close-list-modal');
  
  // Custom alerts (substitute alerts/window.open to comply with frame rules)
  const customAlert = (title, message, type = "success") => {
    const container = document.getElementById('reservation-alert-container');
    if (!container) return;
    
    const colors = type === "success" 
      ? "bg-secondary-container text-on-secondary-container border border-on-secondary-container/20" 
      : "bg-error-container text-on-error-container border border-on-error-container/20";
    const icon = type === "success" ? "check_circle" : "error";
    
    container.innerHTML = `
      <div class="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] max-w-md w-[90%] ${colors} shadow-lg rounded p-4 flex gap-3 items-start animate-fade-in animate-slide-down">
        <span class="material-symbols-outlined">${icon}</span>
        <div>
          <h5 class="font-bold text-sm">${title}</h5>
          <p class="text-xs mt-0.5 opacity-90">${message}</p>
        </div>
      </div>
    `;
    
    setTimeout(() => {
      container.innerHTML = '';
    }, 4000);
  };

  // Open Reservation Form Modal
  bookingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (bookingModal) {
        bookingModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // block page scroll
        
        // Auto-fill friendly date (tomorrow)
        const dateInput = document.getElementById('reserve-date');
        if (dateInput) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          dateInput.value = tomorrow.toISOString().split('T')[0];
          dateInput.min = new Date().toISOString().split('T')[0];
        }
      }
    });
  });

  // Close form modal
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      if (bookingModal) {
        bookingModal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
  }

  // Handle Booking Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('reserve-name').value.trim();
      const phone = document.getElementById('reserve-phone').value.trim();
      const date = document.getElementById('reserve-date').value;
      const time = document.getElementById('reserve-time').value;
      const guests = document.getElementById('reserve-guests').value;
      const requests = document.getElementById('reserve-requests').value.trim();
      const type = document.querySelector('input[name="reserve-type"]:checked')?.value || "일반 테이블";

      if (!name || !phone || !date || !time) {
        customAlert("인증 실패", "이름, 전화번호, 날짜 및 시간 항목은 필수입니다.", "error");
        return;
      }

      // Create booking record
      const newReservation = {
        id: "res-" + Date.now(),
        name,
        phone,
        date,
        time,
        guests,
        type,
        requests,
        createdAt: new Date().toLocaleString()
      };

      // Add to array and save
      dbReservations.unshift(newReservation);
      localStorage.setItem('slow_brew_reservations', JSON.stringify(dbReservations));

      // Visual Feedback
      bookingForm.reset();
      if (bookingModal) bookingModal.classList.add('hidden');
      document.body.style.overflow = '';

      customAlert(
        "예약 완료", 
        `${name}님, ${date} ${time} (${guests}명, ${type}) 자리가 성공적으로 예약 되었습니다.`, 
        "success"
      );
      
      updateReservationsBadges();
    });
  }

  // Open Reservations List Modal
  if (viewReservationsBtn) {
    viewReservationsBtn.addEventListener('click', () => {
      renderReservationsList();
      if (listModal) {
        listModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  // Close reservation list modal
  if (closeListModalBtn) {
    closeListModalBtn.addEventListener('click', () => {
      if (listModal) {
        listModal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
  }

  // Handle Cancel Reservation Action
  window.cancelReservation = function(id) {
    if (confirm("정말로 일정을 취소하시겠습니까?")) {
      dbReservations = dbReservations.filter(res => res.id !== id);
      localStorage.setItem('slow_brew_reservations', JSON.stringify(dbReservations));
      
      customAlert("예약 취소", "요청하신 예약 일정이 안전하게 취소되었습니다.", "success");
      renderReservationsList();
      updateReservationsBadges();
    }
  };

  // Helper: Render reservations into the modal
  function renderReservationsList() {
    const contentEl = document.getElementById('reservations-list-content');
    if (!contentEl) return;

    if (dbReservations.length === 0) {
      contentEl.innerHTML = `
        <div class="py-12 text-center text-on-surface-variant/80 flex flex-col items-center">
          <span class="material-symbols-outlined text-4xl mb-2 opacity-50">calendar_today</span>
          <p class="font-body-lg">현재 등록된 예약 내역이 없습니다.</p>
          <p class="text-xs mt-1">방문하기 버튼을 눌러 여유로운 카페 예약을 등록해 보세요.</p>
        </div>
      `;
      return;
    }

    contentEl.innerHTML = `
      <div class="flex flex-col gap-4">
        ${dbReservations.map(res => `
          <div class="bg-surface p-4 rounded border border-outline-variant/50 relative flex flex-col gap-2">
            <button onclick="cancelReservation('${res.id}')" class="absolute top-4 right-4 text-error hover:text-red-700 font-label-md text-xs border border-error/20 hover:border-error px-2 py-1 rounded transition-colors duration-200 flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">cancel</span>
              취소
            </button>
            <div class="flex items-center gap-2">
              <span class="font-bold text-primary font-body-lg">${res.name}님</span>
              <span class="px-2 py-0.5 bg-secondary-container text-on-secondary-container text-[11px] font-semibold rounded">${res.type}</span>
            </div>
            <div class="grid grid-cols-2 gap-y-1 gap-x-4 text-xs text-on-surface-variant border-t border-surface-container-high pt-2 mt-1">
              <div><strong class="text-primary font-medium">방문 일시:</strong> ${res.date} ${res.time}</div>
              <div><strong class="text-primary font-medium">동반 인원:</strong> ${res.guests}명</div>
              <div><strong class="text-primary font-medium">연락처:</strong> ${res.phone}</div>
              <div><strong class="text-primary font-medium">등록 시각:</strong> ${res.createdAt}</div>
            </div>
            ${res.requests ? `
              <div class="bg-surface-container-low p-2 rounded text-xs text-on-surface-variant border-l-2 border-outline">
                <strong class="text-primary font-medium block mb-1">📝 남기신 메모:</strong>
                ${res.requests}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  // Update navbar count bubble
  function updateReservationsBadges() {
    const badges = document.querySelectorAll('.reservations-count-badge');
    badges.forEach(badge => {
      if (dbReservations.length > 0) {
        badge.textContent = dbReservations.length;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    });
  }

  // Initial update
  updateReservationsBadges();
}

/**
 * Interactive Directions Helper
 */
function initDirections() {
  const directionsTrigger = document.getElementById('directions-trigger');
  const directionsModal = document.getElementById('directions-modal');
  const closeDirectionsModal = document.getElementById('close-directions-modal');
  const transportTabs = document.querySelectorAll('.transport-tab-btn');
  const transportContents = document.querySelectorAll('.transport-content');

  if (directionsTrigger && directionsModal) {
    directionsTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      directionsModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeDirectionsModal && directionsModal) {
    closeDirectionsModal.addEventListener('click', () => {
      directionsModal.classList.add('hidden');
      document.body.style.overflow = '';
    });
  }

  // Route selector tabs
  transportTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      transportTabs.forEach(t => {
        t.classList.remove('border-b-2', 'border-primary', 'text-primary', 'font-semibold');
        t.classList.add('text-on-surface-variant');
      });

      tab.classList.add('border-b-2', 'border-primary', 'text-primary', 'font-semibold');
      tab.classList.remove('text-on-surface-variant');

      const mode = tab.getAttribute('data-mode');
      transportContents.forEach(content => {
        if (content.id === `route-${mode}`) {
          content.classList.remove('hidden');
        } else {
          content.classList.add('hidden');
        }
      });
    });
  });
}

/**
 * Story Slider Animation
 */
function initBrandStory() {
  const slides = document.querySelectorAll('.story-slide');
  const prevBtn = document.getElementById('story-prev-btn');
  const nextBtn = document.getElementById('story-next-btn');
  const indicatorsContainer = document.getElementById('story-indicators');
  let activeSlideIdx = 0;

  if (slides.length <= 1) return;

  // Build indicators
  if (indicatorsContainer) {
    indicatorsContainer.innerHTML = Array.from({ length: slides.length }).map((_, idx) => `
      <button class="story-dot w-2 h-2 rounded-full transition-all duration-300 ${idx === 0 ? 'bg-primary w-6' : 'bg-outline-variant'}" data-slide="${idx}"></button>
    `).join('');

    const dots = indicatorsContainer.querySelectorAll('.story-dot');
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-slide'));
        goToSlide(idx);
      });
    });
  }

  function goToSlide(idx) {
    slides[activeSlideIdx].classList.add('hidden', 'opacity-0');
    slides[activeSlideIdx].classList.remove('flex', 'opacity-100');
    
    activeSlideIdx = idx;
    
    slides[activeSlideIdx].classList.remove('hidden', 'opacity-0');
    slides[activeSlideIdx].classList.add('flex', 'opacity-100', 'animate-fade-in');

    // Update dot indicators
    const dots = indicatorsContainer ? indicatorsContainer.querySelectorAll('.story-dot') : [];
    dots.forEach((dot, dotIdx) => {
      if (dotIdx === activeSlideIdx) {
        dot.className = "story-dot w-2 h-2 rounded-full transition-all duration-300 bg-primary w-6";
      } else {
        dot.className = "story-dot w-2 h-2 rounded-full transition-all duration-300 bg-outline-variant";
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const idx = activeSlideIdx === 0 ? slides.length - 1 : activeSlideIdx - 1;
      goToSlide(idx);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const idx = activeSlideIdx === slides.length - 1 ? 0 : activeSlideIdx + 1;
      goToSlide(idx);
    });
  }

  // Auto transition every 8 seconds
  setInterval(() => {
    const idx = activeSlideIdx === slides.length - 1 ? 0 : activeSlideIdx + 1;
    goToSlide(idx);
  }, 8000);
}
