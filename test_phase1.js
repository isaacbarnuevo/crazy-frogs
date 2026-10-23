/**
 * Test Suite para Fase 1 de Crazy Frogs:
 * - Controles táctiles virtuales
 * - IA de la CPU (Ribbit Bot)
 * - Modos de juego y dificultades
 * - Ciclo de vida de la partida y ranking local
 */

// Mock de entorno DOM mínimo
class MockClassList {
  constructor() { this.classes = new Set(); }
  add(c) { this.classes.add(c); }
  remove(c) { this.classes.delete(c); }
  contains(c) { return this.classes.has(c); }
}

class MockElement {
  constructor(id = '', tag = 'div') {
    this.id = id;
    this.tagName = tag.toUpperCase();
    this.classList = new MockClassList();
    this.style = {};
    this.value = '';
    this.textContent = '';
    this.innerHTML = '';
    this.listeners = {};
    this.dataset = {};
  }
  addEventListener(event, cb) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(cb);
  }
  dispatchEvent(event, data = {}) {
    if (this.listeners[event]) {
      const e = { type: event, preventDefault: () => {}, cancelable: true, ...data };
      this.listeners[event].forEach(cb => cb(e));
    }
  }
  setAttribute(k, v) { this[k] = v; }
  appendChild() {}
}

const mockElements = {
  gameCanvas: new MockElement('gameCanvas', 'canvas'),
  uiOverlay: new MockElement('uiOverlay'),
  mainMenu: new MockElement('mainMenu'),
  pauseMenu: new MockElement('pauseMenu'),
  gameOverMenu: new MockElement('gameOverMenu'),
  leaderboardMenu: new MockElement('leaderboardMenu'),
  winnerTitle: new MockElement('winnerTitle'),
  winnerBanner: new MockElement('winnerBanner'),
  recordAlert: new MockElement('recordAlert'),
  statScoreP1: new MockElement('statScoreP1'),
  statScoreP2: new MockElement('statScoreP2'),
  statHeaderP1: new MockElement('statHeaderP1'),
  statHeaderP2: new MockElement('statHeaderP2'),
  statDetailsP1: new MockElement('statDetailsP1'),
  statDetailsP2: new MockElement('statDetailsP2'),
  toastMessage: new MockElement('toastMessage'),
  btnToggleSound: new MockElement('btnToggleSound'),
  inputP1Name: new MockElement('inputP1Name', 'input'),
  inputP2Name: new MockElement('inputP2Name', 'input'),
  displayP1CardName: new MockElement('displayP1CardName'),
  displayP2CardName: new MockElement('displayP2CardName'),
  btnOpenLeaderboard: new MockElement('btnOpenLeaderboard'),
  btnCloseLeaderboard: new MockElement('btnCloseLeaderboard'),
  btnResetLeaderboard: new MockElement('btnResetLeaderboard'),
  btnGameOverLeaderboard: new MockElement('btnGameOverLeaderboard'),
  lbTableHead: new MockElement('lbTableHead'),
  lbTableBody: new MockElement('lbTableBody'),
  lbEmptyState: new MockElement('lbEmptyState'),
  lbCloudStatus: new MockElement('lbCloudStatus'),
  btnStartGame: new MockElement('btnStartGame'),
  btnResume: new MockElement('btnResume'),
  btnRestartFromPause: new MockElement('btnRestartFromPause'),
  btnBackToMenu: new MockElement('btnBackToMenu'),
  btnRematch: new MockElement('btnRematch'),
  btnGameOverToMenu: new MockElement('btnGameOverToMenu'),
  // Touch controls
  touchLeft: new MockElement('touchLeft', 'button'),
  touchRight: new MockElement('touchRight', 'button'),
  touchDown: new MockElement('touchDown', 'button'),
  touchJump: new MockElement('touchJump', 'button'),
  touchTongue: new MockElement('touchTongue', 'button')
};

// Mock canvas getContext
mockElements.gameCanvas.width = 960;
mockElements.gameCanvas.height = 540;
mockElements.gameCanvas.getContext = () => ({
  clearRect: () => {},
  createLinearGradient: () => ({ addColorStop: () => {} }),
  fillRect: () => {},
  beginPath: () => {},
  arc: () => {},
  ellipse: () => {},
  moveTo: () => {},
  lineTo: () => {},
  fill: () => {},
  stroke: () => {},
  save: () => {},
  restore: () => {},
  translate: () => {},
  rotate: () => {},
  scale: () => {}
});

// Setup globals
const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; }
};

global.document = {
  body: new MockElement('body'),
  getElementById: (id) => mockElements[id] || null,
  querySelectorAll: (selector) => {
    if (selector.includes('#opponentSelector')) {
      const btn1 = new MockElement('', 'button');
      btn1.dataset.opponent = 'cpu';
      const btn2 = new MockElement('', 'button');
      btn2.dataset.opponent = 'local2p';
      return [btn1, btn2];
    }
    if (selector.includes('#modeSelector')) {
      return ['time', 'lives', 'race', 'kombat'].map(m => {
        const b = new MockElement('', 'button');
        b.dataset.mode = m;
        return b;
      });
    }
    if (selector.includes('#diffSelector')) {
      return ['easy', 'normal', 'hard'].map(d => {
        const b = new MockElement('', 'button');
        b.dataset.diff = d;
        return b;
      });
    }
    return [];
  },
  createElement: (tag) => new MockElement('', tag),
  activeElement: null
};

global.window = {
  addEventListener: () => {},
  innerWidth: 960,
  innerHeight: 540
};

global.requestAnimationFrame = () => 1;
global.AudioContext = class {
  constructor() { this.currentTime = 0; }
  createGain() { return { gain: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {} }, connect: () => {} }; }
  createOscillator() { return { type: '', frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }; }
};
global.webkitAudioContext = global.AudioContext;

// Cargar game.js en el contexto global
const fs = require('fs');
const vm = require('vm');
const gameSource = fs.readFileSync('game.js', 'utf8');
vm.runInThisContext(gameSource);

// ==========================================
// EJECUTAR BATERÍA DE PRUEBAS
// ==========================================
let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failed++;
  }
}

console.log('🧪 INICIANDO TEST SUITE FASE 1 - CRAZY FROGS\n');

try {
  // Test 1: Instanciación del juego
  const game = new CrazyFrogsGame();
  assert(game !== null, 'CrazyFrogsGame se instancia correctamente');
  assert(game.opponentMode === 'cpu', 'El modo de oponente por defecto es "cpu"');
  assert(game.touchState.left === false && game.touchState.right === false && game.touchState.down === false, 'Estado inicial de controles táctiles está en reposo');

  // Test 2: Simulación de controles táctiles (D-pad y acciones)
  mockElements.touchLeft.dispatchEvent('touchstart');
  assert(game.touchState.left === true, 'Pulsación táctil izquierda activa touchState.left');
  mockElements.touchLeft.dispatchEvent('touchend');
  assert(game.touchState.left === false, 'Liberación táctil izquierda desactiva touchState.left');

  mockElements.touchRight.dispatchEvent('touchstart');
  assert(game.touchState.right === true, 'Pulsación táctil derecha activa touchState.right');
  mockElements.touchRight.dispatchEvent('touchend');
  assert(game.touchState.right === false, 'Liberación táctil derecha desactiva touchState.right');

  mockElements.touchDown.dispatchEvent('touchstart');
  assert(game.touchState.down === true, 'Pulsación táctil abajo activa touchState.down');
  mockElements.touchDown.dispatchEvent('touchend');
  assert(game.touchState.down === false, 'Liberación táctil abajo desactiva touchState.down');

  // Test 3: Arranque de partida 1P vs CPU
  game.startGame();
  assert(game.gameState === 'playing', 'El estado del juego cambia a "playing"');
  assert(document.body.classList.contains('in-game'), 'La clase "in-game" se añade al body (revela controles táctiles)');
  assert(game.p1 !== null && game.p2 !== null, 'Ambas ranas han sido creadas');
  assert(game.p2.isCPU === true, 'La Rana 2 está configurada como IA (isCPU = true)');
  assert(game.p2.name.includes('Bot') || game.p2.name.includes('Ribbit'), `El nombre de la CPU es identificable: "${game.p2.name}"`);

  // Test 4: Acciones táctiles durante la partida
  const initialTongueShots = game.p1.tongueShots;
  mockElements.touchTongue.dispatchEvent('touchstart');
  assert(game.p1.tongue.active === true, 'Pulsación de botón táctil "LENGUA" dispara la lengua de P1');
  assert(game.p1.tongueShots === initialTongueShots + 1, 'Contador de disparos de lengua se incrementa');

  // Test 5: Pausa, reanudación y visibilidad de controles
  game.pauseGame();
  assert(game.gameState === 'paused', 'Juego entra en estado "paused"');
  assert(!document.body.classList.contains('in-game'), 'Clase "in-game" se retira en pausa (oculta controles táctiles)');

  game.resumeGame();
  assert(game.gameState === 'playing', 'Juego reanuda a "playing"');
  assert(document.body.classList.contains('in-game'), 'Clase "in-game" se restaura al reanudar');

  // Test 6: Comportamiento y lógica de la IA de la CPU
  console.log('\n🤖 Probando Inteligencia Artificial de la CPU:');
  const dummyLilyPads = [new LilyPad(160, 400, 50), new LilyPad(800, 400, 50)];
  const bounds = { width: 960, height: 540 };

  // 6.1: Selección de objetivos prioritarios (libélula vs mosca común)
  const commonFly = new Bug('common', 750, 360, bounds);
  const dragonfly = new Bug('dragonfly', 730, 370, bounds); // Libélula vale 5 pts
  const bugsList = [commonFly, dragonfly];

  game.p2.cpuDecisionTimer = 0; // Forzar evaluación inmediata
  game.p2.updateCPU(0.1, dummyLilyPads, bugsList, game.p1, bounds, 'normal');
  assert(game.p2.cpuTarget === dragonfly, 'La CPU prioriza atacar la libélula (5 pts) sobre la mosca común (1 pt)');

  // 6.2: Esquiva de avispa peligrosa
  const wasp = new Bug('wasp', 780, 390, bounds); // Avispa muy cerca
  const waspList = [wasp];
  game.p2.cpuDecisionTimer = 0;
  // En dificultad 'hard', el ratio de evasión es 96%
  let waspAvoidCount = 0;
  for (let i = 0; i < 50; i++) {
    game.p2.cpuDecisionTimer = 0;
    game.p2.updateCPU(0.1, dummyLilyPads, waspList, game.p1, bounds, 'hard');
    if (game.p2.cpuTarget !== wasp) waspAvoidCount++;
  }
  assert(waspAvoidCount >= 40, `La CPU en modo Caos evita activamente a las avispas (${waspAvoidCount}/50 evitadas)`);

  // 6.3: Salto inteligente si el objetivo está alto
  const highBug = new Bug('golden', 790, 200, bounds); // Mucho más arriba (-200 dy)
  game.p2.cpuDecisionTimer = 0;
  game.p2.cpuJumpTimer = 0;
  game.p2.onGround = true;
  let jumped = false;
  for (let i = 0; i < 30; i++) {
    game.p2.cpuDecisionTimer = 0;
    game.p2.cpuJumpTimer = 0;
    game.p2.updateCPU(0.1, dummyLilyPads, [highBug], game.p1, bounds, 'hard');
    if (!game.p2.onGround || game.p2.vy < 0) {
      jumped = true;
      break;
    }
  }
  assert(jumped, 'La CPU salta para alcanzar objetivos voladores en altura');

  // Test 7: Fin de partida y ranking local
  console.log('\n🏆 Probando Finalización y Salón de la Fama:');
  game.p1.score = 15;
  game.p2.score = 10;
  game.endGame(1);
  assert(game.gameState === 'gameover', 'Estado finaliza en "gameover"');
  assert(!document.body.classList.contains('in-game'), 'Clase "in-game" se retira en gameover');
  
  const savedData = game.getLeaderboardData();
  assert(savedData !== null, 'Se recuperan datos del Salón de la Fama');
  assert(Array.isArray(savedData.time), 'Existe categoría de récord para modo Tiempo');

} catch (err) {
  console.error('Error durante la ejecución del test:', err);
  failed++;
}

console.log(`\n==========================================`);
console.log(`RESULTADOS: ${passed} pruebas superadas, ${failed} fallos.`);
console.log(`==========================================`);
if (failed > 0) process.exit(1);
