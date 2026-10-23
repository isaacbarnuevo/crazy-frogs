/**
 * Benchmark Estadístico Riguroso de la Inteligencia Artificial (Crazy Frogs)
 * Muestra: 10.000 iteraciones por escenario con cálculo de Intervalos de Confianza al 95%.
 */

const fs = require('fs');
const vm = require('vm');

// Mock mínimo
global.window = { addEventListener: () => {} };
global.document = {
  getElementById: () => null,
  querySelectorAll: () => [],
  body: { classList: { add: () => {}, remove: () => {} } }
};
global.localStorage = { getItem: () => null, setItem: () => {} };
global.AudioContext = class {
  constructor() { this.currentTime = 0; }
  createGain() { return { gain: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {} }, connect: () => {} }; }
  createOscillator() { return { type: '', frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }; }
};
global.webkitAudioContext = global.AudioContext;

// Cargar game.js
const code = fs.readFileSync('game.js', 'utf8');
vm.runInThisContext(code);

console.log('================================================================');
console.log('🔬 BENCHMARK ESTADÍSTICO DE LA IA (MONTE CARLO - 10.000 MUESTRAS)');
console.log('================================================================\n');

const bounds = { width: 960, height: 540 };
const N = 10000;

function runAvoidanceTest(difficulty, expectedRate) {
  const dummyLilyPads = [new LilyPad(160, 400, 50), new LilyPad(800, 400, 50)];
  const frog = new Frog(2, 500, 380, 'TestBot');
  frog.isCPU = true;

  // Avispa dentro del rango de acción (distancia 120 px)
  const wasp = new Bug('wasp', 500 + 120, 380, bounds);

  let avoidedCount = 0;
  let targetedCount = 0;

  for (let i = 0; i < N; i++) {
    frog.cpuDecisionTimer = 0;
    frog.cpuTarget = null;
    frog.updateCPU(0.1, dummyLilyPads, [wasp], null, bounds, difficulty);

    if (frog.cpuTarget === null) {
      avoidedCount++;
    } else if (frog.cpuTarget === wasp) {
      targetedCount++;
    }
  }

  const empiricalRate = (avoidedCount / N) * 100;
  const p = avoidedCount / N;
  const standardError = Math.sqrt((p * (1 - p)) / N) * 100;
  const marginError95 = 1.96 * standardError;
  const ciLow = (empiricalRate - marginError95).toFixed(2);
  const ciHigh = (empiricalRate + marginError95).toFixed(2);

  console.log(`[Dificultad: ${difficulty.toUpperCase().padEnd(6)}]`);
  console.log(`  - Muestras ejecutadas: ${N}`);
  console.log(`  - Tasa teórica esperada: ${(expectedRate * 100).toFixed(1)}%`);
  console.log(`  - Tasa empírica observada: ${empiricalRate.toFixed(2)}% (Evitadas: ${avoidedCount}, Atacadas: ${targetedCount})`);
  console.log(`  - Error estándar (SE): ±${standardError.toFixed(3)}%`);
  console.log(`  - Intervalo de Confianza 95%: [${ciLow}%, ${ciHigh}%]\n`);

  return { empiricalRate, ciLow, ciHigh, standardError };
}

console.log('--- TEST 1: Evasión de Avispa Aislada a rango medio (120px) ---');
const easyStats = runAvoidanceTest('easy', 0.60);
const normalStats = runAvoidanceTest('normal', 0.82);
const hardStats = runAvoidanceTest('hard', 0.96);

console.log('--- TEST 2: Dilema de Selección (Avispa cercana vs Libélula valiosa) ---');
function runDilemmaTest() {
  const dummyLilyPads = [new LilyPad(160, 400, 50), new LilyPad(800, 400, 50)];
  const frog = new Frog(2, 500, 380, 'TestBot');
  frog.isCPU = true;

  // Avispa muy cercana (80px), Libélula a distancia media (200px)
  const wasp = new Bug('wasp', 580, 380, bounds);
  const dragonfly = new Bug('dragonfly', 700, 380, bounds);

  let targetedDragonfly = 0;
  let targetedWasp = 0;
  let targetedNeither = 0;

  for (let i = 0; i < N; i++) {
    frog.cpuDecisionTimer = 0;
    frog.cpuTarget = null;
    frog.updateCPU(0.1, dummyLilyPads, [wasp, dragonfly], null, bounds, 'hard');

    if (frog.cpuTarget === dragonfly) targetedDragonfly++;
    else if (frog.cpuTarget === wasp) targetedWasp++;
    else targetedNeither++;
  }

  console.log(`[Dificultad CAOS (HARD) - 10.000 iteraciones]:`);
  console.log(`  - Eligió Libélula (+5 pts): ${(targetedDragonfly / N * 100).toFixed(2)}% (${targetedDragonfly} veces)`);
  console.log(`  - Eligió Avispa (-2 pts / daño): ${(targetedWasp / N * 100).toFixed(2)}% (${targetedWasp} veces)`);
  console.log(`  - Ignoró ambas / neutro: ${(targetedNeither / N * 100).toFixed(2)}% (${targetedNeither} veces)\n`);
}
runDilemmaTest();

console.log('--- TEST 3: Simulación de Partida Real Completa (100 partidas de 60s) ---');
function runFullMatchSimulation() {
  let totalBugsEaten = 0;
  let totalWaspsEaten = 0;
  let totalScore = 0;
  const matches = 100;

  for (let m = 0; m < matches; m++) {
    const dummyLilyPads = [new LilyPad(160, 400, 50), new LilyPad(800, 400, 50)];
    const p1 = new Frog(1, 160, 380, 'Player');
    const cpu = new Frog(2, 800, 380, 'Bot');
    cpu.isCPU = true;

    // Generar estanque con 8 insectos (mezcla realista según dificultad normal)
    const bugs = [
      new Bug('common', 400, 300, bounds),
      new Bug('common', 600, 320, bounds),
      new Bug('golden', 500, 250, bounds),
      new Bug('dragonfly', 700, 220, bounds),
      new Bug('wasp', 750, 350, bounds)
    ];

    // Simular 60 segundos con dt = 0.1s (600 frames lógicos)
    for (let f = 0; f < 600; f++) {
      cpu.update(0.1, {}, dummyLilyPads, bugs, p1, bounds, [], [], 'hard');
      // Respawn si se come un bicho
      for (const b of bugs) {
        if (!b.alive) {
          b.alive = true;
          b.x = 200 + Math.random() * 500;
          b.y = 150 + Math.random() * 200;
        }
      }
    }

    totalBugsEaten += cpu.fliesEaten;
    totalScore += cpu.score;
  }

  console.log(`[Resultados medios tras 100 partidas simuladas (Dificultad Caos)]:`);
  console.log(`  - Promedio moscas cazadas por partida: ${(totalBugsEaten / matches).toFixed(1)}`);
  console.log(`  - Puntuación media de la CPU: ${(totalScore / matches).toFixed(1)} pts`);
}
runFullMatchSimulation();
