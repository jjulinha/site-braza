// script.js
document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA PARA A SPLASH SCREEN ---
    const splashScreen = document.getElementById('splash-screen');
    const body = document.body;
    body.classList.add('no-scroll');
    setTimeout(() => {
        splashScreen.style.opacity = '0';
        body.classList.remove('no-scroll');
        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 1000); 
    }, 3000); 

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
