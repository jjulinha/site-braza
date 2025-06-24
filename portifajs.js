document.addEventListener('DOMContentLoaded', () => {
  // SCROLL REVEAL
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });
    revealElements.forEach(elem => revealObserver.observe(elem));
  }

  // FILTRO DE CATEGORIAS
  const filterButtons = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      items.forEach(item => {
        const category = item.getAttribute('data-category');
        item.style.display = (filter === 'all' || category === filter) ? 'block' : 'none';
      });
    });
  });

  // HEADER ESCONDIDO
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

  // MODAL DE VÍDEO
  const modal = document.getElementById('video-modal');
  const iframe = document.getElementById('video-iframe');
  const closeButton = document.querySelector('.close-button');
  const portfolioItems = document.querySelectorAll('.gallery-item');

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
});
