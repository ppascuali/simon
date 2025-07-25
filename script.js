// Lista de colores posibles en el juego
const colors = ["green", "red", "yellow", "blue"];

// Secuencia generada por el juego
let sequence = [];
// Secuencia que el usuario va ingresando
let userSequence = [];
// Nivel actual del juego
let level = 0;
// Indica si el juego está esperando la entrada del usuario
let waitingForInput = false;

// Frecuencias de las notas según Sonidos.txt y la escala de LA 440
const colorFrequencies = {
  green: 261.63,   // DO
  red: 293.66,     // RE
  yellow: 329.63,  // MI
  blue: 349.23     // FA
};

// Inicializa el contexto de audio
let audioCtx = null;

// Variable para saber si está sonando la melodía de victoria
let isVictoryMelodyPlaying = false;

// Función para reproducir el sonido de un color
function playSound(color) {
  if (isVictoryMelodyPlaying) return;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = 'sine';
  o.frequency.value = colorFrequencies[color];
  g.gain.value = 2.15;
  o.connect(g);
  g.connect(audioCtx.destination);
  o.start();
  o.stop(audioCtx.currentTime + 0.3);
}

// Secuencia de sonidos de victoria cuando se bate el récord
function playVictoryMelody() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  isVictoryMelodyPlaying = true;
  const melody = [
    colorFrequencies.green, // DO
    colorFrequencies.red,   // RE
    colorFrequencies.yellow,// MI
    colorFrequencies.blue,  // FA
    colorFrequencies.yellow,// MI
    colorFrequencies.red,   // RE
    colorFrequencies.green  // DO
  ];
  let t = audioCtx.currentTime;
  melody.forEach((freq, i) => {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    g.gain.value = 1.2;
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start(t + i * 0.18);
    o.stop(t + i * 0.18 + 0.15);
  });
  // Desbloqueo la interacción después de la melodía (duración total: 0.18*7 + 0.15 ≈ 1.41s)
  setTimeout(() => {
    isVictoryMelodyPlaying = false;
  }, 1450);
}

// Referencias a los elementos del DOM
const startBtn = document.getElementById("start-btn");
const repeatBtn = document.getElementById("repeat-btn"); // Botón para repetir secuencia
const levelSpan = document.getElementById("level");
const recordSpan = document.getElementById("record"); // Span para mostrar el récord
const messageDiv = document.getElementById("message"); // Div para mostrar mensajes
const colorBtns = colors.map(color => document.getElementById(color));
const playerNameInput = document.getElementById("player-name");
// Variable para el nombre del jugador que hizo el récord
let recordHolder = '';

// Variable para el récord
let record = 0;
// Variable para el nombre del jugador
let playerName = '';

// Cargar nombre y récord desde localStorage al iniciar
function loadRecord() {
  const saved = localStorage.getItem('simon-record');
  record = saved ? parseInt(saved) : 0;
  const savedHolder = localStorage.getItem('simon-record-holder');
  recordHolder = savedHolder ? savedHolder : '';
  playerNameInput.value = '';
  updateRecordDisplay();
}

function updateRecordDisplay() {
  recordSpan.textContent = recordHolder ? `Récord: ${record} (${recordHolder})` : `Récord: ${record}`;
}

// Guardar récord y nombre del jugador en localStorage
function saveRecord() {
  localStorage.setItem('simon-record', record);
  localStorage.setItem('simon-record-holder', recordHolder);
  updateRecordDisplay();
}

// Inicia el siguiente nivel: aumenta el nivel, agrega un color y muestra la secuencia
function nextLevel() {
  level++;
  levelSpan.textContent = `Nivel: ${level}`;
  if (level > record) {
    record = level;
    recordHolder = playerNameInput.value.trim() || 'Jugador';
    saveRecord();
    // Animación de récord
    recordSpan.classList.add('flash-record');
    playVictoryMelody();
    setTimeout(() => recordSpan.classList.remove('flash-record'), 2000);
  }
  // Agrega un color aleatorio a la secuencia
  sequence.push(colors[Math.floor(Math.random() * 4)]);
  userSequence = [];
  playSequence();
}

// Muestra la secuencia de colores al usuario, uno por uno
function playSequence() {
  waitingForInput = false; // Bloquea la entrada del usuario mientras se muestra la secuencia
  repeatBtn.disabled = true; // Deshabilita el botón de repetir mientras se muestra la secuencia
  let i = 0;
  const interval = setInterval(() => {
    if (i >= sequence.length) {
      clearInterval(interval);
      waitingForInput = true; // Ahora el usuario puede jugar
      return;
    }
    const color = sequence[i];
    flashButton(color); // Ilumina el botón correspondiente
    i++;
  }, 700);
}

// Ilumina un botón de color brevemente y reproduce su sonido
function flashButton(color) {
  const btn = document.getElementById(color);
  btn.classList.add("active");
  playSound(color); // Reproduce el sonido correspondiente
  setTimeout(() => {
    btn.classList.remove("active");
  }, 350);
}

// Maneja el clic en los botones de colores por parte del usuario
function handleColorClick(e) {
  if (!waitingForInput || isVictoryMelodyPlaying) return; // Ignora si no es el turno del usuario o si suena la melodía
  const color = e.target.id;
  userSequence.push(color); // Agrega el color elegido a la secuencia del usuario
  flashButton(color); // Ilumina el botón al hacer clic
  checkUserInput(); // Verifica si el usuario acertó o se equivocó
}

// Verifica si la secuencia del usuario es correcta
function checkUserInput() {
  const idx = userSequence.length - 1;
  // Si el usuario se equivoca, muestra el mensaje de pérdida en el fondo y habilita el botón de repetir
  if (userSequence[idx] !== sequence[idx]) {
    repeatBtn.disabled = false; // Habilita el botón de repetir
    waitingForInput = false;
    // Animación de pérdida y mensaje
    const gameContainer = document.getElementById('game-container');
    messageDiv.textContent = '¡Perdiste!';
    gameContainer.classList.add('lost');
    setTimeout(() => {
      gameContainer.classList.remove('lost');
      messageDiv.textContent = '';
    }, 1400);
    return;
  }
  // Si el usuario completó la secuencia correctamente, pasa al siguiente nivel
  if (userSequence.length === sequence.length) {
    setTimeout(nextLevel, 1000);
  }
}

// Reinicia el juego a su estado inicial
function resetGame() {
  sequence = [];
  userSequence = [];
  level = 0;
  levelSpan.textContent = "Nivel: 0";
  waitingForInput = false;
  repeatBtn.disabled = true; // Deshabilita el botón de repetir
  updateRecordDisplay();
  messageDiv.textContent = '';
}

// Evento para el botón de comenzar
startBtn.addEventListener("click", () => {
  resetGame();
  nextLevel();
});

// Evento para el botón de repetir secuencia
repeatBtn.addEventListener("click", () => {
  if (!repeatBtn.disabled && sequence.length > 0) {
    userSequence = [];
    playSequence();
  }
});

// Eventos para los botones de colores
colorBtns.forEach(btn => {
  btn.addEventListener("click", handleColorClick);
});

// Al cargar la página, cargo el récord y el nombre
loadRecord();

// Deshabilito el botón de comenzar si el nombre está vacío
function checkNameInput() {
  const name = playerNameInput.value.trim();
  startBtn.disabled = name.length === 0;
}
playerNameInput.addEventListener('input', checkNameInput);
checkNameInput(); 