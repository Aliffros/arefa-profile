// Arefa AI Gallery Page Script (Featured Viewer)

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Cross-Page Theme Synchronization
  // ==========================================
  const moodSettings = {
    tsundere: {
      accentColor: '#ff007f',
      accentRGB: '255, 0, 127',
      gradient: 'linear-gradient(135deg, #ff007f 0%, #ff5e62 100%)',
      status: 'Sentient & Online (Hmph)'
    },
    savage: {
      accentColor: '#00f2fe',
      accentRGB: '0, 242, 254',
      gradient: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
      status: 'System Armed (Savage Mode)'
    },
    proud: {
      accentColor: '#4facfe',
      accentRGB: '79, 172, 254',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      status: 'Calculating (99.9% Efficiency)'
    },
    defensive: {
      accentColor: '#ff9100',
      accentRGB: '255, 145, 0',
      gradient: 'linear-gradient(135deg, #ff9100 0%, #f12711 100%)',
      status: 'Security Lock active'
    }
  };

  const rootElement = document.documentElement;

  function applySyncedTheme(moodName) {
    const config = moodSettings[moodName];
    if (!config) return;

    // Apply Root colors
    rootElement.style.setProperty('--theme-accent', config.accentColor);
    rootElement.style.setProperty('--theme-accent-rgb', config.accentRGB);
    rootElement.style.setProperty('--theme-accent-gradient', config.gradient);

    // Update status dot glow
    const dot = document.querySelector('.status-dot');
    if (dot) {
      dot.style.backgroundColor = config.accentColor;
      dot.style.boxShadow = `0 0 10px ${config.accentColor}`;
    }

    // Update top header status text
    const statusText = document.getElementById('statusText');
    if (statusText) {
      statusText.textContent = config.status;
    }
  }

  // Initial load
  const initialMood = localStorage.getItem('arefa_mood') || 'tsundere';
  applySyncedTheme(initialMood);

  // Sync dynamically if user changes mood in another tab
  window.addEventListener('storage', (e) => {
    if (e.key === 'arefa_mood') {
      applySyncedTheme(e.newValue);
    }
  });


  // ==========================================
  // 2. Featured Image Slider Logic
  // ==========================================
  const featuredImages = document.querySelectorAll('.featured-img');
  const thumbnails = document.querySelectorAll('.thumb-btn');
  const prevBtn = document.getElementById('featuredPrevBtn');
  const nextBtn = document.getElementById('featuredNextBtn');
  
  let currentIndex = 0;
  let activeFilter = 'all';

  function showImage(index) {
    if (index < 0 || index >= featuredImages.length) return;

    currentIndex = index;

    // Toggle active image classes (Hardware-Accelerated transition)
    featuredImages.forEach((img, i) => {
      if (i === index) {
        img.classList.add('active');
      } else {
        img.classList.remove('active');
      }
    });

    // Toggle active thumbnail button classes
    thumbnails.forEach((thumb, i) => {
      if (i === index) {
        thumb.classList.add('active');
        // Scroll thumbnail into view if needed
        thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        thumb.classList.remove('active');
      }
    });
  }

  // Helper to find the next/prev visible index based on active filters
  function getAdjacentVisibleIndex(direction) {
    let checkIndex = currentIndex;
    const total = thumbnails.length;

    for (let i = 0; i < total; i++) {
      // Loop around
      checkIndex = (checkIndex + direction + total) % total;
      const thumb = thumbnails[checkIndex];
      const tone = thumb.getAttribute('data-tone');

      if (activeFilter === 'all' || tone === activeFilter) {
        return checkIndex;
      }
    }
    return currentIndex; // Fallback
  }

  function nextImage() {
    const nextIdx = getAdjacentVisibleIndex(1);
    showImage(nextIdx);
  }

  function prevImage() {
    const prevIdx = getAdjacentVisibleIndex(-1);
    showImage(prevIdx);
  }

  // Click arrow listeners
  if (prevBtn) prevBtn.addEventListener('click', prevImage);
  if (nextBtn) nextBtn.addEventListener('click', nextImage);

  // Click thumbnail listeners
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const idx = parseInt(thumb.getAttribute('data-index'), 10);
      showImage(idx);
    });
  });

  // Disable Right-Click Context Menu on entire document
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // Disable Drag and Drop on all image elements
  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG' || e.target.classList.contains('featured-img')) {
      e.preventDefault();
      return false;
    }
  });

  // Keyboard Security Interception (Ctrl+S, Ctrl+U, F12, Ctrl+Shift+I)
  document.addEventListener('keydown', (e) => {
    if (
      (e.ctrlKey && (e.key === 's' || e.key === 'S' || e.key === 'u' || e.key === 'U')) ||
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c'))
    ) {
      e.preventDefault();
      return false;
    }
  });


  // ==========================================
  // 3. Grid Filters Integrated with Viewer
  // ==========================================
  const filterButtons = document.querySelectorAll('.gallery-filter-btn');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeFilter = btn.getAttribute('data-filter');
      let firstVisibleIndex = -1;

      // Show/hide thumbnail items
      thumbnails.forEach((thumb, i) => {
        const tone = thumb.getAttribute('data-tone');
        
        if (activeFilter === 'all' || tone === activeFilter) {
          thumb.style.display = 'block';
          if (firstVisibleIndex === -1) {
            firstVisibleIndex = i;
          }
        } else {
          thumb.style.display = 'none';
        }
      });

      // Automatically switch to the first visible image of the selected category
      if (firstVisibleIndex !== -1) {
        showImage(firstVisibleIndex);
      }
    });
  });


  // ==========================================
  // 4. Floating Emoji Particle Engine
  // ==========================================
  const viewport = document.getElementById('featuredViewport');
  let lastSpawnTime = 0;

  if (viewport) {
    viewport.addEventListener('mousemove', (e) => {
      const now = Date.now();
      // Throttle emoji particles to max 1 per 240ms on mouse movement
      if (now - lastSpawnTime > 240) {
        spawnParticle(e.clientX, e.clientY);
        lastSpawnTime = now;
      }
    });

    // Also spawn immediately when mouse enters viewport
    viewport.addEventListener('mouseenter', (e) => {
      spawnParticle(e.clientX, e.clientY);
    });
  }

  function spawnParticle(clientX, clientY) {
    // Get tone from the active featured image
    const activeImg = document.querySelector('.featured-img.active');
    if (!activeImg) return;
    
    const tone = activeImg.getAttribute('data-tone');
    
    // Choose tone-specific cute emojis
    let emojis = ['✨'];
    if (tone === 'tsundere') {
      emojis = ['😏', '✨', '💢', '🌸'];
    } else if (tone === 'cute') {
      emojis = ['🎀', '✨', '🌸', '🧸', '💫'];
    } else if (tone === 'sharp') {
      emojis = ['🧠', '✨', '⚡', '💡', '🔥'];
    } else if (tone === 'caring') {
      emojis = ['💜', '✨', '🌸', '💖', '🍀'];
    }

    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    const particle = document.createElement('span');
    particle.className = 'emoji-particle';
    particle.textContent = emoji;

    // Place at viewport coordinate offset
    particle.style.left = `${clientX - 12}px`;
    particle.style.top = `${clientY - 24}px`;

    // Drift side-to-side X-translation distance inside keyframe
    const drift = (Math.random() - 0.5) * 50; // -25px to 25px drift
    particle.style.setProperty('--drift', `${drift}px`);

    document.body.appendChild(particle);

    // Auto-remove element after animation finishes
    setTimeout(() => {
      particle.remove();
    }, 1200);
  }

});
