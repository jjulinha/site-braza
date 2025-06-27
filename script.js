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

// script.js (Substituir a função handleSplash)

// === SPLASH GENÉRICO PARA AMBAS AS PÁGINAS (COM MELHOR DEBUG) ===
function handleSplash(splashId, videoId) {
  const splash = document.getElementById(splashId);
  const video = document.getElementById(videoId);

  // Se o splash ou o vídeo não existirem na página, não fazemos nada.
  if (!splash || !video) {
    console.log(`Debug Braza: Elemento de splash ('${splashId}') ou vídeo ('${videoId}') não encontrado nesta página.`);
    // Se o splash não existir, garantimos que o body não fica 'loading'
    if (!splash) document.body.classList.remove('loading');
    return;
  }

  console.log(`Debug Braza: A tentar carregar o vídeo: ${video.querySelector('source').src}`);

  // Evento para quando o vídeo carrega com sucesso
  video.addEventListener('loadeddata', () => {
    console.log(`Debug Braza: Vídeo '${videoId}' carregado com SUCESSO! A mostrar o splash.`);
    setTimeout(() => {
      console.log(`Debug Braza: A remover o splash '${splashId}'.`);
      splash.classList.add('swoosh-out');
      setTimeout(() => {
        splash.remove();
        document.body.classList.remove('loading');
      }, 1000); // Duração da animação de saída
    }, 4000); // Tempo que o vídeo fica visível
  });

  // Evento para quando ocorre um ERRO ao carregar o vídeo
  video.addEventListener('error', () => {
    // AQUI ESTÁ A CHAVE: Este evento está a ser acionado.
    console.error(`Debug Braza: ERRO! Não foi possível carregar o ficheiro do vídeo: ${video.querySelector('source').src}. Verifique se o caminho e o nome do ficheiro estão corretos.`);
    
    // Escondemos o splash imediatamente para não bloquear o site.
    splash.classList.add('swoosh-out');
    setTimeout(() => {
      splash.remove();
      document.body.classList.remove('loading');
    }, 500); // Remove mais rápido em caso de erro
  });

  // Garantia extra: se o vídeo não carregar por algum motivo em 7 segundos, removemos o splash.
  setTimeout(() => {
    if (splash.parentElement) { // Verifica se o splash ainda existe no DOM
      console.warn("Debug Braza: O vídeo demorou demasiado a carregar. A remover o splash por segurança.");
      splash.remove();
      document.body.classList.remove('loading');
    }
  }, 7000);
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
