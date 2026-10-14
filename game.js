/**
 * CRAZY FROGS: BATALLA EN EL ESTANQUE
 * Videojuego arcade retro para 2 jugadores en el mismo teclado.
 */

// ============================================================================
// SISTEMA DE AUDIO (Web Audio API Procedural - Sin dependencias externas)
// ============================================================================
class SoundSystem {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.bgmStep = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopBgm();
    } else {
      this.startBgm();
    }
    return !this.muted;
  }

  playTone(freq, type, duration, gainStart = 0.15, gainEnd = 0.001) {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainStart, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(gainEnd, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playJump(isP1 = true) {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const startF = isP1 ? 160 : 200;
      const endF = isP1 ? 420 : 500;
      osc.frequency.setValueAtTime(startF, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endF, this.ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
    } catch (e) {}
  }

  playTongue() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(300, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }

  playCatch(points = 1) {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const baseFreq = points >= 3 ? 587.33 : 440; // D5 or A4
      const secondFreq = points >= 3 ? 880 : 659.25; // A5 or E5

      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(baseFreq, now);
      osc1.frequency.setValueAtTime(secondFreq, now + 0.08);
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.22);
    } catch (e) {}
  }

  playHurt() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {}
  }

  playSplash() {
    if (this.muted || !this.ctx) return;
    try {
      // Noise burst for splash
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);
      filter.Q.setValueAtTime(2, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch (e) {}
  }

  playBonk() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {}
  }

  playVictory() {
    if (this.muted || !this.ctx) return;
    const notes = [392, 523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.35, 0.25);
      }, idx * 130);
    });
  }

  startBgm() {
    if (this.muted || this.bgmPlaying || !this.ctx) return;
    this.bgmPlaying = true;
    this.bgmStep = 0;

    // Melody and Bassline pattern (Pond groove)
    const melody = [
      261.63, 0, 329.63, 392, 0, 329.63, 261.63, 0,
      293.66, 0, 349.23, 440, 0, 349.23, 293.66, 0,
      329.63, 0, 392, 523.25, 0, 392, 329.63, 0,
      392, 349.23, 329.63, 293.66, 261.63, 0, 0, 0
    ];
    const bass = [
      130.81, 130.81, 130.81, 130.81,
      146.83, 146.83, 146.83, 146.83,
      164.81, 164.81, 164.81, 164.81,
      196.00, 174.61, 164.81, 146.83
    ];

    const stepDuration = 180; // ms per 16th note

    this.bgmTimer = setInterval(() => {
      if (this.muted || !this.bgmPlaying) return;
      
      const mNote = melody[this.bgmStep % melody.length];
      if (mNote > 0) {
        this.playTone(mNote, 'triangle', 0.14, 0.045);
      }

      if (this.bgmStep % 2 === 0) {
        const bIdx = Math.floor((this.bgmStep % 32) / 2);
        const bNote = bass[bIdx % bass.length];
        this.playTone(bNote, 'sine', 0.22, 0.08);
      }

      this.bgmStep++;
    }, stepDuration);
  }

  stopBgm() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

const audio = new SoundSystem();

// ============================================================================
// ENTIDADES DEL JUEGO
// ============================================================================

// --- NENÚFARES (Plataformas) ---
class LilyPad {
  constructor(x, y, radius, moves = false, moveSpeed = 0, moveDist = 0) {
    this.baseX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.moves = moves;
    this.moveSpeed = moveSpeed;
    this.moveDist = moveDist;
    this.moveAngle = Math.random() * Math.PI * 2;
    this.dip = 0; // Se hunde cuando se para una rana
    this.flowerColor = Math.random() > 0.5 ? '#f472b6' : '#fbbf24';
  }

  update(dt) {
    if (this.moves) {
      this.moveAngle += this.moveSpeed * dt;
      this.x = this.baseX + Math.sin(this.moveAngle) * this.moveDist;
    }
    // Suave recuperación del hundimiento
    if (this.dip > 0) {
      this.dip = Math.max(0, this.dip - dt * 25);
    }
  }

  draw(ctx) {
    const curY = this.y + this.dip;

    // Sombra en el agua
    ctx.beginPath();
    ctx.ellipse(this.x, curY + 8, this.radius, this.radius * 0.45, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(2, 28, 18, 0.55)';
    ctx.fill();

    // Hoja del nenúfar
    ctx.save();
    ctx.translate(this.x, curY);

    ctx.beginPath();
    // Borde circular con una cuña típica de nenúfar
    ctx.arc(0, 0, this.radius, 0.35, Math.PI * 1.95);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fillStyle = '#22c55e';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#15803d';
    ctx.stroke();

    // Nervaduras internas
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(21, 128, 61, 0.4)';
    ctx.lineWidth = 2;
    for (let a = 0.5; a < Math.PI * 1.9; a += 0.8) {
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * (this.radius - 4), Math.sin(a) * (this.radius - 4));
    }
    ctx.stroke();

    // Pequeña flor de loto
    ctx.beginPath();
    ctx.arc(this.radius * 0.3, -this.radius * 0.2, 7, 0, Math.PI * 2);
    ctx.fillStyle = this.flowerColor;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.radius * 0.3, -this.radius * 0.2, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.restore();
  }
}

// --- MOSCAS Y BICHOS VOLADORES ---
class Bug {
  constructor(type, x, y, bounds) {
    this.type = type; // 'common', 'golden', 'dragonfly', 'wasp'
    this.x = x;
    this.y = y;
    this.bounds = bounds;
    this.size = 14;
    this.angle = Math.random() * Math.PI * 2;
    this.wingTimer = 0;
    this.alive = true;
    this.eatenBy = null;

    // Características por tipo
    if (this.type === 'common') {
      this.speed = 100 + Math.random() * 40;
      this.points = 1;
      this.color = '#1e293b';
      this.name = 'Mosca';
    } else if (this.type === 'golden') {
      this.speed = 140 + Math.random() * 50;
      this.points = 3;
      this.color = '#facc15';
      this.name = 'Mosca Dorada';
    } else if (this.type === 'dragonfly') {
      this.speed = 180 + Math.random() * 60;
      this.points = 5;
      this.color = '#38bdf8';
      this.name = 'Libélula Veloz';
      this.size = 18;
    } else if (this.type === 'wasp') {
      this.speed = 110 + Math.random() * 50;
      this.points = -2; // Resta en tiempo o quita vida
      this.color = '#eab308';
      this.name = 'Avispa Peligrosa';
      this.isHazard = true;
    }

    this.vx = (Math.random() - 0.5) * this.speed;
    this.vy = (Math.random() - 0.5) * this.speed * 0.8;
    this.changeDirTimer = 1 + Math.random() * 2;
  }

  update(dt) {
    if (!this.alive) return;

    this.wingTimer += dt * 35;
    this.changeDirTimer -= dt;

    if (this.changeDirTimer <= 0) {
      this.changeDirTimer = 0.8 + Math.random() * 1.5;
      const angle = Math.random() * Math.PI * 2;
      this.vx = Math.cos(angle) * this.speed;
      this.vy = Math.sin(angle) * (this.speed * 0.75);
    }

    // Movimiento oscilatorio suave
    this.x += this.vx * dt;
    this.y += (this.vy + Math.sin(this.wingTimer * 0.5) * 25) * dt;

    // Mantener dentro del área del estanque
    const pad = 20;
    if (this.x < pad) { this.x = pad; this.vx *= -1; }
    if (this.x > this.bounds.width - pad) { this.x = this.bounds.width - pad; this.vx *= -1; }
    if (this.y < 50) { this.y = 50; this.vy = Math.abs(this.vy); }
    if (this.y > this.bounds.height - 180) { this.y = this.bounds.height - 180; this.vy = -Math.abs(this.vy); }
  }

  draw(ctx) {
    if (!this.alive) return;

    ctx.save();
    ctx.translate(this.x, this.y);

    const wingSpread = Math.sin(this.wingTimer) * 6;

    // Alas transparentes que aletean
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.beginPath();
    ctx.ellipse(-3, -7 - wingSpread * 0.3, 7, 3 + Math.abs(wingSpread), -0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(3, -7 - wingSpread * 0.3, 7, 3 + Math.abs(wingSpread), 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Cuerpo según tipo
    if (this.type === 'golden') {
      // Brillo dorado
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.ellipse(0, 0, 7, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else if (this.type === 'wasp') {
      // Rayas de avispa
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Rayas amarillas
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-4, -4, 2, 8);
      ctx.fillRect(1, -4, 2, 8);
      // Aguijón
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.moveTo(-7, 0);
      ctx.lineTo(-11, 0);
      ctx.lineTo(-7, 2);
      ctx.fill();
    } else if (this.type === 'dragonfly') {
      // Libélula alargada
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.ellipse(0, 0, 11, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Ojos grandes
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(7, -1, 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Mosca común
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.ellipse(0, 0, 6, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Ojos rojos de mosca
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(3, -2, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// --- RANA (Jugador) ---
class Frog {
  constructor(playerNum, x, y, customName) {
    this.playerNum = playerNum; // 1 o 2
    this.name = customName || (playerNum === 1 ? 'Rana Verde' : 'Rana Coral');
    this.x = x;
    this.y = y;
    this.spawnX = x;
    this.spawnY = y;
    this.vx = 0;
    this.vy = 0;
    this.width = 46;
    this.height = 38;
    this.onGround = true;
    this.currentLilyPad = null;
    this.facing = playerNum === 1 ? 1 : -1; // 1: derecha, -1: izquierda
    this.isCrouching = false;
    this.isLookingUp = false;

    // Aspecto / Colores
    if (playerNum === 1) {
      this.bodyColor = '#22c55e';
      this.darkColor = '#15803d';
      this.bellyColor = '#dcfce7';
      this.eyeColor = '#facc15';
    } else {
      this.bodyColor = '#f97316';
      this.darkColor = '#c2410c';
      this.bellyColor = '#ffedd5';
      this.eyeColor = '#facc15';
    }

    // Estadísticas
    this.score = 0;
    this.fliesEaten = 0;
    this.tongueShots = 0;
    this.lives = 3;
    this.stunTimer = 0;
    this.invulnerableTimer = 0;

    // Mecánica de la Lengua
    this.tongue = {
      active: false,
      state: 'idle', // 'idle', 'extending', 'retracting'
      startX: 0,
      startY: 0,
      tipX: 0,
      tipY: 0,
      targetX: 0,
      targetY: 0,
      length: 0,
      maxLength: 280,
      speed: 1200, // px por segundo
      caughtBug: null,
      dirX: 1,
      dirY: 0
    };

    // Animación
    this.squash = 1;
    this.stretch = 1;
    this.mouthOpen = 0;
  }

  jump() {
    if (this.stunTimer > 0) return;
    if (this.onGround) {
      this.vy = -560; // Fuerza de salto
      this.onGround = false;
      this.currentLilyPad = null;
      this.squash = 0.7;
      this.stretch = 1.35;
      audio.playJump(this.playerNum === 1);
      return true;
    }
    return false;
  }

  shootTongue(keys) {
    if (this.stunTimer > 0) return;
    if (this.tongue.active) return; // Ya está disparando

    this.tongueShots++;
    this.tongue.active = true;
    this.tongue.state = 'extending';
    this.tongue.length = 0;
    this.tongue.caughtBug = null;
    this.mouthOpen = 1;

    // Determinar dirección del tiro
    let dx = this.facing;
    let dy = 0;

    if (this.isLookingUp) {
      dy = -1;
      // Puede disparar recto arriba o diagonal
      if (this.vx !== 0) {
        dx = this.facing * 0.7;
        dy = -0.7;
      } else {
        dx = this.facing * 0.35;
        dy = -0.95;
      }
    } else if (this.isCrouching) {
      dx = this.facing * 0.95;
      dy = 0.25;
    } else {
      // Disparo frontal ligeramente elevado
      dx = this.facing * 0.95;
      dy = -0.25;
    }

    const mag = Math.hypot(dx, dy);
    this.tongue.dirX = dx / mag;
    this.tongue.dirY = dy / mag;

    audio.playTongue();
  }

  update(dt, keys, lilyPads, bugs, otherFrog, gameBounds, particles, floatingTexts) {
    // Timers de estados especiales
    if (this.stunTimer > 0) {
      this.stunTimer = Math.max(0, this.stunTimer - dt);
    }
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer = Math.max(0, this.invulnerableTimer - dt);
    }

    // Input del Jugador (solo si no está aturdido)
    if (this.stunTimer <= 0) {
      let moveDir = 0;
      if (this.playerNum === 1) {
        if (keys['KeyA']) moveDir -= 1;
        if (keys['KeyD']) moveDir += 1;
        this.isCrouching = !!keys['KeyS'];
        this.isLookingUp = !!keys['KeyW'] && this.onGround && !keys['KeyA'] && !keys['KeyD'];
      } else {
        if (keys['ArrowLeft']) moveDir -= 1;
        if (keys['ArrowRight']) moveDir += 1;
        this.isCrouching = !!keys['ArrowDown'];
        this.isLookingUp = !!keys['ArrowUp'] && this.onGround && !keys['ArrowLeft'] && !keys['ArrowRight'];
      }

      if (moveDir !== 0) {
        this.facing = moveDir;
        const accel = this.onGround ? 320 : 250;
        this.vx = moveDir * accel;
      } else {
        // Fricción
        this.vx *= Math.pow(0.005, dt);
        if (Math.abs(this.vx) < 5) this.vx = 0;
      }
    } else {
      this.vx *= Math.pow(0.01, dt);
    }

    // Físicas (Gravedad)
    const gravity = 1200;
    this.vy += gravity * dt;

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Suavizado visual squash & stretch
    this.squash += (1 - this.squash) * dt * 10;
    this.stretch += (1 - this.stretch) * dt * 10;
    if (!this.tongue.active) {
      this.mouthOpen = Math.max(0, this.mouthOpen - dt * 12);
    }

    // Límites de pantalla laterales
    if (this.x < 25) { this.x = 25; this.vx = 0; }
    if (this.x > gameBounds.width - 25) { this.x = gameBounds.width - 25; this.vx = 0; }

    // Colisión con Nenúfares
    let landedOnPad = false;
    for (const pad of lilyPads) {
      const curPadY = pad.y + pad.dip;
      // Comprobar si los pies de la rana caen sobre la superficie del nenúfar
      const feetY = this.y + this.height * 0.45;
      const distX = Math.abs(this.x - pad.x);

      if (distX < pad.radius * 0.85 && this.vy >= 0) {
        if (feetY >= curPadY - 10 && feetY <= curPadY + 22) {
          this.y = curPadY - this.height * 0.45;
          this.vy = 0;
          this.onGround = true;
          this.currentLilyPad = pad;
          pad.dip = Math.min(12, pad.dip + 7);
          landedOnPad = true;
          break;
        }
      }
    }

    if (!landedOnPad && this.onGround) {
      // Si el nenúfar se movió y la rana ya no está encima
      if (this.currentLilyPad) {
        const distX = Math.abs(this.x - this.currentLilyPad.x);
        if (distX > this.currentLilyPad.radius) {
          this.onGround = false;
          this.currentLilyPad = null;
        } else {
          // Seguir el movimiento del nenúfar
          this.x += (this.currentLilyPad.x - this.currentLilyPad.baseX) * dt * 1.5;
        }
      }
    }

    // Caída al Agua Profunda
    const waterLevel = gameBounds.height - 75;
    if (this.y > waterLevel) {
      this.onFallInWater(particles, floatingTexts, lilyPads);
    }

    // Actualización de la Lengua
    this.updateTongue(dt, bugs, otherFrog, particles, floatingTexts);
  }

  onFallInWater(particles, floatingTexts, lilyPads) {
    audio.playSplash();
    // Partículas de salpicadura
    for (let i = 0; i < 20; i++) {
      particles.push(new WaterSplashParticle(this.x, this.y + 10));
    }

    floatingTexts.push(new FloatingText(this.x, this.y - 20, '¡CHOF!', '#38bdf8'));

    // Reubicar en el nenúfar más cercano
    let nearestPad = lilyPads[0];
    let minDist = 9999;
    for (const pad of lilyPads) {
      const d = Math.abs(this.x - pad.x);
      if (d < minDist) {
        minDist = d;
        nearestPad = pad;
      }
    }

    this.x = nearestPad.x;
    this.y = nearestPad.y - 30;
    this.vx = 0;
    this.vy = -180;
    this.onGround = false;
    this.stunTimer = 0.4;
  }

  updateTongue(dt, bugs, otherFrog, particles, floatingTexts) {
    const mouthOffsetX = this.facing * 16;
    const mouthOffsetY = -2;
    this.tongue.startX = this.x + mouthOffsetX;
    this.tongue.startY = this.y + mouthOffsetY;

    if (!this.tongue.active) return;

    if (this.tongue.state === 'extending') {
      this.tongue.length += this.tongue.speed * dt;
      this.mouthOpen = 1;

      this.tongue.tipX = this.tongue.startX + this.tongue.dirX * this.tongue.length;
      this.tongue.tipY = this.tongue.startY + this.tongue.dirY * this.tongue.length;

      // Colisión con moscas
      if (!this.tongue.caughtBug) {
        for (const bug of bugs) {
          if (bug.alive) {
            const dist = Math.hypot(this.tongue.tipX - bug.x, this.tongue.tipY - bug.y);
            if (dist < bug.size + 14) {
              // Atrapada!
              bug.alive = false;
              bug.eatenBy = this;
              this.tongue.caughtBug = bug;
              this.tongue.state = 'retracting';
              break;
            }
          }
        }
      }

      // Colisión de lengua contra la otra rana (¡BONK divertido!)
      if (otherFrog && this.tongue.state === 'extending' && !this.tongue.caughtBug) {
        const frogDist = Math.hypot(this.tongue.tipX - otherFrog.x, this.tongue.tipY - otherFrog.y);
        if (frogDist < 26) {
          audio.playBonk();
          otherFrog.vx = this.facing * 240;
          otherFrog.stunTimer = 0.45;
          floatingTexts.push(new FloatingText(otherFrog.x, otherFrog.y - 35, '¡BONK!', '#f87171'));
          for (let i = 0; i < 8; i++) {
            particles.push(new SparkleParticle(otherFrog.x, otherFrog.y, '#facc15'));
          }
          this.tongue.state = 'retracting';
        }
      }

      // Alcanzó la longitud máxima
      if (this.tongue.length >= this.tongue.maxLength) {
        this.tongue.state = 'retracting';
      }
    } else if (this.tongue.state === 'retracting') {
      const retractSpeed = this.tongue.speed * 1.35;
      this.tongue.length -= retractSpeed * dt;

      this.tongue.tipX = this.tongue.startX + this.tongue.dirX * this.tongue.length;
      this.tongue.tipY = this.tongue.startY + this.tongue.dirY * this.tongue.length;

      if (this.tongue.caughtBug) {
        this.tongue.caughtBug.x = this.tongue.tipX;
        this.tongue.caughtBug.y = this.tongue.tipY;
      }

      if (this.tongue.length <= 0) {
        // La lengua ha vuelto a la boca: Tragar bicho
        this.tongue.length = 0;
        this.tongue.active = false;
        this.tongue.state = 'idle';

        if (this.tongue.caughtBug) {
          const bug = this.tongue.caughtBug;
          if (bug.isHazard) {
            // Avispa picó a la rana!
            audio.playHurt();
            this.score = Math.max(0, this.score + bug.points);
            this.lives = Math.max(0, this.lives - 1);
            this.stunTimer = 0.8;
            this.invulnerableTimer = 1.2;
            floatingTexts.push(new FloatingText(this.x, this.y - 35, '¡PICADURA! -1 ❤️', '#ef4444'));
            for (let i = 0; i < 12; i++) {
              particles.push(new SparkleParticle(this.x, this.y, '#ef4444'));
            }
          } else {
            // Mosca comida con éxito
            audio.playCatch(bug.points);
            this.score += bug.points;
            this.fliesEaten++;
            floatingTexts.push(new FloatingText(this.x, this.y - 35, `+${bug.points}`, bug.color));
            for (let i = 0; i < 14; i++) {
              particles.push(new SparkleParticle(this.x, this.y, bug.color));
            }
          }
          this.tongue.caughtBug = null;
        }
      }
    }
  }

  draw(ctx, nearestBug) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Efecto de parpadeo si está invulnerable
    if (this.invulnerableTimer > 0 && Math.floor(this.invulnerableTimer * 15) % 2 === 0) {
      ctx.globalAlpha = 0.45;
    }

    // Efecto de aturdimiento (estrellitas sobre la cabeza)
    if (this.stunTimer > 0) {
      ctx.save();
      const rot = Date.now() * 0.006;
      ctx.fillStyle = '#facc15';
      for (let i = 0; i < 3; i++) {
        const a = rot + (i * Math.PI * 2) / 3;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * 18, -26 + Math.sin(a) * 6, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Orientación visual
    ctx.scale(this.facing * this.squash, this.stretch);

    // Patas traseras (en cuclillas o estiradas)
    ctx.fillStyle = this.darkColor;
    if (this.onGround) {
      ctx.beginPath();
      ctx.ellipse(-14, 12, 10, 6, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(10, 14, 8, 4, 0.1, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Patas estiradas en el aire
      ctx.beginPath();
      ctx.ellipse(-16, 16, 14, 5, 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cuerpo principal redondeado
    ctx.fillStyle = this.bodyColor;
    ctx.beginPath();
    ctx.ellipse(0, 4, 20, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = this.darkColor;
    ctx.stroke();

    // Vientre pálido
    ctx.fillStyle = this.bellyColor;
    ctx.beginPath();
    ctx.ellipse(4, 7, 12, 9, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Manchas en la espalda
    ctx.fillStyle = this.darkColor;
    ctx.beginPath();
    ctx.arc(-8, -2, 3, 0, Math.PI * 2);
    ctx.arc(-4, 5, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Boca (se abre si dispara la lengua)
    if (this.mouthOpen > 0.1) {
      ctx.fillStyle = '#7f1d1d';
      ctx.beginPath();
      ctx.ellipse(12, 2, 7 * this.mouthOpen, 9 * this.mouthOpen, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ojos saltones
    const eyeBaseX1 = -2;
    const eyeBaseX2 = 10;
    const eyeY = -12;

    ctx.fillStyle = this.bodyColor;
    ctx.beginPath();
    ctx.arc(eyeBaseX1, eyeY, 8, 0, Math.PI * 2);
    ctx.arc(eyeBaseX2, eyeY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = this.darkColor;
    ctx.stroke();

    // Globos oculares blancos/amarillentos
    ctx.fillStyle = this.eyeColor;
    ctx.beginPath();
    ctx.arc(eyeBaseX1, eyeY, 5.5, 0, Math.PI * 2);
    ctx.arc(eyeBaseX2, eyeY, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // Pupilas inteligentes que miran hacia la mosca más cercana
    let pupilOffX = 1.5;
    let pupilOffY = 0;
    if (nearestBug) {
      const bdx = (nearestBug.x - this.x) * this.facing;
      const bdy = nearestBug.y - this.y;
      const bmag = Math.hypot(bdx, bdy) || 1;
      pupilOffX = (bdx / bmag) * 2.8;
      pupilOffY = (bdy / bmag) * 2.8;
    }

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(eyeBaseX1 + pupilOffX, eyeY + pupilOffY, 2.8, 0, Math.PI * 2);
    ctx.arc(eyeBaseX2 + pupilOffX, eyeY + pupilOffY, 2.8, 0, Math.PI * 2);
    ctx.fill();

    // Brillo en los ojos
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(eyeBaseX1 + pupilOffX - 1, eyeY + pupilOffY - 1, 1, 0, Math.PI * 2);
    ctx.arc(eyeBaseX2 + pupilOffX - 1, eyeY + pupilOffY - 1, 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Dibujar la Lengua (en coordenadas globales)
    if (this.tongue.active && this.tongue.length > 2) {
      this.drawTongue(ctx);
    }
  }

  drawTongue(ctx) {
    ctx.save();
    // Línea de lengua elástica rosada
    ctx.beginPath();
    ctx.moveTo(this.tongue.startX, this.tongue.startY);

    // Curva sutil hacia la punta
    const midX = (this.tongue.startX + this.tongue.tipX) / 2;
    const midY = (this.tongue.startY + this.tongue.tipY) / 2 + 6;
    ctx.quadraticCurveTo(midX, midY, this.tongue.tipX, this.tongue.tipY);

    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#f43f5e'; // Rosa brillante
    ctx.stroke();

    // Reflejo central fino en la lengua
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#fbcfe8';
    ctx.stroke();

    // Punta adhesiva de la lengua
    ctx.beginPath();
    ctx.arc(this.tongue.tipX, this.tongue.tipY, 7.5, 0, Math.PI * 2);
    ctx.fillStyle = '#e11d48';
    ctx.fill();
    ctx.strokeStyle = '#ffe4e6';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Si lleva una mosca atrapada, dibujarla en la punta
    if (this.tongue.caughtBug) {
      this.tongue.caughtBug.draw(ctx);
    }

    ctx.restore();
  }
}

// --- PARTÍCULAS Y TEXTOS FLOTANTES ---
class WaterSplashParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 160;
    this.vy = -Math.random() * 220 - 40;
    this.radius = 2.5 + Math.random() * 3.5;
    this.alpha = 1;
    this.color = '#7dd3fc';
  }

  update(dt) {
    this.vy += 650 * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.alpha -= dt * 2.2;
    return this.alpha > 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class SparkleParticle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = 40 + Math.random() * 120;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.radius = 2 + Math.random() * 3;
    this.alpha = 1;
    this.color = color || '#facc15';
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.alpha -= dt * 2.5;
    return this.alpha > 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class FloatingText {
  constructor(x, y, text, color) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color || '#fef08a';
    this.alpha = 1;
    this.vy = -55;
  }

  update(dt) {
    this.y += this.vy * dt;
    this.alpha -= dt * 1.4;
    return this.alpha > 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.font = 'bold 18px "Fredoka One", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#064e3b';
    ctx.fillText(this.text, this.x + 2, this.y + 2);
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}

// ============================================================================
// BUCLE PRINCIPAL Y GESTOR DEL JUEGO
// ============================================================================
class CrazyFrogsGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    // UI Elements
    this.uiOverlay = document.getElementById('uiOverlay');
    this.mainMenu = document.getElementById('mainMenu');
    this.pauseMenu = document.getElementById('pauseMenu');
    this.gameOverMenu = document.getElementById('gameOverMenu');
    this.leaderboardMenu = document.getElementById('leaderboardMenu');
    this.winnerTitle = document.getElementById('winnerTitle');
    this.winnerBanner = document.getElementById('winnerBanner');
    this.recordAlert = document.getElementById('recordAlert');
    this.statScoreP1 = document.getElementById('statScoreP1');
    this.statScoreP2 = document.getElementById('statScoreP2');
    this.statHeaderP1 = document.getElementById('statHeaderP1');
    this.statHeaderP2 = document.getElementById('statHeaderP2');
    this.statDetailsP1 = document.getElementById('statDetailsP1');
    this.statDetailsP2 = document.getElementById('statDetailsP2');
    this.toastMessage = document.getElementById('toastMessage');
    this.btnToggleSound = document.getElementById('btnToggleSound');

    // Inputs de Nombres
    this.inputP1Name = document.getElementById('inputP1Name');
    this.inputP2Name = document.getElementById('inputP2Name');
    this.displayP1CardName = document.getElementById('displayP1CardName');
    this.displayP2CardName = document.getElementById('displayP2CardName');

    // Leaderboard Elements
    this.btnOpenLeaderboard = document.getElementById('btnOpenLeaderboard');
    this.btnCloseLeaderboard = document.getElementById('btnCloseLeaderboard');
    this.btnResetLeaderboard = document.getElementById('btnResetLeaderboard');
    this.btnGameOverLeaderboard = document.getElementById('btnGameOverLeaderboard');
    this.lbTableHead = document.getElementById('lbTableHead');
    this.lbTableBody = document.getElementById('lbTableBody');
    this.lbEmptyState = document.getElementById('lbEmptyState');
    this.lbCloudStatus = document.getElementById('lbCloudStatus');
    this.lbSelectedMode = 'time';
    this.lbCurrentScope = 'global';

    // Estado del juego
    this.gameState = 'menu'; // 'menu', 'playing', 'paused', 'gameover', 'leaderboard'
    this.gameMode = 'time'; // 'time', 'lives', 'race'
    this.difficulty = 'normal'; // 'easy', 'normal', 'hard'

    // Opciones del modo
    this.timeRemaining = 60;
    this.gameElapsedTime = 0;
    this.maxScoreTarget = 30;

    // Teclas pulsadas
    this.keys = {};

    // Entidades
    this.p1 = null;
    this.p2 = null;
    this.lilyPads = [];
    this.bugs = [];
    this.particles = [];
    this.floatingTexts = [];

    // Tiempos de aparición
    this.bugSpawnTimer = 0;
    this.lastTime = 0;

    // Efecto de agua animada
    this.waterTime = 0;

    this.initFirebase();
    this.initPlayerNames();
    this.setupEventListeners();
    this.setupUI();
    this.initPond();

    // Iniciar loop
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  initFirebase() {
    this.firebaseApp = null;
    this.firestore = null;
    this.cloudEnabled = false;

    try {
      const cfg = window.FIREBASE_CONFIG;
      if (cfg && cfg.apiKey && !cfg.apiKey.includes('TU_API_KEY') && typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
          this.firebaseApp = firebase.initializeApp(cfg);
        } else {
          this.firebaseApp = firebase.app();
        }
        this.firestore = firebase.firestore();
        this.cloudEnabled = true;
      }
    } catch (e) {
      console.warn('Firebase no inicializado (usando modo local):', e.message);
    }

    if (this.lbCloudStatus) {
      if (this.cloudEnabled) {
        this.lbCloudStatus.textContent = '🟢 Nube Conectada';
        this.lbCloudStatus.className = 'lb-status-badge status-online';
      } else {
        this.lbCloudStatus.textContent = '⚪ Modo Local (Offline)';
        this.lbCloudStatus.className = 'lb-status-badge status-offline';
      }
    }
  }

  initPlayerNames() {
    const savedP1 = localStorage.getItem('crazyFrogs_p1Name');
    const savedP2 = localStorage.getItem('crazyFrogs_p2Name');
    if (savedP1 && this.inputP1Name) this.inputP1Name.value = savedP1;
    if (savedP2 && this.inputP2Name) this.inputP2Name.value = savedP2;
    this.syncPlayerNames();
  }

  syncPlayerNames() {
    const name1 = (this.inputP1Name ? this.inputP1Name.value.trim() : '') || 'Rana Verde';
    const name2 = (this.inputP2Name ? this.inputP2Name.value.trim() : '') || 'Rana Coral';

    if (this.displayP1CardName) this.displayP1CardName.textContent = name1;
    if (this.displayP2CardName) this.displayP2CardName.textContent = name2;
  }

  setupUI() {
    // Sincronización de inputs de nombres
    if (this.inputP1Name) {
      this.inputP1Name.addEventListener('input', () => {
        localStorage.setItem('crazyFrogs_p1Name', this.inputP1Name.value.trim());
        this.syncPlayerNames();
      });
    }
    if (this.inputP2Name) {
      this.inputP2Name.addEventListener('input', () => {
        localStorage.setItem('crazyFrogs_p2Name', this.inputP2Name.value.trim());
        this.syncPlayerNames();
      });
    }

    // Selectores de Modo
    const modeBtns = document.querySelectorAll('#modeSelector .pill-btn');
    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.gameMode = btn.dataset.mode;
      });
    });

    // Selectores de Dificultad
    const diffBtns = document.querySelectorAll('#diffSelector .pill-btn');
    diffBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        diffBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.difficulty = btn.dataset.diff;
      });
    });

    // Pestañas del Salón de la Fama
    const lbTabBtns = document.querySelectorAll('#lbTabs .lb-tab');
    lbTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        lbTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.lbSelectedMode = btn.dataset.lbmode;
        this.renderLeaderboard();
      });
    });

    // Selector de Alcance (Global / Local)
    const scopeBtns = document.querySelectorAll('#lbScopeSelector .lb-scope-btn');
    scopeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        scopeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.lbCurrentScope = btn.dataset.scope;
        this.renderLeaderboard();
      });
    });

    // Botones de acción
    document.getElementById('btnStartGame').addEventListener('click', () => {
      audio.init();
      this.startGame();
    });

    document.getElementById('btnResume').addEventListener('click', () => {
      this.resumeGame();
    });

    document.getElementById('btnRestartFromPause').addEventListener('click', () => {
      this.startGame();
    });

    document.getElementById('btnBackToMenu').addEventListener('click', () => {
      this.showMenu();
    });

    document.getElementById('btnRematch').addEventListener('click', () => {
      this.startGame();
    });

    document.getElementById('btnGameOverToMenu').addEventListener('click', () => {
      this.showMenu();
    });

    // Leaderboard openers
    if (this.btnOpenLeaderboard) {
      this.btnOpenLeaderboard.addEventListener('click', () => {
        this.openLeaderboard();
      });
    }
    if (this.btnGameOverLeaderboard) {
      this.btnGameOverLeaderboard.addEventListener('click', () => {
        this.openLeaderboard();
      });
    }
    if (this.btnCloseLeaderboard) {
      this.btnCloseLeaderboard.addEventListener('click', () => {
        this.closeLeaderboard();
      });
    }
    if (this.btnResetLeaderboard) {
      this.btnResetLeaderboard.addEventListener('click', () => {
        this.resetLeaderboard();
      });
    }

    this.btnToggleSound.addEventListener('click', () => {
      audio.init();
      const soundOn = audio.toggleMute();
      this.btnToggleSound.innerHTML = soundOn ? '🔊 FX & Música: ON' : '🔇 Silencio: OFF';
    });
  }

  setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      // Ignorar controles de juego si el usuario está escribiendo su nombre en los inputs
      if (document.activeElement === this.inputP1Name || document.activeElement === this.inputP2Name) {
        return;
      }

      this.keys[e.code] = true;

      // Disparo de lengua Jugador 1: Tecla E, F o Espacio
      if (this.gameState === 'playing' && (e.code === 'KeyE' || e.code === 'KeyF' || e.code === 'Space')) {
        e.preventDefault();
        if (this.p1) this.p1.shootTongue(this.keys);
      }

      // Salto Jugador 1: Tecla W
      if (this.gameState === 'playing' && e.code === 'KeyW') {
        if (this.p1) this.p1.jump();
      }

      // Disparo de lengua Jugador 2: Enter, Shift (Left/Right), Numpad0, o tecla L
      if (this.gameState === 'playing' && (e.code === 'Enter' || e.code === 'ShiftRight' || e.code === 'ShiftLeft' || e.code === 'Numpad0' || e.code === 'KeyL')) {
        e.preventDefault();
        if (this.p2) this.p2.shootTongue(this.keys);
      }

      // Salto Jugador 2: Flecha Arriba
      if (this.gameState === 'playing' && e.code === 'ArrowUp') {
        e.preventDefault();
        if (this.p2) this.p2.jump();
      }

      // Pausa rápida con Escape o P
      if (e.code === 'Escape' || e.code === 'KeyP') {
        if (this.gameState === 'playing') {
          this.pauseGame();
        } else if (this.gameState === 'paused') {
          this.resumeGame();
        } else if (this.gameState === 'leaderboard') {
          this.closeLeaderboard();
        }
      }

      // Revancha rápida con R en pantalla de GameOver
      if (this.gameState === 'gameover' && e.code === 'KeyR') {
        this.startGame();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }

  showToast(text, durationMs = 2000) {
    this.toastMessage.textContent = text;
    this.toastMessage.classList.remove('hidden');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastMessage.classList.add('hidden');
    }, durationMs);
  }

  initPond() {
    const w = this.canvas.width;
    const h = this.canvas.height;

    this.lilyPads = [];

    // Nenúfares para las ranas: dos fijos de base y varios intermedios flotantes
    const padY = h - 140;

    // Nenúfar base P1 (izq) y P2 (dcha)
    this.lilyPads.push(new LilyPad(160, padY, 58, false));
    this.lilyPads.push(new LilyPad(w - 160, padY, 58, false));

    // Nenúfares centrales y a diferentes alturas
    const isHard = this.difficulty === 'hard';
    const isEasy = this.difficulty === 'easy';

    this.lilyPads.push(new LilyPad(w * 0.35, padY - 30, 48, !isEasy, 1.2, 40));
    this.lilyPads.push(new LilyPad(w * 0.5, padY + 15, 52, !isEasy, 1.8, 30));
    this.lilyPads.push(new LilyPad(w * 0.65, padY - 30, 48, !isEasy, 1.4, 40));

    // Nenúfares flotantes altos para cazar moscas arriba
    this.lilyPads.push(new LilyPad(w * 0.26, padY - 110, 42, isHard, 1.5, 30));
    this.lilyPads.push(new LilyPad(w * 0.74, padY - 110, 42, isHard, 1.5, 30));
    this.lilyPads.push(new LilyPad(w * 0.5, padY - 150, 40, false));
  }

  startGame() {
    this.gameState = 'playing';
    this.mainMenu.classList.add('hidden');
    this.pauseMenu.classList.add('hidden');
    this.gameOverMenu.classList.add('hidden');
    if (this.leaderboardMenu) this.leaderboardMenu.classList.add('hidden');
    if (this.recordAlert) this.recordAlert.classList.add('hidden');
    this.uiOverlay.style.background = 'transparent';

    this.initPond();

    // Obtener nombres personalizados
    const p1Name = (this.inputP1Name ? this.inputP1Name.value.trim() : '') || 'Rana Verde';
    const p2Name = (this.inputP2Name ? this.inputP2Name.value.trim() : '') || 'Rana Coral';

    // Crear Ranas
    const p1Pad = this.lilyPads[0];
    const p2Pad = this.lilyPads[1];

    this.p1 = new Frog(1, p1Pad.x, p1Pad.y - 30, p1Name);
    this.p2 = new Frog(2, p2Pad.x, p2Pad.y - 30, p2Name);

    if (this.gameMode === 'lives') {
      this.p1.lives = 3;
      this.p2.lives = 3;
    }

    this.timeRemaining = 60;
    this.gameElapsedTime = 0;
    this.bugs = [];
    this.particles = [];
    this.floatingTexts = [];
    this.bugSpawnTimer = 0;

    // Spawn inicial de moscas
    const initialBugs = this.difficulty === 'easy' ? 5 : 8;
    for (let i = 0; i < initialBugs; i++) {
      this.spawnBug();
    }

    audio.startBgm();
    this.showToast(`¡A CAZAR! ${p1Name} VS ${p2Name} 🐸`, 2400);
  }

  pauseGame() {
    this.gameState = 'paused';
    this.pauseMenu.classList.remove('hidden');
    this.uiOverlay.style.background = 'rgba(0, 0, 0, 0.45)';
    audio.stopBgm();
  }

  resumeGame() {
    this.gameState = 'playing';
    this.pauseMenu.classList.add('hidden');
    this.uiOverlay.style.background = 'transparent';
    audio.startBgm();
  }

  showMenu() {
    this.gameState = 'menu';
    this.mainMenu.classList.remove('hidden');
    this.pauseMenu.classList.add('hidden');
    this.gameOverMenu.classList.add('hidden');
    if (this.leaderboardMenu) this.leaderboardMenu.classList.add('hidden');
    this.uiOverlay.style.background = 'rgba(0, 0, 0, 0.65)';
    audio.stopBgm();
  }

  // --- GESTIÓN DEL SALÓN DE LA FAMA (RANKING LOCAL Y NUBE) ---
  getLeaderboardData() {
    try {
      const data = localStorage.getItem('crazyFrogs_rankings_v1');
      if (data) return JSON.parse(data);
    } catch (e) {}
    return {
      time: [],
      lives: [],
      race: []
    };
  }

  saveLeaderboardData(data) {
    try {
      localStorage.setItem('crazyFrogs_rankings_v1', JSON.stringify(data));
    } catch (e) {}
  }

  async saveCloudRecord(mode, entry) {
    if (!this.cloudEnabled || !this.firestore) return;
    try {
      await this.firestore.collection('leaderboard_' + mode).add({
        ...entry,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (e) {
      console.warn('No se pudo enviar el récord a Firebase:', e);
      if (e.code === 'permission-denied') {
        this.showToast('⚠️ Recuerda activar Firestore en "Modo de prueba" en la consola de Firebase', 4000);
      }
    }
  }

  async fetchCloudLeaderboard(mode) {
    if (!this.cloudEnabled || !this.firestore) return [];
    try {
      let q = this.firestore.collection('leaderboard_' + mode);
      if (mode === 'race') {
        q = q.orderBy('timeSeconds', 'asc').limit(10);
      } else {
        q = q.orderBy('score', 'desc').limit(10);
      }
      const snapshot = await q.get();
      const results = [];
      snapshot.forEach(doc => {
        results.push(doc.data());
      });
      return results;
    } catch (e) {
      console.warn('Error al leer de Firebase:', e);
      if (e.code === 'permission-denied') {
        this.showToast('⚠️ Recuerda activar Firestore en "Modo de prueba" en la consola de Firebase', 4000);
      }
      return [];
    }
  }

  saveMatchResults(winner) {
    const data = this.getLeaderboardData();
    const dateStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
    let isNewRecord = false;

    const p1Acc = this.p1.tongueShots > 0 ? Math.round((this.p1.fliesEaten / this.p1.tongueShots) * 100) : 0;
    const p2Acc = this.p2.tongueShots > 0 ? Math.round((this.p2.fliesEaten / this.p2.tongueShots) * 100) : 0;

    if (this.gameMode === 'time') {
      // Registrar a ambos participantes
      const e1 = { name: this.p1.name, score: this.p1.score, flies: this.p1.fliesEaten, acc: p1Acc, diff: this.difficulty, date: dateStr };
      const e2 = { name: this.p2.name, score: this.p2.score, flies: this.p2.fliesEaten, acc: p2Acc, diff: this.difficulty, date: dateStr };
      data.time.push(e1, e2);
      data.time.sort((a, b) => b.score - a.score || b.flies - a.flies || b.acc - a.acc);
      if (data.time.slice(0, 3).some(r => r === e1 || r === e2)) isNewRecord = true;
      data.time = data.time.slice(0, 10);

      this.saveCloudRecord('time', e1);
      this.saveCloudRecord('time', e2);
    } else if (this.gameMode === 'lives') {
      // Registrar al ganador o a ambos si fue empate
      const addPlayer = (p, acc) => {
        const entry = {
          name: p.name,
          score: p.score,
          livesLeft: p.lives,
          timeSurvived: Math.round(this.gameElapsedTime),
          diff: this.difficulty,
          date: dateStr
        };
        data.lives.push(entry);
        this.saveCloudRecord('lives', entry);
        return entry;
      };

      let entries = [];
      if (winner === 1) entries.push(addPlayer(this.p1, p1Acc));
      else if (winner === 2) entries.push(addPlayer(this.p2, p2Acc));
      else {
        entries.push(addPlayer(this.p1, p1Acc));
        entries.push(addPlayer(this.p2, p2Acc));
      }

      data.lives.sort((a, b) => b.score - a.score || b.livesLeft - a.livesLeft || b.timeSurvived - a.timeSurvived);
      if (data.lives.slice(0, 3).some(r => entries.includes(r))) isNewRecord = true;
      data.lives = data.lives.slice(0, 10);
    } else if (this.gameMode === 'race') {
      // En carrera, el récord es por TIEMPO MÁS RÁPIDO para llegar a 30 pts
      const winFrog = winner === 1 ? this.p1 : this.p2;
      const winAcc = winner === 1 ? p1Acc : p2Acc;
      const entry = {
        name: winFrog.name,
        timeSeconds: Number(this.gameElapsedTime.toFixed(1)),
        score: winFrog.score,
        flies: winFrog.fliesEaten,
        diff: this.difficulty,
        date: dateStr
      };
      data.race.push(entry);
      data.race.sort((a, b) => a.timeSeconds - b.timeSeconds || b.score - a.score);
      if (data.race.slice(0, 3).includes(entry)) isNewRecord = true;
      data.race = data.race.slice(0, 10);

      this.saveCloudRecord('race', entry);
    }

    this.saveLeaderboardData(data);
    return isNewRecord;
  }

  openLeaderboard() {
    this.previousState = this.gameState;
    this.gameState = 'leaderboard';
    this.mainMenu.classList.add('hidden');
    this.pauseMenu.classList.add('hidden');
    this.gameOverMenu.classList.add('hidden');
    if (this.leaderboardMenu) this.leaderboardMenu.classList.remove('hidden');
    this.uiOverlay.style.background = 'rgba(0, 0, 0, 0.75)';

    // Sincronizar pestaña activa con el modo actual jugado
    this.lbSelectedMode = this.gameMode;
    const tabs = document.querySelectorAll('#lbTabs .lb-tab');
    tabs.forEach(t => {
      t.classList.toggle('active', t.dataset.lbmode === this.lbSelectedMode);
    });

    this.renderLeaderboard();
  }

  closeLeaderboard() {
    if (this.leaderboardMenu) this.leaderboardMenu.classList.add('hidden');
    if (this.previousState === 'gameover') {
      this.gameState = 'gameover';
      this.gameOverMenu.classList.remove('hidden');
    } else {
      this.showMenu();
    }
  }

  resetLeaderboard() {
    if (confirm('¿Seguro que deseas reiniciar los récords locales de este equipo?')) {
      localStorage.removeItem('crazyFrogs_rankings_v1');
      this.renderLeaderboard();
      this.showToast('¡Récords locales reiniciados con éxito!');
    }
  }

  async renderLeaderboard() {
    if (!this.lbTableBody || !this.lbTableHead) return;

    // Ajustar encabezados de la tabla según el modo
    if (this.lbSelectedMode === 'time') {
      this.lbTableHead.innerHTML = `
        <th>#</th>
        <th>Cazador</th>
        <th>Puntos</th>
        <th>Moscas / Puntería</th>
        <th>Dificultad</th>
        <th>Fecha</th>
      `;
    } else if (this.lbSelectedMode === 'lives') {
      this.lbTableHead.innerHTML = `
        <th>#</th>
        <th>Cazador</th>
        <th>Puntos</th>
        <th>Vidas Restantes</th>
        <th>Dificultad</th>
        <th>Fecha</th>
      `;
    } else { // race
      this.lbTableHead.innerHTML = `
        <th>#</th>
        <th>Cazador</th>
        <th>Tiempo Récord</th>
        <th>Moscas Cazadas</th>
        <th>Dificultad</th>
        <th>Fecha</th>
      `;
    }

    let list = [];
    const isGlobal = this.lbCurrentScope === 'global';

    if (isGlobal && this.cloudEnabled) {
      this.lbTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 24px; color: #a7f3d0;">Conectando con la nube... ⏳</td></tr>`;
      list = await this.fetchCloudLeaderboard(this.lbSelectedMode);
    } else {
      const localData = this.getLeaderboardData();
      list = localData[this.lbSelectedMode] || [];
    }

    this.lbTableBody.innerHTML = '';

    if (list.length === 0) {
      if (this.lbEmptyState) {
        this.lbEmptyState.textContent = isGlobal && !this.cloudEnabled
          ? 'ℹ️ Para activar el ranking mundial, añade tus claves en firebase-config.js. ¡Los récords locales siguen funcionando!'
          : 'Aún no hay récords guardados en este modo. ¡Sé el primero en jugar!';
        this.lbEmptyState.classList.remove('hidden');
      }
      return;
    }

    if (this.lbEmptyState) this.lbEmptyState.classList.add('hidden');

    const medals = ['🥇 1º', '🥈 2º', '🥉 3º'];
    const diffBadges = {
      easy: '🌿 Fácil',
      normal: '🦟 Normal',
      hard: '🌪️ Caótico'
    };

    list.forEach((item, idx) => {
      const tr = document.createElement('tr');
      if (idx === 0) tr.classList.add('top-1');

      const rankDisplay = idx < 3 ? medals[idx] : `#${idx + 1}`;
      const diffDisplay = diffBadges[item.diff] || item.diff;

      let valCol = '';
      let detailCol = '';

      if (this.lbSelectedMode === 'time') {
        valCol = `<strong>${item.score} pts</strong>`;
        detailCol = `${item.flies} moscas (${item.acc || 0}%)`;
      } else if (this.lbSelectedMode === 'lives') {
        valCol = `<strong>${item.score} pts</strong>`;
        let hearts = '';
        for (let h = 0; h < (item.livesLeft || 1); h++) hearts += '❤️';
        detailCol = `${hearts} (${item.timeSurvived || 0}s)`;
      } else {
        valCol = `<strong style="color:#facc15;">⏱️ ${item.timeSeconds}s</strong>`;
        detailCol = `${item.flies || 0} moscas (${item.score || 0} pts)`;
      }

      tr.innerHTML = `
        <td>${rankDisplay}</td>
        <td><strong>🐸 ${this.escapeHtml(item.name)}</strong></td>
        <td>${valCol}</td>
        <td>${detailCol}</td>
        <td>${diffDisplay}</td>
        <td>${item.date || '-'}</td>
      `;

      this.lbTableBody.appendChild(tr);
    });
  }

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  endGame(winner) {
    this.gameState = 'gameover';
    audio.stopBgm();
    audio.playVictory();

    this.gameOverMenu.classList.remove('hidden');
    this.uiOverlay.style.background = 'rgba(0, 0, 0, 0.7)';

    // Guardar resultados en el Ranking y detectar si hubo nuevo récord
    const isNewRecord = this.saveMatchResults(winner);
    if (this.recordAlert) {
      if (isNewRecord) {
        this.recordAlert.classList.remove('hidden');
        audio.playCatch(5); // Sonido alegre extra
      } else {
        this.recordAlert.classList.add('hidden');
      }
    }

    // Actualizar pantalla de victoria con nombres personalizados
    let winnerText = '';
    let winnerBg = '';

    if (winner === 'draw') {
      this.winnerTitle.textContent = '🤝 ¡EMPATE EN EL ESTANQUE!';
      winnerText = `¡${this.p1.name} y ${this.p2.name} son igual de voraces! (${this.p1.score} pts)`;
      winnerBg = '#10b981';
    } else if (winner === 1) {
      this.winnerTitle.textContent = `👑 ¡VICTORIA DE ${this.p1.name.toUpperCase()}!`;
      winnerText = `¡${this.p1.name} se corona como el Rey del Estanque!`;
      winnerBg = '#22c55e';
    } else {
      this.winnerTitle.textContent = `👑 ¡VICTORIA DE ${this.p2.name.toUpperCase()}!`;
      winnerText = `¡${this.p2.name} se corona como el Rey del Estanque!`;
      winnerBg = '#f97316';
    }

    this.winnerBanner.textContent = winnerText;
    this.winnerBanner.style.borderColor = winnerBg;

    // Actualizar cabeceras de estadísticas
    if (this.statHeaderP1) this.statHeaderP1.textContent = `🐸 ${this.p1.name}`;
    if (this.statHeaderP2) this.statHeaderP2.textContent = `🐸 ${this.p2.name}`;

    // Estadísticas
    const p1Acc = this.p1.tongueShots > 0 ? Math.round((this.p1.fliesEaten / this.p1.tongueShots) * 100) : 0;
    const p2Acc = this.p2.tongueShots > 0 ? Math.round((this.p2.fliesEaten / this.p2.tongueShots) * 100) : 0;

    this.statScoreP1.textContent = `${this.p1.score} pts`;
    this.statDetailsP1.textContent = `Moscas: ${this.p1.fliesEaten} | Tiros: ${this.p1.tongueShots} | Puntería: ${p1Acc}%`;

    this.statScoreP2.textContent = `${this.p2.score} pts`;
    this.statDetailsP2.textContent = `Moscas: ${this.p2.fliesEaten} | Tiros: ${this.p2.tongueShots} | Puntería: ${p2Acc}%`;
  }

  spawnBug() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const x = 50 + Math.random() * (w - 100);
    const y = 80 + Math.random() * (h - 280);

    const rand = Math.random();
    let type = 'common';

    if (this.difficulty === 'easy') {
      if (rand < 0.25) type = 'golden';
    } else if (this.difficulty === 'normal') {
      if (rand < 0.2) type = 'golden';
      else if (rand < 0.35) type = 'dragonfly';
      else if (rand < 0.5) type = 'wasp';
    } else { // Hard / Caótico
      if (rand < 0.25) type = 'golden';
      else if (rand < 0.45) type = 'dragonfly';
      else if (rand < 0.72) type = 'wasp';
    }

    this.bugs.push(new Bug(type, x, y, { width: w, height: h }));
  }

  update(dt) {
    if (this.gameState !== 'playing') return;

    this.waterTime += dt;
    this.gameElapsedTime += dt;

    // Actualizar nenúfares
    this.lilyPads.forEach(pad => pad.update(dt));

    // Contador de tiempo (Modo Tiempo)
    if (this.gameMode === 'time') {
      this.timeRemaining -= dt;
      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        // Evaluar ganador por puntuación
        if (this.p1.score > this.p2.score) this.endGame(1);
        else if (this.p2.score > this.p1.score) this.endGame(2);
        else this.endGame('draw');
        return;
      }
    }

    // Comprobar condiciones de victoria para Modo Vidas
    if (this.gameMode === 'lives') {
      if (this.p1.lives <= 0 && this.p2.lives <= 0) {
        this.endGame('draw');
        return;
      } else if (this.p1.lives <= 0) {
        this.endGame(2);
        return;
      } else if (this.p2.lives <= 0) {
        this.endGame(1);
        return;
      }
    }

    // Comprobar condiciones de victoria para Modo Carrera
    if (this.gameMode === 'race') {
      if (this.p1.score >= this.maxScoreTarget) {
        this.endGame(1);
        return;
      }
      if (this.p2.score >= this.maxScoreTarget) {
        this.endGame(2);
        return;
      }
    }

    // Generar nuevas moscas
    this.bugSpawnTimer += dt;
    const maxBugs = this.difficulty === 'easy' ? 6 : this.difficulty === 'normal' ? 9 : 12;
    const spawnRate = this.difficulty === 'hard' ? 1.0 : 1.4;

    if (this.bugSpawnTimer >= spawnRate && this.bugs.length < maxBugs) {
      this.bugSpawnTimer = 0;
      this.spawnBug();
    }

    // Actualizar moscas
    this.bugs = this.bugs.filter(b => b.alive);
    this.bugs.forEach(bug => bug.update(dt));

    // Actualizar ranas
    const bounds = { width: this.canvas.width, height: this.canvas.height };
    this.p1.update(dt, this.keys, this.lilyPads, this.bugs, this.p2, bounds, this.particles, this.floatingTexts);
    this.p2.update(dt, this.keys, this.lilyPads, this.bugs, this.p1, bounds, this.particles, this.floatingTexts);

    // Actualizar partículas y textos
    this.particles = this.particles.filter(p => p.update(dt));
    this.floatingTexts = this.floatingTexts.filter(t => t.update(dt));
  }

  getNearestBug(x, y) {
    let nearest = null;
    let minDist = 9999;
    for (const b of this.bugs) {
      if (b.alive) {
        const d = Math.hypot(b.x - x, b.y - y);
        if (d < minDist) {
          minDist = d;
          nearest = b;
        }
      }
    }
    return nearest;
  }

  draw() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    // Limpiar pantalla
    ctx.clearRect(0, 0, w, h);

    // Fondo: Cielo del pantano / Cañas de bambú
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#022c22');
    skyGrad.addColorStop(0.35, '#064e3b');
    skyGrad.addColorStop(0.65, '#065f46');
    skyGrad.addColorStop(1, '#022c22');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Cañas y vegetación de fondo
    ctx.save();
    ctx.fillStyle = 'rgba(6, 78, 59, 0.45)';
    for (let i = 20; i < w; i += 45) {
      const reedHeight = 120 + Math.sin(i) * 50;
      ctx.fillRect(i, h - 160 - reedHeight, 6, reedHeight + 60);
    }
    ctx.restore();

    // Ondas y superficie del agua del estanque
    const waterY = h - 180;
    const waterGrad = ctx.createLinearGradient(0, waterY, 0, h);
    waterGrad.addColorStop(0, '#047857');
    waterGrad.addColorStop(0.3, '#064e3b');
    waterGrad.addColorStop(1, '#022c22');

    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, waterY, w, h - waterY);

    // Olas animadas en la superficie
    ctx.save();
    ctx.strokeStyle = 'rgba(167, 243, 208, 0.35)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 20) {
      const y = waterY + Math.sin((x * 0.02) + (this.waterTime * 2.5)) * 4;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    // Dibujar Nenúfares
    this.lilyPads.forEach(pad => pad.draw(ctx));

    // Dibujar Moscas
    this.bugs.forEach(bug => bug.draw(ctx));

    // Dibujar Ranas si están en juego
    if (this.p1 && this.p2) {
      const p1Nearest = this.getNearestBug(this.p1.x, this.p1.y);
      const p2Nearest = this.getNearestBug(this.p2.x, this.p2.y);
      this.p1.draw(ctx, p1Nearest);
      this.p2.draw(ctx, p2Nearest);
    }

    // Dibujar Partículas
    this.particles.forEach(p => p.draw(ctx));

    // Dibujar Textos Flotantes
    this.floatingTexts.forEach(t => t.draw(ctx));

    // Dibujar HUD superior durante el juego
    if (this.gameState === 'playing' || this.gameState === 'paused') {
      this.drawHUD(ctx, w, h);
    }
  }

  drawHUD(ctx, w, h) {
    ctx.save();

    // Nombre truncado para el HUD si es muy largo
    const p1DisplayName = this.p1.name.length > 10 ? this.p1.name.substring(0, 9) + '…' : this.p1.name;
    const p2DisplayName = this.p2.name.length > 10 ? this.p2.name.substring(0, 9) + '…' : this.p2.name;

    // Tarjeta HUD P1 (Izquierda)
    ctx.fillStyle = 'rgba(6, 78, 59, 0.85)';
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    this.roundRect(ctx, 18, 14, 210, 52, 14, true, true);

    ctx.font = '900 15px "Nunito", sans-serif';
    ctx.fillStyle = '#86efac';
    ctx.fillText(`🐸 ${p1DisplayName.toUpperCase()}`, 30, 34);

    ctx.font = 'bold 22px "Fredoka One", sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.fillText(`${this.p1.score} PTS`, 30, 58);

    if (this.gameMode === 'lives') {
      ctx.font = '16px "Nunito", sans-serif';
      let hearts = '';
      for (let i = 0; i < this.p1.lives; i++) hearts += '❤️';
      ctx.fillText(hearts || '💀', 130, 57);
    }

    // Tarjeta HUD P2 (Derecha)
    ctx.fillStyle = 'rgba(67, 20, 7, 0.85)';
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 3;
    this.roundRect(ctx, w - 228, 14, 210, 52, 14, true, true);

    ctx.font = '900 15px "Nunito", sans-serif';
    ctx.fillStyle = '#fdba74';
    ctx.fillText(`🐸 ${p2DisplayName.toUpperCase()}`, w - 216, 34);

    ctx.font = 'bold 22px "Fredoka One", sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.fillText(`${this.p2.score} PTS`, w - 216, 58);

    if (this.gameMode === 'lives') {
      ctx.font = '16px "Nunito", sans-serif';
      let hearts = '';
      for (let i = 0; i < this.p2.lives; i++) hearts += '❤️';
      ctx.fillText(hearts || '💀', w - 116, 57);
    }

    // Indicador Central de Modo (Tiempo / Objetivo)
    ctx.fillStyle = 'rgba(2, 44, 34, 0.9)';
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2.5;
    this.roundRect(ctx, w / 2 - 95, 14, 190, 52, 14, true, true);

    ctx.textAlign = 'center';
    if (this.gameMode === 'time') {
      ctx.font = '900 13px "Nunito", sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('TIEMPO RESTANTE', w / 2, 33);

      const sec = Math.ceil(this.timeRemaining);
      ctx.font = 'bold 24px "Fredoka One", sans-serif';
      ctx.fillStyle = sec <= 10 ? '#ef4444' : '#facc15';
      ctx.fillText(`⏱️ ${sec}s`, w / 2, 57);
    } else if (this.gameMode === 'lives') {
      ctx.font = '900 13px "Nunito", sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('MODO SUPERVIVENCIA', w / 2, 33);
      ctx.font = 'bold 18px "Fredoka One", sans-serif';
      ctx.fillStyle = '#f87171';
      ctx.fillText('¡CUIDADO CON AVISPAS!', w / 2, 55);
    } else {
      ctx.font = '900 13px "Nunito", sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('META DE PUNTOS', w / 2, 33);
      ctx.font = 'bold 20px "Fredoka One", sans-serif';
      ctx.fillStyle = '#facc15';
      ctx.fillText(`🎯 ${this.maxScoreTarget} PUNTOS`, w / 2, 56);
    }

    ctx.restore();
  }

  roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  gameLoop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1); // Limitar dt para evitar saltos
    this.lastTime = timestamp;

    this.update(dt);
    this.draw();

    requestAnimationFrame((t) => this.gameLoop(t));
  }
}

// Inicializar el juego cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', () => {
  window.crazyFrogsGame = new CrazyFrogsGame();
});
