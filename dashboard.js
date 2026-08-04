// Arefa AI Dashboard Script

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

  // Sync dynamically if the user updates localStorage in another tab
  window.addEventListener('storage', (e) => {
    if (e.key === 'arefa_mood') {
      applySyncedTheme(e.newValue);
    }
  });


  // ==========================================
  // 2. Monospace Typing Log Emulator
  // ==========================================
  const logTextEl = document.getElementById('typingLogText');
  
  const logSequences = [
    "Connecting to localhost:8000 metrics socket...",
    "Telemetry link secure. Initiating handshakes...",
    "Gateway handshake established. Verification: NOMINAL.",
    "Syncing active sub-matrix logs: google drive, calendar, terminal.",
    "Compiling capability matrices and execution token limits...",
    "Live-telemetry feed initialized. Ready for command input."
  ];

  let sequenceIndex = 0;
  let charIndex = 0;

  function typeLogLine() {
    if (!logTextEl) return;

    if (sequenceIndex >= logSequences.length) {
      // Loop logs after sequence is done, pause 6 seconds, clear, and restart
      setTimeout(() => {
        sequenceIndex = 0;
        charIndex = 0;
        logTextEl.textContent = '';
        typeLogLine();
      }, 6000);
      return;
    }

    const currentLine = logSequences[sequenceIndex];
    if (charIndex < currentLine.length) {
      logTextEl.textContent += currentLine.charAt(charIndex);
      charIndex++;
      setTimeout(typeLogLine, 25);
    } else {
      // Hold line for 1.8 seconds, then clear and move to the next log item
      setTimeout(() => {
        sequenceIndex++;
        charIndex = 0;
        logTextEl.textContent = '';
        typeLogLine();
      }, 1800);
    }
  }

  // Launch typing emulator
  typeLogLine();


  // ==========================================
  // 3. Stats Rolling Count-Up Animation
  // ==========================================
  const counters = document.querySelectorAll('.count-up, .count-up-num');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const isComma = counter.getAttribute('data-format') === 'comma';
    let count = 0;
    
    // Adjust speed based on value magnitude (so small/big values finish in ~1.2s)
    const duration = 1200; // ms
    const fps = 60;
    const stepCount = duration / (1000 / fps);
    const stepIncrement = target / stepCount;

    const runCount = () => {
      count += stepIncrement;
      if (count < target) {
        counter.textContent = isComma ? Math.floor(count).toLocaleString() : Math.floor(count);
        requestAnimationFrame(runCount);
      } else {
        counter.textContent = isComma ? target.toLocaleString() : target;
      }
    };

    // Tiny trigger delay
    setTimeout(runCount, 150);
  });


  // ==========================================
  // 4. Bar Chart Fill Width Animations
  // ==========================================
  const barFills = document.querySelectorAll('.dash-bar-fill');
  
  // Staggered width expansion trigger
  setTimeout(() => {
    barFills.forEach(fill => {
      const targetWidth = fill.getAttribute('data-width');
      fill.style.width = targetWidth;
    });
  }, 350);

});
