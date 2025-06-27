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

  // HEADER ESCONDIDO AO ROLAR
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

  // REVEAL
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

  // SPLASH INDEX
  const homePageIdentifier = document.getElementById('hero');
  if (homePageIdentifier) {
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
      setTimeout(() => {
        splashScreen.classList.add('swoosh-out');
        setTimeout(() => {
          if (splashScreen.parentNode) splashScreen.parentNode.removeChild(splashScreen);
          document.body.classList.remove('loading');
        }, 1000);
      }, 4000);
    }
  }

  // SPLASH PORTFOLIO
  const portfolioPageIdentifier = document.querySelector('.portfolio-grid-new');
  if (portfolioPageIdentifier) {
    const portfolioSplash = document.getElementById('splash-screen-portfolio');
    const splashVideo = document.getElementById('splash-video-portfolio');

    const removeSplash = () => {
      if (portfolioSplash) {
        portfolioSplash.classList.add('swoosh-out');
        setTimeout(() => {
          if (portfolioSplash.parentNode) {
            portfolioSplash.parentNode.removeChild(portfolioSplash);
          }
          document.body.classList.remove('loading');
        }, 1000);
      }
    };

    if (splashVideo) {
      splashVideo.addEventListener('loadeddata', () => {
        setTimeout(removeSplash, 4000);
      });
      splashVideo.addEventListener('error', (e) => {
        console.error("Erro ao carregar o vídeo de splash:", e);
        removeSplash();
      });
    } else {
      setTimeout(removeSplash, 5000);
    }

    // FILTROS
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
