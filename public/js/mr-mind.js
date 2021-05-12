import MrMindGame from './mr-mind-game.js'
import GameAudio from './game-audio.js'
import GameImage from './game-image.js'

export default class MrMind {
    constructor(canvas, repeatColor, debug) {
        this.bling = [{}]
        this.canvas = canvas
        this.repeatColor = repeatColor ?? true
        this.debug = debug ?? false
        this.ctx = this.canvas.getContext("2d")
        this.images = {}
    }

    play() {
        this.select = {};
        this.select.xdist = 136;
        this.select.ypos = 65;
        this.select.xpos = [];
        this.combination = [];

        for (let i = 0; i <= 3; i++) {
            this.select.xpos[i] = 276 + this.select.xdist * i;
        }

        this.scene = "intro";
        this.introtimer = -1;
        this.timer = -1;

        this.intro();
    }

    intro() {
        this.introtimer = 0;
        this.loadSounds();
        this.loadImages();
        this._initLoop();
    }

    loadSounds() {
        for (let i = 1; i <= 8; i++) {
            this.bling[i] = new GameAudio("snd/" + i + ".ogg");
            this.bling[i].setVolume(1.2 - 0.0375 * i);
            this.bling[i].setLooping(false);
        }

        this.bgm = new GameAudio("snd/Sheeps.ogg");
        this.bgm.setVolume(0.5);
        this.bgm.setLooping(true);

        this.fanfarre = new GameAudio("snd/fanfarre.ogg");
        this.fanfarre.setVolume(0.8);
        this.fanfarre.setLooping(false);
    }

    loadImages() {
        let i, j, z;
        this.images.bg = new GameImage("img/bg.png");

        this.images.big = [];
        for (i = 0; i <= 8; i++) {
            this.images.big[i] = new GameImage("img/big/" + i + ".png");
        }

        this.images.small = [];
        for (i = 0; i <= 8; i++) {
            this.images.small[i] = new GameImage("img/small/" + i + ".png");
        }

        this.images.intro = new GameImage("img/intro.png");

        this.images.hints = [];
        for (i = 0; i <= 4; i++) {
            for (j = 0; j <= 4 - i; j++) {
                z = i * 10 + j;
                this.images.hints[z] = new GameImage("img/hints/" + z + ".png");
            }
        }

        //load the clear image
        this.images.hints[100] = new GameImage("img/hints/100.png");


        this.arrow = new GameImage("img/arrow.png");

        this.images.controls = {};
        this.images.controls[0] = new GameImage("img/check.png");
        this.images.controls.xpos = [];
        this.images.controls.ypos = [];
        this.images.controls.xpos[0] = 620;
        this.images.controls.ypos[0] = 482;

        this.star = new GameImage("img/star.png");
    }

    _initLoop() {
        this.setClickHandlers();
        window.requestAnimationFrame(dt => this.mainLoop(dt));
    }

    setClickHandlers() {
        this.canvas.addEventListener("click", evt => {
            evt.stopPropagation();
            const pos = getRelativeCoords(evt);
            this.gameMousePressed(pos.x, pos.y);
        });
    }

    gameMousePressed(x, y) {
        let i;
        if (this.scene == "game") {
            // pressed a color
            if (y >= 478 && y <= 519) {
                for (i = 1; i <= 8; i++) {
                    if (x >= 420 + 20 * i && x <= 439 + 20 * i) {
                        this.switch = i;
                        this.bling[i].play();
                    }
                }
            }

            // pressed one of the this.combination buttons
            if (y >= 358 && y <= 417) {
                for (i = 0; i <= 3; i++) {
                    if (x >= 385 + 70 * i && x <= 444 + 70 * i) {
                        this.combination[i] = this.switch;
                    }
                }
            }

            // pressed check
            if (y >= 482 && y <= 620 + 31) {
                if (x >= 620 && x <= 620 + 31) {
                    if (this.over) {
                        this.gameStart();
                    } else {
                        this.checkColors();
                    }
                }
            }
        }
    }

    gameStart() {
        let i, j;

        this.game = new MrMindGame(4, 8, 10, this.repeatColor);
        this.bgm.setVolume(0.6);
        this.bgm.play();
        this.timer = 0;
        this.score = 0;

        this.turn = 0;
        this.switch = 0;
        this.win = false;
        this.over = false;

        this.hintValue = [];
        // clear combination, hint and trials
        for (i = 0; i <= 3; i++) this.combination[i] = 0;
        for (i = 0; i <= 8; i++) this.hintValue[i] = 100;

        this.trials = [];
        for (i = 0; i <= 8; i++) {
            this.trials[i] = [];
            for (j = 0; j <= 3; j++) {
                this.trials[i][j] = 0;
            }
        }
    }

    checkColors() {
        let i;
        for (i = 0; i <= 3; i++) {
            if (this.combination[i] == 0) {
                return false;
            }
        }

        const guess = this.combination.map(a => a - 1);
        const hint = this.game.guess(guess);

        if (hint.status) {
            this.won();
        } else {
            this.failed(hint);
        }
    }

    failed(hint) {
        let z;
        this.win = false;

        if (hint.status === false) {
            this.gameOver(hint.data.result);
            return false;
        }

        this.trials[this.turn] = this.combination.slice(0);

        this.hintValue[this.turn] = 10 * hint.data.correctPosition
                                  +  1 * hint.data.correctColor;
        this.turn++;
    }

    gameOver(result) {
        this.result = result.map(a => a + 1);
        this.over = true;
        this.score = Math.floor(this.timer * 10)/10;
        this.timer = -1;
    }

    won() {
        this.win = true;
        this.bgm.setVolume(0.5);
        this.fanfarre.play();
        this.gameOver();
    }

    mainLoop(dt) {
        this.gameDraw();
        this.gameUpdate(dt / 1000);
        window.requestAnimationFrame(dt => this.mainLoop(dt));
    }

    gameDraw() {
        let i, j;
        this.clearCanvas();

        if (this.scene == "intro") {
            this.drawCanvas(this.images.intro, 200, 150);
        }

        if (this.scene == "game") {
            this.drawCanvas(this.images.bg, 0, 0);

            for (i = 0; i <= 3; i++) {
                this.drawCanvas(this.images.big[this.combination[i]], this.select.xpos[i], this.select.ypos);
            }

            for (i = 0; i <= 8; i++) {
                for (j = 0; j <= 3; j++) {
                    this.drawCanvas(this.images.small[this.trials[i][j]], 50 + 40 * j, 570 - 45 * i);
                }
            }

            if (this.over) {
                for (i = 0; i <= 3; i++) {
                    this.drawCanvas(this.images.small[this.result[i]], 50 + 40 * i, 165);
                }
            }

            for (i = 0; i <= 8; i++) {
                this.drawCanvas(this.images.hints[this.hintValue[i]], 210, 570 - 45 * i);
            }

            this.drawCanvas(this.images.controls[0], this.images.controls.xpos[0], this.images.controls.ypos[0]);

            if (this.switch != 0) {
                this.drawCanvas(this.arrow, 424 + 20 * this.switch, 523);
            }

            if (this.win) {
                this.drawCanvas(this.star, 82, 54);
                this.ctx.font = "48px sans-serif";
                this.ctx.fillText(this.score, 85, 165);
            }
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawCanvas(img, x, y) {
        this.ctx.drawImage(img.getImg(), x, y);
    }

    gameUpdate(dt) {
        if (this.timer >= 0) {
            this.timer += dt;
        }

        if (this.introtimer >= 0) {
            this.introtimer += dt;
        }

        if (this.introtimer > 4) {
            this.scene = "game";
            this.introtimer = -1;
            this.gameStart();
        }
    }
}

function getRelativeCoords(event) {
    if (event.offsetX !== undefined && event.offsetY !== undefined) {
        return { x: event.offsetX, y: event.offsetY };
    }
    return { x: event.layerX, y: event.layerY };
}

function gameRandom(a,b) {
    return parseInt(Math.random() * (b - a) + a);
}
