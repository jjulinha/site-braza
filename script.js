// script.js (VERSÃO FINAL E COMPLETA)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBXcwxROjcGbjDcJ5ZvFvr_GsNAFg9_N3c",
  authDomain: "braza-portfolio.firebaseapp.com",
  projectId: "braza-portfolio",
  storageBucket: "braza-portfolio.firebasestorage.app",
  messagingSenderId: "504617854086",
  appId: "1:504617854086:web:727bfb242c29a6d7345d07",
  measurementId: "G-5KFT2C7ZCF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- INICIALIZAÇÃO DE TODAS AS FUNÇÕES ---
document.addEventListener('DOMContentLoaded', () => {
    
    // Animação de Fundo Vanta.js
    if (document.getElementById('hero')) {
        VANTA.FOG({
            el: "#hero", mouseControls: true, touchControls: true, gyroControls: false, minHeight: 200.00,
            minWidth: 200.00, highlightColor: 0xffc300, midtoneColor: 0xff1f00, lowlightColor: 0x2d2d2d,
            baseColor: 0x0, blurFactor: 0.90, speed: 1.5, zoom: 0.4
        });
    }

    // Animações de Scroll
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .timeline, .icon-svg');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.2 }); // Ajustado o threshold para melhor disparo
    animatedElements.forEach(el => observer.observe(el));
    
    // Chamadas de Funções
    if (document.getElementById('splash-screen')) handleSplash('splash-screen', 'splash-video');
    if (document.getElementById('gallery-julinha')) handleGallery('gallery-julinha', 'julinha');
    if (document.getElementById('splash-screen-portfolio')) handleSplash('splash-screen-portfolio', 'splash-video-portfolio');
});

// Função para o splash screen (versão robusta)
function handleSplash(splashId, videoId) {
    const splash = document.getElementById(splashId);
    const video = document.getElementById(videoId);

    if (!splash || !video) {
        if (!splash) document.body.classList.remove('loading');
        return;
    }
    
    video.loop = false; 

    let splashRemoved = false;
    const removeSplash = () => {
        if (splashRemoved) return;
        splashRemoved = true;
        splash.style.opacity = '0';
        setTimeout(() => {
            if (splash.parentElement) splash.remove();
            document.body.classList.remove('loading');
        }, 1000);
    };

    video.addEventListener('ended', removeSplash);
    video.addEventListener('error', removeSplash);

    const playPromise = video.play();
    if (playPromise !== undefined) {
        playPromise.catch(() => removeSplash());
    }

    const fallbackTimeout = setTimeout(removeSplash, 8000); // Timeout de segurança
    video.addEventListener('canplaythrough', () => clearTimeout(fallbackTimeout));
}

// Função para a galeria do portfólio (versão corrigida)
function handleGallery(galleryId, collectionName) {
    const galleryElement = document.getElementById(galleryId);
    if (!galleryElement) return;

    galleryElement.innerHTML = '<p>Carregando galeria...</p>'; 
    const collectionRef = collection(db, collectionName);

    getDocs(collectionRef)
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                galleryElement.innerHTML = '<p>Nenhum item encontrado na galeria.</p>';
                return;
            }

            let coverItem = null;
            const otherItems = [];

            querySnapshot.forEach((doc) => {
                const item = { id: doc.id, ...doc.data() };
                if (item.tag === 'capa') {
                    coverItem = item;
                } else {
                    otherItems.push(item);
                }
            });

            let galleryHTML = '<div class="gallery-layout">';
            if (coverItem) {
                galleryHTML += `<div class="gallery-item gallery-item-cover"><a href="${coverItem.link}" target="_blank"><img src="${coverItem.imageUrl}" alt="Imagem de capa do projeto"></a></div>`;
            }
            if (otherItems.length > 0) {
                galleryHTML += '<div class="gallery-thumbnails">';
                otherItems.forEach(item => {
                    galleryHTML += `<div class="gallery-item gallery-item-thumbnail"><a href="${item.link}" target="_blank"><img src="${item.imageUrl}" alt="Imagem do projeto"></a></div>`;
                });
                galleryHTML += '</div>';
            }
            galleryHTML += '</div>';
            galleryElement.innerHTML = galleryHTML;
        })
        .catch((error) => {
            console.error("Erro ao buscar a galeria do Firebase: ", error);
            galleryElement.innerHTML = '<p>Não foi possível carregar a galeria. Verifique a consola para mais detalhes.</p>';
        });
}
