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
    this.id = 'b_' + Math.random().toString(36).substring(2, 9);
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
    this.jumpBufferTimer = 0;

    // Configuración IA / CPU
    this.isCPU = false;
    this.cpuDecisionTimer = 0;
    this.cpuTarget = null;
    this.cpuJumpTimer = 0;
    this.cpuReactionTimer = 0;
    this.cpuShootCooldown = 0;

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

  shootTongue(keys, targetDir = null) {
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

    if (targetDir && (targetDir.dx !== 0 || targetDir.dy !== 0)) {
      dx = targetDir.dx;
      dy = targetDir.dy;
      if (dx !== 0) this.facing = dx > 0 ? 1 : -1;
    } else if (this.isLookingUp) {
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

  // --- INTELIGENCIA ARTIFICIAL DE LA CPU (OPONENTE BOT) ---
  updateCPU(dt, lilyPads, bugs, otherFrog, gameBounds, difficulty) {
    if (this.stunTimer > 0) {
      this.vx *= Math.pow(0.01, dt);
      return;
    }

    this.cpuDecisionTimer = (this.cpuDecisionTimer || 0) - dt;
    this.cpuJumpTimer = (this.cpuJumpTimer || 0) - dt;
    this.cpuShootCooldown = (this.cpuShootCooldown || 0) - dt;

    // Frecuencia de decisión según dificultad (en Caos reacciona antes)
    const interval = difficulty === 'hard' ? 0.08 : (difficulty === 'normal' ? 0.16 : 0.26);

    if (this.cpuDecisionTimer <= 0) {
      this.cpuDecisionTimer = interval;

      // 1. Evaluación táctica de insectos en el estanque
      let bestTarget = null;
      let bestScore = -9999;

      // Probabilidad de esquivar avispas picadoras
      const avoidWaspRatio = difficulty === 'hard' ? 0.96 : (difficulty === 'normal' ? 0.82 : 0.60);

      for (const bug of bugs) {
        if (!bug.alive) continue;
        const dist = Math.hypot(bug.x - this.x, bug.y - this.y);
        if (dist > 380) continue; // fuera de radio de acción

        let value = bug.points;
        if (bug.isHazard) {
          if (Math.random() < avoidWaspRatio) {
            continue; // Evitar / ignorar la avispa por completo
          } else {
            value = 1; // Error de cálculo casual (se confunde e intenta cazarla)
          }
        }

        // Ponderar recompensa y cercanía
        const targetWeight = value * 35 - dist * 0.9;
        if (targetWeight > bestScore) {
          bestScore = targetWeight;
          bestTarget = bug;
        }
      }

      // Evaluar atacar al rival con "¡BONK!" si está cerca y a tiro
      if (otherFrog && Math.hypot(otherFrog.x - this.x, otherFrog.y - this.y) < 170) {
        const bonkInterest = difficulty === 'hard' ? 65 : (difficulty === 'normal' ? 25 : 10);
        if (bonkInterest > bestScore) {
          bestTarget = otherFrog;
        }
      }

      this.cpuTarget = bestTarget;
    }

    // 2. Ejecución motora y decisiones de acción
    if (this.cpuTarget) {
      const dx = this.cpuTarget.x - this.x;
      const dy = this.cpuTarget.y - this.y;
      const dist = Math.hypot(dx, dy);

      // Mirar hacia donde está el objetivo
      if (Math.abs(dx) > 12) {
        this.facing = dx > 0 ? 1 : -1;
      }

      // Comprobar si puede lanzar la lengua con éxito
      const inFront = (dx * this.facing) > 0;
      const inRange = inFront && dist < (this.tongue.maxLength - 10) && !this.tongue.active;

      if (inRange) {
        // Altura del tiro
        if (dy < -45) {
          this.isLookingUp = true;
          this.isCrouching = false;
        } else if (dy > 30) {
          this.isCrouching = true;
          this.isLookingUp = false;
        } else {
          this.isLookingUp = false;
          this.isCrouching = false;
        }

        // Si no está en cooldown de disparo
        if (this.cpuShootCooldown <= 0) {
          if (this.cpuReactionTimer === 0) {
            // Iniciar temporizador de reacción humano antes de soltar la lengua
            const reactionDelay = difficulty === 'hard' ? 0.08 : (difficulty === 'normal' ? 0.25 : 0.45);
            this.cpuReactionTimer = reactionDelay;
          } else {
            this.cpuReactionTimer -= dt;
            if (this.cpuReactionTimer <= 0) {
              // Reacción completada: disparar según precisión
              const accuracy = difficulty === 'hard' ? 0.88 : (difficulty === 'normal' ? 0.68 : 0.42);
              if (Math.random() < accuracy) {
                this.shootTongue();
              }
              this.cpuShootCooldown = difficulty === 'hard' ? 0.18 : (difficulty === 'normal' ? 0.38 : 0.65);
              this.cpuReactionTimer = 0;
            }
          }
        }
      } else {
        this.cpuReactionTimer = 0;
        if (!this.tongue.active) {
          this.isLookingUp = false;
          this.isCrouching = false;
        }
      }

      // Desplazamiento horizontal hacia la presa con velocidades calibradas
      if (Math.abs(dx) > 28) {
        let maxSpeed = 230;
        if (difficulty === 'easy') maxSpeed = 180;
        else if (difficulty === 'hard') maxSpeed = 310;
        else maxSpeed = 230;

        const speed = this.onGround ? maxSpeed : (maxSpeed * 0.85);
        this.vx = (dx > 0 ? 1 : -1) * speed;
      } else {
        this.vx *= Math.pow(0.01, dt);
      }

      // Saltos inteligentes: si el objetivo está alto o en otro nenúfar
      if (this.onGround && this.cpuJumpTimer <= 0) {
        const needJumpHeight = dy < -65 && Math.abs(dx) < 150;
        const targetFarAway = Math.abs(dx) > 95;
        const jumpProbability = difficulty === 'hard' ? 0.22 : (difficulty === 'normal' ? 0.10 : 0.04);

        if ((needJumpHeight || targetFarAway) && Math.random() < jumpProbability) {
          this.jump();
          this.cpuJumpTimer = difficulty === 'hard' ? 0.35 : (difficulty === 'normal' ? 0.6 : 0.9);
        }
      }
    } else {
      // Sin objetivo cercano: esperar en el nenúfar
      this.vx *= Math.pow(0.01, dt);
      this.isLookingUp = false;
      this.isCrouching = false;

      // Salto explorador ocasional
      if (this.onGround && this.cpuJumpTimer <= 0 && Math.random() < 0.015) {
        this.jump();
        this.cpuJumpTimer = 0.8;
      }
    }
  }

  update(dt, keys, lilyPads, bugs, otherFrog, gameBounds, particles, floatingTexts, difficulty = 'normal', touchState = null) {
    // Timers de estados especiales
    if (this.stunTimer > 0) {
      this.stunTimer = Math.max(0, this.stunTimer - dt);
    }
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer = Math.max(0, this.invulnerableTimer - dt);
    }

    // Control: CPU vs Humano (Teclado + Pantalla Táctil)
    if (this.isCPU) {
      this.updateCPU(dt, lilyPads, bugs, otherFrog, gameBounds, difficulty);
    } else if (this.stunTimer <= 0) {
      let moveDir = 0;
      if (this.playerNum === 1) {
        const touchLeft = touchState && touchState.left;
        const touchRight = touchState && touchState.right;
        const touchDown = touchState && touchState.down;
        const touchUp = touchState && touchState.up;

        if (keys['KeyA'] || touchLeft) moveDir -= 1;
        if (keys['KeyD'] || touchRight) moveDir += 1;
        this.isCrouching = !!keys['KeyS'] || touchDown;
        this.isLookingUp = (!!keys['KeyW'] || touchUp) && this.onGround && !keys['KeyA'] && !keys['KeyD'] && !touchLeft && !touchRight;
        if ((keys['KeyW'] || touchUp) && moveDir !== 0) {
          this.isLookingUp = true;
        }
      } else {
        const touchLeft = touchState && touchState.left;
        const touchRight = touchState && touchState.right;
        const touchDown = touchState && touchState.down;
        const touchUp = touchState && touchState.up;

        if (keys && keys._isGuestInputs) {
          if (keys.left) moveDir -= 1;
          if (keys.right) moveDir += 1;
          this.isCrouching = !!keys.down;
          this.isLookingUp = !!keys.up && this.onGround && !keys.left && !keys.right;
          if (keys.up && moveDir !== 0) {
            this.isLookingUp = true;
          }
        } else {
          const isLeft = (keys && (keys['ArrowLeft'] || (keys._isGuestPlayer && keys['KeyA']))) || touchLeft;
          const isRight = (keys && (keys['ArrowRight'] || (keys._isGuestPlayer && keys['KeyD']))) || touchRight;
          const isDown = (keys && (keys['ArrowDown'] || (keys._isGuestPlayer && keys['KeyS']))) || touchDown;
          const isUp = (keys && (keys['ArrowUp'] || (keys._isGuestPlayer && keys['KeyW']))) || touchUp;

          if (isLeft) moveDir -= 1;
          if (isRight) moveDir += 1;
          this.isCrouching = !!isDown;
          this.isLookingUp = (!!isUp) && this.onGround && !isLeft && !isRight;
          if (isUp && moveDir !== 0) {
            this.isLookingUp = true;
          }
        }
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

    // Buffer de salto (si el salto se pulsa o llega por red poco antes de aterrizar)
    if (this.jumpBufferTimer > 0) {
      this.jumpBufferTimer -= dt;
      if (this.onGround) {
        this.jump();
        this.jumpBufferTimer = 0;
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

    // Elementos de Lobby Online (WebRTC P2P)
    this.onlineLobbyMenu = document.getElementById('onlineLobbyMenu');
    this.btnTabHost = document.getElementById('btnTabHost');
    this.btnTabJoin = document.getElementById('btnTabJoin');
    this.panelHost = document.getElementById('panelHost');
    this.panelJoin = document.getElementById('panelJoin');
    this.displayRoomCode = document.getElementById('displayRoomCode');
    this.btnCopyRoomCode = document.getElementById('btnCopyRoomCode');
    this.hostStatusBadge = document.getElementById('hostStatusBadge');
    this.inputJoinCode = document.getElementById('inputJoinCode');
    this.btnConnectToRoom = document.getElementById('btnConnectToRoom');
    this.joinStatusBadge = document.getElementById('joinStatusBadge');
    this.btnCloseOnlineLobby = document.getElementById('btnCloseOnlineLobby');
    this.onlineHudBadge = document.getElementById('onlineHudBadge');
    this.onlinePingDisplay = document.getElementById('onlinePingDisplay');

    // Estado WebRTC 2P Online
    this.isOnline = false;
    this.onlineRole = null; // 'host' o 'guest'
    this.onlineRoomId = null;
    this.peerConnection = null;
    this.dataChannel = null;
    this.roomUnsubscribe = null;
    this.candidatesUnsubscribe = null;
    this.onlinePingInterval = null;
    this.onlineLastPingTime = 0;
    this.onlinePing = 0;
    this.onlineStateSyncTimer = 0;
    this.onlineWinner = null;
    this.guestInputs = { left: false, right: false, up: false, down: false };
    this.lastGuestSentInput = '';

    // Estado del juego
    this.gameState = 'menu'; // 'menu', 'playing', 'paused', 'gameover', 'leaderboard', 'online_lobby'
    this.gameMode = 'time'; // 'time', 'lives', 'race'
    this.difficulty = 'normal'; // 'easy', 'normal', 'hard'
    this.opponentMode = 'cpu'; // 'cpu', 'local2p', o 'online2p'

    // Opciones del modo
    this.timeRemaining = 60;
    this.gameElapsedTime = 0;
    this.maxScoreTarget = 30;

    // Teclas pulsadas
    this.keys = {};

    // Estado de controles táctiles en pantalla (Móvil)
    this.touchState = {
      left: false,
      right: false,
      up: false,
      down: false
    };

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
    this.dismissedRotateNotice = false;

    this.initFirebase();
    this.initPlayerNames();
    this.setupEventListeners();
    this.setupTouchControls();
    this.setupOrientationHandling();
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

    // Selector de Oponente (1P vs CPU / 2P Local / 🌐 2P Online)
    const oppBtns = document.querySelectorAll('#opponentSelector .pill-btn');
    oppBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        oppBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.opponentMode = btn.dataset.opponent;
        if (this.opponentMode === 'cpu') {
          if (this.inputP2Name) {
            this.inputP2Name.value = 'Ribbit Bot 🤖';
          }
        } else if (this.opponentMode === 'online2p') {
          if (this.inputP2Name) {
            this.inputP2Name.value = 'Rival Online 🌐';
          }
          this.openOnlineLobby();
        } else {
          if (this.inputP2Name && (this.inputP2Name.value === 'Ribbit Bot 🤖' || this.inputP2Name.value === 'Rival Online 🌐')) {
            this.inputP2Name.value = 'Rana Coral';
          }
        }
        this.syncPlayerNames();
      });
    });

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
    const diffHints = {
      easy: '🌿 Fácil: Rana rival relajada, ideal para aprender y practicar',
      normal: '🦟 Normal: Duelo equilibrado y divertido',
      hard: '🌪️ Caos: ¡Rana bot ultra rápida y despiadada!'
    };
    const diffHintEl = document.getElementById('diffHint');

    const diffBtns = document.querySelectorAll('#diffSelector .pill-btn');
    diffBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        diffBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.difficulty = btn.dataset.diff;
        if (diffHintEl && diffHints[this.difficulty]) {
          diffHintEl.textContent = diffHints[this.difficulty];
        }
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

    // Pestañas y Acciones del Lobby 2P Online
    if (this.btnTabHost) {
      this.btnTabHost.addEventListener('click', () => {
        this.switchOnlineTab('host');
      });
    }
    if (this.btnTabJoin) {
      this.btnTabJoin.addEventListener('click', () => {
        this.switchOnlineTab('join');
      });
    }
    if (this.btnCopyRoomCode) {
      this.btnCopyRoomCode.addEventListener('click', async () => {
        if (!this.onlineRoomId) return;
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(this.onlineRoomId);
          } else {
            const temp = document.createElement('textarea');
            temp.value = this.onlineRoomId;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
          }
          this.showToast('📋 ¡Código ' + this.onlineRoomId + ' copiado al portapapeles!');
        } catch (e) {
          this.showToast('Código: ' + this.onlineRoomId);
        }
      });
    }
    if (this.btnConnectToRoom) {
      this.btnConnectToRoom.addEventListener('click', () => {
        const code = this.inputJoinCode ? this.inputJoinCode.value.trim().toUpperCase() : '';
        this.joinOnlineRoom(code);
      });
    }
    if (this.inputJoinCode) {
      this.inputJoinCode.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          const code = this.inputJoinCode.value.trim().toUpperCase();
          this.joinOnlineRoom(code);
        }
      });
    }
    if (this.btnCloseOnlineLobby) {
      this.btnCloseOnlineLobby.addEventListener('click', () => {
        this.closeOnlineLobby();
      });
    }

    // Botones de acción
    document.getElementById('btnStartGame').addEventListener('click', () => {
      audio.init();
      if (this.opponentMode === 'online2p' && !this.isOnline) {
        this.openOnlineLobby();
        return;
      }
      this.startGame();
    });

    const btnFs = document.getElementById('btnFullscreen');
    if (btnFs) {
      btnFs.addEventListener('click', () => {
        this.requestLandscapeFullscreen();
      });
    }

    const btnFsPause = document.getElementById('btnFullscreenPause');
    if (btnFsPause) {
      btnFsPause.addEventListener('click', () => {
        this.requestLandscapeFullscreen();
      });
    }

    document.getElementById('btnResume').addEventListener('click', () => {
      this.resumeGame();
    });

    document.getElementById('btnRestartFromPause').addEventListener('click', () => {
      this.startGame();
    });

    document.getElementById('btnBackToMenu').addEventListener('click', () => {
      if (this.isOnline) {
        this.sendOnlinePacket({ t: 'D' });
        this.cleanupOnlineConnection();
      }
      this.showMenu();
    });

    document.getElementById('btnRematch').addEventListener('click', () => {
      if (this.isOnline) {
        this.sendOnlinePacket({ t: 'REMATCH' });
      }
      this.startGame();
    });

    document.getElementById('btnGameOverToMenu').addEventListener('click', () => {
      if (this.isOnline) {
        this.sendOnlinePacket({ t: 'D' });
        this.cleanupOnlineConnection();
      }
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

      if (this.gameState === 'playing') {
        if (this.isOnline && this.onlineRole === 'guest') {
          // Si somos Invitado online, controlamos a Rana 2 y enviamos acciones por red
          if (e.code === 'KeyE' || e.code === 'KeyF' || e.code === 'Space' || e.code === 'Enter' || e.code === 'ShiftRight' || e.code === 'ShiftLeft' || e.code === 'KeyL') {
            e.preventDefault();
            if (this.p2 && !this.p2.tongue.active) {
              this.p2.shootTongue(this.keys);
            }
            this.sendGuestAction({ t: 'T' });
            return;
          }
          if (e.code === 'KeyW' || e.code === 'ArrowUp') {
            e.preventDefault();
            if (this.p2) {
              if (this.p2.onGround) {
                this.p2.jump();
              } else {
                this.p2.jumpBufferTimer = 0.15;
              }
            }
            this.sendGuestAction({ t: 'J' });
            return;
          }
        } else {
          // Modo Local / Host
          // Disparo de lengua Jugador 1: Tecla E, F o Espacio
          if (e.code === 'KeyE' || e.code === 'KeyF' || e.code === 'Space') {
            e.preventDefault();
            if (this.p1) this.p1.shootTongue(this.keys);
          }

          // Salto Jugador 1: Tecla W
          if (e.code === 'KeyW') {
            if (this.p1) this.p1.jump();
          }

          // Disparo de lengua Jugador 2: Enter, Shift (Left/Right), Numpad0, o tecla L
          if (e.code === 'Enter' || e.code === 'ShiftRight' || e.code === 'ShiftLeft' || e.code === 'Numpad0' || e.code === 'KeyL') {
            e.preventDefault();
            if (this.p2) this.p2.shootTongue(this.keys);
          }

          // Salto Jugador 2: Flecha Arriba
          if (e.code === 'ArrowUp') {
            e.preventDefault();
            if (this.p2) this.p2.jump();
          }
        }
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

  setupTouchControls() {
    const bindTouch = (elemId, onStart, onEnd) => {
      const el = document.getElementById(elemId);
      if (!el) return;

      const handleStart = (e) => {
        if (e && e.cancelable) e.preventDefault();
        el.classList.add('active');
        onStart();
      };

      const handleEnd = (e) => {
        if (e && e.cancelable) e.preventDefault();
        el.classList.remove('active');
        if (onEnd) onEnd();
      };

      el.addEventListener('touchstart', handleStart, { passive: false });
      el.addEventListener('touchend', handleEnd, { passive: false });
      el.addEventListener('touchcancel', handleEnd, { passive: false });

      el.addEventListener('mousedown', handleStart);
      el.addEventListener('mouseup', handleEnd);
      el.addEventListener('mouseleave', handleEnd);
    };

    // Botones individuales (compatibilidad directa y testing)
    bindTouch('touchLeft',
      () => { this.touchState.left = true; },
      () => { this.touchState.left = false; }
    );

    bindTouch('touchRight',
      () => { this.touchState.right = true; },
      () => { this.touchState.right = false; }
    );

    bindTouch('touchDown',
      () => { this.touchState.down = true; },
      () => { this.touchState.down = false; }
    );

    bindTouch('touchUp',
      () => {
        this.touchState.up = true;
        if (this.gameState === 'playing') {
          if (this.isOnline && this.onlineRole === 'guest') {
            if (this.p2) {
              if (this.p2.onGround) {
                this.p2.jump();
              } else {
                this.p2.jumpBufferTimer = 0.15;
              }
            }
            this.sendGuestAction({ t: 'J' });
          } else if (this.p1) {
            this.p1.jump();
          }
        }
      },
      () => { this.touchState.up = false; }
    );

    bindTouch('touchJump',
      () => {
        if (this.gameState === 'playing') {
          if (this.isOnline && this.onlineRole === 'guest') {
            if (this.p2) {
              if (this.p2.onGround) {
                this.p2.jump();
              } else {
                this.p2.jumpBufferTimer = 0.15;
              }
            }
            this.sendGuestAction({ t: 'J' });
          } else if (this.p1) {
            this.p1.jump();
          }
        }
      },
      () => {}
    );

    bindTouch('touchTongue',
      () => {
        if (this.gameState === 'playing') {
          if (this.isOnline && this.onlineRole === 'guest') {
            if (this.p2 && !this.p2.tongue.active) {
              this.p2.shootTongue(this.keys);
            }
            this.sendGuestAction({ t: 'T' });
          } else if (this.p1) {
            this.p1.shootTongue(this.keys);
          }
        }
      },
      () => {}
    );

    // Botón de Pausa Rápida para Móvil
    const pauseBtn = document.getElementById('touchPauseBtn');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.gameState === 'playing') {
          this.pauseGame();
        } else if (this.gameState === 'paused') {
          this.resumeGame();
        }
      });
    }

    // Soporte de deslizamiento continuo sobre el D-Pad (Touch Drag sin levantar el dedo)
    const dpad = document.getElementById('touchDpad');
    if (dpad && typeof dpad.getBoundingClientRect === 'function') {
      let dpadTouchId = null;

      const updateDpadFromCoords = (clientX, clientY) => {
        const rect = dpad.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = clientX - cx;
        const dy = clientY - cy;
        const dist = Math.hypot(dx, dy);

        const deadZone = 10;
        const threshold = 16;

        let left = false;
        let right = false;
        let up = false;
        let down = false;

        if (dist > deadZone) {
          if (dx < -threshold) left = true;
          if (dx > threshold) right = true;
          if (dy < -threshold) up = true;
          if (dy > threshold) down = true;
        }

        if (up && !this.touchState.up) {
          if (this.gameState === 'playing' && this.p1) {
            this.p1.jump();
          }
        }

        this.touchState.left = left;
        this.touchState.right = right;
        this.touchState.up = up;
        this.touchState.down = down;

        const bL = document.getElementById('touchLeft');
        const bR = document.getElementById('touchRight');
        const bU = document.getElementById('touchUp');
        const bD = document.getElementById('touchDown');

        if (bL && bL.classList) bL.classList.toggle('active', left);
        if (bR && bR.classList) bR.classList.toggle('active', right);
        if (bU && bU.classList) bU.classList.toggle('active', up);
        if (bD && bD.classList) bD.classList.toggle('active', down);
      };

      const resetDpad = () => {
        dpadTouchId = null;
        this.touchState.left = false;
        this.touchState.right = false;
        this.touchState.up = false;
        this.touchState.down = false;
        ['touchLeft', 'touchRight', 'touchUp', 'touchDown'].forEach(id => {
          const el = document.getElementById(id);
          if (el && el.classList) el.classList.remove('active');
        });
      };

      dpad.addEventListener('touchstart', (e) => {
        if (e.cancelable) e.preventDefault();
        const touch = e.targetTouches && e.targetTouches[0];
        if (touch) {
          dpadTouchId = touch.identifier;
          updateDpadFromCoords(touch.clientX, touch.clientY);
        }
      }, { passive: false });

      dpad.addEventListener('touchmove', (e) => {
        if (e.cancelable) e.preventDefault();
        if (e.changedTouches) {
          for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === dpadTouchId) {
              updateDpadFromCoords(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
              break;
            }
          }
        }
      }, { passive: false });

      dpad.addEventListener('touchend', (e) => {
        if (e.changedTouches) {
          for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === dpadTouchId) {
              resetDpad();
              break;
            }
          }
        }
      }, { passive: false });

      dpad.addEventListener('touchcancel', resetDpad, { passive: false });
    }

    // Tap-to-Shoot en el estanque (Tocar la pantalla o un insecto para disparar la lengua hacia allí)
    if (this.canvas) {
      const handlePointerShoot = (clientX, clientY) => {
        if (this.gameState !== 'playing') return;
        if (typeof this.canvas.getBoundingClientRect !== 'function') return;

        const rect = this.canvas.getBoundingClientRect();
        if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
          // Si el toque cae en las esquinas inferiores donde descansan los pulgares, no interferir
          const relX = (clientX - rect.left) / rect.width;
          const relY = (clientY - rect.top) / rect.height;
          if (relY > 0.65 && (relX < 0.28 || relX > 0.72)) {
            return;
          }

          const scaleX = this.canvas.width / rect.width;
          const scaleY = this.canvas.height / rect.height;
          const canvasX = (clientX - rect.left) * scaleX;
          const canvasY = (clientY - rect.top) * scaleY;

          if (this.isOnline && this.onlineRole === 'guest') {
            if (this.p2) {
              const mouthX = this.p2.x + (this.p2.facing * this.p2.width * 0.35);
              const mouthY = this.p2.y - this.p2.height * 0.1;
              const dx = canvasX - mouthX;
              const dy = canvasY - mouthY;
              this.sendGuestAction({ t: 'T', dir: { dx, dy } });
            }
          } else if (this.p1) {
            const mouthX = this.p1.x + (this.p1.facing * this.p1.width * 0.35);
            const mouthY = this.p1.y - this.p1.height * 0.1;
            const dx = canvasX - mouthX;
            const dy = canvasY - mouthY;
            this.p1.shootTongue(this.keys, { dx, dy });
          }
        }
      };

      this.canvas.addEventListener('touchstart', (e) => {
        if (e.changedTouches && e.changedTouches[0]) {
          const t = e.changedTouches[0];
          handlePointerShoot(t.clientX, t.clientY);
        }
      }, { passive: true });

      this.canvas.addEventListener('mousedown', (e) => {
        handlePointerShoot(e.clientX, e.clientY);
      });
    }
  }

  // --- CONTROL DE PANTALLA COMPLETA Y BLOQUEO DE ORIENTACIÓN HORIZONTAL ---
  async requestLandscapeFullscreen() {
    try {
      const elem = document.documentElement;
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen();
        }
      }
    } catch (err) {
      // Ignorar si el usuario deniega o el navegador no lo soporta
    }

    try {
      if (window.screen && screen.orientation && screen.orientation.lock) {
        await screen.orientation.lock('landscape');
      }
    } catch (err) {
      // Ignorar si el dispositivo no permite bloquear orientación
    }
  }

  setupOrientationHandling() {
    const rotateNotice = document.getElementById('rotateNotice');
    const btnForceLandscape = document.getElementById('btnForceLandscape');
    const btnDismissRotate = document.getElementById('btnDismissRotate');

    const checkOrientation = () => {
      if (!rotateNotice || this.dismissedRotateNotice) return;
      const isPortrait = typeof window !== 'undefined' && window.innerHeight > window.innerWidth;
      const isMobile = typeof window !== 'undefined' && (
        ('ontouchstart' in window) || 
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) || 
        window.innerWidth < 850
      );

      if (isPortrait && isMobile) {
        rotateNotice.classList.remove('hidden');
      } else {
        rotateNotice.classList.add('hidden');
      }
    };

    if (btnForceLandscape) {
      btnForceLandscape.addEventListener('click', async () => {
        await this.requestLandscapeFullscreen();
        if (rotateNotice) rotateNotice.classList.add('hidden');
      });
    }

    if (btnDismissRotate) {
      btnDismissRotate.addEventListener('click', () => {
        this.dismissedRotateNotice = true;
        if (rotateNotice) rotateNotice.classList.add('hidden');
      });
    }

    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('resize', checkOrientation);
      window.addEventListener('orientationchange', checkOrientation);
      setTimeout(checkOrientation, 350);
    }
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
    this.requestLandscapeFullscreen();
    this.gameState = 'playing';
    document.body.classList.add('in-game');
    this.mainMenu.classList.add('hidden');
    this.pauseMenu.classList.add('hidden');
    this.gameOverMenu.classList.add('hidden');
    if (this.leaderboardMenu) this.leaderboardMenu.classList.add('hidden');
    if (this.recordAlert) this.recordAlert.classList.add('hidden');
    this.uiOverlay.style.background = 'transparent';

    this.initPond();

    // Obtener nombres personalizados y modo de oponente
    const isCPU = this.opponentMode === 'cpu';
    const isOnline = this.isOnline;
    this.onlineWinner = null;

    let p1Name = (this.inputP1Name ? this.inputP1Name.value.trim() : '') || 'Rana Verde';
    let p2Name = (this.inputP2Name ? this.inputP2Name.value.trim() : '');
    if (!p2Name) {
      if (isCPU) p2Name = 'Ribbit Bot 🤖';
      else if (isOnline) p2Name = 'Rival Online 🌐';
      else p2Name = 'Rana Coral';
    }

    if (isOnline && this.onlineHudBadge) {
      this.onlineHudBadge.classList.remove('hidden');
    }

    // Crear Ranas
    const p1Pad = this.lilyPads[0];
    const p2Pad = this.lilyPads[1];

    this.p1 = new Frog(1, p1Pad.x, p1Pad.y - 30, p1Name);
    this.p2 = new Frog(2, p2Pad.x, p2Pad.y - 30, p2Name);
    this.p2.isCPU = isCPU && !isOnline;

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

    // Spawn inicial de moscas (solo Host o local)
    if (!isOnline || this.onlineRole === 'host') {
      const initialBugs = this.difficulty === 'easy' ? 5 : 8;
      for (let i = 0; i < initialBugs; i++) {
        this.spawnBug();
      }
    }

    audio.startBgm();
    this.showToast(`¡A CAZAR! ${p1Name} VS ${p2Name} 🐸`, 2400);
  }

  pauseGame() {
    this.gameState = 'paused';
    document.body.classList.remove('in-game');
    this.pauseMenu.classList.remove('hidden');
    this.uiOverlay.style.background = 'rgba(0, 0, 0, 0.45)';
    audio.stopBgm();
  }

  resumeGame() {
    this.gameState = 'playing';
    document.body.classList.add('in-game');
    this.pauseMenu.classList.add('hidden');
    this.uiOverlay.style.background = 'transparent';
    audio.startBgm();
  }

  showMenu() {
    this.gameState = 'menu';
    document.body.classList.remove('in-game');
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
    if (this.isOnline && this.onlineRole === 'host') {
      this.onlineWinner = winner;
      this.sendOnlinePacket({
        t: 'S',
        winner: winner,
        tRem: 0,
        p1: {
          x: Math.round(this.p1.x),
          y: Math.round(this.p1.y),
          score: this.p1.score,
          lives: this.p1.lives,
          stun: 0,
          tAct: false
        },
        p2: {
          x: Math.round(this.p2.x),
          y: Math.round(this.p2.y),
          score: this.p2.score,
          lives: this.p2.lives,
          stun: 0,
          tAct: false
        },
        bugs: []
      });
    }

    this.gameState = 'gameover';
    document.body.classList.remove('in-game');
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

    // Sincronización de entradas del Invitado hacia el Host
    if (this.isOnline && this.onlineRole === 'guest') {
      const left = !!(this.keys['KeyA'] || this.keys['ArrowLeft'] || this.touchState.left);
      const right = !!(this.keys['KeyD'] || this.keys['ArrowRight'] || this.touchState.right);
      const up = !!(this.keys['KeyW'] || this.keys['ArrowUp'] || this.touchState.up);
      const down = !!(this.keys['KeyS'] || this.keys['ArrowDown'] || this.touchState.down);

      const inputKey = `${left}|${right}|${up}|${down}`;
      if (inputKey !== this.lastGuestSentInput) {
        this.lastGuestSentInput = inputKey;
        this.sendGuestAction({ t: 'I', left, right, up, down });
      }
    }

    // Contador de tiempo (Modo Tiempo) - Solo el Host o partida local evalúa el tiempo y victoria
    if (!this.isOnline || this.onlineRole === 'host') {
      if (this.gameMode === 'time') {
        this.timeRemaining -= dt;
        if (this.timeRemaining <= 0) {
          this.timeRemaining = 0;
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
    }

    // Actualizar ranas (Host aplica guestInputs a P2; Guest usa touchState en P2)
    const bounds = { width: this.canvas.width, height: this.canvas.height };
    const isGuest = this.isOnline && this.onlineRole === 'guest';
    const isHost = this.isOnline && this.onlineRole === 'host';

    // En Guest: P1 es remoto (Host) por lo que no debe responder a teclas locales del Guest
    const p1Keys = isGuest ? {} : this.keys;
    const p1Touch = isGuest ? null : this.touchState;

    // En Guest: P2 es el jugador local y puede usar Flechas, WASD o Touch
    // En Host: P2 recibe los guestInputs
    const p2Touch = isGuest ? this.touchState : null;
    let p2Keys = this.keys;
    if (isHost) {
      p2Keys = { ...this.guestInputs, _isGuestInputs: true };
    } else if (isGuest) {
      p2Keys = { ...this.keys, _isGuestPlayer: true };
    }

    this.p1.update(dt, p1Keys, this.lilyPads, this.bugs, this.p2, bounds, this.particles, this.floatingTexts, this.difficulty, p1Touch);
    this.p2.update(dt, p2Keys, this.lilyPads, this.bugs, this.p1, bounds, this.particles, this.floatingTexts, this.difficulty, p2Touch);

    // Si somos Host en 2P Online, transmitir instantánea de estado a 30 FPS (~33ms)
    if (this.isOnline && this.onlineRole === 'host' && this.dataChannel && this.dataChannel.readyState === 'open') {
      this.onlineStateSyncTimer = (this.onlineStateSyncTimer || 0) + dt;
      if (this.onlineStateSyncTimer >= 0.033) {
        this.onlineStateSyncTimer = 0;
        const snapshot = {
          t: 'S',
          tRem: Math.round(this.timeRemaining * 10) / 10,
          p1: {
            x: Math.round(this.p1.x),
            y: Math.round(this.p1.y),
            vx: Math.round(this.p1.vx),
            vy: Math.round(this.p1.vy),
            facing: this.p1.facing,
            score: this.p1.score,
            lives: this.p1.lives,
            stun: Math.round(this.p1.stunTimer * 10) / 10,
            tAct: this.p1.tongue.active,
            tLen: Math.round(this.p1.tongue.length),
            tDirX: Math.round(this.p1.tongue.dirX * 100) / 100,
            tDirY: Math.round(this.p1.tongue.dirY * 100) / 100,
            tState: this.p1.tongue.state,
            cBug: this.p1.tongue.caughtBug ? { id: this.p1.tongue.caughtBug.id, type: this.p1.tongue.caughtBug.type } : null
          },
          p2: {
            x: Math.round(this.p2.x),
            y: Math.round(this.p2.y),
            vx: Math.round(this.p2.vx),
            vy: Math.round(this.p2.vy),
            facing: this.p2.facing,
            score: this.p2.score,
            lives: this.p2.lives,
            stun: Math.round(this.p2.stunTimer * 10) / 10,
            tAct: this.p2.tongue.active,
            tLen: Math.round(this.p2.tongue.length),
            tDirX: Math.round(this.p2.tongue.dirX * 100) / 100,
            tDirY: Math.round(this.p2.tongue.dirY * 100) / 100,
            tState: this.p2.tongue.state,
            cBug: this.p2.tongue.caughtBug ? { id: this.p2.tongue.caughtBug.id, type: this.p2.tongue.caughtBug.type } : null
          },
          bugs: this.bugs.map(b => ({
            id: b.id,
            type: b.type,
            x: Math.round(b.x),
            y: Math.round(b.y),
            alive: b.alive
          })),
          winner: this.onlineWinner !== undefined ? this.onlineWinner : null
        };
        this.sendOnlinePacket(snapshot);
      }
    }

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

  // ============================================================================
  // NETWORKING 2P ONLINE (WebRTC P2P + Firestore Signaling)
  // ============================================================================
  openOnlineLobby() {
    if (!this.onlineLobbyMenu) return;
    this.gameState = 'online_lobby';
    this.onlineLobbyMenu.classList.remove('hidden');
    if (this.mainMenu) this.mainMenu.classList.add('hidden');
    if (this.pauseMenu) this.pauseMenu.classList.add('hidden');
    if (this.gameOverMenu) this.gameOverMenu.classList.add('hidden');
    if (this.leaderboardMenu) this.leaderboardMenu.classList.add('hidden');
    this.uiOverlay.style.background = 'rgba(0, 0, 0, 0.7)';
    this.switchOnlineTab('host');
  }

  closeOnlineLobby() {
    if (!this.onlineLobbyMenu) return;
    this.onlineLobbyMenu.classList.add('hidden');
    this.cleanupOnlineConnection();
    this.showMenu();
  }

  switchOnlineTab(tab) {
    if (tab === 'host') {
      if (this.btnTabHost) this.btnTabHost.classList.add('active');
      if (this.btnTabJoin) this.btnTabJoin.classList.remove('active');
      if (this.panelHost) this.panelHost.classList.remove('hidden');
      if (this.panelJoin) this.panelJoin.classList.add('hidden');
      if (!this.onlineRoomId || this.onlineRole !== 'host') {
        this.createOnlineRoom();
      }
    } else {
      if (this.btnTabJoin) this.btnTabJoin.classList.add('active');
      if (this.btnTabHost) this.btnTabHost.classList.remove('active');
      if (this.panelJoin) this.panelJoin.classList.remove('hidden');
      if (this.panelHost) this.panelHost.classList.add('hidden');
      if (this.onlineRole === 'host') {
        this.cleanupOnlineConnection();
      }
      if (this.inputJoinCode) {
        this.inputJoinCode.focus();
      }
    }
  }

  updateHostStatus(text, badgeClass = 'status-waiting') {
    if (!this.hostStatusBadge) return;
    this.hostStatusBadge.textContent = text;
    this.hostStatusBadge.className = `status-badge ${badgeClass}`;
  }

  updateJoinStatus(text, badgeClass = 'status-idle') {
    if (!this.joinStatusBadge) return;
    this.joinStatusBadge.textContent = text;
    this.joinStatusBadge.className = `status-badge ${badgeClass}`;
  }

  async createOnlineRoom() {
    this.cleanupOnlineConnection();
    if (!this.cloudEnabled || !this.firestore) {
      this.updateHostStatus('⚠️ Firestore no conectado (revisa firebase-config.js)', 'status-error');
      return;
    }

    this.onlineRole = 'host';
    const codeNum = Math.floor(10 + Math.random() * 90);
    this.onlineRoomId = 'FROG' + codeNum;
    if (this.displayRoomCode) this.displayRoomCode.textContent = this.onlineRoomId;
    this.updateHostStatus('⏳ Creando sala en el pantano...', 'status-waiting');

    try {
      const rtcConfig = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      };

      this.peerConnection = new RTCPeerConnection(rtcConfig);
      this.setupPeerConnectionListeners();

      this.dataChannel = this.peerConnection.createDataChannel('crazyFrogsNet', {
        ordered: false,
        maxRetransmits: 0
      });
      this.setupDataChannel(this.dataChannel);

      const roomRef = this.firestore.collection('rooms').doc(this.onlineRoomId);
      const candidatesCol = roomRef.collection('candidates');

      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          candidatesCol.add({
            candidate: JSON.stringify(event.candidate.toJSON()),
            type: 'host',
            timestamp: Date.now()
          }).catch(() => {});
        }
      };

      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      await roomRef.set({
        roomId: this.onlineRoomId,
        status: 'waiting_guest',
        hostOffer: JSON.stringify(offer),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      this.updateHostStatus(`⏳ Esperando a que tu rival se una con el código ${this.onlineRoomId}...`, 'status-waiting');

      // Escuchar respuesta SDP del invitado
      this.roomUnsubscribe = roomRef.onSnapshot(async (snapshot) => {
        const data = snapshot.data();
        if (!data) return;

        if (this.peerConnection && !this.peerConnection.currentRemoteDescription && data.guestAnswer) {
          this.updateHostStatus('🤝 Negociando enlace directo P2P...', 'status-waiting');
          try {
            const answer = new RTCSessionDescription(JSON.parse(data.guestAnswer));
            await this.peerConnection.setRemoteDescription(answer);
          } catch (e) {
            console.warn('Error al establecer RemoteDescription:', e);
          }
        }
      });

      // Escuchar candidatos ICE del invitado
      this.candidatesUnsubscribe = candidatesCol.where('type', '==', 'guest').onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added' && this.peerConnection) {
            try {
              const candData = JSON.parse(change.doc.data().candidate);
              await this.peerConnection.addIceCandidate(new RTCIceCandidate(candData));
            } catch (err) {}
          }
        });
      });
    } catch (e) {
      console.error('Error al crear sala:', e);
      this.updateHostStatus('❌ Error al crear la sala: ' + e.message, 'status-error');
    }
  }

  async joinOnlineRoom(code) {
    if (!code) {
      this.showToast('Por favor, introduce un código de sala');
      return;
    }
    this.cleanupOnlineConnection();

    if (!this.cloudEnabled || !this.firestore) {
      this.updateJoinStatus('⚠️ Firestore no conectado (revisa firebase-config.js)', 'status-error');
      return;
    }

    this.onlineRole = 'guest';
    this.onlineRoomId = code;
    this.updateJoinStatus(`⏳ Buscando sala ${code}...`, 'status-waiting');

    try {
      const roomRef = this.firestore.collection('rooms').doc(code);
      const snap = await roomRef.get();

      if (!snap.exists) {
        this.updateJoinStatus(`❌ Sala "${code}" no encontrada`, 'status-error');
        this.showToast(`La sala ${code} no existe o ha expirado.`);
        return;
      }

      const roomData = snap.data();
      if (roomData.status !== 'waiting_guest') {
        this.updateJoinStatus(`❌ Sala ${code} ocupada o finalizada`, 'status-error');
        this.showToast('La sala ya tiene 2 jugadores o se ha cerrado.');
        return;
      }

      const rtcConfig = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      };

      this.peerConnection = new RTCPeerConnection(rtcConfig);
      this.setupPeerConnectionListeners();

      this.peerConnection.ondatachannel = (event) => {
        this.dataChannel = event.channel;
        this.setupDataChannel(this.dataChannel);
      };

      const candidatesCol = roomRef.collection('candidates');

      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          candidatesCol.add({
            candidate: JSON.stringify(event.candidate.toJSON()),
            type: 'guest',
            timestamp: Date.now()
          }).catch(() => {});
        }
      };

      const offer = JSON.parse(roomData.hostOffer);
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      await roomRef.update({
        guestAnswer: JSON.stringify(answer),
        status: 'connected'
      });

      this.updateJoinStatus('🤝 Conectando directamente con el Host...', 'status-waiting');

      this.candidatesUnsubscribe = candidatesCol.where('type', '==', 'host').onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added' && this.peerConnection) {
            try {
              const candData = JSON.parse(change.doc.data().candidate);
              await this.peerConnection.addIceCandidate(new RTCIceCandidate(candData));
            } catch (err) {}
          }
        });
      });
    } catch (e) {
      console.error('Error al unirse a la sala:', e);
      this.updateJoinStatus('❌ Error al conectar: ' + e.message, 'status-error');
    }
  }

  setupPeerConnectionListeners() {
    if (!this.peerConnection) return;

    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection.connectionState;
      if (state === 'connected') {
        if (this.onlineRole === 'host') {
          this.updateHostStatus('🟢 ¡Conexión P2P establecida!', 'status-connected');
        } else {
          this.updateJoinStatus('🟢 ¡Conectado al Host!', 'status-connected');
        }
      } else if (state === 'disconnected' || state === 'failed') {
        this.showToast('⚠️ Conexión P2P perdida con el rival.');
        if (this.isOnline) {
          this.cleanupOnlineConnection();
          if (this.gameState === 'playing') {
            this.showMenu();
          }
        }
      }
    };
  }

  setupDataChannel(channel) {
    if (!channel) return;

    channel.onopen = () => {
      this.isOnline = true;
      if (this.onlineLobbyMenu) this.onlineLobbyMenu.classList.add('hidden');
      if (this.onlineHudBadge) this.onlineHudBadge.classList.remove('hidden');

      this.startOnlinePing();
      this.showToast(this.onlineRole === 'host' ? '¡Tu rival se ha unido al estanque!' : '¡Conectado al estanque del rival!', 2500);

      // Iniciar la partida
      this.startOnlineGame();
    };

    channel.onclose = () => {
      if (this.isOnline) {
        this.showToast('🔴 El rival se ha desconectado.');
        this.cleanupOnlineConnection();
      }
    };

    channel.onerror = (e) => {
      console.warn('Error en DataChannel:', e);
    };

    channel.onmessage = (event) => {
      try {
        const packet = JSON.parse(event.data);
        this.handleOnlinePacket(packet);
      } catch (e) {}
    };
  }

  sendOnlinePacket(packet) {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      try {
        this.dataChannel.send(JSON.stringify(packet));
      } catch (e) {}
    }
  }

  startOnlinePing() {
    this.stopOnlinePing();
    this.onlinePingInterval = setInterval(() => {
      if (this.dataChannel && this.dataChannel.readyState === 'open') {
        this.onlineLastPingTime = Date.now();
        this.sendOnlinePacket({ t: 'P', ts: this.onlineLastPingTime });
      }
    }, 2000);
  }

  stopOnlinePing() {
    if (this.onlinePingInterval) {
      clearInterval(this.onlinePingInterval);
      this.onlinePingInterval = null;
    }
  }

  handleOnlinePacket(packet) {
    if (!packet || !packet.t) return;

    // Ping / Pong
    if (packet.t === 'P') {
      this.sendOnlinePacket({ t: 'R', ts: packet.ts });
      return;
    }
    if (packet.t === 'R') {
      const now = Date.now();
      const ping = Math.max(1, now - (packet.ts || now));
      this.onlinePing = ping;
      if (this.onlinePingDisplay) {
        this.onlinePingDisplay.textContent = `${ping} ms`;
      }
      return;
    }

    // Rematch
    if (packet.t === 'REMATCH') {
      this.showToast('¡Revancha aceptada!');
      this.startGame();
      return;
    }

    // Desconexión intencional
    if (packet.t === 'D') {
      this.showToast('El rival ha salido de la partida.');
      this.cleanupOnlineConnection();
      this.showMenu();
      return;
    }

    // Acciones del Invitado recibidas por el Host
    if (this.onlineRole === 'host') {
      if (packet.t === 'I') {
        this.guestInputs = {
          left: !!packet.left,
          right: !!packet.right,
          up: !!packet.up,
          down: !!packet.down
        };
      } else if (packet.t === 'J') {
        if (this.p2 && this.gameState === 'playing') {
          if (this.p2.onGround) {
            this.p2.jump();
          } else {
            this.p2.jumpBufferTimer = 0.15;
          }
        }
      } else if (packet.t === 'T') {
        if (this.p2 && this.gameState === 'playing') {
          this.p2.shootTongue(null, packet.dir || null);
        }
      }
      return;
    }

    // Instantáneas de Estado (State) recibidas por el Invitado
    if (this.onlineRole === 'guest') {
      if (packet.t === 'S') {
        this.applyHostSnapshot(packet);
      }
    }
  }

  sendGuestAction(action) {
    if (this.isOnline && this.onlineRole === 'guest') {
      this.sendOnlinePacket(action);
    }
  }

  applyHostSnapshot(s) {
    if (!s) return;

    if (typeof s.tRem === 'number') {
      this.timeRemaining = s.tRem;
    }

    // Sincronizar P1 (Host)
    if (this.p1 && s.p1) {
      if (typeof s.p1.x === 'number') this.p1.x = s.p1.x;
      if (typeof s.p1.y === 'number') this.p1.y = s.p1.y;
      if (typeof s.p1.vx === 'number') this.p1.vx = s.p1.vx;
      if (typeof s.p1.vy === 'number') this.p1.vy = s.p1.vy;
      if (typeof s.p1.facing === 'number') this.p1.facing = s.p1.facing;
      if (typeof s.p1.score === 'number') this.p1.score = s.p1.score;
      if (typeof s.p1.lives === 'number') this.p1.lives = s.p1.lives;
      if (typeof s.p1.stun === 'number') this.p1.stunTimer = s.p1.stun;
      if (typeof s.p1.tAct === 'boolean') this.p1.tongue.active = s.p1.tAct;
      if (typeof s.p1.tLen === 'number') this.p1.tongue.length = s.p1.tLen;
      if (typeof s.p1.tDirX === 'number') this.p1.tongue.dirX = s.p1.tDirX;
      if (typeof s.p1.tDirY === 'number') this.p1.tongue.dirY = s.p1.tDirY;
      if (s.p1.tState) this.p1.tongue.state = s.p1.tState;

      if (s.p1.cBug && !this.p1.tongue.caughtBug) {
        this.p1.tongue.caughtBug = new Bug(s.p1.cBug.type, this.p1.tongue.tipX, this.p1.tongue.tipY, { width: this.canvas.width, height: this.canvas.height });
      } else if (!s.p1.cBug) {
        this.p1.tongue.caughtBug = null;
      }
    }

    // Sincronizar P2 (Invitado) - Reconciliación suave sin tirones
    if (this.p2 && s.p2) {
      if (typeof s.p2.x === 'number' && typeof s.p2.y === 'number') {
        const dx = s.p2.x - this.p2.x;
        const dy = s.p2.y - this.p2.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 120) {
          // Desfase grande: corrección directa
          this.p2.x = s.p2.x;
          this.p2.y = s.p2.y;
          if (typeof s.p2.vx === 'number') this.p2.vx = s.p2.vx;
          if (typeof s.p2.vy === 'number') this.p2.vy = s.p2.vy;
        } else if (dist > 3) {
          // Reconciliación suave: converge hacia la posición del host sin tirones
          this.p2.x += dx * 0.35;
          this.p2.y += dy * 0.35;
          if (typeof s.p2.vy === 'number') {
            this.p2.vy += (s.p2.vy - this.p2.vy) * 0.35;
          }
          if (typeof s.p2.vx === 'number') {
            this.p2.vx += (s.p2.vx - this.p2.vx) * 0.35;
          }
        }
      }
      if (typeof s.p2.score === 'number') this.p2.score = s.p2.score;
      if (typeof s.p2.lives === 'number') this.p2.lives = s.p2.lives;
      if (typeof s.p2.stun === 'number') this.p2.stunTimer = s.p2.stun;
      if (typeof s.p2.tAct === 'boolean') {
        if (!s.p2.tAct && this.p2.tongue.active) {
          this.p2.tongue.active = false;
        }
      }
      if (s.p2.cBug && !this.p2.tongue.caughtBug) {
        this.p2.tongue.caughtBug = new Bug(s.p2.cBug.type, this.p2.tongue.tipX, this.p2.tongue.tipY, { width: this.canvas.width, height: this.canvas.height });
      } else if (!s.p2.cBug) {
        this.p2.tongue.caughtBug = null;
      }
    }

    // Sincronizar Moscas
    if (Array.isArray(s.bugs)) {
      const bounds = { width: this.canvas.width, height: this.canvas.height };
      const currentBugsMap = new Map();
      this.bugs.forEach(b => currentBugsMap.set(b.id, b));

      const updatedBugs = [];
      s.bugs.forEach(sb => {
        let bug = currentBugsMap.get(sb.id);
        if (!bug) {
          bug = new Bug(sb.type, sb.x, sb.y, bounds);
          bug.id = sb.id;
        } else {
          bug.x = sb.x;
          bug.y = sb.y;
          bug.alive = sb.alive;
        }
        if (bug.alive) {
          updatedBugs.push(bug);
        }
      });
      this.bugs = updatedBugs;
    }

    // Fin de partida indicado por Host
    if (s.winner !== null && s.winner !== undefined && this.gameState === 'playing') {
      this.endGame(s.winner);
    }
  }

  cleanupOnlineConnection() {
    this.stopOnlinePing();
    if (this.roomUnsubscribe) {
      this.roomUnsubscribe();
      this.roomUnsubscribe = null;
    }
    if (this.candidatesUnsubscribe) {
      this.candidatesUnsubscribe();
      this.candidatesUnsubscribe = null;
    }
    if (this.dataChannel) {
      try { this.dataChannel.close(); } catch (e) {}
      this.dataChannel = null;
    }
    if (this.peerConnection) {
      try { this.peerConnection.close(); } catch (e) {}
      this.peerConnection = null;
    }
    this.isOnline = false;
    this.onlineRole = null;
    this.onlineRoomId = null;
    this.lastGuestSentInput = '';
    this.onlineWinner = null;
    if (this.onlineHudBadge) this.onlineHudBadge.classList.add('hidden');
    if (this.hostStatusBadge) this.updateHostStatus('⏳ Esperando a que tu amigo se una...', 'status-waiting');
    if (this.joinStatusBadge) this.updateJoinStatus('⚪ Introduce el código', 'status-idle');
  }

  startOnlineGame() {
    this.opponentMode = 'online2p';
    this.startGame();
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
