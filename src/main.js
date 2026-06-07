import './style.css';

// Initialize background floating hearts
function initHearts() {
  const container = document.getElementById('hearts-container');
  if (!container) return;
  
  const heartsCount = 60;
  const heartSymbols = ['❤️', '💖', '💝', '💕', '💗'];

  for (let i = 0; i < heartsCount; i++) {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.innerText = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    
    const size = Math.floor(Math.random() * 20) + 16; // 16px - 36px
    const left = Math.random() * 100; // 0% - 100%
    const duration = Math.random() * 6 + 7; // 7s - 13s
    const delay = Math.random() * 8; // 0s - 8s

    heart.style.setProperty('--size', `${size}px`);
    heart.style.setProperty('--left', `${left}%`);
    heart.style.setProperty('--duration', `${duration}s`);
    heart.style.animationDelay = `${delay}s`;

    container.appendChild(heart);
  }
}

// Logic components
const btnNao = document.getElementById('btn-nao');
const btnSim = document.getElementById('btn-sim');
const cardConvite = document.getElementById('card-convite');
const cardSucesso = document.getElementById('card-sucesso');

let tentativas = 0;
let ultimaPosicaoIndex = -1;

// Posições predefinidas em percentagem da viewport (vw, vh)
// Garante que o botão nunca saia do ecrã em qualquer dispositivo
const posicoes = [
  { x: 15, y: 15 }, // Top Left
  { x: 65, y: 15 }, // Top Right
  { x: 15, y: 70 }, // Bottom Left
  { x: 65, y: 70 }, // Bottom Right
  { x: 40, y: 20 }, // Top Center
  { x: 40, y: 75 }, // Bottom Center
  { x: 15, y: 45 }, // Middle Left
  { x: 65, y: 45 }  // Middle Right
];

function desviarBotao() {
  tentativas++;

  // Condição de terminação por limite de tentativas (desaparece ao 3º clique)
  if (tentativas >= 3) {
    if (btnNao) {
      btnNao.style.display = 'none';
    }
    return;
  }

  // Prevenir slide-in estranho no primeiro desvio
  if (!btnNao.classList.contains('moving')) {
    const rect = btnNao.getBoundingClientRect();
    btnNao.style.left = `${rect.left}px`;
    btnNao.style.top = `${rect.top}px`;
    btnNao.classList.add('no-transition');
    btnNao.classList.add('moving');
    
    // Mover o botão para o body para que a posição seja calculada em relação à viewport
    document.body.appendChild(btnNao);
    
    // Forçar reflow do browser
    btnNao.offsetHeight;
    btnNao.classList.remove('no-transition');
  }

  // Escolher uma posição predefinida diferente da anterior
  let index;
  do {
    index = Math.floor(Math.random() * posicoes.length);
  } while (index === ultimaPosicaoIndex);

  ultimaPosicaoIndex = index;
  const pos = posicoes[index];

  // Aplicar novas coordenadas usando unidades relativas à viewport (vw e vh)
  btnNao.style.left = `${pos.x}vw`;
  btnNao.style.top = `${pos.y}vh`;

  // Escalonamento de tamanhos (passos maiores pois o limite agora é de 3 tentativas)
  const escalaNao = Math.max(0.15, 1 - (tentativas * 0.35));
  const escalaSim = Math.min(2.5, 1 + (tentativas * 0.6)); // Limitar crescimento a 2.5x

  btnNao.style.transform = `scale(${escalaNao})`;
  btnSim.style.transform = `scale(${escalaSim})`;
}

// Triggers Confetti Explosion
function triggerConfetti() {
  const duration = 6 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    // Custom romantic and celebratory pastel colors
    const colors = ['#ff4d6d', '#ff758f', '#ff8fa3', '#ffb3c1', '#ffd3dc', '#ffeef2', '#ffd166', '#ffffff'];

    confetti(Object.assign({}, defaults, { 
      particleCount, 
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: colors
    }));
    confetti(Object.assign({}, defaults, { 
      particleCount, 
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: colors
    }));
  }, 250);
}

// Event Listeners
if (btnNao) {
  // O botão move-se apenas quando é clicado/tocado
  btnNao.addEventListener('click', desviarBotao);
}

if (btnSim) {
  btnSim.addEventListener('click', () => {
    if (cardConvite && cardSucesso) {
      cardConvite.classList.add('hidden');
      cardSucesso.classList.remove('hidden');
      triggerConfetti();

      // Esconder o botão "Não" caso ele tenha sido movido para o body durante a evasão
      if (btnNao) {
        btnNao.style.display = 'none';
      }

      // Initialize Lottie bouquet animation
      if (typeof lottie !== 'undefined') {
        lottie.loadAnimation({
          container: document.getElementById('lottie-container'),
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: './flower_buque.json'
        });
      }
    }
  });
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  initHearts();
});
