// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA PARA ANIMAÇÃO DE SCROLL ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1 // O elemento é revelado quando 10% dele está visível
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
                // Monta a URL para o embed do YouTube com autoplay
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                modal.classList.add('active');
            }
        });
    });

    const closeModal = () => {
        modal.classList.remove('active');
        // Importante: para o vídeo de tocar quando o modal for fechado
        iframe.src = "";
    }

    closeButton.addEventListener('click', closeModal);

    // Fecha o modal se o usuário clicar fora do conteúdo do vídeo
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
});
