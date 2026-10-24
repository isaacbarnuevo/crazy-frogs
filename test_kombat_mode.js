/**
 * TEST SUITE: Modo Kombat (Street Frog - Al mejor de 3 rondas)
 */

const fs = require('fs');
const vm = require('vm');

global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
global.window = {
  innerWidth: 1024,
  innerHeight: 600,
  addEventListener: () => {},
  removeEventListener: () => {}
};
global.requestAnimationFrame = () => 1;
global.AudioContext = class {
  constructor() { this.currentTime = 0; }
  createGain() { return { gain: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {} }; }
  createOscillator() { return { type: '', frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }; }
  createBuffer() { return { getChannelData: () => new Float32Array(100) }; }
  createBufferSource() { return { connect: () => {}, start: () => {} }; }
  createBiquadFilter() { return { frequency: { setValueAtTime: () => {} }, Q: { setValueAtTime: () => {} }, connect: () => {} }; }
};
global.webkitAudioContext = global.AudioContext;

global.document = {
  getElementById: (id) => ({
    id,
    width: 1024,
    height: 600,
    value: '',
    textContent: '',
    dataset: {},
    classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} },
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
  }),
  querySelectorAll: () => [],
  body: {
    classList: { add: () => {}, remove: () => {} }
  }
};
global.navigator = { userAgent: 'Android Mobile' };
global.firebase = {
  apps: [],
  initializeApp: () => ({}),
  firestore: () => null
};

// Cargar game.js
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

console.log('🥊 INICIANDO TEST SUITE MODO KOMBAT (STREET FROG):\n');

// 1. Inicialización de Modo Kombat
{
  const game = new CrazyFrogsGame();
  game.gameMode = 'kombat';
  game.startGame();

  assert(game.kombatRound === 1, 'Inicia en la Ronda 1');
  assert(game.kombatP1Wins === 0 && game.kombatP2Wins === 0, 'Marcador de rondas en 0 - 0');
  assert(game.p1.hp === 100 && game.p2.hp === 100, 'Ambas ranas inician con 100 HP');
  assert(game.p1.energy === 0 && game.p2.energy === 0, 'Barras de energía Ultra inician en 0%');
  assert(game.roundBannerText.includes('RONDA 1'), 'Cartel central anuncia ¡RONDA 1!');
  assert(game.lilyPads[0].radius >= 250, 'Escenario cuenta con un Gran Ring Central de Combate');
}

// 2. Carga de Energía Ultra al cazar moscas
{
  const game = new CrazyFrogsGame();
  game.gameMode = 'kombat';
  game.startGame();

  // Simular captura de mosca dorada (+40%) y libélula (+25%) y común (+15%)
  const goldenBug = new Bug('golden', 100, 100, { width: 1024, height: 600 });
  const dragonfly = new Bug('dragonfly', 100, 100, { width: 1024, height: 600 });
  const common1 = new Bug('common', 100, 100, { width: 1024, height: 600 });
  const common2 = new Bug('common', 100, 100, { width: 1024, height: 600 });

  // Comer dorada
  game.p1.tongue.active = true;
  game.p1.tongue.caughtBug = goldenBug;
  game.p1.tongue.state = 'retracting';
  game.p1.tongue.length = 0;
  game.p1.updateTongue(0.016, [], game.p2, [], []);
  assert(game.p1.energy === 40, 'Mosca dorada suma +40% de energía Ultra');

  // Comer libélula
  game.p1.tongue.active = true;
  game.p1.tongue.caughtBug = dragonfly;
  game.p1.tongue.state = 'retracting';
  game.p1.tongue.length = 0;
  game.p1.updateTongue(0.016, [], game.p2, [], []);
  assert(game.p1.energy === 65, 'Libélula suma +25% de energía Ultra (65% total)');

  // Comer dos comunes (+15 + 15 = 95%) y otra (+15 = 100%)
  game.p1.tongue.active = true;
  game.p1.tongue.caughtBug = common1;
  game.p1.tongue.state = 'retracting';
  game.p1.tongue.length = 0;
  game.p1.updateTongue(0.016, [], game.p2, [], []);

  game.p1.tongue.active = true;
  game.p1.tongue.caughtBug = common2;
  game.p1.tongue.state = 'retracting';
  game.p1.tongue.length = 0;
  game.p1.updateTongue(0.016, [], game.p2, [], []);

  const common3 = new Bug('common', 100, 100, { width: 1024, height: 600 });
  game.p1.tongue.active = true;
  game.p1.tongue.caughtBug = common3;
  game.p1.tongue.state = 'retracting';
  game.p1.tongue.length = 0;
  game.p1.updateTongue(0.016, [], game.p2, [], []);

  assert(game.p1.energy === 100, 'Energía alcanza el 100% MAX');
  assert(game.p1.isUltraReady === true, 'El estado isUltraReady se activa al 100% de energía');
}

// 3. // Ataque normal vs Ultra a la otra rana
{
  const game = new CrazyFrogsGame();
  game.gameMode = 'kombat';
  game.startGame();

  // Ataque normal: P1 se posiciona frente a P2 y le dispara
  game.p1.x = game.p2.x - 25;
  game.p1.y = game.p2.y;
  game.p1.facing = 1;
  game.p1.tongue.active = true;
  game.p1.tongue.state = 'extending';
  game.p1.tongue.length = 24;
  game.p1.tongue.dirX = 1;
  game.p1.tongue.dirY = 0;
  game.p1.updateTongue(0.001, [], game.p2, [], []);

  assert(game.p2.hp === 96, 'Golpe normal con lengua resta -4 HP (pasa a 96 HP)');
  assert(game.p2.vx > 0, 'Golpe normal aplica retroceso horizontal a la víctima');

  // Activar Ultra en P1 y golpear a P2
  game.p1.isUltraReady = true;
  game.p1.energy = 100;
  game.p1.x = game.p2.x - 25;
  game.p1.y = game.p2.y;
  game.p1.facing = 1;
  game.p1.tongue.active = true;
  game.p1.tongue.state = 'extending';
  game.p1.tongue.length = 24;
  game.p1.tongue.dirX = 1;
  game.p1.tongue.dirY = 0;
  game.p1.updateTongue(0.001, [], game.p2, [], []);

  assert(game.p2.hp === 46, 'Golpe Ultra Mortal resta -50 HP demoledores (pasa a 46 HP)');
  assert(game.p1.isUltraReady === false, 'El Ultra se consume tras el impacto');
  assert(game.p1.energy === 0, 'La barra de energía vuelve a 0 tras usar el Ultra');
}

// 4. Daño por Caída al Agua (-8 HP)
{
  const game = new CrazyFrogsGame();
  game.gameMode = 'kombat';
  game.startGame();

  game.p1.hp = 100;
  game.p1.y = 550; // Nivel de agua
  game.p1.onFallInWater([], [], game.lilyPads);

  assert(game.p1.hp === 92, 'Caer al agua (¡Chof!) resta -8 HP');
}

// 5. Daño y drenaje por Avispas (-15 HP y -25 energía)
{
  const game = new CrazyFrogsGame();
  game.gameMode = 'kombat';
  game.startGame();

  game.p1.hp = 80;
  game.p1.energy = 50;
  const wasp = new Bug('wasp', 100, 100, { width: 1024, height: 600 });
  game.p1.tongue.active = true;
  game.p1.tongue.caughtBug = wasp;
  game.p1.tongue.state = 'retracting';
  game.p1.tongue.length = 0;
  game.p1.updateTongue(0.016, [], game.p2, [], []);

  assert(game.p1.hp === 65, 'Picadura de avispa resta -15 HP');
  assert(game.p1.energy === 25, 'Picadura de avispa drena 25% de energía Ultra');
}

// 6. Transición de Rondas (K.O. y Ronda 2)
{
  const game = new CrazyFrogsGame();
  game.gameMode = 'kombat';
  game.startGame();

  // P2 llega a 0 HP
  game.p2.hp = 0;
  game.update(0.016);

  assert(game.isRoundOver === true, 'Se activa estado de K.O. / Fin de Ronda');
  assert(game.kombatP1Wins === 1, 'P1 se anota su 1ª victoria de ronda');
  assert(game.roundBannerText.includes('K.O.'), 'Cartel muestra ¡K.O.!');

  // Simular el paso del tiempo de transición (160 frames a 60 FPS)
  for (let f = 0; f < 160; f++) {
    game.update(0.016);
  }

  assert(game.kombatRound === 2, 'Comienza automáticamente la Ronda 2');
  assert(game.p1.hp === 100 && game.p2.hp === 100, 'Las vidas se restauran a 100 HP para la nueva ronda');
  assert(game.isRoundOver === false, 'El estado de ronda activa se restablece');
}

// 7. Victoria Total al Mejor de 3 (Street Fighter Champion)
{
  const game = new CrazyFrogsGame();
  game.gameMode = 'kombat';
  game.startGame();

  // P1 gana ronda 1
  game.kombatP1Wins = 1;
  game.kombatRound = 2;

  // P1 vence en la ronda 2
  game.p2.hp = 0;
  game.update(0.016);
  assert(game.kombatP1Wins === 2, 'P1 acumula 2 rondas ganadas');

  // Esperar transición
  for (let f = 0; f < 160; f++) {
    game.update(0.016);
  }
  assert(game.gameState === 'gameover', 'La partida finaliza con victoria total tras 2 rondas ganadas');
  assert(game.winnerTitle.textContent.includes('CAMPEÓN'), 'El título de victoria corona al Campeón del Kombat');
}

// 8. Sincronización Online de Kombat
{
  const hostGame = new CrazyFrogsGame();
  hostGame.isOnline = true;
  hostGame.onlineRole = 'host';
  hostGame.gameMode = 'kombat';
  hostGame.startGame();

  hostGame.p1.hp = 75;
  hostGame.p1.energy = 80;
  hostGame.p2.hp = 40;
  hostGame.p2.energy = 100;
  hostGame.p2.isUltraReady = true;
  hostGame.kombatP1Wins = 1;
  hostGame.kombatP2Wins = 0;
  hostGame.kombatRound = 2;

  const guestGame = new CrazyFrogsGame();
  guestGame.isOnline = true;
  guestGame.onlineRole = 'guest';
  guestGame.gameMode = 'kombat';
  guestGame.startGame();

  let sentSnapshot = null;
  hostGame.sendOnlinePacket = (s) => { sentSnapshot = s; };

  // Forzar emisión de snapshot
  hostGame.onlineStateSyncTimer = 0.05;
  hostGame.dataChannel = { readyState: 'open', send: () => {} };
  hostGame.update(0.016);

  assert(sentSnapshot !== null && sentSnapshot.kombat !== null, 'El Host emite el paquete Kombat con datos de combate');
  assert(sentSnapshot.kombat.p1Hp === 75, 'HP de P1 se sincroniza en el snapshot');
  assert(sentSnapshot.kombat.p2U === true, 'Estado Ultra de P2 se sincroniza en el snapshot');

  // Invitado recibe snapshot
  guestGame.applyHostSnapshot(sentSnapshot);
  assert(guestGame.p1.hp === 75, 'El cliente Invitado sincroniza HP de P1');
  assert(guestGame.p2.isUltraReady === true, 'El cliente Invitado sincroniza Ultra de P2');
  assert(guestGame.kombatRound === 2, 'El cliente Invitado sincroniza la ronda actual');
}

console.log(`\n==========================================`);
console.log(`RESULTADOS KOMBAT: ${passed} superadas, ${failed} fallos.`);
console.log(`==========================================`);

if (failed > 0) process.exit(1);
