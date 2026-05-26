// ===== LOADER & DOOR =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    setTimeout(() => {
      document.getElementById('temple-intro').classList.add('open');
      setTimeout(() => {
        document.getElementById('temple-intro').style.pointerEvents = 'none';
      }, 1600);
    }, 400);
  }, 3000);
});

// ===== FLOATING PETALS =====
const petalCanvas = document.getElementById('petals-canvas');
const petalCtx = petalCanvas.getContext('2d');
let petals = [];

function resizePetals() {
  petalCanvas.width = window.innerWidth;
  petalCanvas.height = window.innerHeight;
}
resizePetals();
window.addEventListener('resize', resizePetals);

const petalColors = [
  'rgba(232,180,184,0.7)',
  'rgba(245,215,142,0.65)',
  'rgba(232,150,60,0.55)',
  'rgba(201,168,76,0.5)',
  'rgba(232,180,184,0.5)',
  'rgba(255,220,180,0.55)'
];

function createPetal() {
  return {
    x: Math.random() * petalCanvas.width,
    y: -20,
    size: 4 + Math.random() * 8,
    color: petalColors[Math.floor(Math.random() * petalColors.length)],
    speedX: (Math.random() - 0.5) * 1.2,
    speedY: 0.6 + Math.random() * 1.2,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.05,
    opacity: 0.5 + Math.random() * 0.5,
    shape: Math.random() > 0.5 ? 'oval' : 'petal'
  };
}

function drawPetal(p) {
  petalCtx.save();
  petalCtx.translate(p.x, p.y);
  petalCtx.rotate(p.rotation);
  petalCtx.globalAlpha = p.opacity;
  petalCtx.fillStyle = p.color;
  if (p.shape === 'oval') {
    petalCtx.beginPath();
    petalCtx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
    petalCtx.fill();
  } else {
    petalCtx.beginPath();
    petalCtx.moveTo(0, -p.size);
    petalCtx.bezierCurveTo(p.size, -p.size * 0.5, p.size * 0.8, p.size * 0.5, 0, p.size);
    petalCtx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size, -p.size * 0.5, 0, -p.size);
    petalCtx.fill();
  }
  petalCtx.restore();
}

function animatePetals() {
  petalCtx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);
  if (petals.length < 35 && Math.random() < 0.06) petals.push(createPetal());
  petals = petals.filter(p => p.y < petalCanvas.height + 30);
  petals.forEach(p => {
    p.x += p.speedX + Math.sin(p.y * 0.02) * 0.4;
    p.y += p.speedY;
    p.rotation += p.rotSpeed;
    drawPetal(p);
  });
  requestAnimationFrame(animatePetals);
}
animatePetals();

// ===== AMBIENT PARTICLES (gold dust) =====
const partCanvas = document.getElementById('particles-canvas');
const partCtx = partCanvas.getContext('2d');
let particles = [];

function resizePart() { partCanvas.width = window.innerWidth; partCanvas.height = window.innerHeight; }
resizePart();
window.addEventListener('resize', resizePart);

function createParticle() {
  return {
    x: Math.random() * partCanvas.width,
    y: Math.random() * partCanvas.height,
    r: 0.5 + Math.random() * 1.5,
    speedY: -0.15 - Math.random() * 0.3,
    speedX: (Math.random() - 0.5) * 0.2,
    opacity: 0,
    maxOpacity: 0.3 + Math.random() * 0.4,
    phase: 'in',
    life: 0,
    maxLife: 180 + Math.random() * 200
  };
}
for (let i = 0; i < 60; i++) {
  const p = createParticle();
  p.life = Math.random() * p.maxLife;
  particles.push(p);
}

function animateParticles() {
  partCtx.clearRect(0, 0, partCanvas.width, partCanvas.height);
  particles.forEach((p, i) => {
    p.life++;
    p.x += p.speedX;
    p.y += p.speedY;
    if (p.phase === 'in') { p.opacity += 0.008; if (p.opacity >= p.maxOpacity) p.phase = 'hold'; }
    else if (p.phase === 'hold') { if (p.life > p.maxLife * 0.6) p.phase = 'out'; }
    else { p.opacity -= 0.005; }
    if (p.life >= p.maxLife || p.y < -10) { particles[i] = createParticle(); return; }
    partCtx.beginPath();
    partCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    partCtx.fillStyle = `rgba(201,168,76,${p.opacity})`;
    partCtx.fill();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal-el, .reveal-left, .reveal-right, .reveal-scale');
function checkReveal() {
  const wh = window.innerHeight;
  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < wh * 0.88) el.classList.add('revealed');
  });
}
window.addEventListener('scroll', checkReveal, { passive: true });
checkReveal();

// ===== COUNTDOWN =====
const wedding = new Date("2026-06-03T18:30:00").getTime();

function updateCountdown() {

  const now = new Date().getTime();
  const diff = wedding - now;

  if (diff <= 0) {
    document.getElementById("cd-days").innerHTML = "00";
    document.getElementById("cd-hours").innerHTML = "00";
    document.getElementById("cd-mins").innerHTML = "00";
    document.getElementById("cd-secs").innerHTML = "00";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const mins = Math.floor(
    (diff % (1000 * 60 * 60)) / (1000 * 60)
  );
  const secs = Math.floor(
    (diff % (1000 * 60)) / 1000
  );
  document.getElementById("cd-days").innerHTML =
    String(days).padStart(2, "0");

  document.getElementById("cd-hours").innerHTML =
    String(hours).padStart(2, "0");

  document.getElementById("cd-mins").innerHTML =
    String(mins).padStart(2, "0");

  document.getElementById("cd-secs").innerHTML =
    String(secs).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===== MUSIC TOGGLE (Autoplay & Manual) =====
let musicOn = false;

const musicBtn = document.getElementById('music-toggle');
const audioBars = document.getElementById('audio-bars');
const bgMusic = document.getElementById('bg-music');

// Function to handle turning the music ON
function playMusic() {
  musicOn = true;
  musicBtn.classList.add('playing');
  audioBars.classList.remove('paused');
  bgMusic.play().catch(error => {
    console.log("Autoplay prevented by browser. Waiting for user interaction.");
    musicOn = false;
    musicBtn.classList.remove('playing');
    audioBars.classList.add('paused');
  });
}

// Function to handle pausing the music
function pauseMusic() {
  musicOn = false;
  musicBtn.classList.remove('playing');
  audioBars.classList.add('paused');
  bgMusic.pause();
}

// 1. Attempt to autoplay when the script loads
window.addEventListener('DOMContentLoaded', () => {
  playMusic();
  
  // 2. Fallback: If autoplay fails, play on the very first user interaction
  const emergencyAutoplay = () => {
    if (!musicOn) {
      playMusic();
    }
    // Remove the listener immediately so it doesn't keep firing
    document.removeEventListener('click', emergencyAutoplay);
  };
  document.addEventListener('click', emergencyAutoplay);
});

// 3. Manual toggle button listener
musicBtn.addEventListener('click', (e) => {
  // Prevent the document click listener from conflicting if it hasn't fired yet
  e.stopPropagation(); 
  
  if (musicOn) {
    pauseMusic();
  } else {
    playMusic();
  }
});
