// =================================================================
// INÍCIO: CONFIGURAÇÃO E FUNÇÕES DO FIREBASE
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
// FIM: CONFIGURAÇÃO DO FIREBASE
// =================================================================


document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA PARA A PÁGINA COMPLETA DE PORTFÓLIO ---
    const fullPortfolioGrid = document.querySelector('.portfolio-grid-new');

    if (fullPortfolioGrid && typeof db !== 'undefined') {
        db.collection("projetos")
            .orderBy("dataDeCriacao", "desc")
            .get()
            .then((querySnapshot) => {
                fullPortfolioGrid.innerHTML = ""; // Limpa a grelha primeiro

                if (querySnapshot.empty) {
                    fullPortfolioGrid.innerHTML = "<p style='color: white; text-align: center;'>Nenhum projeto encontrado.</p>";
                    return;
                }

                querySnapshot.forEach((doc) => {
                    // **PASSO DE DEBUG:** Isto irá mostrar no console os dados de cada projeto que vêm do Firebase.
                    console.log("Projeto encontrado:", doc.data()); 
                    
                    const projeto = doc.data();

                    // --- MÉTODO ROBUSTO PARA CRIAR ELEMENTOS ---
                    // 1. Cria o elemento principal <a>
                    const itemLink = document.createElement('a');
                    itemLink.href = projeto.link || '#';
                    itemLink.className = 'portfolio-item-new';
                    itemLink.target = '_blank';

                    // 2. Cria a imagem
                    const img = document.createElement('img');
                    img.src = projeto.imagemURL;
                    img.alt = `Imagem do Projeto ${projeto.titulo}`;
                    
                    // 3. Cria o HTML do overlay
                    const overlayDiv = document.createElement('div');
                    overlayDiv.className = 'portfolio-item-overlay';
                    overlayDiv.innerHTML = `
                        <div class="overlay-content">
                            <h3>${projeto.titulo}</h3>
                            <p>${projeto.descricao || 'Clique para ver mais'}</p>
                        </div>
                    `;

                    // 4. Monta a estrutura
                    itemLink.appendChild(img);
                    itemLink.appendChild(overlayDiv);
                    
                    // 5. Adiciona o item completo e pronto à grelha
                    fullPortfolioGrid.appendChild(itemLink);
                });
            })
            .catch((error) => {
                console.error("Erro CRÍTICO ao buscar projetos para a pág. de portfólio: ", error);
                fullPortfolioGrid.innerHTML = "<p style='color: white; text-align: center;'>Ocorreu um erro ao carregar os projetos.</p>";
            });
    }

    // A lógica para a pré-visualização da página inicial pode ser adicionada aqui se necessário,
    // mas vamos focar-nos em fazer a página de portfólio funcionar primeiro.

    // --- Restante das funcionalidades do site ---
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
