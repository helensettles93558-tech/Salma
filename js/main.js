(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const html = document.documentElement;
  let language = 'ar';
  let letterStarted = false;
  let letterObserver;
  let blown = false;
  let wishesMade = 0;

  function setLanguage(next) {
    language = next;
    html.lang = next;
    html.dir = next === 'ar' ? 'rtl' : 'ltr';
    $$('[data-ar][data-en]').forEach((element) => {
      const text = element.dataset[next];
      if (text !== undefined && element.id !== 'letterText') element.innerHTML = text.replace(/\n/g, '<br>');
    });
    $('#languageToggle').textContent = next === 'ar' ? 'EN' : 'عربي';
    $('#languageToggle').setAttribute('aria-label', next === 'ar' ? 'Switch language' : 'تغيير اللغة');
    $('#musicToggle').setAttribute('aria-label', next === 'ar' ? 'تشغيل الموسيقى' : 'Play music');
    if (letterStarted) $('#letterText').textContent = $('#letterText').dataset[next];
  }

  $('#languageToggle').addEventListener('click', () => setLanguage(language === 'ar' ? 'en' : 'ar'));
  setLanguage(language);

  // A quiet field of drifting stars stays behind the entire experience.
  const ambient = $('#ambient');
  const particleCount = window.innerWidth < 600 ? 18 : 32;
  const particleGlyphs = ['✦', '✧', '·', '♡'];
  for (let i = 0; i < particleCount; i += 1) {
    const particle = document.createElement('i');
    particle.className = 'ambient-particle';
    particle.textContent = particleGlyphs[Math.floor(Math.random() * particleGlyphs.length)];
    particle.style.setProperty('--x', `${Math.random() * 100}%`);
    particle.style.setProperty('--y', `${Math.random() * 100}%`);
    particle.style.setProperty('--size', `${7 + Math.random() * 12}px`);
    particle.style.setProperty('--duration', `${5 + Math.random() * 9}s`);
    particle.style.setProperty('--delay', `${-Math.random() * 12}s`);
    particle.style.setProperty('--drift', `${-32 + Math.random() * 64}px`);
    particle.style.setProperty('--tone', Math.random() > .55 ? '#e9a3ac' : '#e5c99a');
    particle.style.setProperty('--opacity', `${.2 + Math.random() * .35}`);
    ambient.appendChild(particle);
  }

  // Entrance: let the visitor open the gift; audio is never started automatically.
  const prelude = $('#prelude');
  document.body.classList.add('locked');
  $('#openGift').addEventListener('click', () => {
    if (prelude.classList.contains('is-gone')) return;
    if (typeof confetti === 'function' && !reducedMotion) {
      confetti({ particleCount: 65, spread: 72, startVelocity: 28, origin: { y: .58 }, colors: ['#e9a3ac', '#e5c99a', '#fff0df', '#9b7aa8'] });
    }
    prelude.classList.add('is-gone');
    document.body.classList.remove('locked');
    if (window.gsap && !reducedMotion) {
      gsap.fromTo('.hero-copy', { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: .25 });
      gsap.fromTo('.hero-sparkles i', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, stagger: .08, duration: .8, delay: .4, ease: 'back.out(2)' });
    }
  });

  // Scroll reveals and the age counter, with an IntersectionObserver fallback.
  if (window.gsap && window.ScrollTrigger && !reducedMotion) {
    gsap.registerPlugin(ScrollTrigger);
    $$('.reveal').forEach((element) => {
      gsap.fromTo(element, { y: 28, opacity: 0 }, {
        y: 0, opacity: 1, duration: .85, ease: 'power2.out',
        scrollTrigger: { trigger: element, start: 'top 88%', once: true },
      });
    });
    gsap.to('#progressBar', { width: '100%', ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: .2 } });
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    $$('.reveal').forEach((element) => revealObserver.observe(element));
    const progressBar = $('#progressBar');
    window.addEventListener('scroll', () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    }, { passive: true });
  }

  const ageCard = $('.age-card');
  const ageNumber = $('.age-number');
  let ageCounted = false;
  const countAge = () => {
    if (ageCounted) return;
    ageCounted = true;
    const target = Number(ageNumber.dataset.count) || 25;
    if (window.gsap && !reducedMotion) {
      const count = { value: 0 };
      gsap.to(count, { value: target, duration: 2.1, ease: 'power2.out', onUpdate: () => { ageNumber.textContent = String(Math.round(count.value)).padStart(2, '0'); } });
    } else {
      ageNumber.textContent = String(target).padStart(2, '0');
    }
  };
  new IntersectionObserver((entries, observer) => {
    if (entries[0].isIntersecting) { countAge(); observer.disconnect(); }
  }, { threshold: .55 }).observe(ageCard);

  // Envelope opens as the letter enters view; a typewriter honors line breaks.
  const letterWrap = $('.letter-wrap');
  const letterText = $('#letterText');
  const typeLetter = () => {
    if (letterStarted) return;
    letterStarted = true;
    letterWrap.classList.add('open');
    const fullText = letterText.dataset[language];
    letterText.textContent = '';
    if (reducedMotion) { letterText.textContent = fullText; return; }
    let position = 0;
    const typeNext = () => {
      if (position >= fullText.length) return;
      const char = fullText[position++];
      letterText.textContent += char;
      window.setTimeout(typeNext, char === '\n' ? 280 : 19);
    };
    typeNext();
  };
  letterObserver = new IntersectionObserver((entries, observer) => {
    if (entries[0].isIntersecting) { typeLetter(); observer.disconnect(); }
  }, { threshold: .3 });
  letterObserver.observe(letterWrap);

  // Cake: blowing out flames triggers confetti, a visual firework, and a soft optional chime.
  function fireworkBurst() {
    if (typeof confetti !== 'function' || reducedMotion) return;
    const duration = 1250;
    const end = Date.now() + duration;
    const colors = ['#e9a3ac', '#e5c99a', '#fff0df', '#b899c5'];
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 62, origin: { x: .05, y: .68 }, colors, startVelocity: 36, ticks: 90 });
      confetti({ particleCount: 3, angle: 120, spread: 62, origin: { x: .95, y: .68 }, colors, startVelocity: 36, ticks: 90 });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
    confetti({ particleCount: 100, spread: 130, startVelocity: 42, origin: { y: .56 }, colors, scalar: 1.05 });
  }
  function playChime() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      [659.25, 783.99, 987.77].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(.0001, context.currentTime + index * .12);
        gain.gain.exponentialRampToValueAtTime(.08, context.currentTime + index * .12 + .03);
        gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + index * .12 + .65);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start(context.currentTime + index * .12);
        oscillator.stop(context.currentTime + index * .12 + .7);
      });
      window.setTimeout(() => context.close(), 1400);
    } catch (_) { /* Audio may be unavailable or blocked; the visual surprise still works. */ }
  }
  $('#blowCandles').addEventListener('click', () => {
    if (blown) return;
    blown = true;
    $('#cake').classList.add('blown');
    $('#surpriseHint').textContent = language === 'ar' ? 'كل سنة وإنتِ منوّرة حياتي يا سلمى! ✨' : 'You light up my life, Salma. Happy birthday! ✨';
    fireworkBurst();
    playChime();
  });
  $('#makeWish').addEventListener('click', () => {
    wishesMade += 1;
    const count = window.innerWidth < 600 ? 9 : 17;
    for (let i = 0; i < count; i += 1) {
      const lantern = document.createElement('span');
      lantern.className = 'wish-lantern';
      lantern.textContent = i % 3 === 0 ? '♡' : '✧';
      lantern.style.cssText = `position:fixed;z-index:70;left:${8 + Math.random() * 84}vw;bottom:${5 + Math.random() * 14}vh;color:${i % 2 ? '#e9a3ac' : '#e5c99a'};font-size:${15 + Math.random() * 17}px;pointer-events:none;text-shadow:0 0 16px currentColor;transition:transform ${4 + Math.random() * 2}s linear,opacity 4s linear;`;
      document.body.appendChild(lantern);
      requestAnimationFrame(() => { lantern.style.transform = `translate(${Math.random() * 55 - 27}px,-${window.innerHeight * (.7 + Math.random() * .3)}px) rotate(${Math.random() * 40 - 20}deg)`; lantern.style.opacity = '0'; });
      window.setTimeout(() => lantern.remove(), 6700);
    }
    if (typeof confetti === 'function' && !reducedMotion) confetti({ particleCount: 35, spread: 75, origin: { y: .73 }, colors: ['#e9a3ac', '#e5c99a', '#fff0df'], scalar: .8 });
    $('#surpriseHint').textContent = language === 'ar' ? 'أمنيتك وصلت للنجوم… يا رب تتحقق كلها ✨' : 'Your wish made it to the stars… may every one come true ✨';
  });

  // Tap-to-flip keepsake cards reveal a personal promise.
  $$('.promise-card').forEach((card) => {
    card.addEventListener('click', () => {
      const flipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', String(flipped));
    });
  });

  // Hidden heart easter egg.
  const secretModal = $('#secretModal');
  $('#secretHeart').addEventListener('click', () => secretModal.classList.add('open'));
  $('#secretClose').addEventListener('click', () => secretModal.classList.remove('open'));
  secretModal.addEventListener('click', (event) => { if (event.target === secretModal) secretModal.classList.remove('open'); });

  // Music button; missing placeholder file simply leaves the button idle.
  const music = $('#backgroundMusic');
  const musicToggle = $('#musicToggle');
  musicToggle.addEventListener('click', async () => {
    if (music.paused) {
      try {
        await music.play();
        musicToggle.classList.add('playing');
        musicToggle.querySelector('.music-icon').textContent = '♫';
      } catch (_) {
        musicToggle.title = language === 'ar' ? 'ضيفي ملف الموسيقى في assets/music.mp3' : 'Add your song at assets/music.mp3';
      }
    } else {
      music.pause();
      musicToggle.classList.remove('playing');
    }
  });
  music.addEventListener('error', () => { musicToggle.title = language === 'ar' ? 'ضيفي ملف الموسيقى في assets/music.mp3' : 'Add your song at assets/music.mp3'; });

  // Desktop-only subtle cursor sparkle and hero parallax; touch stays clean and fast.
  const cursorSpark = $('#cursorSpark');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion) {
    let lastTrailAt = 0;
    window.addEventListener('mousemove', (event) => {
      cursorSpark.classList.add('visible');
      cursorSpark.style.left = `${event.clientX}px`;
      cursorSpark.style.top = `${event.clientY}px`;
      if (event.timeStamp - lastTrailAt > 85) {
        lastTrailAt = event.timeStamp;
        const trail = document.createElement('span');
        trail.textContent = Math.random() > .5 ? '✦' : '·';
        trail.style.cssText = `position:fixed;z-index:99;left:${event.clientX}px;top:${event.clientY}px;pointer-events:none;color:${Math.random() > .5 ? '#e9a3ac' : '#e5c99a'};font-size:${8 + Math.random() * 7}px;opacity:.85;transition:transform .55s ease,opacity .55s ease;text-shadow:0 0 10px currentColor`;
        document.body.appendChild(trail);
        requestAnimationFrame(() => { trail.style.transform = `translate(${Math.random() * 18 - 9}px,${Math.random() * 18 - 9}px) scale(.35)`; trail.style.opacity = '0'; });
        window.setTimeout(() => trail.remove(), 600);
      }
    }, { passive: true });
    window.addEventListener('mouseleave', () => cursorSpark.classList.remove('visible'));
    $('.hero').addEventListener('mousemove', (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      $('.hero-copy').style.transform = `translate3d(${x * -9}px,${y * -8}px,0)`;
    }, { passive: true });
    $('.hero').addEventListener('mouseleave', () => { $('.hero-copy').style.transform = ''; });
  }

  // Hearts and sparkles appear where the visitor taps or clicks.
  document.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button, a')) return;
    const sparkle = document.createElement('span');
    sparkle.textContent = Math.random() > .48 ? '♡' : '✦';
    sparkle.style.cssText = `position:fixed;z-index:80;left:${event.clientX}px;top:${event.clientY}px;pointer-events:none;color:${Math.random() > .5 ? '#e9a3ac' : '#e5c99a'};font-size:${13 + Math.random() * 10}px;transform:translate(-50%,-50%);opacity:1;transition:transform .8s ease,opacity .8s ease;text-shadow:0 0 12px currentColor`;
    document.body.appendChild(sparkle);
    requestAnimationFrame(() => { sparkle.style.transform = `translate(${Math.random() * 20 - 10}px,-${24 + Math.random() * 18}px) scale(.6)`; sparkle.style.opacity = '0'; });
    window.setTimeout(() => sparkle.remove(), 900);
  }, { passive: true });

  // Keyboard controls and replay of the opening.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') secretModal.classList.remove('open');
  });
  $('#replay').addEventListener('click', () => {
    if (!music.paused) { music.pause(); musicToggle.classList.remove('playing'); }
    blown = false;
    $('#cake').classList.remove('blown');
    $$('.candle i').forEach((flame) => { flame.style.animation = ''; });
    $('#surpriseHint').textContent = $('#surpriseHint').dataset[language];
    wishesMade = 0;
    $$('.promise-card').forEach((card) => { card.classList.remove('is-flipped'); card.setAttribute('aria-pressed', 'false'); });
    letterStarted = false;
    letterWrap.classList.remove('open');
    letterText.textContent = '';
    letterObserver = new IntersectionObserver((entries, observer) => {
      if (entries[0].isIntersecting) { typeLetter(); observer.disconnect(); }
    }, { threshold: .3 });
    letterObserver.observe(letterWrap);
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
    document.body.classList.add('locked');
    prelude.classList.remove('is-gone');
  });

  // Keep the optional mobile tilt/parallax deliberately subtle.
  if (window.DeviceOrientationEvent && !reducedMotion && window.innerWidth < 760) {
    window.addEventListener('deviceorientation', (event) => {
      if (prelude.classList.contains('is-gone') && window.scrollY < window.innerHeight * .7) {
        const x = Math.max(-5, Math.min(5, (event.gamma || 0) * .1));
        const y = Math.max(-4, Math.min(4, (event.beta || 0) * .05));
        $('.hero-copy').style.transform = `translate3d(${x}px,${y}px,0)`;
      }
    }, { passive: true });
  }
})();
