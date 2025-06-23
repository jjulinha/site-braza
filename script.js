document.addEventListener('DOMContentLoaded', () => {
  // Splash Screen
  const splash = document.getElementById('splash-screen');
  const video = document.getElementById('splash-video');
if (splash && video) {
  const removeSplash = () => {
    splash.classList.add('swoosh-out');
    setTimeout(() => splash.remove(), 1000);
  };

  video.addEventListener('ended', removeSplash);

  // Fallback total: vídeo bloqueado ou falhou
  setTimeout(() => {
    if (document.body.contains(splash)) removeSplash();
  }, 4000);
}


  // Background VANTA FOG
  <script>
    VANTA.FOG({
      el: "#fundo-animado",
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

  // Header Escondido ao Rolar
  let lastScrollTop = 0;
  const header = document.querySelector('header');

  window.addEventListener('scroll', function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });

  // Scroll Reveal
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

  // Tilt 3D nos Cards
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

  // Modal de Vídeo
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
  }

  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Animação dos Títulos HERO
  const heroTitles = document.querySelectorAll('.hero-title');
  heroTitles.forEach((el, i) => {
    setTimeout(() => el.classList.add('active'), i * 400);
  });
});
