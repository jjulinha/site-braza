// CONFIGURAÇÃO DO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyBXcwxROjcGbjDcJ5ZvFvr_GsNAFg9_N3c",
  authDomain: "braza-portfolio.firebaseapp.com",
  projectId: "braza-portfolio",
  storageBucket: "braza-portfolio.appspot.com",
  messagingSenderId: "504617854086",
  appId: "1:504617854086:web:727bfb242c29a6d7345d07",
  measurementId: "G-5KFT2C7ZCF"
};
let db;
try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
} catch (e) {
  console.error("Erro ao inicializar o Firebase.", e);
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loading');

  // VANTA
  if (typeof VANTA !== 'undefined') {
    VANTA.FOG({
      el: "body",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      highlightColor: 0x6d0202,
      midtoneColor: 0x0,
      lowlightColor: 0x04040D,
      baseColor: 0x0,
      blurFactor: 0.50,
      speed: 0.80,
      zoom: 1.00
    });
  }

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

  // REVEAL SECTIONS
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active');
        }
      });
    }, { threshold: 0.1 });
    revealElements.forEach(elem => {
      revealObserver.observe(elem);
    });
  }

  // FAQ TOGGLE
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const question = item.querySelector('h3');
      question.addEventListener('click', () => {
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
        item.classList.toggle('active');
      });
    });
  }

// script.js (SUBSTITUA A FUNÇÃO ANTERIOR POR ESTA VERSÃO MELHORADA)

function handleSplash(splashId, videoId) {
  const splash = document.getElementById(splashId);
  const video = document.getElementById(videoId);

  // Se o splash ou o vídeo não existirem na página, não faz nada.
  if (!splash || !video) {
    // Garante que a classe 'loading' seja removida se o splash não for encontrado.
    if (!splash) document.body.classList.remove('loading');
    return;
  }

  console.log(`Debug Braza: A aguardar o vídeo '${videoId}' ficar pronto...`);

  let splashRemoved = false; // Variável de controlo para não remover o splash duas vezes

  const removeSplash = () => {
    if (splashRemoved) return; // Se já foi removido, não faz mais nada
    splashRemoved = true;
    console.log(`Debug Braza: A remover o splash '${splashId}'.`);
    splash.classList.add('swoosh-out'); // Adiciona a classe para o efeito de fade-out
    
    // Remove o elemento da página após a animação de saída.
    setTimeout(() => {
      if (splash && splash.parentElement) {
        splash.remove();
      }
      // Remove a classe 'loading' do body para mostrar o conteúdo do site.
      document.body.classList.remove('loading');
    }, 1000); // Tempo igual à duração da transição no CSS.
  };

  // EVENTO PRINCIPAL: Disparado quando o vídeo pode ser reproduzido.
  video.addEventListener('canplay', () => {
    console.log(`Debug Braza: Vídeo '${videoId}' pronto para tocar (evento 'canplay').`);
    
    // Tenta reproduzir o vídeo. O .catch() é importante para lidar com políticas de autoplay dos navegadores.
    video.play()
      .then(() => {
        console.log(`Debug Braza: O vídeo '${videoId}' começou a tocar com sucesso.`);
        // Espera 4 segundos com o vídeo a tocar antes de remover o splash.
        setTimeout(removeSplash, 4000);
      })
      .catch(e => {
        console.error(`Debug Braza: Ocorreu um erro ao tentar tocar o vídeo: `, e);
        removeSplash(); // Se houver um erro ao tocar, remove o splash imediatamente.
      });
  });

  // EVENTO DE ERRO: Disparado se o vídeo não carregar (ex: caminho errado).
  video.addEventListener('error', (e) => {
    console.error(`Debug Braza: ERRO GERAL no elemento de vídeo '${videoId}'. Verifique o caminho do ficheiro.`, e);
    removeSplash(); // Remove o splash para não bloquear o site.
  });

  // TEMPO LIMITE DE SEGURANÇA: Se nada acontecer em 15 segundos, remove o splash.
  setTimeout(() => {
    console.warn("Debug Braza: Timeout de segurança atingido. A remover o splash para evitar bloqueio.");
    removeSplash();
  }, 15000); // Aumentámos o tempo de espera para 15 segundos.
}
  
  // Detecta qual splash usar:
  if (document.getElementById('splash-screen')) {
    handleSplash('splash-screen', 'splash-video');
  }
  if (document.getElementById('splash-screen-portfolio')) {
    handleSplash('splash-screen-portfolio', 'splash-video-portfolio');
  }

 // script.js (SUBSTITUA A FUNÇÃO ANTERIOR POR ESTA VERSÃO CORRIGIDA)

function handleGallery(galleryId, collectionName) {
  const galleryElement = document.getElementById(galleryId);
  if (!galleryElement) return;

  // Limpa a galeria para evitar duplicados ao recarregar
  galleryElement.innerHTML = ''; 

  // Pega a referência da coleção no Firebase
  const collectionRef = collection(db, collectionName);

  getDocs(collectionRef)
    .then((querySnapshot) => {
      let coverItem = null; // Para armazenar o item de capa
      const otherItems = []; // Para armazenar os outros itens

      querySnapshot.forEach((doc) => {
        const item = { id: doc.id, ...doc.data() };
        // Separa o item de capa dos demais
        if (item.tag === 'capa') {
          coverItem = item;
        } else {
          otherItems.push(item);
        }
      });

      // --- Início da Lógica de Construção do HTML ---

      let galleryHTML = '<div class="gallery-layout">';

      // 1. Adiciona a imagem de capa (maior)
      if (coverItem) {
        galleryHTML += `
          <div class="gallery-item gallery-item-cover">
            <a href="${coverItem.link}" target="_blank">
              <img src="${coverItem.imageUrl}" alt="Imagem de capa do projeto">
            </a>
          </div>
        `;
      }

      // 2. Cria um container para as imagens menores
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
        galleryHTML += '</div>'; // Fecha o container das thumbnails
      }
      
      galleryHTML += '</div>'; // Fecha o gallery-layout

      // Insere o HTML gerado no elemento da galeria
      galleryElement.innerHTML = galleryHTML;

    })
    .catch((error) => {
      console.error("Erro ao buscar a galeria do Firebase: ", error);
      galleryElement.innerHTML = '<p>Não foi possível carregar a galeria. Tente novamente mais tarde.</p>';
    });
}

          
        });
      });
    }
  }
});
