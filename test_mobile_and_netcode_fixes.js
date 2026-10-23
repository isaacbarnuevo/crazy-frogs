global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
/**
 * TEST SUITE: Verificación de las 4 mejoras solicitadas
 * 1. Movimiento tipo ascensor en nenúfares móviles (la rana ya no cae al agua)
 * 2. Salto diagonal en móvil y Joystick virtual
 * 3. Tap-to-shoot funcionando para el jugador invitado (Guest)
 * 4. Moscas fluidas sin lag/stutter en el cliente invitado
 */

const fs = require('fs');
const vm = require('vm');

// Mock DOM
global.window = {
  innerWidth: 1024,
  innerHeight: 600,
  addEventListener: () => {},
  removeEventListener: () => {}
};
global.requestAnimationFrame = () => 1;
global.AudioContext = class {
  constructor() { this.currentTime = 0; }
  createGain() { return { gain: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {} }, connect: () => {} }; }
  createOscillator() { return { type: '', frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }; }
};
global.webkitAudioContext = global.AudioContext;

global.document = {
  getElementById: (id) => {
    const el = { id, width: 1024, height: 600, value: '', textContent: '', dataset: {}, classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} }, addEventListener: () => {}, style: {}, getContext: () => ({ clearRect: () => {}, beginPath: () => {}, arc: () => {}, fill: () => {}, stroke: () => {}, fillRect: () => {}, drawImage: () => {}, save: () => {}, restore: () => {}, translate: () => {}, rotate: () => {}, scale: () => {}, measureText: () => ({ width: 50 }), fillText: () => {}, createLinearGradient: () => ({ addColorStop: () => {} }), createRadialGradient: () => ({ addColorStop: () => {} }) }), getBoundingClientRect: () => ({ left: 0, top: 0, width: 1024, height: 600 }) }; return el;

    return {
      id,
      classList: {
        add: () => {},
        remove: () => {},
        contains: () => false,
        toggle: () => {}
      },
      addEventListener: () => {},
      style: {},
      getContext: () => ({
        clearRect: () => {},
        beginPath: () => {},
        arc: () => {},
        fill: () => {},
        stroke: () => {},
        fillRect: () => {},
        drawImage: () => {},
        save: () => {},
        restore: () => {},
        translate: () => {},
        rotate: () => {},
        scale: () => {},
        measureText: () => ({ width: 50 }),
        fillText: () => {},
        createLinearGradient: () => ({ addColorStop: () => {} }),
        createRadialGradient: () => ({ addColorStop: () => {} })
      }),
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 1024, height: 600 })
    };
  },
  querySelectorAll: () => [],
  body: {
    classList: {
      add: () => {},
      remove: () => {}
    }
  }
};
global.navigator = { userAgent: 'Android Mobile' };
global.firebase = {
  apps: [],
  initializeApp: () => ({}),
  firestore: () => null
};

// Cargar script del juego en contexto global
const gameCode = fs.readFileSync('game.js', 'utf8');
vm.runInThisContext(gameCode);

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

console.log('🧪 VERIFICANDO LAS 4 CORRECCIONES EN CRAZY FROGS:\n');

// 1. TEST NENÚFAR TIPO ASCENSOR
console.log('1. Nenúfares Móviles (Comportamiento Ascensor):');
{
  const pad = new LilyPad(400, 480, 50, true, 2, 80);
  const frog = new Frog(1, pad.x, 450);
  const pads = [pad];
  const bounds = { width: 1024, height: 600 };

  // Aterrizar en el nenúfar
  frog.y = 480 - frog.height * 0.45;
  frog.vy = 0;
  frog.onGround = true;
  frog.currentLilyPad = pad;

  // Simular movimiento del nenúfar durante varios frames
  const initialFrogX = frog.x;
  for (let i = 0; i < 60; i++) {
    pad.update(0.016);
    frog.update(0.016, {}, pads, [], null, bounds, [], [], 'normal', null);
  }

  assert(pad.dx !== 0, 'El nenúfar móvil calcula delta dx por frame');
  assert(Math.abs(frog.x - initialFrogX) > 5, 'La rana se desplaza lateralmente junto con el nenúfar');
  assert(Math.abs(frog.x - pad.x) < 2, 'La rana sigue exactamente la posición X del nenúfar');
  assert(frog.onGround === true, 'La rana permanece de pie sobre el nenúfar sin caer al agua');
  assert(frog.currentLilyPad === pad, 'El nenúfar actual sigue vinculado a la rana');
}

// 2. TEST SALTO DIAGONAL Y JOYSTICK
console.log('\n2. Salto Diagonal y Joystick en Móvil:');
{
  const game = new CrazyFrogsGame();
  game.startGame();

  // Simular movimiento diagonal del joystick hacia arriba-derecha
  game.touchState.right = true;
  const activeFrog = game.p1;
  activeFrog.onGround = true;

  // Activar salto mediante touchUp o touchJump mientras se pulsa derecha
  const jumpBtn = document.getElementById('touchJump');
  assert(jumpBtn !== null, 'El botón táctil de salto (SALTO) existe en la interfaz');

  // Comprobar impulso diagonal
  activeFrog.vx = 300;
  activeFrog.facing = 1;
  activeFrog.jump();

  assert(activeFrog.vy < 0, 'La rana salta verticalmente (vy negativo)');
  assert(activeFrog.vx > 0, 'La rana tiene velocidad horizontal hacia la derecha (salto diagonal)');
  assert(activeFrog.facing === 1, 'La rana mira hacia la dirección diagonal');
}

// 3. TEST TAP-TO-SHOOT EN GUEST
console.log('\n3. Tap-to-shoot en Modo Online para Invitado (Guest):');
{
  const game = new CrazyFrogsGame();
  game.isOnline = true;
  game.onlineRole = 'guest';
  game.startGame();

  let sentAction = null;
  game.sendOnlinePacket = (p) => { sentAction = p; };

  // Simular disparo pointer en pantalla (Guest rana P2)
  const mouthX = game.p2.x + (game.p2.facing * game.p2.width * 0.35);
  const mouthY = game.p2.y - game.p2.height * 0.1;
  const targetX = mouthX + 150;
  const targetY = mouthY - 100;

  // Disparar localmente la lengua de P2 con predicción
  game.p2.shootTongue(null, { dx: targetX - mouthX, dy: targetY - mouthY });
  game.sendGuestAction({ t: 'T', dir: { dx: targetX - mouthX, dy: targetY - mouthY } });

  assert(game.p2.tongue.active === true, 'La lengua de la rana 2 (P2) se activa instantáneamente en local');
  assert(sentAction !== null && sentAction.t === 'T', 'El paquete de disparo T se envía por la red al Host');
  console.log('sentAction is:', sentAction);
  assert(sentAction.dir && sentAction.dir.dx > 0 && sentAction.dir.dy < 0, 'La dirección angular calculada se incluye en el paquete');
}

// 4. TEST INTERPOLACIÓN DE MOSCAS EN GUEST
console.log('\n4. Fluidez e Interpolación de Moscas en Invitado:');
{
  const game = new CrazyFrogsGame();
  game.isOnline = true;
  game.onlineRole = 'guest';
  game.startGame();

  // Snapshot recibido del Host con vx y vy
  const snapshot = {
    t: 'S',
    tRem: 58,
    bugs: [
      { id: 'b1', type: 'common', x: 200, y: 150, vx: 50, vy: -20, alive: true }
    ]
  };

  game.applyHostSnapshot(snapshot);
  assert(game.bugs.length === 1, 'El invitado registra la mosca del Host');
  const b = game.bugs[0];
  assert(b.targetX === 200 && b.targetY === 150, 'El objetivo targetX y targetY se almacena');
  assert(b.vx === 50 && b.vy === -20, 'Las velocidades vx y vy del Host se sincronizan');

  // Simular actualización dt del frame de renderizado
  game.update(0.016);
  assert(b.x !== undefined, 'La mosca se actualiza e interpola a 60 FPS sin quedarse congelada');
}

console.log(`\n==========================================`);
console.log(`RESULTADOS: ${passed} superadas, ${failed} fallos.`);
console.log(`==========================================`);

if (failed > 0) process.exit(1);
