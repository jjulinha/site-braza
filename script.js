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
  // === SPLASH FIX ===
 const splashScreen = document.getElementById("splash-screen");
const splashVideo = document.getElementById("splash-video");

function removeSplash() {
  if (!splashScreen) return;
  splashScreen.classList.add("swoosh-out");
  setTimeout(() => {
    if (splashScreen.parentNode) splashScreen.parentNode.removeChild(splashScreen);
  }, 1000);
}

if (splashScreen && splashVideo) {
  let splashTimeout = setTimeout(removeSplash, 4000);

  splashVideo.addEventListener("loadeddata", () => {
    splashVideo.play().catch(() => {});
  });

  splashVideo.addEventListener("ended", () => {
    clearTimeout(splashTimeout);
    removeSplash();
  });

  // Se o vídeo não terminar em 7s, remove o splash mesmo assim (fallback)
  setTimeout(removeSplash, 7000);
}

  // === HERO TEXT ANIMAÇÃO ===
  const heroTitles = document.querySelectorAll(".hero-title");
  heroTitles.forEach((el, i) => {
    setTimeout(() => el.classList.add("active"), i * 400);
  });

  // === INTERSECTION OBSERVER para .reveal ===
  const revealElements = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle("active", entry.isIntersecting);
      });
    },
    { threshold: 0.1 }
  );
  revealElements.forEach(el => observer.observe(el));

  // === PORTFÓLIO COMPLETO ===
  const grid = document.querySelector(".portfolio-grid-new");
  const filterBtns = document.querySelectorAll(".filter-btn");
  let allProjects = [];

  function renderPortfolioGrouped(categoria) {
    if (!grid) return;

    grid.innerHTML = "";
    const capas = allProjects.filter(p => p.isCapa && (categoria === "all" || p.categoria === categoria));

    capas.forEach(capa => {
      // CAPA
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

      // FILHOS
      const filhos = allProjects.filter(p => p.descricao === capa.descricao && !p.isCapa);
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
              <p>${filho.descricao}</p>
            </div>
          </div>
        `;
        capaElem.appendChild(filhoElem);
      });

      grid.appendChild(capaElem);
    });
  }

  if (grid && db) {
    db.collection("projetos").orderBy("dataDeCriacao", "desc").get().then(snapshot => {
      allProjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      renderPortfolioGrouped("all");

      filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          filterBtns.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          const categoria = btn.dataset.filter;
          renderPortfolioGrouped(categoria);
        });
      });
    });
  }
});
