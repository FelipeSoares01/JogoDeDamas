import Dama from './Dama.js';
class UI {
    constructor(jogo) {
        this.jogo = jogo;
        this.modelo = document.getElementById("modeloInicial");
        this.jogoElemento = document.getElementById("jogo");
    }

    construirTabuleiro() {
        this.jogoElemento.innerHTML = "";
        let black = 0;
        let white = 0;
        for (let i = 0; i < this.jogo.tabuleiro.tabuleiro.length; i++) {
            const element = this.jogo.tabuleiro.tabuleiro[i];
            let linha = document.createElement("div"); // create div for each linha
            linha.setAttribute("class", "linha");

            for (let j = 0; j < element.length; j++) {
                let col = document.createElement("div"); // create div for each case
                let dama = document.createElement("div");
                let caseType = "";
                let ocupado = "";

                if (i % 2 === 0) {
                    if (j % 2 === 0) {
                        caseType = "Whitecase";
                    } else {
                        caseType = "blackCase";
                    }
                } else {
                    if (j % 2 !== 0) {
                        caseType = "Whitecase";
                    } else {
                        caseType = "blackCase";
                    }
                }

                // add the dama if the case isn't empty
                if (this.jogo.tabuleiro.tabuleiro[i][j] === 1) {
                    ocupado = "damaBranca";
                } else if (this.jogo.tabuleiro.tabuleiro[i][j] === -1) {
                    ocupado = "damaPreta";
                } else {
                    ocupado = "empty";
                }

                dama.setAttribute("class", "ocupado " + ocupado);

                // set linha and colum in the case
                dama.setAttribute("linha", i);
                dama.setAttribute("coluna", j);
                dama.setAttribute("data-position", i + "-" + j);

                //add event listener to each dama
                dama.addEventListener("click", (event) => {
                    if (this.jogo.jogadorAtual === -1 && this.jogo.iaAtivada) {
                        // Se for a vez da IA jogar, não fazer nada ao clicar na peça preta
                        return;
                    }
                    // Caso contrário, chamar a função movedama normalmente
                    this.jogo.moverDama(event);
                });

                col.appendChild(dama);

                col.setAttribute("class", "coluna " + caseType);
                linha.appendChild(col);

                // counter number of each dama
                if (this.jogo.tabuleiro.tabuleiro[i][j] === -1) {
                    black++;
                } else if (this.jogo.tabuleiro.tabuleiro[i][j] === 1) {
                    white++;
                }

                //display the number of dama for each player
                this.displayCounter(black, white);
            }

            this.jogoElemento.appendChild(linha);
        }

        if (this.jogo.jogoIniciar && (black === 0 || white === 0)) {
            this.modeloOpen(black);
        }
    }

    showJogadorAtual() {
        var container = document.getElementById("proximo-jogador");
        if (container.classList.contains("damaBranca")) {
            container.setAttribute("class", "ocupado damaPreta");
        } else {
            container.setAttribute("class", "ocupado damaBranca");
        }
    }

    marcarPosicoesPossiveis(posicaoAtual, direcaoVertical = 0, direcaoHorizontal = 0) {
        const novaLinha = posicaoAtual.linha + direcaoVertical;
        const novaColuna = posicaoAtual.coluna + direcaoHorizontal;
    
        const posicao = document.querySelector(`[data-position='${novaLinha}-${novaColuna}']`);
        if (posicao) {
            posicao.style.background = "green";
            // Salvar onde pode mover
            this.jogo.novaPosicao.push(new Dama(novaLinha, novaColuna));
        }
    }

    displayCounter(black, white) {
        var blackContainer = document.getElementById("contador-damasPretas");
        var whiteContainer = document.getElementById("contador-damasBrancas");
        blackContainer.innerHTML = black;
        whiteContainer.innerHTML = white;
    }

    modeloOpen(black) {
        document.getElementById("vencedor").innerHTML = black === 0 ? "White" : "Black";
        document.getElementById("perdedor").innerHTML = black !== 0 ? "White" : "Black";
        this.modelo.classList.add("effect");
    }

    fecharModelo() {
        this.modelo.classList.remove("effect");
    }
}
export default UI;