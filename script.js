// script.js (DEBUG VERSION)

document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA PARA A SPLASH SCREEN (VERSÃO À PROVA DE FALHAS) ---
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


    // --- LÓGICA PARA ANIMAÇÃO DE SCROLL FOI REMOVIDA PARA ESTE TESTE ---


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
