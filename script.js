// =================================================================
// CONFIGURAÇÃO DO FIREBASE
// =================================================================
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

// =================================================================
// LÓGICA PRINCIPAL DO SITE
// =================================================================
document.addEventListener('DOMContentLoaded', () => {

    // --- FUNCIONALIDADES GERAIS (EXECUTADAS EM TODAS AS PÁGINAS) ---

    // Background VANTA FOG
    if (typeof VANTA !== 'undefined') {
        VANTA.FOG({
            el: "body", mouseControls: true, touchControls: true, gyroControls: false, minHeight: 200.00, minWidth: 200.00, highlightColor: 0x6d0202, midtoneColor: 0x0, lowlightColor: 0x04040D, baseColor: 0x0, blurFactor: 0.50, speed: 0.80, zoom: 1.00
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

    // SCROLL REVEAL DAS SECÇÕES (REPETE A ANIMAÇÃO)
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

    // LÓGICA DO ACORDEÃO PARA A FAQ
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

    // --- LÓGICA ESPECÍFICA PARA CADA PÁGINA ---

    // 1. SÓ PARA A PÁGINA INICIAL (index.html)
    const homePageIdentifier = document.getElementById('hero');
    if (homePageIdentifier) {
        
        // Lógica do Splash Screen (com duração fixa de 4 segundos)
        const splashScreen = document.getElementById('splash-screen');
        if (splashScreen) {
            const removeSplash = () => {
                if (document.body.contains(splashScreen)) {
                    splashScreen.classList.add('swoosh-out');
                    setTimeout(() => { if (splashScreen.parentNode) splashScreen.parentNode.removeChild(splashScreen); }, 1000);
                }
            };
            // Define um temporizador fixo para remover o splash após 4 segundos
            setTimeout(removeSplash, 4000);
        }

        // Animação dos Títulos HERO
        const heroTitles = document.querySelectorAll('.hero-title');
        heroTitles.forEach((el, i) => {
            setTimeout(() => el.classList.add('active'), i * 400);
        });

        // Lógica da Pré-visualização do Portfólio
        const homePortfolioGrid = document.querySelector('.portfolio-grid');
        if (homePortfolioGrid && typeof db !== 'undefined') {
            db.collection("projetos").orderBy("dataDeCriacao", "desc").limit(3).get()
                .then((querySnapshot) => {
                    let html = "";
                    querySnapshot.forEach((doc) => {
                        const projeto = doc.data();
                        html += `<div class="portfolio-item"><img src="${projeto.imagemURL}" alt="${projeto.titulo}"><div class="overlay"><h3>${projeto.titulo}</h3></div></div>`;
                    });
                    homePortfolioGrid.innerHTML = html;
                });
        }
    }

// --- LÓGICA ESPECÍFICA PARA A PÁGINA DE PORTFÓLIO ---
    const fullPortfolioGrid = document.querySelector('.portfolio-grid-new');
    if (fullPortfolioGrid && typeof db !== 'undefined') {
        const filterButtons = document.querySelectorAll('.filter-btn');
        let allProjects = [];

        // --- FUNÇÃO DE RENDERIZAÇÃO ATUALIZADA COM PADRÃO DE LAYOUT ---
        function renderPortfolio(projectsToRender) {
            fullPortfolioGrid.innerHTML = "";
            if (projectsToRender.length === 0) {
                fullPortfolioGrid.innerHTML = "<p style='color: white; text-align: center;'>Nenhum projeto encontrado nesta categoria.</p>";
                return;
            }

            // Define o nosso padrão de layout. Pode ajustá-lo como quiser!
            // 'item-large' ocupa 4x2, 'item-wide' 2x1, 'item-standard' 1x1.
            const layoutPattern = [
                'item-large', 
                'item-standard', 
                'item-standard', 
                'item-wide', 
                'item-standard',
                'item-standard',
                'item-wide'
            ];

            projectsToRender.forEach((projeto, index) => {
                const itemLink = document.createElement('a');
                itemLink.href = projeto.link || '#';
                itemLink.className = 'portfolio-item-new'; // Classe base
                itemLink.target = '_blank';

                // Aplica a classe do padrão de forma cíclica
                const patternClass = layoutPattern[index % layoutPattern.length];
                itemLink.classList.add(patternClass);

                itemLink.innerHTML = `
                    <img src="${projeto.imagemURL}" alt="Imagem do Projeto ${projeto.titulo}">
                    <div class="portfolio-item-overlay">
                        <div class="overlay-content">
                            <h3>${projeto.titulo}</h3>
                            <p>${projeto.descricao || 'Clique para ver mais'}</p>
                        </div>
                    </div>
                `;
                fullPortfolioGrid.appendChild(itemLink);
            });
        }

        db.collection("projetos").orderBy("dataDeCriacao", "desc").get()
            .then((querySnapshot) => {
                allProjects = querySnapshot.docs.map(doc => doc.data());
                renderPortfolio(allProjects);
            })
            .catch((error) => console.error("Erro ao buscar projetos: ", error));

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filterValue = button.getAttribute('data-filter');
                
                const filteredProjects = filterValue === 'all' 
                    ? allProjects 
                    : allProjects.filter(p => p.categoria === filterValue);
                
                // Agora, ao renderizar, o padrão será aplicado corretamente aos itens filtrados
                renderPortfolio(filteredProjects);
            });
        });
    }
});
