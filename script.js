// script.js (VERSÃO DE DEPURAÇÃO)

// 1. O navegador vai registrar esta mensagem assim que começar a ler o arquivo.
console.log("-> PASSO 1: Script.js carregado.");

document.addEventListener('DOMContentLoaded', () => {
    // 2. Esta mensagem só aparece se a estrutura básica da página (HTML) estiver pronta.
    console.log("-> PASSO 2: Página pronta (DOMContentLoaded). O script principal vai começar.");

    try {
        // 3. Tentando encontrar os elementos da tela de abertura.
        console.log("-> PASSO 3: Procurando a splash-screen...");
        const splashScreen = document.getElementById('splash-screen');
        const body = document.body;

        if (splashScreen && body) {
            // 4. Se encontrou, registrará e irá travar o scroll.
            console.log("-> PASSO 4: Elementos da splash encontrados. Travando o scroll.");
            body.classList.add('no-scroll');
        } else {
            // Se não encontrou, veremos este erro.
            console.error("-> ERRO: Não foi possível encontrar #splash-screen ou o body da página.");
            return;
        }
        
        // 5. Agendando o desaparecimento.
        console.log("-> PASSO 5: Agendando o desaparecimento da splash para daqui a 3 segundos.");
        setTimeout(() => {
            // 6. Esta é a primeira ação após os 3 segundos.
            console.log("-> PASSO 6: 3 segundos se passaram. Dando fade out na splash e liberando o scroll.");
            splashScreen.style.opacity = '0';
            body.classList.remove('no-scroll');
            
            // 7. Agendando a remoção final.
            setTimeout(() => {
                // 8. Esta é a última ação do script da splash.
                console.log("-> PASSO 7: 1 segundo de transição passou. Removendo a splash da tela (display: none).");
                splashScreen.style.display = 'none';
                console.log("-> FIM: O site deveria estar visível agora.");
            }, 1000); 

        }, 3000);

    } catch (error) {
        // Se qualquer coisa dentro do 'try' der um erro inesperado, veremos esta mensagem.
        console.error("-> ERRO INESPERADO:", error);
    }

    // A lógica do Vanta.js continua aqui para vermos se ela causa algum conflito.
    try {
        console.log("-> VANTA: Tentando inicializar a animação de fundo...");
        VANTA.FOG({
            el: "#hero",
            mouseControls: true, touchControls: true, gyroControls: false,
            minHeight: 200.00, minWidth: 200.00,
            highlightColor: 0xffb300, midtoneColor: 0xe53935,
            lowlightColor: 0x150202, baseColor: 0x111111,
            blurFactor: 0.50, speed: 0.80, zoom: 1.00
        });
        console.log("-> VANTA: Animação inicializada com sucesso.");
    } catch(error) {
        console.error("-> ERRO NO VANTA.JS:", error);
    }
});
