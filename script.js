document.addEventListener("DOMContentLoaded", () => {
    // === ANIMAÇÃO DO TEXTO DO TOPO (HERO) ===
    const heroTitles = document.querySelectorAll(".hero-title");
    if (heroTitles.length > 0) {
        heroTitles.forEach((title, index) => {
            setTimeout(() => {
                title.classList.add("active");
            }, index * 300);
        });
    }

    // === INICIALIZAÇÃO DO VANTA.JS ===
    if (typeof VANTA !== 'undefined' && document.querySelector('#hero')) {
        VANTA.FOG({
            el: "#hero",
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

    function removeSplash() {
        if (!splashScreen) return;
        splashScreen.classList.add("swoosh-out");
        setTimeout(() => {
            if (splashScreen.parentNode) splashScreen.parentNode.removeChild(splashScreen);
        }, 1000); // Duração da animação de saída
    }
    
    // Este código simula o fim do vídeo da splash screen para o preview.
    // Na sua versão final, você pode querer voltar para a lógica original com o evento "ended" do vídeo.
    setTimeout(removeSplash, 2000);


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


    // ===============================================
    // NOVO: LÓGICA DO HEADER INTELIGENTE (STICKY)
    // ===============================================
    const header = document.querySelector("header");
    let lastScrollTop = 0;

    window.addEventListener("scroll", () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Rolando para baixo
            header.classList.add("header-hidden");
        } else {
            // Rolando para cima
            header.classList.remove("header-hidden");
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);
});
