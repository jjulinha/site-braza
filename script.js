// =================================================================
// INÍCIO: CONFIGURAÇÃO E FUNÇÕES DO FIREBASE
// =================================================================

// 1. Configuração do Firebase (com as suas chaves)
const firebaseConfig = {
  apiKey: "AIzaSyBXcwxROjcGbjDcJ5ZvFvr_GsNAFg9_N3c",
  authDomain: "braza-portfolio.firebaseapp.com",
  projectId: "braza-portfolio",
  storageBucket: "braza-portfolio.appspot.com",
  messagingSenderId: "504617854086",
  appId: "1:504617854086:web:727bfb242c29a6d7345d07",
  measurementId: "G-5KFT2C7ZCF"
};

// 2. Inicializa o Firebase e o Firestore
// Usamos uma variável global 'db' para que a função construtora possa acessá-la
let db;
try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
} catch (e) {
  console.error("Erro ao inicializar o Firebase. Verifique suas chaves de configuração.", e);
}

/**
 * Adiciona um novo projeto à coleção 'projetos' no Firestore,
 * garantindo que todos os projetos tenham uma estrutura padrão.
 * Esta é a sua função "construtora" ou "molde".
 *
 * @param {string} titulo - O título do novo projeto.
 * @param {string} imagemURL - O caminho para a imagem do projeto (ex: 'assets/novo-projeto.jpg').
 * @param {string} descricao - A descrição detalhada do projeto.
 */
async function adicionarNovoProjeto(titulo, imagemURL, descricao) {
  if (typeof db === 'undefined') {
    console.error("Erro: A instância do Firestore 'db' não foi encontrada.");
    return;
  }

  try {
    // Objeto que representa o novo projeto com os campos padrão.
    const novoProjeto = {
      titulo: titulo,
      imagemURL: imagemURL,
      descricao: descricao,
      dataDeCriacao: firebase.firestore.FieldValue.serverTimestamp(), // Pega a data/hora do servidor.
    };

    const docRef = await db.collection("projetos").add(novoProjeto);
    console.log("Projeto adicionado com sucesso! ID do documento:", docRef.id);
    alert("Projeto adicionado com sucesso!");

  } catch (error) {
    console.error("Erro ao adicionar novo projeto: ", error);
    alert("Ocorreu um erro ao adicionar o projeto. Verifique o console.");
  }
}

// =================================================================
// FIM: CONFIGURAÇÃO E FUNÇÕES DO FIREBASE
// =================================================================


// --- LÓGICA PRINCIPAL DO SITE (executada após o carregamento da página) ---
document.addEventListener('DOMContentLoaded', () => {

  // LÓGICA PARA BUSCAR PROJETOS DO FIREBASE
  const portfolioGrid = document.querySelector('.portfolio-grid');
  if (portfolioGrid && typeof db !== 'undefined') {
    db.collection("projetos")
      .orderBy("dataDeCriacao", "desc")
      .limit(3)
      .get()
      .then((querySnapshot) => {
        let html = "";
        if (querySnapshot.empty) {
          portfolioGrid.innerHTML = "<p style='text-align: center; width: 100%;'>Nenhum projeto encontrado.</p>";
          return;
        }
        querySnapshot.forEach((doc) => {
          const projeto = doc.data();
          html += `
            <div class="portfolio-item">
              <img src="${projeto.imagemURL}" alt="${projeto.titulo}" onerror="this.onerror=null;this.src='https://placehold.co/600x400/1a1a1a/fff?text=Imagem+N%C3%A3o+Encontrada';">
              <div class="overlay">
                <h3>${projeto.titulo}</h3>
              </div>
            </div>
          `;
        });
        portfolioGrid.innerHTML = html;
      })
      .catch((error) => {
        console.error("Erro ao buscar projetos: ", error);
        portfolioGrid.innerHTML = "<p style='text-align: center; width: 100%;'>Não foi possível carregar os projetos.</p>";
      });
  }
// =================================================================
// INÍCIO: LÓGICA PARA A PÁGINA COMPLETA DE PORTFÓLIO
// =================================================================
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona a grelha da página de portfólio (com a classe correta)
    const fullPortfolioGrid = document.querySelector('.portfolio-grid-new');

    // Esta lógica só corre se encontrar a grelha da página de portfólio
    if (fullPortfolioGrid && typeof db !== 'undefined') {
        
        db.collection("projetos")
          .orderBy("dataDeCriacao", "desc") // Ordena pelos mais recentes
          // SEM LIMITE: .limit(3) foi removido para mostrar todos os projetos
          .get()
          .then((querySnapshot) => {
            
            // Limpa a grelha caso tenha conteúdo de exemplo
            fullPortfolioGrid.innerHTML = ""; 

            if (querySnapshot.empty) {
                fullPortfolioGrid.innerHTML = "<p style='text-align: center; width: 100%; color: white;'>Nenhum projeto encontrado no momento.</p>";
                return;
            }

            querySnapshot.forEach((doc) => {
                const projeto = doc.data();

                // Cria o HTML com a estrutura CORRETA que o nosso CSS espera
                const portfolioItemHTML = `
                    <a href="${projeto.link || '#'}" class="portfolio-item-new" target="_blank">
                        <img src="${projeto.imagemURL}" alt="Imagem do Projeto ${projeto.titulo}">
                        <div class="portfolio-item-overlay">
                            <div class="overlay-content">
                                <h3>${projeto.titulo}</h3>
                                <p>${projeto.descricao || 'Clique para ver mais'}</p>
                            </div>
                        </div>
                    </a>
                `;
                
                // Insere o novo item na grelha
                fullPortfolioGrid.innerHTML += portfolioItemHTML;
            });
          })
          .catch((error) => {
            console.error("Erro ao buscar projetos para a página de portfólio: ", error);
            fullPortfolioGrid.innerHTML = "<p style='text-align: center; width: 100%; color: white;'>Não foi possível carregar os projetos.</p>";
          });
    }
});
  // --- Restante das funcionalidades do site ---

  // Splash Screen
  const splash = document.getElementById('splash-screen');
  const video = document.getElementById('splash-video');
  if (splash && video) {
    const removeSplash = () => {
      if (document.body.contains(splash)) {
        splash.classList.add('swoosh-out');
        setTimeout(() => {
          if (splash.parentNode) {
            splash.parentNode.removeChild(splash);
          }
        }, 1000);
      }
    };
    video.addEventListener('ended', removeSplash);
    setTimeout(removeSplash, 4000);
  }

  // Background VANTA FOG
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

  // SCROLL REVEAL DAS SEÇÕES
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
    }, {
      threshold: 0.1
    });
    revealElements.forEach(elem => {
      revealObserver.observe(elem);
    });
  }

  // TILT 3D NOS CARDS DE PLANOS
  const planoCards = document.querySelectorAll('.plano-card');
  planoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  });

  // MODAL DE VÍDEO DO PORTFÓLIO
  const modal = document.getElementById('video-modal');
  const iframe = document.getElementById('video-iframe');
  const closeButton = document.querySelector('.close-button');
  
  // Atenção: esta lógica só funcionará para os itens estáticos.
  // Para funcionar com os itens dinâmicos do Firebase, precisaremos ajustá-la.
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  if (modal && iframe && closeButton && portfolioItems.length > 0) {
    portfolioItems.forEach(item => {
      item.addEventListener('click', () => {
        const videoId = item.getAttribute('data-video-id');
        if (videoId && videoId.trim() !== "" && videoId.includes("YOUTUBE_ID") === false) {
          iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
          modal.classList.add('active');
        }
      });
    });

    const closeModal = () => {
      modal.classList.remove('active');
      setTimeout(() => {
        iframe.src = "";
      }, 300);
    };

    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  // ANIMAÇÃO DOS TÍTULOS HERO
  const heroTitles = document.querySelectorAll('.hero-title');
  heroTitles.forEach((el, i) => {
    setTimeout(() => el.classList.add('active'), i * 400);
  });

});
