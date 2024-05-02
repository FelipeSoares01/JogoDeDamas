import Dama from './Dama.js';

class Ia {
    constructor(jogo) {
        this.jogo = jogo;
    }

    executar() {
        let damasPretas = [];
        for (let i = 0; i < this.jogo.tabuleiro.tabuleiro.length; i++) {
            for (let j = 0; j < this.jogo.tabuleiro.tabuleiro[i].length; j++) {
                if (this.jogo.tabuleiro.tabuleiro[i][j] === -1) {
                    damasPretas.push(new Dama(i, j));
                }
            }
        }

        console.log(`Total de peças pretas: ${damasPretas.length}`);

        // Filtrar as peças que podem se mover para uma posição vazia na diagonal abaixo
        let damasValidas = damasPretas.filter(dama => {
            let baixoEsquerda = (dama.linha + 1 < this.jogo.tabuleiro.tabuleiro.length && dama.coluna - 1 >= 0 && this.jogo.tabuleiro.tabuleiro[dama.linha + 1][dama.coluna - 1] === 0);
            let baixoDireita = (dama.linha + 1 < this.jogo.tabuleiro.tabuleiro.length && dama.coluna + 1 < this.jogo.tabuleiro.tabuleiro[0].length && this.jogo.tabuleiro.tabuleiro[dama.linha + 1][dama.coluna + 1] === 0);
            return baixoEsquerda || baixoDireita;
        });

        console.log(`Peças elegíveis para movimento: ${damasValidas.length}`);

        let damasValidasCapturadas = damasPretas.filter(dama => {
            let habilitarCaptura = false;
            if (dama.linha + 2 < this.jogo.tabuleiro.tabuleiro.length && dama.coluna - 2 >= 0) {
                if (this.jogo.tabuleiro.tabuleiro[dama.linha + 1][dama.coluna - 1] === 1 && this.jogo.tabuleiro.tabuleiro[dama.linha + 2][dama.coluna - 2] === 0) {
                    habilitarCaptura = true;
                }
            }
            if (dama.linha + 2 < this.jogo.tabuleiro.tabuleiro.length && dama.coluna + 2 < this.jogo.tabuleiro.tabuleiro[0].length) {
                if (this.jogo.tabuleiro.tabuleiro[dama.linha + 1][dama.coluna + 1] === 1 && this.jogo.tabuleiro.tabuleiro[dama.linha + 2][dama.coluna + 2] === 0) {
                    habilitarCaptura = true;
                }
            }
            return habilitarCaptura;
        });
        
        // Se houver peças elegíveis para captura
        if (damasValidasCapturadas.length > 0) {
            // Escolher uma peça aleatória entre as elegíveis para captura
            const indexParaCapturar = Math.floor(Math.random() * damasValidasCapturadas.length);
            const damaParaCapturar = damasValidasCapturadas[indexParaCapturar];
            
            // Determinar em qual direção a peça pode capturar
            let capturarBaixoEsquerda = (damaParaCapturar.linha + 2 < this.jogo.tabuleiro.tabuleiro.length && damaParaCapturar.coluna - 2 >= 0 &&
                this.jogo.tabuleiro.tabuleiro[damaParaCapturar.linha + 1][damaParaCapturar.coluna - 1] === 1 && this.jogo.tabuleiro.tabuleiro[damaParaCapturar.linha + 2][damaParaCapturar.coluna - 2] === 0);
            let capturarBaixoDireita = (damaParaCapturar.linha + 2 < this.jogo.tabuleiro.tabuleiro.length && damaParaCapturar.coluna + 2 < this.jogo.tabuleiro.tabuleiro[0].length &&
                this.jogo.tabuleiro.tabuleiro[damaParaCapturar.linha + 1][damaParaCapturar.coluna + 1] === 1 && this.jogo.tabuleiro.tabuleiro[damaParaCapturar.linha + 2][damaParaCapturar.coluna + 2] === 0);
        
            // Escolher aleatoriamente uma direção de captura
            let captureDirection = capturarBaixoEsquerda ? 'esquerda' : 'direita';
        
            // Remover a peça adversária capturada da direção selecionada
            if (captureDirection === 'esquerda') {
                this.jogo.tabuleiro.tabuleiro[damaParaCapturar.linha + 1][damaParaCapturar.coluna - 1] = 0; // Remover a peça adversária capturada
            } else {
                this.jogo.tabuleiro.tabuleiro[damaParaCapturar.linha + 1][damaParaCapturar.coluna + 1] = 0; // Remover a peça adversária capturada
            }
        
            // Mover a peça para a nova posição na direção selecionada
            if (captureDirection === 'esquerda') {
                this.jogo.tabuleiro.tabuleiro[damaParaCapturar.linha][damaParaCapturar.coluna] = 0; // Remover a peça da posição atual
                this.jogo.tabuleiro.tabuleiro[damaParaCapturar.linha + 2][damaParaCapturar.coluna - 2] = -1; // Mover a peça para a nova posição
            } else {
                this.jogo.tabuleiro.tabuleiro[damaParaCapturar.linha][damaParaCapturar.coluna] = 0; // Remover a peça da posição atual
                this.jogo.tabuleiro.tabuleiro[damaParaCapturar.linha + 2][damaParaCapturar.coluna + 2] = -1; // Mover a peça para a nova posição
            }
        
            // Atualizar a exibição do tabuleiro após a captura
            this.jogo.ui.construirTabuleiro();
            this.jogo.jogadorAtual = this.jogo.trocarJogador(this.jogo.jogadorAtual);
            this.jogo.ui.showJogadorAtual();
        } else {
            if (damasValidas.length > 0) {
                const indexParaDama = Math.floor(Math.random() * damasValidas.length);
                const damaMovimento = damasValidas[indexParaDama];
                console.log(`Peça escolhida para mover: linha ${damaMovimento.linha}, coluna ${damaMovimento.coluna}`);

                // Encontrar todas as novas posições possíveis para a peça escolhida
                let possiveisNovasPosicoes = [];

                // Verificar se a peça pode se mover para a diagonal abaixo à esquerda
                if (damaMovimento.linha + 1 < this.jogo.tabuleiro.tabuleiro.length && damaMovimento.coluna - 1 >= 0 && this.jogo.tabuleiro.tabuleiro[damaMovimento.linha + 1][damaMovimento.coluna - 1] === 0) {
                    possiveisNovasPosicoes.push(new Dama(damaMovimento.linha + 1, damaMovimento.coluna - 1));
                }

                // Verificar se a peça pode se mover para a diagonal abaixo à direita
                if (damaMovimento.linha + 1 < this.jogo.tabuleiro.tabuleiro.length && damaMovimento.coluna + 1 < this.jogo.tabuleiro.tabuleiro[0].length && this.jogo.tabuleiro.tabuleiro[damaMovimento.linha + 1][damaMovimento.coluna + 1] === 0) {
                    possiveisNovasPosicoes.push(new Dama(damaMovimento.linha + 1, damaMovimento.coluna + 1));
                }

                console.log(`Posições novas possíveis: ${possiveisNovasPosicoes.length}`);

                // Escolher uma nova posição aleatória para a peça, se houver posições disponíveis
                if (possiveisNovasPosicoes.length > 0) {
                    const indexParaPossiveisPosicoes = Math.floor(Math.random() * possiveisNovasPosicoes.length);
                    const novaPosicao= possiveisNovasPosicoes[indexParaPossiveisPosicoes];
                    console.log(`Movendo peça para: linha ${novaPosicao.linha}, coluna ${novaPosicao.coluna}`);

                    // Mover a peça para a nova posição escolhida
                    this.jogo.tabuleiro.tabuleiro[damaMovimento.linha][damaMovimento.coluna] = 0; // Remover a peça da posição atual
                    this.jogo.tabuleiro.tabuleiro[novaPosicao.linha][novaPosicao.coluna] = -1; // Mover a peça para a nova posição

                    // Atualizar a exibição do tabuleiro após o movimento
                    this.jogo.ui.construirTabuleiro();
                    this.jogo.jogadorAtual = this.jogo.trocarJogador(this.jogo.jogadorAtual);
                    this.jogo.ui.showJogadorAtual();
                }
            }
        }
    }
}

export default Ia;
