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

  // SCRIPT DE DEPURAÇÃO PARA O HEADER

document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos que vamos usar
    const debugMonitor = document.getElementById('debug-monitor');
    const header = document.querySelector('header');
    
    // Verifica se os elementos essenciais existem
    if (!debugMonitor || !header) {
        console.error("ERRO: O monitor de debug ou o header não foram encontrados.");
        if(debugMonitor) debugMonitor.innerHTML = "ERRO: Header não encontrado.";
        return;
    }

    // Escreve o status inicial no monitor
    debugMonitor.innerHTML = "Status: INICIALIZADO<br>Posição do Scroll: 0<br>Header: VISÍVEL";
    
    let lastScrollTop = 0;

    // Adiciona o listener de scroll
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Atualiza o monitor com a posição atual
        debugMonitor.innerHTML = "Status: ROLANDO...<br>Posição do Scroll: " + Math.round(scrollTop);

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Adiciona a classe para esconder
            header.classList.add('header-hidden');
            // Informa no monitor
            debugMonitor.innerHTML += "<br>Header: ESCONDIDO";
        } else {
            // Remove a classe para mostrar
            header.classList.remove('header-hidden');
            // Informa no monitor
            debugMonitor.innerHTML += "<br>Header: VISÍVEL";
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);

});
  // Lógica do Acordeão (para Serviços e FAQ)
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const isActive = header.classList.contains('active');

      // Fecha todos os outros itens dentro do mesmo container
      const container = header.closest('.accordion-container');
      container.querySelectorAll('.accordion-header').forEach(otherHeader => {
        otherHeader.classList.remove('active');
        otherHeader.nextElementSibling.classList.remove('active');
      });
      
      // Abre ou fecha o item clicado (se não estava ativo, abre. Se estava, fecha)
      if (!isActive) {
        header.classList.add('active');
        content.classList.add('active');
      }
    });
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
