import MrMind from './js/mr-mind.js'
import KnCode from './js/kncode.js'

const canvas = document.getElementById("game");
let debug = false
let repeatColors = false

const game = new MrMind(canvas, repeatColors, debug);
game.play();

KnCode(() => {
    debug = !debug
    game.debug = debug
})
