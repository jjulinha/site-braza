// script.js (VERSÃO FINAL, COMPLETA E CORRIGIDA)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Configuração do Firebase (Lembre-se de preencher com as suas chaves, se aplicável)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "braza-ag",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Inicializa o Firebase e o Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para controlar o menu de navegação (mobile)
function handleMenu(menuId, buttonId) {
    const menu = document.getElementById(menuId);
    const button = document.getElementById(buttonId);
    if (menu && button) {
        button.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }
}

// Função para controlar o comportamento de acordeão (accordion)
function handleAccordion(accordionId) {
    const accordion = document.getElementById(accordionId);
    if (accordion) {
        const items = accordion.querySelectorAll('.accordion-item');
        items.forEach(item => {
            const header = item.querySelector('.accordion-header');
            header.addEventListener('click', () => {
                items.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                item.classList.toggle('active');
            });
        });
    }
}

// Função CORRIGIDA para o splash screen (resolve o loop infinito)
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
        
        splash.classList.add('swoosh-out');
        
        setTimeout(() => {
            if (splash.parentElement) {
                splash.remove();
            }
            document.body.classList.remove('loading');
        }, 1000);
    };

    video.addEventListener('ended', () => {
        removeSplash();
    });

    video.addEventListener('canplay', () => {
        video.play().catch(e => {
            removeSplash();
        });
    });

    const fallbackTimeout = setTimeout(() => {
        removeSplash();
    }, 15000);

    video.addEventListener('ended', () => clearTimeout(fallbackTimeout));
    video.addEventListener('error', () => clearTimeout(fallbackTimeout));
}

// Função CORRIGIDA para a galeria do portfólio (layout de capa)
function handleGallery(galleryId, collectionName) {
    const galleryElement = document.getElementById(galleryId);
    if (!galleryElement) return;

    galleryElement.innerHTML = ''; 
    const collectionRef = collection(db, collectionName);

    getDocs(collectionRef)
        .then((querySnapshot) => {
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
                galleryHTML += `
                  <div class="gallery-item gallery-item-cover">
                    <a href="${coverItem.link}" target="_blank">
                      <img src="${coverItem.imageUrl}" alt="Imagem de capa do projeto">
                    </a>
                  </div>
                `;
            }

            if (otherItems.length > 0) {
                galleryHTML += '<div class="gallery-thumbnails">';
                otherItems.forEach(item => {
                    galleryHTML += `
                      <div class="gallery-item gallery-item-thumbnail">
                        <a href="${item.link}" target="_blank">
                          <img src="${item.imageUrl}" alt="Imagem do projeto">
                        </a>
                      </div>
                    `;
                });
                galleryHTML += '</div>';
            }
            
            galleryHTML += '</div>';
            galleryElement.innerHTML = galleryHTML;
        })
        .catch((error) => {
            console.error("Erro ao buscar a galeria do Firebase: ", error);
            galleryElement.innerHTML = '<p>Não foi possível carregar a galeria. Tente novamente mais tarde.</p>';
        });
}

// --- INICIALIZAÇÃO DE TODAS AS FUNÇÕES NO SITE ---
document.addEventListener('DOMContentLoaded', () => {
    // ---- FUNÇÕES E ANIMAÇÕES ORIGINAIS RESTAURADAS ----
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });
    // ---------------------------------------------------

    // Inicializa o menu
    handleMenu('main-menu', 'menu-button');

    // Inicializa o acordeão (se existir na página)
    if (document.getElementById('faq-accordion')) {
        handleAccordion('faq-accordion');
    }
    
    // Inicializa o splash da PÁGINA INICIAL (index.html)
    if (document.getElementById('splash-screen')) {
        handleSplash('splash-screen', 'splash-video');
    }

    // Inicializa a galeria do PORTFÓLIO
    if (document.getElementById('gallery-julinha')) {
        handleGallery('gallery-julinha', 'julinha');
    }
    
    // Inicializa o splash do PORTFÓLIO
    if (document.getElementById('splash-screen-portfolio')) {
        handleSplash('splash-screen-portfolio', 'splash-video-portfolio');
    }
});
