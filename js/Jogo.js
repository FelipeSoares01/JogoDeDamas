import Dama from './Dama.js';
import Ia from './IA.js';
class Jogo {
    constructor(tabuleiro, ui, modelo) {
        this.tabuleiro = tabuleiro;
        this.ui = ui;
        this.jogoIniciar = false;
        this.modelo = modelo;
        this.jogadorAtual = 1;
        this.novaPosicao = [];
        this.posicaoParaCapturar = [];
        this.prontoParaMover = null;
        this.iaAtivada = false;
        this.ia = new Ia(this);
    }

    moverDama(e) {
        let dama = e.target;
        const linha = parseInt(dama.getAttribute("linha"));
        const coluna = parseInt(dama.getAttribute("coluna"));
        let d = new Dama(linha, coluna);

        if (this.posicaoParaCapturar.length > 0) {
            this.habilitaParaCapturar(d);
        } else {
            if (this.novaPosicao.length > 0) {
                this.habilitaParaMover(d);
            }
        }

        if (this.jogadorAtual === this.tabuleiro.tabuleiro[linha][coluna]) {
            let jogador = this.trocarJogador(this.jogadorAtual);
            if (!this.encontrarPossivelCaptura(d, jogador)) {
                this.encontrarPosicoesPossiveis(d, jogador);
            }
        }
        if (this.iaAtivada && this.jogadorAtual === -1) {
            setTimeout(() => {
                this.ia.executar();
            }, 1000);
        }
    }

    habilitaParaCapturar(d) {
        let encontrar = false;
        let pos = null;
        let posAnterior = null;
        this.posicaoParaCapturar.forEach((elemento) => {
            if (elemento.novaPosicao.comparar(d)) {
                encontrar = true;
                pos = elemento.novaPosicao;
                posAnterior = elemento.damaCapturada;
                return;
            }
        });

        if (encontrar) {
            this.tabuleiro.tabuleiro[pos.linha][pos.coluna] = this.jogadorAtual;
            this.tabuleiro.tabuleiro[this.prontoParaMover.linha][this.prontoParaMover.coluna] = 0;
            this.tabuleiro.tabuleiro[posAnterior.linha][posAnterior.coluna] = 0;

            this.prontoParaMover = null;
            this.posicaoParaCapturar = [];
            this.novaPosicao = [];
            this.ui.showJogadorAtual();
            this.ui.construirTabuleiro();
            this.jogadorAtual = this.trocarJogador(this.jogadorAtual);
        } else {
            this.ui.construirTabuleiro();
        }
    }

    habilitaParaMover(d) {
        let encontrar = false;
        let novaPosicao = null;
        this.novaPosicao.forEach((elemento) => {
            if (elemento.comparar(d)) {
                encontrar = true;
                novaPosicao = elemento;
                return;
            }
        });

        if (encontrar) {
            this.moverDamaAtual(novaPosicao);
        } else {
            this.ui.construirTabuleiro();
        }
    }

    moverDamaAtual(novaPosicao) {
        this.tabuleiro.tabuleiro[novaPosicao.linha][novaPosicao.coluna] = this.jogadorAtual;
        this.tabuleiro.tabuleiro[this.prontoParaMover.linha][this.prontoParaMover.coluna] = 0;

        this.prontoParaMover = null;
        this.novaPosicao = [];
        this.posicaoParaCapturar = [];

        this.jogadorAtual = this.trocarJogador(this.jogadorAtual);
        this.ui.showJogadorAtual();
        this.ui.construirTabuleiro();
    }

    encontrarPosicoesPossiveis(dama, jogador) {
        let posicoes = [];

        if (
            dama.linha + jogador >= 0 &&
            dama.linha + jogador < this.tabuleiro.tabuleiro.length &&
            dama.coluna + 1 >= 0 &&
            dama.coluna + 1 < this.tabuleiro.tabuleiro[0].length &&
            this.tabuleiro.tabuleiro[dama.linha + jogador][dama.coluna + 1] === 0
        ) {
            posicoes.push(new Dama(dama.linha + jogador, dama.coluna + 1));
            this.ui.marcarPosicoesPossiveis(dama, jogador, 1);
        }

        if (
            dama.linha + jogador >= 0 &&
            dama.linha + jogador < this.tabuleiro.tabuleiro.length &&
            dama.coluna - 1 >= 0 &&
            dama.coluna - 1 < this.tabuleiro.tabuleiro[0].length &&
            this.tabuleiro.tabuleiro[dama.linha + jogador][dama.coluna - 1] === 0
        ) {
            posicoes.push(new Dama(dama.linha + jogador, dama.coluna - 1));
            this.ui.marcarPosicoesPossiveis(dama, jogador, -1);
        }

        if (posicoes.length > 0) {
            this.prontoParaMover = dama;
            this.novaPosicao = posicoes;
        }
    }


    encontrarPossivelCaptura(d, jogador) {
        let encontrado = false;
        if (
            d.linha - 1 >= 0 &&
            d.coluna - 1 >= 0 &&
            d.linha - 2 >= 0 &&
            d.coluna - 2 >= 0 &&
            this.tabuleiro.tabuleiro[d.linha - 1][d.coluna - 1] === jogador &&
            this.tabuleiro.tabuleiro[d.linha - 2][d.coluna - 2] === 0
        ) {
            encontrado = true;
            let novaPosicao = new Dama(d.linha - 2, d.coluna - 2);
            this.prontoParaMover = d;
            this.ui.marcarPosicoesPossiveis(novaPosicao);
            this.posicaoParaCapturar.push({
                novaPosicao: novaPosicao,
                damaCapturada: new Dama(d.linha - 1, d.coluna - 1),
            });
        }

        if (
            d.linha - 1 >= 0 &&
            d.coluna + 1 < this.tabuleiro.tabuleiro[0].length &&
            d.linha - 2 >= 0 &&
            d.coluna + 2 < this.tabuleiro.tabuleiro[0].length &&
            this.tabuleiro.tabuleiro[d.linha - 1][d.coluna + 1] === jogador &&
            this.tabuleiro.tabuleiro[d.linha - 2][d.coluna + 2] === 0
        ) {
            encontrado = true;
            let novaPosicao = new Dama(d.linha - 2, d.coluna + 2);
            this.prontoParaMover = d;
            this.ui.marcarPosicoesPossiveis(novaPosicao);
            this.posicaoParaCapturar.push({
                novaPosicao: novaPosicao,
                damaCapturada: new Dama(d.linha - 1, d.coluna + 1),
            });
        }

        if (
            d.linha + 1 < this.tabuleiro.tabuleiro.length &&
            d.coluna - 1 >= 0 &&
            d.linha + 2 < this.tabuleiro.tabuleiro.length &&
            d.coluna - 2 >= 0 &&
            this.tabuleiro.tabuleiro[d.linha + 1][d.coluna - 1] === jogador &&
            this.tabuleiro.tabuleiro[d.linha + 2][d.coluna - 2] === 0
        ) {
            encontrado = true;
            let novaPosicao = new Dama(d.linha + 2, d.coluna - 2);
            this.prontoParaMover = d;
            this.ui.marcarPosicoesPossiveis(novaPosicao);
            this.posicaoParaCapturar.push({
                novaPosicao: novaPosicao,
                damaCapturada: new Dama(d.linha + 1, d.coluna - 1),
            });
        }

        if (
            d.linha + 1 < this.tabuleiro.tabuleiro.length &&
            d.coluna + 1 < this.tabuleiro.tabuleiro[0].length &&
            d.linha + 2 < this.tabuleiro.tabuleiro.length &&
            d.coluna + 2 < this.tabuleiro.tabuleiro[0].length &&
            this.tabuleiro.tabuleiro[d.linha + 1][d.coluna + 1] === jogador &&
            this.tabuleiro.tabuleiro[d.linha + 2][d.coluna + 2] === 0
        ) {
            encontrado = true;
            let novaPosicao = new Dama(d.linha + 2, d.coluna + 2);
            this.prontoParaMover = d;
            this.ui.marcarPosicoesPossiveis(novaPosicao);
            this.posicaoParaCapturar.push({
                novaPosicao: novaPosicao,
                damaCapturada: new Dama(d.linha + 1, d.coluna + 1),
            });
        }

        return encontrado;
    }

    trocarJogador(jogador) {
        return jogador === 1 ? -1 : 1;
    }
}
export default Jogo;
