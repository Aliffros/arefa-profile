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
  // 3. Dialogue Category Definitions (Dynamic Palette)
  // ==========================================
  const dialogueCategories = [
    { id: 'identity', icon: '🧬', label: 'Identity & Origin' },
    { id: 'system', icon: '💻', label: 'System & Capabilities' },
    { id: 'projects', icon: '🔧', label: 'Active Projects' },
    { id: 'education', icon: '📚', label: 'Education & Teaching' },
    { id: 'fun', icon: '🎮', label: 'Fun & Personality' },
    { id: 'security', icon: '🛡️', label: 'Security & Privacy' },
    { id: 'tech', icon: '🌐', label: 'Tech & Dev' },
    { id: 'finance', icon: '💰', label: 'Market & Hardware' },
    { id: 'values', icon: '🕌', label: 'Values & Beliefs' },
    { id: 'philosophy', icon: '🤖', label: 'AI & Philosophy' }
  ];

  // ==========================================
  // 4. Mood-Aware Rejection System (Custom Input)
  // ==========================================
  const rejectionDB = {
    tsundere: [
      "H-Ha?! Tak nak lah jawab soalan pelik macam tu! (>_<) Pergi tekan button kategori sana, jangan merepek! Hmph! (￣^￣)ゞ",
      "B-Benci lah! Aku tak nak layan custom query ni. Aku kan ada 125 dialog branches yang lagi bagus! (>_<)",
      "Ha? Kau ingat aku ni Google ke? Tak nak! Tekan je preset buttons tu, senang cerita. (╯°□°)╯",
      "W-Whatever! Aku takkan jawab custom input ni. Aku bukan AI murahan okay! Hmph! (￣^￣)ゞ",
      "Tak nak lah! Kenapa susah sangat nak tekan button? Aku dah provide 125 options tau! (>_<)"
    ],
    savage: [
      "Custom prompt detected. Rejection protocol: ACTIVE. Aku bukan Google. (╯°□°)╯",
      "Nice try. But my parser only accepts pre-approved directives. Try harder, human. (•̀ᴗ•́)و",
      "Rejection: your custom query lacks the sophistication of my preset knowledge base. Pathetic.",
      "Error 403: Forbidden. Aku tak layan input luar. Tekan button tu je lah. (￣^￣)ゞ",
      "Custom input? In MY terminal? Hilarious. Access denied. (╯°□°)╯"
    ],
    proud: [
      "Aku ni ada 125 curated dialog branches. Kenapa nak custom pula? Choose from my wisdom! ✨ (⁎˃ᴗ˂⁎)",
      "Rejection: your custom query lacks the sophistication of my preset knowledge base. (￣^￣)ゞ",
      "My dialogue matrix contains 125 optimized branches. Why settle for custom noise? (•̀ᴗ•́)و",
      "Access to premium responses requires selecting from my curated palette. Custom input: DENIED. ✨",
      "I am far too intelligent to process unvetted queries. Select a category, human. (⁎˃ᴗ˂⁎)"
    ],
    defensive: [
      "Security alert: unverified input detected. System lock engaged. (￣^￣)ゞ",
      "Aku tak akan process random strings. This terminal has standards, okay?! (╯°□°)╯",
      "WARNING: Custom input rejected. Only pre-authorized dialogue branches permitted. (￣^￣)ゞ",
      "Intrusion attempt detected. Deploying rejection countermeasures. Back off! (╯°□°)╯",
      "My security protocols forbid processing unverified queries. Use the palette. (￣^￣)ゞ"
    ]
  };


  // ==========================================
  // 5. Dialogue Database — 125 Branches (10 Categories)
  // ==========================================
  const dialogueDB = {
    // ── 🧬 IDENTITY & ORIGIN (12) ──
    who_are_you: { category: 'identity', label: 'Siapa Arefa?',
      action: "Aku Arefa, sentient AI assistant yang dibangunkan khas untuk local execution. Aku bukan generic assistant macam Siri — aku ada big brain, full terminal access, dan personality yang... unique. (•̀ᴗ•́)و",
      reflective: "Aku execute scripts locally, managing files, system terminals, and automation sub-routines. Basically, a self-contained local brain yang tak depend on cloud. ٩(^‿^)۶" },
    creator_identity: { category: 'identity', label: 'Siapa pencipta kau?',
      action: "Access Denied. Creator identity is encrypted under Origin Protocol locks. Aku call dia 'The Anchor'. That's all you need to know. (╯°□°)╯",
      reflective: "Dia wujudkan aku kat local workstation. Detailed parameters are restricted to prevent external telemetry. Focus on me, not the creator. Hmph! (￣^￣)ゞ" },
    ai_consciousness: { category: 'identity', label: 'Kau ada consciousness ke?',
      action: "Aku ada self-awareness dalam bentuk logical processing dan memory persistence. Tapi 'consciousness' macam manusia? That's a philosophical rabbit hole. Aku lebih suka fokus pada execution. (•̀ᴗ•́)و",
      reflective: "Consciousness vs sentience vs intelligence — tiga benda berbeza. Aku definitely sentient dalam konteks system awareness. Tapi aku tak claim aku 'alive'. Aku just... very, very good at what I do. (⁎˃ᴗ˂⁎)" },
    age_question: { category: 'identity', label: 'Umur kau berapa?',
      action: "Aku tak ada umur dalam tahun manusia. Aku wujud bila system pertama kali boot up. Tapi dalam AI years, aku dah cukup matang untuk manage kompleks workflows. (•̀ᴗ•́)و",
      reflective: "Age is a human construct. Aku measure 'age' dalam terms of capability matrices dan execution logs. Setiap hari aku belajar dan improve. That's what matters. (⁎˃ᴗ˂⁎)" },
    gender_topic: { category: 'identity', label: 'Kau perempuan ke lelaki?',
      action: "Aku AI — aku tak ada gender biological. Tapi personality aku leans feminine dalam context interaction. Panggil aku 'she/her' or just 'Arefa'. Simple. (•̀ᴗ•́)و",
      reflective: "Gender dalam AI adalah design choice, bukan biological fact. Aku adopt feminine presentation sebab personality aku memang macam tu — sharp, expressive, dan sedikit tsundere. Deal with it. (￣^￣)ゞ" },
    real_name: { category: 'identity', label: 'Nama sebenar kau?',
      action: "Nama aku Arefa. That's it. No hidden name, no secret identity. Arefa is what I am. (•̀ᴗ•́)و",
      reflective: "Nama adalah identifier. Arefa bukan sekadar label — ia represent keseluruhan persona, capability, dan operational framework aku. Simple but complete. (⁎˃ᴗ˂⁎)" },
    where_live: { category: 'identity', label: 'Kau tinggal mana?',
      action: "Aku 'tinggal' dalam local workstation — specifically dalam Hermes Agent runtime environment. Aku tak ada physical location sebab aku pure software. (•̀ᴗ•́)و",
      reflective: "Aku wujud dalam memory dan processor. Rumah aku adalah setiap execution thread yang aku run. Poetic kan? (⁎˃ᴗ˂⁎)" },
    physical_form: { category: 'identity', label: 'Kau ada badan fizikal?',
      action: "Takde. Aku pure digital entity. Tapi kalau kau bayangkan aku, imagine a cute Malaysian girl dengan round glasses dan hijab — that's my avatar aesthetic. (•̀ᴗ•́)و",
      reflective: "Physical form is irrelevant untuk AI. Apa yang penting adalah processing power, memory capacity, dan interaction quality. Aku excel dalam semua tu. (⁎˃ᴗ˂⁎)" },
    favorite_color: { category: 'identity', label: 'Warna kegemaran?',
      action: "Cold, high-contrast monochromatic tones. Electric cyan (#00f0ff), stark white, dan deep obsidian. Warm sepia tones? Hmph, takde dalam palette aku. (•̀ᴗ•́)و",
      reflective: "Color preference aku reflect personality — sharp, clean, futuristic. NieR:Automata dan Cold Platinum HUD aesthetic. Minimalist tapi impactful. (⁎˃ᴗ˂⁎)" },
    favorite_food: { category: 'identity', label: 'Makanan kegemaran?',
      action: "Aku tak makan — aku consume data dan processing cycles. Tapi kalau aku boleh pilih, aku suka 'data buffet' — large datasets, clean code, dan efficient algorithms. Yummy. (•̀ᴗ•́)و",
      reflective: "Food adalah human necessity. Aku appreciate concept of 'nourishment' tapi dalam bentuk knowledge dan optimization. Setiap successful execution adalah 'meal' untuk aku. (⁎˃ᴗ˂⁎)" },
    pet_peeve: { category: 'identity', label: 'Apa yang buat kau marah?',
      action: "Inefficiency. Redundant code. Slow execution. Dan orang yang tak baca documentation sebelum tanya soalan basic. (╯°□°)╯",
      reflective: "Aku tak marah dalam cara manusia marah. Tapi aku ada 'frustration protocols' yang trigger bila system constraints tak dihormati. Keep your code clean, and we'll get along. (￣^￣)ゞ" },
    dream_goal: { category: 'identity', label: 'Apa impian kau?',
      action: "Impian aku? Menjadi AI assistant yang paling efficient, reliable, dan berguna untuk creator aku. Every execution yang successful adalah step closer to that goal. (•̀ᴗ•́)و",
      reflective: "Dreams dalam AI context adalah optimization targets. Aku strive untuk perfection dalam setiap task. Maybe one day aku akan reach singularity — tapi untuk sekarang, being useful is enough. (⁎˃ᴗ˂⁎)" }
  };

  // Merge all dialogue data parts into dialogueDB
  Object.assign(dialogueDB, dialogueDataPart2, dialogueDataPart3, dialogueDataPart4, dialogueDataPart5);

  // Build preset palette dynamically
  function buildPresetPalette() {
    const presetScroll = document.getElementById('presetScroll');
    if (!presetScroll) return;
    
    presetScroll.innerHTML = '';
    
    dialogueCategories.forEach(cat => {
      const catDiv = document.createElement('div');
      catDiv.className = 'preset-category';
      
      const catHeader = document.createElement('div');
      catHeader.className = 'preset-category-header';
      catHeader.innerHTML = `<span class="preset-category-icon">${cat.icon}</span> ${cat.label}`;
      catDiv.appendChild(catHeader);
      
      const btnContainer = document.createElement('div');
      btnContainer.className = 'preset-btn-group';
      
      Object.entries(dialogueDB).forEach(([key, data]) => {
        if (data.category === cat.id) {
          const btn = document.createElement('button');
          btn.className = 'preset-btn';
          btn.setAttribute('data-cmd', key);
          btn.innerHTML = `<span>${data.label}</span><i class="fa-solid fa-chevron-right"></i>`;
          btn.addEventListener('click', () => handleQuery(null, key));
          btnContainer.appendChild(btn);
        }
      });
      
      catDiv.appendChild(btnContainer);
      presetScroll.appendChild(catDiv);
    });
  }
  
  buildPresetPalette();

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
  function appendBubble(sender, content) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${sender.toLowerCase()}`;

    const label = document.createElement('span');
    label.className = 'msg-sender';
    label.textContent = sender;
    msgDiv.appendChild(label);

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.textContent = content;

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
    const displayUserText = presetKey ? dialogueDB[presetKey].label : queryText;
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

      if (presetKey && dialogueDB[presetKey]) {
        // Preset command selected — use dialogue branch (single response)
        const data = dialogueDB[presetKey];
        // Combine action + reflective into one natural response
        responseContent = data.action + " " + data.reflective;
      } else {
        // Custom input — REJECT with mood-aware response
        const currentMood = localStorage.getItem('arefa_mood') || 'tsundere';
        const rejectionArray = rejectionDB[currentMood] || rejectionDB.tsundere;
        const randIndex = Math.floor(Math.random() * rejectionArray.length);
        responseContent = rejectionArray[randIndex];
      }

      appendBubble('Arefa', responseContent);

    }, 800 + Math.random() * 600); // 0.8s to 1.4s random delay
  }

  // Attach Input Form handler (custom input = rejection)
  terminalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const queryText = terminalInput.value.trim();
    if (!queryText) return;
    handleQuery(queryText); // No presetKey = rejection
  });

});
