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
        
        // Lógica do Splash Screen da Home
        const splashScreen = document.getElementById('splash-screen');
        if (splashScreen) {
            const removeSplash = () => {
                if (document.body.contains(splashScreen)) {
                    splashScreen.classList.add('swoosh-out');
                    setTimeout(() => { if (splashScreen.parentNode) splashScreen.parentNode.removeChild(splashScreen); }, 1000);
                }
            };
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
            db.collection("projetos").where("isCapa", "==", false).orderBy("dataDeCriacao", "desc").limit(3).get()
                .then((querySnapshot) => {
                    let html = "";
                    querySnapshot.forEach((doc) => {
                        const projeto = doc.data();
                        html += `<a href="portfolio.html" class="portfolio-item"><img src="${projeto.imagemURL}" alt="${projeto.titulo}"><div class="overlay"><h3>${projeto.titulo}</h3></div></a>`;
                    });
                    homePortfolioGrid.innerHTML = html;
                });
        }
    }
// 2. SÓ PARA A PÁGINA DE PORTFÓLIO (portfolio.html)
    const portfolioPageIdentifier = document.querySelector('.portfolio-grid-new');
    if (portfolioPageIdentifier) {
        const portfolioSplash = document.getElementById('splash-screen-portfolio');
        if (portfolioSplash) {
            setTimeout(() => {
                portfolioSplash.classList.add('swoosh-out');
                setTimeout(() => { if (portfolioSplash.parentNode) portfolioSplash.parentNode.removeChild(portfolioSplash); }, 1000);
            }, 4000);
        }
