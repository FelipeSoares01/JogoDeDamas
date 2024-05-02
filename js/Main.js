import Tabuleiro from './Tabuleiro.js';
import Jogo from './Jogo.js';
import UI from './UI.js';
import IA from './IA.js';

let tabuleiro = new Tabuleiro(false);
let ui = new UI();
let jogo = new Jogo(tabuleiro, ui);
ui.jogo = jogo;
ui.construirTabuleiro();

document.querySelector('#jogador').addEventListener('click', () => {
    tabuleiro = new Tabuleiro();
    ui = new UI();
    jogo.jogoIniciar = true;
    jogo = new Jogo(tabuleiro, ui);
    ui.jogo = jogo;
    ui.construirTabuleiro();
})

document.querySelector('#maquina').addEventListener('click', () => {
    tabuleiro = new Tabuleiro();
    ui = new UI();
    let ia = new IA(); // Crie uma instância da classe Ia
    jogo = new Jogo(tabuleiro, ui, ia);
    jogo.iaAtivada = true; // Ativa o modo de jogo contra a IA após a criação do jogo
    jogo.jogoIniciar = true;
    ui.jogo = jogo;
    ui.construirTabuleiro();
});

document.querySelector('#restart').addEventListener('click', () => {
    location.reload();
})

