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

// Função corrigida para o splash screen
function handleSplash(splashId, videoId) {
    const splash = document.getElementById(splashId);
    const video = document.getElementById(videoId);

    if (!splash || !video) {
        if (!splash) document.body.classList.remove('loading');
        return;
    }

    console.log(`Debug Braza: A aguardar o vídeo '${videoId}' ficar pronto...`);
    let splashRemoved = false;

    const removeSplash = () => {
        if (splashRemoved) return;
        splashRemoved = true;
        console.log(`Debug Braza: A remover o splash '${splashId}'.`);
        splash.classList.add('swoosh-out');
        
        setTimeout(() => {
            if (splash && splash.parentElement) {
                splash.remove();
            }
            document.body.classList.remove('loading');
        }, 1000);
    };

    video.addEventListener('canplay', () => {
        console.log(`Debug Braza: Vídeo '${videoId}' pronto para tocar (evento 'canplay').`);
        video.play()
            .then(() => {
                console.log(`Debug Braza: O vídeo '${videoId}' começou a tocar com sucesso.`);
                setTimeout(removeSplash, 4000);
            })
            .catch(e => {
                console.error(`Debug Braza: Ocorreu um erro ao tentar tocar o vídeo: `, e);
                removeSplash();
            });
    });

    video.addEventListener('error', (e) => {
        console.error(`Debug Braza: ERRO GERAL no elemento de vídeo '${videoId}'. Verifique o caminho do ficheiro.`, e);
        removeSplash();
    });

    setTimeout(() => {
        console.warn("Debug Braza: Timeout de segurança atingido. A remover o splash para evitar bloqueio.");
        removeSplash();
    }, 15000);
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
