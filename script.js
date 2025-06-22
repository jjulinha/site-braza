// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA PARA A SPLASH SCREEN (VERSÃO À PROVA DE FALHAS) ---
    const splashScreen = document.getElementById('splash-screen');
    const body = document.body;

    // Impede o scroll enquanto a splash screen está visível
    body.classList.add('no-scroll');

    // Define o tempo que a splash screen fica visível
    setTimeout(() => {
        // Inicia a animação de fade out
        splashScreen.style.opacity = '0';
        
        // Libera o scroll da página principal
        body.classList.remove('no-scroll');

        // Define um tempo para remover completamente a splash screen APÓS a animação
        // O tempo deve ser igual à duração da transição no CSS (1s = 1000ms)
        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 1000); 

    }, 3000); // Tempo total visível = 3 segundos


    // --- LÓGICA PARA ANIMAÇÃO DE SCROLL (continua igual) ---
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


    // --- LÓGICA PARA O MODAL DE VÍDEO (continua igual) ---
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
