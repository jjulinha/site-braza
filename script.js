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

  // --- Background VANTA FOG (CONFIGURAÇÃO ATUALIZADA) ---
  VANTA.FOG({
    el: "body", // Alvo continua sendo o body para preencher a tela toda
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    highlightColor: 0x6d0202, // Cor atualizada
    midtoneColor: 0x0,         // Cor atualizada
    lowlightColor: 0x04040D,   // Cor corrigida e atualizada
    baseColor: 0x0,            // Cor atualizada
    blurFactor: 0.50,          // Parâmetro mantido
    speed: 0.80,               // Parâmetro mantido
    zoom: 1.00                 // Parâmetro mantido
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
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1
  });

  revealElements.forEach(elem => {
    revealObserver.observe(elem);
  });

  // --- EFEITO 3D NOS CARDS DE PLANOS ---
  const planoCards = document.querySelectorAll('.plano-card');
  planoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

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
    item.addEventListener('click', () => {
      const videoId = item.getAttribute('data-video-id');
      if (videoId) {
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        modal.classList.add('active');
      }
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    iframe.src = "";
  };

  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  // --- ANIMAÇÃO DOS TÍTULOS NA SEÇÃO HERO ---
  const heroTitles = document.querySelectorAll('.hero-title');
  heroTitles.forEach((el, i) => {
    setTimeout(() => el.classList.add('active'), i * 400);
  });

});
