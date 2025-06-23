document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA PARA A SPLASH SCREEN ---
<script>
  window.addEventListener('DOMContentLoaded', () => {
    const splash = document.getElementById('splash-screen');
    const video = document.getElementById('splash-video');

    if (!splash || !video) {
      console.error('Splash screen ou elemento de vídeo não encontrado.');
      return;
    }

    video.addEventListener('ended', () => {
      splash.classList.add('swoosh-out');
      setTimeout(() => splash.remove(), 1000);
    });

    // Se vídeo não carregar ou bloquear no autoplay, force após 3 s
    setTimeout(() => {
      if (document.body.contains(splash)) {
        video.dispatchEvent(new Event('ended'));
      }
    }, 3000);
  });
</script>

    // --- LÓGICA DO MENU QUE SOME AO ROLAR ---
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // --- LÓGICA PARA ANIMAÇÃO DE SCROLL ---
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

    // --- EFEITO DE TILT 3D NOS PLANOS ---
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


    // --- LÓGICA PARA O MODAL DE VÍDEO ---
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
});
