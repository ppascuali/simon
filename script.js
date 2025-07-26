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
  o.stop(audioCtx.currentTime + 0.1);
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

// Melodía especial más larga para cuando se obtiene un récord
function playRecordMelody() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  isVictoryMelodyPlaying = true;
  
  // Melodía más elaborada y larga para celebrar el récord
  const recordMelody = [
    // Primera parte: escala ascendente
    colorFrequencies.green,  // DO
    colorFrequencies.red,    // RE
    colorFrequencies.yellow, // MI
    colorFrequencies.blue,   // FA
    // Segunda parte: escala descendente
    colorFrequencies.blue,   // FA
    colorFrequencies.yellow, // MI
    colorFrequencies.red,    // RE
    colorFrequencies.green,  // DO
    // Tercera parte: acorde final (múltiples notas juntas)
    colorFrequencies.green,  // DO
    colorFrequencies.yellow, // MI
    colorFrequencies.blue,   // FA
    // Cuarta parte: repetición final
    colorFrequencies.green,  // DO
    colorFrequencies.red,    // RE
    colorFrequencies.yellow, // MI
    colorFrequencies.blue    // FA
  ];
  
  let t = audioCtx.currentTime;
  
  // Reproduce la melodía con diferentes duraciones para crear más variedad
  recordMelody.forEach((freq, i) => {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    
    // Ajusta el volumen según la posición en la melodía
    let gainValue = 1.2;
    if (i >= 12) { // Las últimas notas son más fuertes
      gainValue = 1.5;
    }
    
    g.gain.value = gainValue;
    o.connect(g);
    g.connect(audioCtx.destination);
    
    // Duración variable: notas más largas al final
    let noteDuration = 0.2;
    if (i >= 8) {
      noteDuration = 0.3; // Notas más largas en la parte final
    }
    
    o.start(t + i * 0.25); // Espaciado más amplio entre notas
    o.stop(t + i * 0.25 + noteDuration);
  });
  
  // Desbloqueo la interacción después de la melodía completa
  // Duración total: 0.25*16 + 0.3 ≈ 4.3 segundos
  setTimeout(() => {
    isVictoryMelodyPlaying = false;
  }, 4500);
}

// Función para crear confeti animado
function createConfetti() {
  const confettiContainer = document.createElement('div');
  confettiContainer.style.position = 'fixed';
  confettiContainer.style.top = '0';
  confettiContainer.style.left = '0';
  confettiContainer.style.width = '100%';
  confettiContainer.style.height = '100%';
  confettiContainer.style.pointerEvents = 'none';
  confettiContainer.style.zIndex = '999';
  
  // Crear múltiples piezas de confeti
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.animationDelay = Math.random() * 2 + 's';
    confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
    confettiContainer.appendChild(confetti);
  }
  
  document.body.appendChild(confettiContainer);
  
  // Remover el confeti después de 4 segundos
  setTimeout(() => {
    document.body.removeChild(confettiContainer);
  }, 4000);
}

// Función para crear mensaje de celebración
function showRecordMessage() {
  const message = document.createElement('div');
  message.className = 'record-message';
  message.innerHTML = `
    <div>🏆 ¡NUEVO RÉCORD! 🏆</div>
    <div style="font-size: 1.5rem; margin-top: 10px;">¡Felicidades!</div>
  `;
  
  document.body.appendChild(message);
  
  // Remover el mensaje después de 3 segundos
  setTimeout(() => {
    if (document.body.contains(message)) {
      document.body.removeChild(message);
    }
  }, 3000);
}

// Función para crear efecto de fondo dorado
function createCelebrationBackground() {
  const bg = document.createElement('div');
  bg.className = 'record-celebration';
  document.body.appendChild(bg);
  
  // Remover el fondo después de 3 segundos
  setTimeout(() => {
    if (document.body.contains(bg)) {
      document.body.removeChild(bg);
    }
  }, 3000);
}

// Función para crear ondas de sonido
function createSoundWaves() {
  const gameContainer = document.getElementById('game-container');
  gameContainer.style.position = 'relative';
  
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const wave = document.createElement('div');
      wave.className = 'sound-wave';
      gameContainer.appendChild(wave);
      
      setTimeout(() => {
        if (gameContainer.contains(wave)) {
          gameContainer.removeChild(wave);
        }
      }, 2000);
    }, i * 500);
  }
}

// Función para celebrar el récord con todos los efectos
function celebrateRecord() {
  // Agregar clase de celebración al contenedor del juego
  const gameContainer = document.getElementById('game-container');
  gameContainer.classList.add('game-container-celebration');
  
  // Crear todos los efectos visuales
  createConfetti();
  showRecordMessage();
  createCelebrationBackground();
  createSoundWaves();
  
  // Remover la clase de celebración después de 3 segundos
  setTimeout(() => {
    gameContainer.classList.remove('game-container-celebration');
  }, 3000);
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
// Variable para rastrear si se superó el récord durante el juego actual
let recordBeatenThisGame = false;

// Referencia al botón de modo
const modeBtn = document.getElementById('mode-btn');

// Inicializa el modo en 'normal' siempre
let gameMode = 'normal';

// Evento para alternar el modo de juego
modeBtn.addEventListener('click', () => {
  // Solo permitir cambiar el modo cuando no está esperando input del usuario
  if (waitingForInput) {
    console.log('No se puede cambiar el modo durante el turno del usuario');
    return;
  }

  // Alternar entre modo normal y reversa
  if (gameMode === 'normal') {
    gameMode = 'reversa';
  } else {
    gameMode = 'normal';
  }

  // Actualizar la clase del botón para el color
  if (gameMode === 'reversa') {
    modeBtn.classList.add('reversa');
  } else {
    modeBtn.classList.remove('reversa');
  }

  // Actualizar el texto del botón con palabras destacadas
  modeBtn.innerHTML = `
    <span class="icon">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 3L10 17M10 3L6 7M10 3L14 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
    Modo: <span class="modo-normal">Normal</span> / <span class="modo-reversa">Reversa</span>
  `;
});

// Inicializar el botón de modo en estado normal al cargar
modeBtn.classList.remove('reversa');
modeBtn.innerHTML = `
  <span class="icon">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 3L10 17M10 3L6 7M10 3L14 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </span>
  Modo: <span class="modo-normal">Normal</span> / <span class="modo-reversa">Reversa</span>
`;

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
  // Verifica si se superó el récord pero no actualiza inmediatamente
  if (level > record) {
    recordBeatenThisGame = true; // Marca que se superó el récord en este juego
  }
  // Agrega un color aleatorio a la secuencia
  sequence.push(colors[Math.floor(Math.random() * 4)]);
  userSequence = [];
  playSequence();
}

// Función para habilitar todos los botones de colores
function enableColorButtons() {
  colorBtns.forEach(btn => {
    btn.disabled = false;
    btn.style.cursor = 'pointer';
  });
}

// Función para deshabilitar todos los botones de colores
function disableColorButtons() {
  colorBtns.forEach(btn => {
    btn.disabled = true;
    btn.style.cursor = 'not-allowed';
  });
}

// Muestra la secuencia de colores al usuario, uno por uno
function playSequence() {
  waitingForInput = false; // Bloquea la entrada del usuario mientras se muestra la secuencia
  repeatBtn.disabled = true; // Deshabilita el botón de repetir mientras se muestra la secuencia
  disableColorButtons(); // Deshabilita los botones de colores durante la reproducción
  let i = 0;
  const interval = setInterval(() => {
    if (i >= sequence.length) {
      clearInterval(interval);
      waitingForInput = true; // Ahora el usuario puede jugar
      enableColorButtons(); // Habilita los botones de colores para que el usuario pueda jugar
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
  // Determinar el índice correcto según el modo
  let correctColor;
  if (gameMode === 'reversa') {
    // En reversa, la secuencia se compara al revés
    correctColor = sequence[sequence.length - 1 - idx];
  } else {
    // En normal, la secuencia se compara normalmente
    correctColor = sequence[idx];
  }
  // Si el usuario se equivoca, muestra el mensaje de pérdida en el fondo y habilita el botón de repetir
  if (userSequence[idx] !== correctColor) {
    repeatBtn.disabled = false; // Habilita el botón de repetir
    waitingForInput = false;
    disableColorButtons(); // Deshabilita los botones de colores cuando el usuario pierde
    
    // Verifica si se superó el récord al final del juego
    if (recordBeatenThisGame) {
      record = level; // Actualiza el récord con el nivel alcanzado
      recordHolder = playerNameInput.value.trim() || 'Jugador';
      saveRecord();
      // Animación de récord y melodía de victoria
      recordSpan.classList.add('flash-record');
      playRecordMelody(); // Usa la nueva melodía de récord
      setTimeout(() => recordSpan.classList.remove('flash-record'), 600);
      celebrateRecord(); // Llamar a la función de celebración
    }
    
    // Animación de pérdida y mensaje
    const gameContainer = document.getElementById('game-container');
    messageDiv.textContent = '¡Perdiste!';
    gameContainer.classList.add('lost');
    setTimeout(() => {
      gameContainer.classList.remove('lost');
      messageDiv.textContent = '';
    }, 500);
    return;
  }
  // Si el usuario completó la secuencia correctamente, pasa al siguiente nivel
  if (userSequence.length === sequence.length) {
    setTimeout(nextLevel, 500);
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
  disableColorButtons(); // Deshabilita los botones de colores al reiniciar
  recordBeatenThisGame = false; // Resetea la bandera de récord superado
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

// Deshabilitar los botones de colores al cargar la página
disableColorButtons(); 