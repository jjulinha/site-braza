document.addEventListener('DOMContentLoaded', () => {

  // Splash Screen
  const splash = document.getElementById('splash-screen');
  const video = document.getElementById('splash-video');
  if (splash && video) {
    const removeSplash = () => {
      splash.classList.add('swoosh-out');
      // Espera a transição do CSS terminar para remover o elemento
      setTimeout(() => {
        if (splash.parentNode) {
            splash.parentNode.removeChild(splash);
        }
      }, 1000);
    };

    video.addEventListener('ended', removeSplash);

    // Fallback: remove o splash após 4s caso o vídeo não termine ou falhe
    setTimeout(() => {
      if (document.body.contains(splash)) {
        removeSplash();
      }
    }, 4000);
  }

  // Background VANTA FOG
  // Esta função aplica o efeito animado no fundo do corpo da página
  VANTA.FOG({
    el: "body",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    highlightColor: 0xffb300,
    midtoneColor: 0xe53935,
    lowlightColor: 0x150202,
    baseColor: 0x111111,
    blurFactor: 0.50,
    speed: 0.80,
    zoom: 1.00
  });

  // --- HEADER ESCONDIDO AO ROLAR ---
  let lastScrollTop = 0;
  const header = document.querySelector('header');

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Se rolar para baixo e já tiver passado da altura do header
    if (currentScroll > lastScrollTop && currentScroll > 100) {
      // Adiciona a classe que esconde o header
      header.classList.add('header-hidden');
    } else {
      // Se rolar para cima, remove a classe e mostra o header
      header.classList.remove('header-hidden');
    }
    // Atualiza a última posição de scroll
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  });
  
  // --- ANIMAÇÃO DE REVELAÇÃO DAS SEÇÕES AO ROLAR ---
  const revealElements = document.querySelectorAll('.reveal');
  // O IntersectionObserver é uma forma moderna e eficiente de detectar quando um elemento entra na tela
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Se o elemento estiver visível
      if (entry.isIntersecting) {
        // Adiciona a classe 'active' que ativa a animação do CSS
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1 // A animação ativa quando 10% do elemento estiver visível
  });

  // Aplica o observador a todos os elementos com a classe '.reveal'
  revealElements.forEach(elem => {
    revealObserver.observe(elem);
  });

  // --- EFEITO 3D NOS CARDS DE PLANOS ---
  const planoCards = document.querySelectorAll('.plano-card');
  planoCards.forEach(card => {
    // Quando o mouse se move sobre o card
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // Posição X do mouse dentro do card
      const y = e.clientY - rect.top;  // Posição Y do mouse dentro do card
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      // Calcula a rotação baseada na distância do mouse ao centro do card
      const rotateX = ((y - centerY) / centerY) * -7; // Rotação no eixo X
      const rotateY = ((x - centerX) / centerX) * 7;   // Rotação no eixo Y
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    // Quando o mouse sai do card, reseta a transformação
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  });

  // --- MODAL DE VÍDEO DO PORTFÓLIO ---
  const modal = document.getElementById('video-modal');
  const iframe = document.getElementById('video-iframe');
  const closeButton = document.querySelector('.close-button');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  portfolioItems.forEach(item => {
    // Adiciona um evento de clique para cada item do portfólio
    item.addEventListener('click', () => {
      const videoId = item.getAttribute('data-video-id');
      if (videoId) {
        // **CORREÇÃO AQUI:** Usamos a URL correta de embed do YouTube e o template literal `` com ${}
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        modal.classList.add('active'); // Mostra o modal
      }
    });
  });

  // Função para fechar o modal
  const closeModal = () => {
    modal.classList.remove('active');
    iframe.src = ""; // Para o vídeo ao fechar
  };

  closeButton.addEventListener('click', closeModal);
  // Fecha o modal se clicar fora do vídeo
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  // --- ANIMAÇÃO DOS TÍTULOS NA SEÇÃO HERO ---
  const heroTitles = document.querySelectorAll('.hero-title');
  // Adiciona a classe 'active' com um pequeno atraso entre cada título para um efeito escalonado
  heroTitles.forEach((el, i) => {
    setTimeout(() => el.classList.add('active'), i * 400);
  });

}); // Fim do addEventListener 'DOMContentLoaded'
