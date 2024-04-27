import Board from './Board.js';
import Game from './Game.js';
import UI from './UI.js';

let board = new Board(false);
let ui = new UI();
let game = new Game(board, ui);
ui.game = game;
ui.buildBoard();

document.querySelector('#jogador').addEventListener('click', ()=> {
    board = new Board();
    ui = new UI(); 
    game.gameStarted = true;
    game = new Game(board, ui); 
    ui.game = game;
    ui.buildBoard();
})

document.querySelector('#maquina').addEventListener('click', () => {
    board = new Board();
    ui = new UI(); 
    game.gameStarted = true;
    game = new Game(board, ui); 
    game.iaEnabled = true; // Ativa o modo de jogo contra a IA
    ui.game = game;
    ui.buildBoard();
});

document.querySelector('#restart').addEventListener('click', () => {
    location.reload();
})

