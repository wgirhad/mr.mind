import MrMind from './js/mr-mind.js'
import KnCode from './js/kncode.js'

const canvas = document.getElementById("game")

fetch('config.json')
    .then(response => response.json())
    .then(({ debugMode, repeatColors }) => {
        const game = new MrMind(canvas, repeatColors, debugMode)
        game.play()

        KnCode(() => game.toggleDebug())
    })
