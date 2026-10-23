/**
 * Test Suite para 2P Online WebRTC Multiplayer - Crazy Frogs
 */
const fs = require('fs');
const path = require('path');

// Mock mínimo de entorno DOM
class MockClassList {
  constructor() { this.classes = new Set(); }
  add(c) { this.classes.add(c); }
  remove(c) { this.classes.delete(c); }
  contains(c) { return this.classes.has(c); }
  toggle(c, force) {
    if (force !== undefined) {
      if (force) this.add(c); else this.remove(c);
      return force;
    }
    if (this.contains(c)) { this.remove(c); return false; }
    else { this.add(c); return true; }
  }
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
  focus() {}
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
  // Online elements
  onlineLobbyMenu: new MockElement('onlineLobbyMenu'),
  btnTabHost: new MockElement('btnTabHost', 'button'),
  btnTabJoin: new MockElement('btnTabJoin', 'button'),
  panelHost: new MockElement('panelHost'),
  panelJoin: new MockElement('panelJoin'),
  displayRoomCode: new MockElement('displayRoomCode'),
  btnCopyRoomCode: new MockElement('btnCopyRoomCode', 'button'),
  hostStatusBadge: new MockElement('hostStatusBadge'),
  inputJoinCode: new MockElement('inputJoinCode', 'input'),
  btnConnectToRoom: new MockElement('btnConnectToRoom', 'button'),
  joinStatusBadge: new MockElement('joinStatusBadge'),
  btnCloseOnlineLobby: new MockElement('btnCloseOnlineLobby', 'button'),
  onlineHudBadge: new MockElement('onlineHudBadge'),
  onlinePingDisplay: new MockElement('onlinePingDisplay'),
  // Touch
  touchLeft: new MockElement('touchLeft', 'button'),
  touchRight: new MockElement('touchRight', 'button'),
  touchDown: new MockElement('touchDown', 'button'),
  touchUp: new MockElement('touchUp', 'button'),
  touchJump: new MockElement('touchJump', 'button'),
  touchTongue: new MockElement('touchTongue', 'button')
};

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

global.window = {
  addEventListener: () => {},
  FIREBASE_CONFIG: { apiKey: 'test', projectId: 'crazy-frogs-test' }
};
global.document = {
  getElementById: (id) => mockElements[id] || null,
  querySelectorAll: () => [],
  activeElement: null,
  body: {
    classList: new MockClassList()
  }
};
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};
global.requestAnimationFrame = () => 1;
global.AudioContext = class {
  constructor() { this.currentTime = 0; }
  createGain() { return { gain: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {} }, connect: () => {} }; }
  createOscillator() { return { type: '', frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }; }
};
global.webkitAudioContext = global.AudioContext;

const vm = require('vm');
const gameCode = fs.readFileSync(path.join(__dirname, 'game.js'), 'utf8');
vm.runInThisContext(gameCode);

console.log('🧪 INICIANDO TEST SUITE 2P ONLINE WEBRTC - CRAZY FROGS\n');
let passed = 0;
let total = 0;

function assert(condition, testName) {
  total++;
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    process.exitCode = 1;
  }
}

const game = new CrazyFrogsGame();

// 1. Apertura del Lobby Online
game.openOnlineLobby();
assert(game.gameState === 'online_lobby', 'openOnlineLobby() cambia el gameState a "online_lobby"');
assert(!game.onlineLobbyMenu.classList.contains('hidden'), 'El menú del lobby online se muestra visible');

// 2. Navegación de pestañas (Host vs Join)
game.switchOnlineTab('join');
assert(game.btnTabJoin.classList.contains('active'), 'Pestaña Join se activa al cambiar');
assert(!game.panelJoin.classList.contains('hidden'), 'Panel Join se vuelve visible');

game.switchOnlineTab('host');
assert(game.btnTabHost.classList.contains('active'), 'Pestaña Host se activa al volver a Host');
assert(!game.panelHost.classList.contains('hidden'), 'Panel Host se vuelve visible');

// 3. Simulación de DataChannel Mock para pruebas de paquetes
const sentPacketsHost = [];
const sentPacketsGuest = [];

const mockHostChannel = {
  readyState: 'open',
  send: (data) => sentPacketsHost.push(JSON.parse(data))
};

const mockGuestChannel = {
  readyState: 'open',
  send: (data) => sentPacketsGuest.push(JSON.parse(data))
};

// 4. Configurar rol Host
game.isOnline = true;
game.onlineRole = 'host';
game.dataChannel = mockHostChannel;

// 5. Test Ping-Pong
game.handleOnlinePacket({ t: 'P', ts: 1000 });
assert(sentPacketsHost.length > 0 && sentPacketsHost[0].t === 'R' && sentPacketsHost[0].ts === 1000, 'Host responde con paquete Pong { t: "R" } ante un Ping');

// 6. Test Input de Invitado en Host
game.startGame();
game.handleOnlinePacket({ t: 'I', left: true, right: false, up: true, down: false });
assert(game.guestInputs.left === true && game.guestInputs.up === true, 'Host recibe y almacena guestInputs correctamente');

// Comprobar que guestInputs se aplican a P2 en update()
game.update(0.016);
assert(game.p2.vx < 0, 'La Rana 2 (P2) se mueve a la izquierda basándose en los inputs del Invitado');

// 7. Test Salto de Invitado en Host
const initialY = game.p2.y;
game.p2.onGround = true;
game.handleOnlinePacket({ t: 'J' });
assert(game.p2.vy < 0, 'La Rana 2 (P2) salta tras recibir paquete "J" del Invitado');

// 8. Test Lenguazo de Invitado en Host
game.handleOnlinePacket({ t: 'T', dir: { dx: 1, dy: -0.5 } });
assert(game.p2.tongue.active === true, 'La Rana 2 (P2) activa su lengua tras recibir paquete "T"');

// 9. Simular rol Invitado (Guest)
const guestGame = new CrazyFrogsGame();
guestGame.isOnline = true;
guestGame.onlineRole = 'guest';
guestGame.dataChannel = mockGuestChannel;
guestGame.startGame();

// 10. Aplicar snapshot del Host en Invitado
const testSnapshot = {
  t: 'S',
  tRem: 42.5,
  p1: { x: 210, y: 350, vx: 50, vy: 0, facing: 1, score: 7, lives: 3, stun: 0, tAct: false },
  p2: { x: 750, y: 350, vx: -50, vy: 0, facing: -1, score: 9, lives: 2, stun: 0, tAct: false },
  bugs: [
    { id: 'b_123', type: 'golden', x: 450, y: 200, alive: true },
    { id: 'b_456', type: 'wasp', x: 500, y: 220, alive: true }
  ],
  winner: null
};

guestGame.applyHostSnapshot(testSnapshot);
assert(guestGame.timeRemaining === 42.5, 'Invitado sincroniza timeRemaining desde el snapshot del Host');
assert(guestGame.p1.score === 7 && guestGame.p1.x === 210, 'Invitado sincroniza la posición y puntos de P1');
assert(guestGame.p2.score === 9 && guestGame.p2.lives === 2, 'Invitado sincroniza los puntos y vidas de P2');
assert(guestGame.bugs.length === 2 && guestGame.bugs[0].type === 'golden', 'Invitado sincroniza la lista de moscas del estanque');

// 11. Test Victoria indicada por Host
guestGame.applyHostSnapshot({ ...testSnapshot, winner: 2 });
assert(guestGame.gameState === 'gameover', 'Invitado finaliza partida al recibir "winner" desde el Host');

// 12. Limpieza de conexión
guestGame.cleanupOnlineConnection();
assert(guestGame.isOnline === false, 'cleanupOnlineConnection restablece isOnline a false');
assert(guestGame.onlineRole === null, 'cleanupOnlineConnection restablece onlineRole a null');

console.log(`\n==========================================`);
console.log(`RESULTADOS: ${passed} pruebas superadas, ${total - passed} fallos.`);
console.log(`==========================================\n`);
