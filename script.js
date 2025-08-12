// FIREBASE CONFIG
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
    console.error("Erro ao iniciar Firebase", e);
}

document.addEventListener("DOMContentLoaded", () => {
// === ANIMAÇÃO DO TEXTO DO TOPO (HERO) ===
    const heroTitles = document.querySelectorAll(".hero-title");
    if (heroTitles.length > 0) {
        heroTitles.forEach((title, index) => {
            // Adiciona a classe 'active' com um pequeno atraso para criar um efeito de cascata
            setTimeout(() => {
                title.classList.add("active");
            }, index * 300); 
        });
    }
    // === INICIALIZAÇÃO DO VANTA.JS ===
    // Movido do HTML para cá para melhor organização
    if (typeof VANTA !== 'undefined') {
        VANTA.FOG({
            el: "body",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            highlightColor: 0xb90000,
            midtoneColor: 0x140f00,
            lowlightColor: 0xbb0808,
            baseColor: 0x000000
        });
    }

    // === SPLASH SCREEN ===
    const splashScreen = document.getElementById("splash-screen");
    const splashVideo = document.getElementById("splash-video");

    function removeSplash() {
        if (!splashScreen) return;
        splashScreen.classList.add("swoosh-out");
        setTimeout(() => {
            if (splashScreen.parentNode) splashScreen.parentNode.removeChild(splashScreen);
            document.body.classList.remove('loading');
        }, 1000);
    }

    if (splashScreen && splashVideo) {
        let splashTimeout = setTimeout(removeSplash, 7000); // Timeout de segurança

        splashVideo.addEventListener("loadeddata", () => {
            splashVideo.play().catch(() => removeSplash()); // Se o play falhar, remove o splash
        });

        splashVideo.addEventListener("ended", () => {
            clearTimeout(splashTimeout);
            removeSplash();
        });
    } else {
        document.body.classList.remove('loading');
    }

    // === ANIMAÇÕES DE SCROLL ===
    const revealElements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                }
            });
        },
        { threshold: 0.1 }
    );
    revealElements.forEach(el => observer.observe(el));

    // === LÓGICA DO PORTFÓLIO ===
    const grid = document.querySelector(".portfolio-grid-new");
    const filterBtns = document.querySelectorAll(".filter-btn");
    let allProjects = [];

    function renderPortfolioGrouped(categoria) {
        if (!grid) return;
        grid.innerHTML = "";

        const capas = allProjects.filter(
            p => p.isCapa && (categoria === "all" || p.categoria === categoria)
        );

        if (capas.length === 0) {
            grid.innerHTML = `<p style="text-align: center; color: #aaa;">Nenhum projeto encontrado para a categoria "${categoria}".</p>`;
            return;
        }

        capas.forEach(capa => {
            const capaElem = document.createElement("div");
            capaElem.className = "portfolio-group";
            capaElem.innerHTML = `
                <a href="${capa.link || "#"}" target="_blank" class="portfolio-item-new item-capa">
                    <img src="${capa.imagemURL}" alt="${capa.titulo}">
                    <div class="portfolio-item-overlay">
                        <div class="overlay-content">
                            <h3>${capa.titulo}</h3>
                            <p>${capa.descricao}</p>
                        </div>
                    </div>
                </a>
            `;

            const filhos = allProjects.filter(p => p.descricao === capa.descricao && !p.isCapa);
            if (filhos.length > 0) {
                const filhosWrapper = document.createElement("div");
                filhosWrapper.className = "portfolio-filhos-wrapper";

                filhos.forEach(filho => {
                    const filhoElem = document.createElement("a");
                    filhoElem.href = filho.link || "#";
                    filhoElem.className = "portfolio-item-new portfolio-item-child";
                    filhoElem.target = "_blank";
                    filhoElem.innerHTML = `
                        <img src="${filho.imagemURL}" alt="${filho.titulo}">
                        <div class="portfolio-item-overlay">
                            <div class="overlay-content">
                                <h3>${filho.titulo}</h3>
                            </div>
                        </div>
                    `;
                    filhosWrapper.appendChild(filhoElem);
                });
                capaElem.appendChild(filhosWrapper);
            }
            grid.appendChild(capaElem);
        });
    }

    // Carrega dados do Firebase se o grid existir
    if (grid) {
        db.collection("projetos").orderBy("dataDeCriacao", "desc").get().then(snapshot => {
            allProjects = snapshot.docs.map(doc => doc.data());
            renderPortfolioGrouped("all"); // Renderiza tudo inicialmente
        }).catch(err => {
            console.error("Erro ao carregar dados do Firebase: ", err);
            grid.innerHTML = `<p style="text-align: center; color: red;">Erro ao carregar projetos. Verifique a consola.</p>`;
        });
    }

    // Lógica dos Filtros
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const categoria = btn.getAttribute("data-filter");
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderPortfolioGrouped(categoria);
        });
    });

}); // <-- CORREÇÃO: Fecho do Event Listener que faltava
