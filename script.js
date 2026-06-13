document.addEventListener('DOMContentLoaded', () => {
  /* ===================================================
     1. PERFORMANCE & DEVICE DETECTION
     =================================================== */
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  /* ===================================================
     2. CURSOR GLOW EFFECT (Desktop Only)
     =================================================== */
  const cursorGlow = document.getElementById('cursor-glow');
  
  if (isTouchDevice) {
    if (cursorGlow) cursorGlow.style.display = 'none';
  } else {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  /* ===================================================
     3. GLASS CARD HOVER GLOWS & 3D TILT EFFECT (Desktop Only)
     =================================================== */
  const glassCards = document.querySelectorAll('.glass-card, .project-card');
  
  if (!isTouchDevice) {
    glassCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 1. Mouse Glow Coordinate
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        // 2. 3D Tilt calculation
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Rotate maximum 8 degrees based on coordinate offsets
        const rotateX = -(y - centerY) / (rect.height / 8); 
        const rotateY = (x - centerX) / (rect.width / 8);
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
      });
    });
  }

  /* ===================================================
     4. MAGNETIC BUTTONS EFFECT (Desktop Only)
     =================================================== */
  const magneticButtons = document.querySelectorAll('.btn');

  if (!isTouchDevice) {
    magneticButtons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Pull the button up to 15% towards the cursor coordinate
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.02)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px) scale(1)';
      });
    });
  }

  /* ===================================================
     5. HERO PROFESSION AUTO-TYPING & ROTATING LOOP
     =================================================== */
  const typingElement = document.getElementById('typing-profession');
  const professions = [
    'MCA STUDENT',
    'CREATIVE PRODUCER',
    'GOOD LISTENER',
    'TECH DEVELOPER'
  ];
  
  let professionIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 120;
  
  const typeEffect = () => {
    if (!typingElement) return;

    const currentText = professions[professionIndex];
    
    if (isDeleting) {
      typingElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 60;
    } else {
      typingElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 120;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      typingDelay = 2000;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      professionIndex = (professionIndex + 1) % professions.length;
      typingDelay = 500;
    }
    
    setTimeout(typeEffect, typingDelay);
  };
  
  if (typingElement) {
    setTimeout(typeEffect, 1000);
  }

  /* ===================================================
     6. SCROLL PROGRESS INDICATOR BAR
     =================================================== */
  const scrollProgress = document.getElementById('scroll-progress');
  
  window.addEventListener('scroll', () => {
    if (scrollProgress) {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      scrollProgress.style.width = `${scrolled}%`;
    }
  });

  /* ===================================================
     7. HEADER SCROLL EFFECT & SCROLL SPY
     =================================================== */
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    if (currentSection) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}` || (currentSection === 'hero' && link.getAttribute('href') === '#')) {
          link.classList.add('active');
        }
      });
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial run

  /* ===================================================
     8. MOBILE NAVIGATION MENU
     =================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const primaryNavigation = document.getElementById('primary-navigation');
  
  if (mobileToggle && primaryNavigation) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      primaryNavigation.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.setAttribute('aria-expanded', 'false');
        primaryNavigation.classList.remove('open');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  /* ===================================================
     9. HERO VIDEO AUTOPLAY & AUTOMATIC AUDIO TRIGGER
     =================================================== */
  const heroVideo = document.getElementById('hero-video');
  
  if (heroVideo) {
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log("Autoplay blocked. Attaching user fallback triggers.");
        const startVideoOnInteraction = () => {
          heroVideo.play().then(() => {
            document.removeEventListener('click', startVideoOnInteraction);
            document.removeEventListener('scroll', startVideoOnInteraction);
            document.removeEventListener('touchstart', startVideoOnInteraction);
          });
        };
        document.addEventListener('click', startVideoOnInteraction);
        document.addEventListener('scroll', startVideoOnInteraction);
        document.addEventListener('touchstart', startVideoOnInteraction);
      });
    }
  }

  let userWantsSound = false;
  let volumeFadeInterval = null;

  const fadeVideoVolume = (targetVolume, duration = 800) => {
    if (!heroVideo) return;
    
    // Mobile/touch devices (iOS/Android Safari/Chrome) do not support programmatically setting 'volume' (it is read-only).
    // We must toggle the 'muted' attribute directly.
    if (isTouchDevice) {
      if (targetVolume === 0) {
        heroVideo.muted = true;
      } else {
        heroVideo.muted = false;
        heroVideo.volume = 1.0;
      }
      return;
    }
    
    if (targetVolume > 0 && heroVideo.muted) {
      heroVideo.muted = false;
    }

    clearInterval(volumeFadeInterval);
    
    const startVolume = heroVideo.volume;
    const difference = targetVolume - startVolume;
    const stepTime = 30; // 30ms step updates
    const steps = duration / stepTime;
    const stepAmount = difference / steps;
    
    let currentStep = 0;
    
    volumeFadeInterval = setInterval(() => {
      currentStep++;
      let nextVolume = startVolume + (stepAmount * currentStep);
      
      // Clamp values
      if (nextVolume < 0) nextVolume = 0;
      if (nextVolume > 1) nextVolume = 1;
      
      heroVideo.volume = nextVolume;
      
      if (currentStep >= steps) {
        clearInterval(volumeFadeInterval);
        heroVideo.volume = targetVolume;
        if (targetVolume === 0) {
          heroVideo.muted = true;
        }
      }
    }, stepTime);
  };

  // Auto-Unmute voice smoothly on first page interaction
  const autoUnmuteOnInteraction = () => {
    if (heroVideo) {
      if (isTouchDevice) {
        heroVideo.muted = false;
        heroVideo.volume = 1.0;
      } else {
        heroVideo.volume = 0;
        fadeVideoVolume(1, 1000); // Smooth fade to 100% volume over 1s
      }
      
      // Attempt to verify if the video is successfully unmuted.
      // If the browser blocked it (e.g. if the user gesture wasn't registered yet),
      // we keep the listeners active so the next click/tap will unmute it.
      if (!heroVideo.muted) {
        userWantsSound = true;
        console.log("Voice unmuted automatically.");
        
        // Clean up all document listener handles
        document.removeEventListener('click', autoUnmuteOnInteraction);
        document.removeEventListener('touchend', autoUnmuteOnInteraction);
      }
    }
  };

  // Wait 1.0s after page loads before listening to click/touchend triggers to prevent sudden audio shock
  setTimeout(() => {
    document.addEventListener('click', autoUnmuteOnInteraction);
    document.addEventListener('touchend', autoUnmuteOnInteraction);
  }, 1000);

  // Auto-mute audio smoothly when scrolling out of hero, auto-unmute smoothly when scrolling back up
  const handleScrollAudioMute = () => {
    if (!heroVideo) return;
    const scrollThreshold = window.innerHeight * 0.6; // 60% of screen height
    
    if (window.scrollY > scrollThreshold) {
      if (!heroVideo.muted && heroVideo.volume > 0) {
        fadeVideoVolume(0, 800); // Fade out to silent over 800ms
        console.log("Audio fading out on scroll down.");
      }
    } else {
      if (userWantsSound && (heroVideo.muted || heroVideo.volume < 1)) {
        fadeVideoVolume(1, 800); // Fade in to full volume over 800ms
        console.log("Audio fading in on scroll up.");
      }
    }
  };

  window.addEventListener('scroll', handleScrollAudioMute);

  /* ===================================================
     10. SCROLL REVEAL & SKILL BARS ACTIVATION
     =================================================== */
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  const skillBarFills = document.querySelectorAll('.skill-bar-fill');
  
  skillBarFills.forEach(bar => {
    const targetWidth = bar.style.width;
    bar.setAttribute('data-target-width', targetWidth);
    bar.style.width = '0%';
  });

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        const bars = entry.target.querySelectorAll('.skill-bar-fill');
        if (bars.length > 0) {
          bars.forEach(bar => {
            const width = bar.getAttribute('data-target-width');
            bar.style.width = width;
          });
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => scrollObserver.observe(el));

  /* ===================================================
     11. PROJECTS FILTERING LOGIC
     =================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px) scale(0.9)';
          setTimeout(() => {
            item.classList.add('hidden');
          }, 300);
        }
      });
    });
  });

  /* ===================================================
     12. INTERACTIVE PROJECTS DEMO MODAL
     =================================================== */
  const modal = document.getElementById('video-modal');
  const modalPlayer = document.getElementById('modal-player');
  const modalTitle = document.getElementById('modal-project-title');
  const modalDesc = document.getElementById('modal-project-desc');
  const closeBackdrop = document.getElementById('modal-close-backdrop');
  const closeModalBtn = document.getElementById('btn-modal-close');
  
  const projectDetails = {
    'btn-project-new': {
      title: 'Color Tube Master 3D & Arcade',
      desc: `<strong>Color Tube Master 3D & Arcade</strong> is a premium 3D puzzle arcade game and native Android wrapper built entirely in Vanilla JS/CSS3 and Kotlin.<br><br>
<strong>Core Tech Stack:</strong> HTML5, Vanilla CSS3 (3D Isometric transforms), ES6+ JS, Firebase Auth, Firestore Database, Kotlin, Jetpack Compose, Web Audio API.<br><br>
<strong>Key Technical Achievements:</strong><br>
• <strong>Custom 3D Isometric Engine (Pure CSS):</strong> Designed visual isometric containers with liquid layers using CSS 3D transforms.<br>
• <strong>Algorithmic AI Solvers:</strong> Implemented BFS solvers for puzzles and a Minimax AI engine for 3D isometric Tic-Tac-Toe.<br>
• <strong>Procedural Audio Synthesis:</strong> Synthesized all game audio mathematically via the browser's Web Audio API.<br>
• <strong>Real-time Cloud Sync:</strong> Used Firebase Firestore live listeners to sync leaderboards and player states.<br>
• <strong>Native Android Wrapper:</strong> Built service workers for offline play and packaged the app in a Kotlin WebView container.<br><br>
<div class="modal-links" style="display: flex; gap: 15px; margin-top: 15px;">
  <a href="https://color-tube-master.web.app" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 8px 16px; font-size: 0.8rem; text-decoration: none; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; width: auto; height: 36px; min-width: 100px;">Live Demo</a>
  <a href="https://github.com/Abhinandasn251515/color-tube-master" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 8px 16px; font-size: 0.8rem; text-decoration: none; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; width: auto; height: 36px; min-width: 100px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-glass);">GitHub Repo</a>
</div>`
    },
    'btn-project-1': {
      title: 'EduCareer Platform',
      desc: `<strong>EduCareer</strong> is a comprehensive career guidance and educational path platform designed to align academic courses with industrial specifications. It provides interactive path roadmaps, skills evaluations, and links users to direct career openings matching their MCA or BCA skill levels.<br><br>
<strong>Core Tech Stack:</strong> HTML5, CSS3, JavaScript, Java, Spring Boot, MySQL.<br><br>
<strong>Key Features:</strong><br>
• Interactive career roadmap visualization.<br>
• Skill assessments and gap analysis.<br>
• Industry job matching algorithm based on skill profile.<br>
• Course recommendation system for students.`
    },
    'btn-project-2': {
      title: 'E-Commerce System',
      desc: `<strong>E-Commerce System</strong> is an interactive online marketplace built to demonstrate database optimization and modern frontend layout design. Implements complete product catalogue queries, cart additions, session checks, and an automated mock checkout process.<br><br>
<strong>Core Tech Stack:</strong> JavaScript, Bootstrap, Node.js, Express, MongoDB.<br><br>
<strong>Key Features:</strong><br>
• Fast search queries and dynamic category filters.<br>
• Secure user sessions and checkout validation.<br>
• Backend database optimization to handle concurrent traffic.`
    },
    'btn-project-3': {
      title: 'Tech Vlog Narrative',
      desc: 'This video demonstrates clean editing technique, background audio balancing, color grading matching tech-space aesthetic, and highly fluid callout graphics designed to maximize viewer watch time.'
    },
    'btn-project-4': {
      title: 'Cinematic Travel Reel',
      desc: 'Vertical 9:16 layout optimizing speed-ramping, camera pans, atmospheric sounds, and cohesive Teal-and-Orange color correction to draw immediate viewer attention on Instagram Reels.'
    },
    'btn-project-5': {
      title: 'Logo Reveal Animation',
      desc: 'Sleek motion graphics, utilizing After Effects with complex particle effects, metallic gloss shaders, and custom sound design to create an energetic brand intro.'
    },
    'btn-project-6': {
      title: 'SaaS Product Commercial',
      desc: 'Highly customized ad commercial. Includes kinetic typography animations, modern stock overlays, dynamic slide transitions, and clear calls to action suited for B2B Facebook advertising.'
    }
  };

  const openModal = (projectId) => {
    const details = projectDetails[projectId];
    if (details && modal) {
      modalTitle.textContent = details.title;
      modalDesc.innerHTML = details.desc;
      
      const isDevProject = projectId === 'btn-project-1' || projectId === 'btn-project-2' || projectId === 'btn-project-new';
      const videoWrapper = document.querySelector('.modal-video-wrapper');
      
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
      
      if (isDevProject) {
        if (videoWrapper) videoWrapper.style.display = 'none';
      } else {
        if (videoWrapper) videoWrapper.style.display = 'block';
        if (modalPlayer) {
          modalPlayer.currentTime = 0;
          modalPlayer.play().catch(e => console.log('Playback prevented: ' + e));
        }
      }
    }
  };

  const closeModal = () => {
    if (modal && modalPlayer) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
      modalPlayer.pause();
    }
  };

  document.querySelectorAll('.btn-play-demo').forEach(btn => {
    btn.addEventListener('click', (e) => {
      openModal(e.target.id);
    });
  });

  if (closeBackdrop && closeModalBtn) {
    closeBackdrop.addEventListener('click', closeModal);
    closeModalBtn.addEventListener('click', closeModal);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  /* ===================================================
     13. CONTACT FORM HANDLER (Formspree Email Integration)
     =================================================== */
  const contactForm = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success-msg');
  const submitBtn = document.getElementById('btn-submit-form');
  
  if (contactForm && successMsg && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const originalBtnHtml = submitBtn.innerHTML;
      
      // Update button state to loading
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Transmitting...</span><svg class="btn-icon spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" stroke-dasharray="16" stroke-dashoffset="0"></path></svg>`;
      
      if (!document.getElementById('spinner-style')) {
        const style = document.createElement('style');
        style.id = 'spinner-style';
        style.textContent = `
          .spinner { animation: spin 1s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `;
        document.head.appendChild(style);
      }

      // Deactivate automatic unmute triggers since they interacted
      document.removeEventListener('click', autoUnmuteOnInteraction);
      document.removeEventListener('scroll', autoUnmuteOnInteraction);
      document.removeEventListener('touchstart', autoUnmuteOnInteraction);

      // Submit data via AJAX fetch to Formspree action endpoint
      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
        
        if (response.ok) {
          // Show visual success overlay
          successMsg.classList.add('visible');
          successMsg.setAttribute('aria-hidden', 'false');
          contactForm.reset();
          
          setTimeout(() => {
            successMsg.classList.remove('visible');
            successMsg.setAttribute('aria-hidden', 'true');
          }, 5000);
        } else {
          response.json().then(data => {
            if (data && data.message) {
              alert("Submission failed: " + data.message);
            } else {
              alert("Submission failed. Please try again or contact me directly via email.");
            }
          });
        }
      })
      .catch(error => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
        alert("Connection Error: Ensure your internet connection is active.");
        console.error(error);
      });
    });
  }

  /* ===================================================
     14. MATRIX RAIN EFFECT
     =================================================== */
  const canvas = document.getElementById('matrix-canvas');
  let ctx = null;
  let matrixInterval = null;
  let matrixActive = false;

  const initMatrixRain = () => {
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const katakana = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const alphabet = katakana.split("");

    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const rainDrops = [];
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(3, 7, 18, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-cyan').trim() || '#00f2fe';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    };

    matrixInterval = setInterval(draw, 30);
  };

  const toggleMatrix = () => {
    if (!canvas) return;
    matrixActive = !matrixActive;
    if (matrixActive) {
      canvas.classList.add('active');
      if (!matrixInterval) {
        initMatrixRain();
      }
    } else {
      canvas.classList.remove('active');
      if (matrixInterval) {
        clearInterval(matrixInterval);
        matrixInterval = null;
      }
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  window.addEventListener('resize', () => {
    if (matrixActive && canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  });

  /* ===================================================
     15. ACCENT COLOR THEME SHIFTING
     =================================================== */
  const accentThemes = [
    { cyan: '#00f2fe', purple: '#a855f7', blue: '#3b82f6' }, // Default Cyan/Purple
    { cyan: '#39ff14', purple: '#00f2fe', blue: '#2563eb' }, // Neon Green
    { cyan: '#ff007f', purple: '#ff7700', blue: '#db2777' }, // Cyber Pink & Orange
    { cyan: '#ffd700', purple: '#fb923c', blue: '#ea580c' }  // Cyber Gold
  ];
  let currentThemeIndex = 0;

  const shiftAccentTheme = () => {
    currentThemeIndex = (currentThemeIndex + 1) % accentThemes.length;
    const theme = accentThemes[currentThemeIndex];
    document.documentElement.style.setProperty('--accent-cyan', theme.cyan);
    document.documentElement.style.setProperty('--accent-purple', theme.purple);
    document.documentElement.style.setProperty('--accent-blue', theme.blue);
    
    // Also update custom equalizer and glow variables
    document.documentElement.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${theme.cyan} 0%, ${theme.purple} 100%)`);
    document.documentElement.style.setProperty('--glow-shadow', `0 0 20px ${theme.cyan}4d`);
  };

  /* ===================================================
     16. SPEECH SYNTHESIS (VOICE OUT)
     =================================================== */
  const aiResponse = document.getElementById('ai-response');
  const aiVisualizer = document.getElementById('ai-visualizer');
  let currentUtterance = null;

  // Preload voices list early to ensure SpeechSynthesis behaves correctly in all browsers
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }

  const speakText = (text) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    if (aiVisualizer) aiVisualizer.classList.remove('active');

    if (aiResponse) aiResponse.textContent = text;

    currentUtterance = new SpeechSynthesisUtterance(text);
    
    const voices = window.speechSynthesis.getVoices();
    
    // Look for a high-quality English voice
    let selectedVoice = voices.find(voice => voice.lang.includes('en-US') || voice.lang.includes('en_US'))
                    || voices.find(voice => voice.lang.includes('en-GB') || voice.lang.includes('en_GB'))
                    || voices.find(voice => voice.lang.includes('en'));

    if (selectedVoice) {
      currentUtterance.voice = selectedVoice;
    }
    
    currentUtterance.rate = 1.02;
    currentUtterance.pitch = 1.0;

    currentUtterance.onstart = () => {
      if (aiVisualizer) aiVisualizer.classList.add('active');
    };

    currentUtterance.onend = () => {
      if (aiVisualizer) aiVisualizer.classList.remove('active');
    };

    currentUtterance.onerror = (e) => {
      console.error("SpeechSynthesis error:", e);
      if (aiVisualizer) aiVisualizer.classList.remove('active');
    };

    window.speechSynthesis.speak(currentUtterance);
  };

  /* ===================================================
     17. SPEECH RECOGNITION (VOICE COMMANDS)
     =================================================== */
  const btnMic = document.getElementById('btn-mic');
  const micStatus = document.getElementById('mic-status');
  let recognition = null;
  let isListening = false;

  const initSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (micStatus) micStatus.textContent = "Unsupported";
      if (btnMic) btnMic.disabled = true;
      return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isListening = true;
      if (btnMic) btnMic.classList.add('listening');
      if (micStatus) micStatus.textContent = "Listening...";
    };

    recognition.onend = () => {
      isListening = false;
      if (btnMic) btnMic.classList.remove('listening');
      if (micStatus) micStatus.textContent = "Tap to Speak";
    };

    recognition.onerror = (e) => {
      console.error(e);
      isListening = false;
      if (btnMic) btnMic.classList.remove('listening');
      if (micStatus) micStatus.textContent = "Retry Command";
    };

    recognition.onresult = (e) => {
      const command = e.results[0][0].transcript.toLowerCase();
      console.log("Command received:", command);
      handleAICommand(command);
    };
  };

  const toggleListening = () => {
    if (!recognition) initSpeechRecognition();
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      window.speechSynthesis.cancel();
      recognition.start();
    }
  };

  if (btnMic) {
    btnMic.addEventListener('click', toggleListening);
  }

  /* ===================================================
     18. NEURAL PANEL COMMAND PROTOCOLS
     =================================================== */
  const handleAICommand = (cmd) => {
    const cleanCmd = cmd.trim().toLowerCase();
    
    if (cleanCmd.includes('greet') || cleanCmd.includes('hello') || cleanCmd.includes('hi') || cleanCmd.includes('assistant')) {
      speakText("Greetings! I am the digital assistant for Abhinandan Ghosh. I can display his technical skills, reveal his creative projects, toggle holographic matrix overlays, or change the page design color scheme. What details do you require?");
    }
    else if (cleanCmd.includes('skills') || cleanCmd.includes('dsa') || cleanCmd.includes('programming') || cleanCmd.includes('java') || cleanCmd.includes('python')) {
      speakText("Accessing skills protocol. Abhinandan specializes in Python, Java, Data Structures, Algorithms, and Frontend Development. I am scrolling you to the Skills and Tools section now.");
      document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
    }
    else if (cleanCmd.includes('project') || cleanCmd.includes('work') || cleanCmd.includes('portfolio') || cleanCmd.includes('showcase')) {
      speakText("Opening Abhinandan's project catalog. It lists developer projects like EduCareer guidance and creative media videos. Scrolling to projects.");
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    }
    else if (cleanCmd.includes('about') || cleanCmd.includes('who is') || cleanCmd.includes('education') || cleanCmd.includes('experience') || cleanCmd.includes('biography')) {
      speakText("Abhinandan Ghosh is a Master of Computer Applications student at MSIT and holds a BCA from Brainware. He is a Good Listener and a team player. Scrolling to his biography.");
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    }
    else if (cleanCmd.includes('matrix') || cleanCmd.includes('code') || cleanCmd.includes('hologram') || cleanCmd.includes('rain')) {
      speakText("Initiating digital matrix code rain overlay. Observe the screen backdrop.");
      toggleMatrix();
    }
    else if (cleanCmd.includes('color') || cleanCmd.includes('theme') || cleanCmd.includes('accent') || cleanCmd.includes('shift')) {
      shiftAccentTheme();
      speakText("Design accent theme shifted successfully. Recalibrating glowing vectors.");
    }
    else if (cleanCmd.includes('contact') || cleanCmd.includes('mail') || cleanCmd.includes('email') || cleanCmd.includes('send')) {
      speakText("Opening communications console. You can submit the form to email Abhinandan directly, or connect instantly on WhatsApp. Scrolling down.");
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
    else {
      speakText("Command unrecognized. Please say: 'skills', 'projects', 'matrix', 'color', 'about', or 'greet'.");
    }
  };

  /* ===================================================
     19. PANEL INTERACTIVES (OPEN / CLOSE)
     =================================================== */
  const aiTrigger = document.getElementById('ai-core-trigger');
  const aiPanel = document.getElementById('ai-panel');
  const aiClose = document.getElementById('ai-close-btn');
  const aiBackdrop = document.getElementById('ai-panel-backdrop');
  
  const openAIPanel = () => {
    if (aiPanel) {
      aiPanel.classList.add('open');
      aiPanel.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
      
      // Stop general background video voice smoothly if AI starts talking to avoid overlap
      if (heroVideo && !heroVideo.muted && heroVideo.volume > 0) {
        fadeVideoVolume(0, 300); // Quick fade out over 300ms
      }
      
      speakText("Neural Assistant Core online. State your command protocol.");
    }
  };

  const closeAIPanel = () => {
    if (aiPanel) {
      aiPanel.classList.remove('open');
      aiPanel.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
      window.speechSynthesis.cancel();
      if (recognition && isListening) recognition.stop();
      
      // Fade back in if still inside the Hero viewport range
      const scrollThreshold = window.innerHeight * 0.6;
      if (window.scrollY <= scrollThreshold && heroVideo && userWantsSound) {
        fadeVideoVolume(1, 600); // Smooth fade in over 600ms
      }
    }
  };

  if (aiTrigger) aiTrigger.addEventListener('click', openAIPanel);
  if (aiClose) aiClose.addEventListener('click', closeAIPanel);
  if (aiBackdrop) aiBackdrop.addEventListener('click', closeAIPanel);

  // Command chip clicks
  document.querySelectorAll('.ai-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const cmd = e.target.getAttribute('data-cmd');
      handleAICommand(cmd);
    });
  });

  /* ===================================================
     20. HERO INTERACTIVE PARTICLE NETWORK
     =================================================== */
  const initHeroParticles = () => {
    const pCanvas = document.getElementById('hero-particles');
    if (!pCanvas) return;
    const pCtx = pCanvas.getContext('2d');
    
    let width = pCanvas.width = pCanvas.offsetWidth;
    let height = pCanvas.height = pCanvas.offsetHeight;
    
    const particles = [];
    const maxParticles = isTouchDevice ? 30 : 70;
    const connectionDist = 110;
    const mouse = { x: null, y: null, radius: 150 };
    
    window.addEventListener('resize', () => {
      if (pCanvas) {
        width = pCanvas.width = pCanvas.offsetWidth;
        height = pCanvas.height = pCanvas.offsetHeight;
      }
    });
    
    const heroSection = document.getElementById('hero');
    if (heroSection && !isTouchDevice) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
      heroSection.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
      });
    }
    
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
        
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= dx * force * 0.02;
            this.y -= dy * force * 0.02;
          }
        }
      }
      
      draw() {
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        pCtx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-cyan').trim() || '#00f2fe';
        pCtx.fill();
      }
    }
    
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }
    
    const animate = () => {
      pCtx.clearRect(0, 0, width, height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < connectionDist) {
            const alpha = (1 - (dist / connectionDist)) * 0.12;
            pCtx.save();
            pCtx.globalAlpha = alpha;
            pCtx.beginPath();
            pCtx.moveTo(particles[i].x, particles[i].y);
            pCtx.lineTo(particles[j].x, particles[j].y);
            
            const accentCyan = getComputedStyle(document.documentElement).getPropertyValue('--accent-cyan').trim() || '#00f2fe';
            pCtx.strokeStyle = accentCyan;
            pCtx.lineWidth = 0.8;
            pCtx.stroke();
            pCtx.restore();
          }
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
  };

  // Run the particle network
  initHeroParticles();
});
