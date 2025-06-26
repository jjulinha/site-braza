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

    // --- FUNCIONALIDADE 1: LÓGICA DO SPLASH SCREEN ---
    const splash = document.getElementById('splash-screen');
    if (splash) {
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
        window.addEventListener('load', removeSplash);
        setTimeout(removeSplash, 5000); // Segurança
    }

    // --- FUNCIONALIDADE 2: LÓGICA DO PORTFÓLIO ---

    // 2a: Lógica para a PRÉ-VISUALIZAÇÃO na Página Inicial
    const homePortfolioGrid = document.querySelector('.portfolio-grid');
    if (homePortfolioGrid && typeof db !== 'undefined') {
        db.collection("projetos").orderBy("dataDeCriacao", "desc").limit(3).get()
            .then((querySnapshot) => {
                let html = "";
                querySnapshot.forEach((doc) => {
                    const projeto = doc.data();
                    html += `
                        <div class="portfolio-item">
                            <img src="${projeto.imagemURL}" alt="${projeto.titulo}">
                            <div class="overlay"><h3>${projeto.titulo}</h3></div>
                        </div>
                    `;
                });
                homePortfolioGrid.innerHTML = html;
            });
    }

    // 2b: Lógica para a PÁGINA COMPLETA de Portfólio com Filtros
    const fullPortfolioGrid = document.querySelector('.portfolio-grid-new');
    const filterButtons = document.querySelectorAll('.filter-btn');
    let allProjects = []; 

    function renderPortfolio(projectsToRender) {
        fullPortfolioGrid.innerHTML = "";
        if (projectsToRender.length === 0) {
            fullPortfolioGrid.innerHTML = "<p style='color: white; text-align: center;'>Nenhum projeto encontrado nesta categoria.</p>";
            return;
        }
        projectsToRender.forEach(projeto => {
            const itemLink = document.createElement('a');
            itemLink.href = projeto.link || '#';
            itemLink.className = 'portfolio-item-new';
            itemLink.target = '_blank';
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

    if (fullPortfolioGrid && typeof db !== 'undefined') {
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
                if (filterValue === 'all') {
                    renderPortfolio(allProjects);
                } else {
                    const filteredProjects = allProjects.filter(p => p.categoria === filterValue);
                    renderPortfolio(filteredProjects);
                }
            });
        });
    }

    // --- FUNCIONALIDADE 3: OUTRAS ANIMAÇÕES E EFEITOS ---
    
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
});
