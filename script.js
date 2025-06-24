document.addEventListener('DOMContentLoaded', () => {

  // Splash Screen
  const splash = document.getElementById('splash-screen');
  const video = document.getElementById('splash-video');
  if (splash && video) {
    const removeSplash = () => {
      // Verifica se o splash ainda existe antes de tentar removê-lo
      if (document.body.contains(splash)) {
        splash.classList.add('swoosh-out');
        setTimeout(() => {
          if (splash.parentNode) {
              splash.parentNode.removeChild(splash);
          }
        }, 1000); // Tempo da animação CSS
      }
    };

    // Evento para quando o vídeo termina
    video.addEventListener('ended', removeSplash);

    // Fallback de 4 segundos para remover o splash caso o vídeo falhe ou não dispare o evento
    setTimeout(removeSplash, 4000);
  }

  // Background VANTA FOG
  // Verifica se o elemento 'body' existe antes de aplicar o efeito
  if (document.querySelector('body')) {
    VANTA.FOG({
      el: "body",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      highlightColor: 0x6d0202,
      midtoneColor: 0x0,
      lowlightColor: 0x04040D,
      baseColor: 0x0,
      blurFactor: 0.50,
      speed: 0.80,
      zoom: 1.00
    });
  }

  // HEADER ESCONDIDO AO ROLAR
  const header = document.querySelector('header');
  if (header) {
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      if (currentScroll > lastScrollTop && currentScroll > 100) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }
      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
  }
  
  // SCROLL REVEAL DAS SEÇÕES
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
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
  }
  
  // TILT 3D NOS CARDS DE PLANOS
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

  // MODAL DE VÍDEO DO PORTFÓLIO
  const modal = document.getElementById('video-modal');
  const iframe = document.getElementById('video-iframe');
  const closeButton = document.querySelector('.close-button');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  if (modal && iframe && closeButton && portfolioItems.length > 0) {
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
  }

  // ANIMAÇÃO DOS TÍTULOS HERO
  const heroTitles = document.querySelectorAll('.hero-title');
  heroTitles.forEach((el, i) => {
    setTimeout(() => el.classList.add('active'), i * 400);
  });

});
