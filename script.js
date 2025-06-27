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

  if (!splash || !video) {
    if (!splash) document.body.classList.remove('loading');
    return;
  }

  console.log(`Debug Braza: A aguardar o vídeo '${videoId}' ficar pronto...`);

  let splashRemoved = false; // Variável de controlo para não remover o splash duas vezes

  const removeSplash = () => {
    if (splashRemoved) return; // Se já foi removido, não faz mais nada
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

  // EVENTO PRINCIPAL: Ouve pelo evento 'canplay' que indica que o vídeo tem dados suficientes para tocar.
  video.addEventListener('canplay', () => {
    console.log(`Debug Braza: Vídeo '${videoId}' pronto para tocar (evento 'canplay').`);
    // Tenta iniciar o vídeo de forma programática. É mais garantido que o 'autoplay'.
    video.play()
      .then(() => {
        console.log(`Debug Braza: O vídeo '${videoId}' começou a tocar com sucesso.`);
        // Espera um tempo definido (4s) com o vídeo a tocar antes de remover o splash.
        setTimeout(removeSplash, 4000);
      })
      .catch(e => {
        console.error(`Debug Braza: Ocorreu um erro ao tentar tocar o vídeo: `, e);
        removeSplash(); // Se houver erro ao tocar, remove o splash
      });
  });

  // EVENTO DE ERRO: Se o browser não conseguir descodificar ou encontrar o vídeo.
  video.addEventListener('error', (e) => {
    console.error(`Debug Braza: ERRO GERAL no elemento de vídeo '${videoId}'.`, e);
    removeSplash();
  });

  // TEMPO LIMITE DE SEGURANÇA: Aumentado para 15 segundos.
  // Se nada acontecer em 15 segundos (nem 'canplay', nem 'error'), remove o splash para não bloquear o site.
  setTimeout(() => {
    console.warn("Debug Braza: Timeout de segurança atingido. A remover o splash.");
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

  // === LÓGICA DE PORTFÓLIO ===
  const portfolioPageIdentifier = document.querySelector('.portfolio-grid-new');
  if (portfolioPageIdentifier) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    let allProjects = [];

    function renderPortfolio(projectsToRender) {
      portfolioPageIdentifier.innerHTML = "";
      if (projectsToRender.length === 0) {
        portfolioPageIdentifier.innerHTML = "<p style='color: white; text-align: center;'>Nenhum projeto encontrado nesta categoria.</p>";
        return;
      }
      projectsToRender.forEach(projeto => {
        const itemLink = document.createElement('a');
        itemLink.href = projeto.link || '#';
        itemLink.className = 'portfolio-item-new';
        itemLink.target = '_blank';
        if (projeto.isCapa === true) {
          itemLink.classList.add('item-large');
        }
        itemLink.innerHTML = `<img src="${projeto.imagemURL}" alt="${projeto.titulo}"><div class="portfolio-item-overlay"><div class="overlay-content"><h3>${projeto.titulo}</h3><p>${projeto.descricao || 'Clique para ver mais'}</p></div></div>`;
        portfolioPageIdentifier.appendChild(itemLink);
      });
    }

    db.collection("projetos").orderBy("dataDeCriacao", "desc").get()
      .then((querySnapshot) => {
        allProjects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allProjects.sort((a, b) => (b.isCapa || false) - (a.isCapa || false));
        renderPortfolio(allProjects);
      })
      .catch((error) => console.error("Erro ao buscar projetos: ", error));

    if (filterButtons.length > 0) {
      filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          filterButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          const filterValue = button.getAttribute('data-filter');
          let filteredProjects = filterValue === 'all' ? allProjects : allProjects.filter(p => p.categoria === filterValue);
          filteredProjects.sort((a, b) => (b.isCapa || false) - (a.isCapa || false));
          renderPortfolio(filteredProjects);
        });
      });
    }
  }
});
