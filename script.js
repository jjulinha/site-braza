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

    // --- LÓGICA ESPECÍFICA PARA A PÁGINA INICIAL ---
    const homePageIdentifier = document.getElementById('hero'); // Usar um elemento que só existe na home
    if (homePageIdentifier) {
        
        // Lógica do Splash Screen
        const splashScreen = document.getElementById('splash-screen');
        if (splashScreen) {
            const removeSplash = () => {
                if (document.body.contains(splashScreen)) {
                    splashScreen.classList.add('swoosh-out');
                    setTimeout(() => { if (splashScreen.parentNode) splashScreen.parentNode.removeChild(splashScreen); }, 1000);
                }
            };
            window.addEventListener('load', removeSplash);
            setTimeout(removeSplash, 5000);
        }

        // Animação dos Títulos HERO para fazê-los aparecer
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

        function renderPortfolio(projectsToRender) {
            fullPortfolioGrid.innerHTML = "";
            if (projectsToRender.length === 0) {
                fullPortfolioGrid.innerHTML = "<p style='color: white; text-align: center;'>Nenhum projeto encontrado.</p>";
                return;
            }
            projectsToRender.forEach(projeto => {
                const itemLink = document.createElement('a');
                itemLink.href = projeto.link || '#';
                itemLink.className = 'portfolio-item-new';
                itemLink.target = '_blank';
                itemLink.innerHTML = `<img src="${projeto.imagemURL}" alt="${projeto.titulo}"><div class="portfolio-item-overlay"><div class="overlay-content"><h3>${projeto.titulo}</h3><p>${projeto.descricao || 'Clique para ver mais'}</p></div></div>`;
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
                const filteredProjects = filterValue === 'all' ? allProjects : allProjects.filter(p => p.categoria === filterValue);
                renderPortfolio(filteredProjects);
            });
        });
    }
});
