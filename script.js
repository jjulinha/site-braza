// script.js (VERSÃO COMPLETA E CORRIGIDA)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Configuração do Firebase (Lembre-se de preencher com as suas chaves)
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
            menu.classList.toggle('active'); // Adiciona ou remove a classe 'active'
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
                // Fecha todos os outros itens
                items.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                // Abre ou fecha o item clicado
                item.classList.toggle('active');
            });
        });
    }
}

// script.js - Substitua a função handleSplash por esta versão

function handleSplash(splashId, videoId) {
    const splash = document.getElementById(splashId);
    const video = document.getElementById(videoId);

    // Se os elementos não existirem, termina a execução para evitar erros.
    if (!splash || !video) {
        if (!splash) document.body.classList.remove('loading');
        return;
    }
    
    // Garante via JavaScript que o vídeo não entre em loop.
    video.loop = false; 

    let splashRemoved = false;
    const removeSplash = () => {
        if (splashRemoved) return;
        splashRemoved = true;
        
        console.log(`Debug Braza: A remover o splash '${splashId}'.`);
        splash.classList.add('swoosh-out');
        
        // Remove o elemento da página e a classe de loading após a animação.
        setTimeout(() => {
            if (splash.parentElement) {
                splash.remove();
            }
            document.body.classList.remove('loading');
        }, 1000); // Duração da animação de fade-out
    };

    // GATILHO PRINCIPAL: Quando o vídeo terminar de tocar, remove o splash.
    video.addEventListener('ended', () => {
        console.log("Debug Braza: Vídeo terminou (evento 'ended'). A remover o splash.");
        removeSplash();
    });

    // Tenta iniciar o vídeo assim que ele estiver pronto.
    video.addEventListener('canplay', () => {
        video.play().catch(e => {
            // Se o navegador bloquear o autoplay, remove o splash imediatamente.
            console.error("Debug Braza: Autoplay bloqueado. A remover o splash.", e);
            removeSplash();
        });
    });

    // GATILHO DE SEGURANÇA: Se o vídeo não carregar ou não tocar em 15 segundos, remove o splash.
    const fallbackTimeout = setTimeout(() => {
        console.warn("Debug Braza: Timeout de segurança de 15s atingido. A remover o splash.");
        removeSplash();
    }, 15000);

    // Se o vídeo terminar, cancelamos o gatilho de segurança para não haver redundância.
    video.addEventListener('ended', () => clearTimeout(fallbackTimeout));
    video.addEventListener('error', () => clearTimeout(fallbackTimeout));
}

// Função corrigida para a galeria do portfólio
function handleGallery(galleryId, collectionName) {
    const galleryElement = document.getElementById(galleryId);
    if (!galleryElement) return;

    galleryElement.innerHTML = ''; // Limpa a galeria
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


// --- INICIALIZAÇÃO DE TODAS AS FUNÇÕES ---
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o menu
    handleMenu('main-menu', 'menu-button');

    // Inicializa o acordeão (se existir na página)
    if (document.getElementById('faq-accordion')) {
        handleAccordion('faq-accordion');
    }

    // Inicializa a galeria (se existir na página)
    if (document.getElementById('gallery-julinha')) {
        handleGallery('gallery-julinha', 'julinha');
    }
    
    // Inicializa o splash (se existir na página)
    if (document.getElementById('splash-portfolio')) {
        handleSplash('splash-portfolio', 'splash-video-portfolio');
    }
});
