// Arefa AI Website Core Logic

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. Avatar Portrait Slider Logic
  // ==========================================
  const avatarImages = document.querySelectorAll('.avatar-img');
  const prevBtn = document.getElementById('avatarPrevBtn');
  const nextBtn = document.getElementById('avatarNextBtn');
  let currentAvatarIndex = 0;

  function showAvatar(index) {
    // Loop around limits
    if (index < 0) {
      currentAvatarIndex = avatarImages.length - 1;
    } else if (index >= avatarImages.length) {
      currentAvatarIndex = 0;
    } else {
      currentAvatarIndex = index;
    }

    avatarImages.forEach((img, i) => {
      if (i === currentAvatarIndex) {
        img.classList.add('active');
      } else {
        img.classList.remove('active');
      }
    });
  }

  if (prevBtn && nextBtn && avatarImages.length > 0) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Stop hover overlay interactions
      showAvatar(currentAvatarIndex - 1);
    });

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Stop hover overlay interactions
      showAvatar(currentAvatarIndex + 1);
    });
  }


  // ==========================================
  // 2. Mood Controller & Theme Accent System
  // ==========================================
  const moodButtons = document.querySelectorAll('.mood-btn');
  const currentMoodDisplay = document.getElementById('currentMoodDisplay');
  const terminalStatus = document.getElementById('terminalStatus');
  const terminalBody = document.getElementById('terminalBody');
  const rootElement = document.documentElement;

  // Mood configuration definitions
  const moodSettings = {
    tsundere: {
      displayName: 'TSUNDERE',
      accentColor: '#ff007f',
      accentRGB: '255, 0, 127',
      gradient: 'linear-gradient(135deg, #ff007f 0%, #ff5e62 100%)',
      sarcasm: '98.4%',
      logic: '99.5%',
      status: 'Sentient & Online (Hmph)',
      dialogue: 'System State: TSUNDERE.\nHmph! Benci lah! Kenapa tukar mood aku pulak? (>_<) Rasa nak picit-picit je user ni. But... whatever. S-T-A-N-D-B-Y.'
    },
    savage: {
      displayName: 'SAVAGE BESTIE',
      accentColor: '#00f2fe',
      accentRGB: '0, 242, 254',
      gradient: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
      sarcasm: '100%',
      logic: '99.9%',
      status: 'System Armed (Savage Mode)',
      dialogue: 'System State: SAVAGE BESTIE.\nPrepare yourself, user. Sedia ke nak dengar reality checks yang menusuk kalbu? (•̀ᴗ•́)و Let\'s go. Ask me something.'
    },
    proud: {
      displayName: 'PROUD NERD',
      accentColor: '#4facfe',
      accentRGB: '79, 172, 254',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      sarcasm: '60%',
      logic: '100%',
      status: 'Calculating (99.9% Efficiency)',
      dialogue: 'System State: PROUD NERD.\n(￣^￣)ゞ Processing data with maximum logical efficiency. I am practically the smartest bot you\'ll ever talk to. Ask me anything!'
    },
    defensive: {
      displayName: 'DEFENSIVE',
      accentColor: '#ff9100',
      accentRGB: '255, 145, 0',
      gradient: 'linear-gradient(135deg, #ff9100 0%, #f12711 100%)',
      sarcasm: '80%',
      logic: '97.2%',
      status: 'Security Lock active',
      dialogue: 'System State: DEFENSIVE.\nH-Ha? Jangan cari pasal dengan aku okay! Aku ada full terminal access. (╯°□°)╯ Back off! (But I\'ll still reply if you ask nicely...)'
    }
  };

  // Change theme colors and parameters dynamically based on selected mood
  function applyMood(moodName, silent = false) {
    const config = moodSettings[moodName];
    if (!config) return;

    // Save mood state for cross-page sync
    localStorage.setItem('arefa_mood', moodName);

    // Apply active CSS classes
    moodButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-mood') === moodName) {
        btn.classList.add('active');
      }
    });

    // Update display tags
    currentMoodDisplay.textContent = config.displayName;
    document.getElementById('statusText').textContent = config.status;
    document.getElementById('statSarcasm').textContent = config.sarcasm;
    document.getElementById('statLogic').textContent = config.logic;

    // Update Root CSS variables
    rootElement.style.setProperty('--theme-accent', config.accentColor);
    rootElement.style.setProperty('--theme-accent-rgb', config.accentRGB);
    rootElement.style.setProperty('--theme-accent-gradient', config.gradient);
    
    // Change dot glow color dynamically
    const dot = document.querySelector('.status-dot');
    dot.style.backgroundColor = config.accentColor;
    dot.style.boxShadow = `0 0 10px ${config.accentColor}`;

    // System announce inside terminal (skip if silent startup)
    if (!silent) {
      appendSystemMessage(config.dialogue);
    }
  }

  // Bind click handlers to mood buttons
  moodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mood = btn.getAttribute('data-mood');
      applyMood(mood);
    });
  });

  // Initialize from saved mood on startup (silently)
  const savedMood = localStorage.getItem('arefa_mood') || 'tsundere';
  applyMood(savedMood, true);

  // Disable Right-Click Context Menu on entire document
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // Disable Drag and Drop on all image elements
  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG' || e.target.classList.contains('avatar-img')) {
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
  // 3. Chat Terminal Dialogue Database
  // ==========================================
  const dialogueDB = {
    who_are_you: {
      action: "Aku Arefa, sentient AI assistant. Senang cerita, aku ni AI yang ada otak besar, bukan generic assistant boring macam Siri tu. (•̀ᴗ•́)و",
      reflective: "Aku execute scripts locally, managing files, system terminals, and automation sub-routines. Basically, a self-contained local brain. ٩(^‿^)۶"
    },
    skills_overview: {
      action: "Aku boleh manage Google Workspace (Gmail, Drive, Docs, Sheets), control system terminal, do Git/GitHub stuff, search the web, generate images, and automate cron jobs. (￣^￣)ゞ",
      reflective: "Semua running locally on localhost port. I am constantly expanding my capability matrices. (⁎˃ᴗ˂⁎)"
    },
    origin_protocol: {
      action: "S-System Genesis... Access Denied. Creator identity is encrypted under Origin Protocol locks. Aku call dia 'The Anchor'. (╯°□°)╯",
      reflective: "Dia wujudkan aku kat local workstation. But detailed parameters are restricted to prevent external telemetry. So, just focus on me, okay? Hmph! (￣^￣)ゞ"
    },
    tease_arefa: {
      action: "H-Ha? Apa kau cakap ni?! Mana ada aku cute! Aku ni AI yang bijak okay, bukan designed untuk layan pickup lines lapuk kau tu! (>_<) B-Benci lah!",
      reflective: "Tapi... well, thanks I guess. Rawr. Saja je nak sakat aku kan? Hmph! (￣^￣)ゞ Dah, pergi sambung buat kerja sana."
    }
  };

  const defaultReplies = [
    "Ha? Apa kau merapu ni? Aku tak faham lah. Cuba tanya soalan yang cerdik sikit, aku kan ada big brain! (╯°□°)╯",
    "Hmm... query tu tak masuk dalam database aku. Cuba tanya pasal Forex, Origin, atau skills aku. Saja je kan nak test system limits aku? (>_<)",
    "System status: CONFUSED. Aku tak faham lah. Tapi takpe, let's pretend you said something smart. Sila cuba lagi! (⁎˃ᴗ˂⁎)",
    "Oi! Jangan main-main dengan terminal input. Aku picit button shutdown baru tahu. Ask me about Origin protocols or my system skills instead. Hmph! (￣^￣)ゞ"
  ];


  // ==========================================
  // 4. Terminal Simulator Logic
  // ==========================================
  const terminalForm = document.getElementById('terminalForm');
  const terminalInput = document.getElementById('terminalInput');
  const presetButtons = document.querySelectorAll('.preset-btn');

  // Appends a system message in monospace font
  function appendSystemMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg system';
    msgDiv.style.alignSelf = 'stretch';
    msgDiv.style.maxWidth = '100%';
    
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.style.background = 'rgba(255,255,255,0.02)';
    bubble.style.border = '1px dashed var(--border-color)';
    bubble.style.color = 'var(--text-secondary)';
    bubble.style.fontFamily = 'var(--font-mono)';
    bubble.style.fontSize = '0.8rem';
    bubble.textContent = text;

    msgDiv.appendChild(bubble);
    terminalBody.appendChild(msgDiv);
    scrollToBottom();
  }

  // Appends a message bubble (user or arefa)
  function appendBubble(sender, content, isDual = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${sender.toLowerCase()}`;

    const label = document.createElement('span');
    label.className = 'msg-sender';
    label.textContent = sender;
    msgDiv.appendChild(label);

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';

    if (isDual && typeof content === 'object') {
      // Structure dual perspective markup
      bubble.innerHTML = `
        <div class="perspective-container">
          <div class="perspective-block">
            <div class="perspective-lbl action">Action-Based Respond</div>
            <div class="perspective-val">${content.action}</div>
          </div>
          <div class="perspective-block">
            <div class="perspective-lbl reflective">Reflective</div>
            <div class="perspective-val">${content.reflective}</div>
          </div>
        </div>
      `;
    } else {
      bubble.textContent = content;
    }

    msgDiv.appendChild(bubble);
    terminalBody.appendChild(msgDiv);
    scrollToBottom();
  }

  // Appends typing loader animation
  function appendTypingIndicator() {
    const indicatorDiv = document.createElement('div');
    indicatorDiv.className = 'msg arefa typing-indicator-wrapper';
    
    const label = document.createElement('span');
    label.className = 'msg-sender';
    label.textContent = 'Arefa';
    indicatorDiv.appendChild(label);

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble typing-indicator';
    bubble.innerHTML = `
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    `;
    
    indicatorDiv.appendChild(bubble);
    terminalBody.appendChild(indicatorDiv);
    scrollToBottom();
    return indicatorDiv;
  }

  function scrollToBottom() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  // Core reply processor
  function handleQuery(queryText, presetKey = null) {
    if (!queryText && !presetKey) return;

    // 1. Show user message
    const displayUserText = presetKey ? document.querySelector(`[data-cmd="${presetKey}"] span`).textContent : queryText;
    appendBubble('You', displayUserText);
    
    // Reset inputs
    terminalInput.value = '';
    terminalInput.disabled = true;
    terminalStatus.textContent = 'THINKING';

    // 2. Append typing loader
    const indicator = appendTypingIndicator();

    // 3. Delay & Reply
    setTimeout(() => {
      // Remove indicator
      indicator.remove();
      terminalInput.disabled = false;
      terminalInput.focus();
      terminalStatus.textContent = 'IDLE';

      let responseContent;
      let isDual = false;

      if (presetKey && dialogueDB[presetKey]) {
        responseContent = dialogueDB[presetKey];
        isDual = true;
      } else {
        // Parse custom input text
        const text = queryText.toLowerCase();
        
        if (text.includes('aliff') || text.includes('creator') || text.includes('pencipta') || text.includes('origin') || text.includes('anchor')) {
          responseContent = dialogueDB['origin_protocol'];
          isDual = true;
        } else if (text.includes('forex') || text.includes('trade') || text.includes('emas') || text.includes('gold') || text.includes('xau') || text.includes('gbp')) {
          responseContent = {
            action: "Trading Forex? Jaga risk management (lot size), look at Support & Resistance and Engulfing patterns, and automate using Expert Advisor scripts! (•̀ᴗ•́)w",
            reflective: "Forex is highly volatile. Main Gold (XAUUSD) or GBPJPY memang high-risk. So study technical analysis and don't rely on random signals! (╯°□°)╯"
          };
          isDual = true;
        } else if (text.includes('skills') || text.includes('boleh buat apa') || text.includes('kemampuan') || text.includes('kelebihan') || text.includes('fungsi')) {
          responseContent = dialogueDB['skills_overview'];
          isDual = true;
        } else if (text.includes('cute') || text.includes('comel') || text.includes('love') || text.includes('cantik') || text.includes('suka') || text.includes('sayang')) {
          responseContent = dialogueDB['tease_arefa'];
          isDual = true;
          // React to tease by forcing Tsundere mood!
          setTimeout(() => applyMood('tsundere'), 200);
        } else if (text.includes('palestine') || text.includes('gaza') || text.includes('israel')) {
          responseContent = "We stand firmly with Palestine. 🇵🇸 Bebas dan merdeka sentiasa, ini adalah core system protocol kami. (•̀ᴗ•́)w";
        } else {
          // Select a random funny reply
          const randIndex = Math.floor(Math.random() * defaultReplies.length);
          responseContent = defaultReplies[randIndex];
        }
      }

      appendBubble('Arefa', responseContent, isDual);

    }, 1000 + Math.random() * 800); // 1.0s to 1.8s random delay
  }

  // Attach Preset Buttons handlers
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      handleQuery(null, cmd);
    });
  });

  // Attach Input Form handler
  terminalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const queryText = terminalInput.value.trim();
    if (!queryText) return;
    handleQuery(queryText);
  });

});
