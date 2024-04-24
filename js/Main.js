import Board from './Board.js';
import Game from './Game.js';
import UI from './UI.js';

let board = new Board(false);
let ui = new UI();
let game = new Game(board, ui);
ui.game = game;
ui.buildBoard();

document.querySelector('#jogador').addEventListener('click', ()=> {
    board = new Board(); // Remova 'const' aqui
    ui = new UI(); // Remova 'const' aqui
    game.gameStarted = true;
    game = new Game(board, ui); // Remova 'const' aqui
    ui.game = game;
    ui.buildBoard();
})

document.querySelector('#restart').addEventListener('click', () => {
    location.reload();
})
