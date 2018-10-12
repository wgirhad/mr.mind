var mrMind = function(_canvas) {

    var
        bling = [{}],
        canvas = _canvas,
        ctx = canvas.getContext("2d"),
        images = {},
        _switch,
        arrow,
        debug,
        fails,
        fanfarre,
        hintValue,
        introtimer,
        over,
        repeatColor,
        result,
        star,
        scene,
        score,
        select,
        bgm,
        timer,
        trials,
        win;

    this.play = init;
    return this;

    function init() {
        debug = false;
        //debug = true;
        repeatColor = true;

        select = {};
        select.xdist = 136;
        select.ypos = 65;
        select.xpos = [];
        for (var i = 0; i <= 3; i++) {
            select.xpos[i] = 276 + select.xdist * i;
        }

        scene = "intro";
        introtimer = -1;
        timer = -1;
        intro();
    }

    function gameStart() {
        var i, j, z;

        bgm.setVolume(0.6);
        bgm.play();
        timer = 0;
        score = 0;

        fails = 0;
        _switch = 0;
        win = false;
        over = false;

        result = [];
        hintValue = [];


        for (i = 0; i <= 3; i++) {
            z = 0;
            while (z == 0) {
                result[i] = gameRandom(1,8);
                x = 1;
                if (!repeatColor) {
                    for (j = 0; j <= 3; j++) {
                        if (i != j && result[i] == result[j]) {
                            x = 0;
                        }
                    }
                }
                z = x;
            }
        }

        for (i = 0; i <= 3; i++) select[i] = 0;
        for (i = 0; i <= 8; i++) hintValue[i] = 100;

        trials = [];
        for (i = 0; i <= 8; i++) {
            trials[i] = [];
            for (j = 0; j <= 3; j++) {
                trials[i][j] = 0;
            }
        }
    }

    function intro() {
        introtimer = 0;
        loadSounds();
        loadImages();
        _initLoop();
    }

    function gameOver() {
        over = true;
        score = Math.floor(timer * 10)/10;
        timer = -1;
    }

    function hint() {
        var check = [],
            alloc = [],
            i, j;

        for (i = 0; i <= 3; i++) {
            check[i] = 0;
            alloc[i] = 0;
        }

        for (i = 0; i <= 3; i++) {
            if (select[i] == result[i]) {
                check[i] = 10;
                alloc[i] = 1;
            }
        }


        for (i = 0; i <= 3; i++) {
            if (check[i] == 0) {
                for (j = 0; j <= 3; j++) {
                    if (alloc[j] == 0) {
                        if (select[i] == result[j]) {
                            check[i] = 1;
                            alloc[j] = 1;
                            break;
                        }
                    }
                }
            }
        }

        hintValue[fails] = 0;
        for (i = 0; i <= 3; i++){
            hintValue[fails] = hintValue[fails] + check[i];
        }
    }

    function failed() {
        var z;
        win = false;
        if (fails == 9) {
            gameOver();
            return false;
        }
        for (z = 0; z <= 3; z++) {
            trials[fails][z] = select[z];
        }
        hint();
        fails++;
    }

    function checkColors() {
        var i;
        for (i = 0; i <= 3; i++) {
            if (select[i] == 0) {
                return false;
            }
        }

        for (i = 0; i <= 3; i++) {
            if (select[i] == result[i]) {
                win = true;
            } else {
                failed();
                break;
            }
        }

        if (win == true) {
            won();
        }
    }

    function won() {
        bgm.setVolume(0.5);
        fanfarre.play();
        gameOver();
    }

    function gameMousePressed(x, y, button) {
        if (scene == "game") {
            // pressed a color
            if (y >= 478 && y <= 519) {
                for (i = 1; i <= 8; i++) {
                    if (x >= 420 + 20 * i && x <= 439 + 20 * i) {
                        _switch = i;
                        bling[i].play();
                    }
                }
            }

            // pressed one of the selection buttons
            if (y >= 358 && y <= 417) {
                for (i = 0; i <= 3; i++) {
                    if (x >= 385 + 70 * i && x <= 444 + 70 * i) {
                        select[i] = _switch;
                    }
                }
            }

            // pressed check
            if (y >= 482 && y <= 620 + 31) {
                if (x >= 620 && x <= 620 + 31) {
                    if (over) {
                        gameStart();
                    } else {
                        checkColors();
                    }
                }
            }
        }
    }

    function gameUpdate(dt) {
        if (timer >= 0) {
            timer += dt;
        }

        if (introtimer >= 0) {
            introtimer += dt;
        }

        if (introtimer > 4) {
            scene = "game";
            introtimer = -1;
            gameStart();
        }
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawCanvas(img, x, y) {
        ctx.drawImage(img.getImg(), x, y);
    }


    function gameDraw() {
        var i, j;
        clearCanvas();

        if (scene == "intro") {
            drawCanvas(images.intro, 200, 150);
        }

        if (scene == "game") {
            drawCanvas(images.bg, 0, 0);

            if (debug) {
                for (i = 0; i <= 3; i++) {
                    drawCanvas(images.big[result[i]], 30, 30 + 90 * i);
                }
            }

            for (i = 0; i <= 3; i++) {
                drawCanvas(images.big[select[i]], select.xpos[i], select.ypos);
            }

            for (i = 0; i <= 8; i++) {
                for (j = 0; j <= 3; j++) {
                    drawCanvas(images.small[trials[i][j]], 50 + 40 * j, 570 - 45 * i);
                }
            }

            if (over) {
                for (i = 0; i <= 3; i++) {
                    drawCanvas(images.small[result[i]], 50 + 40 * i, 165);
                }
            }

            for (i = 0; i <= 8; i++) {
                drawCanvas(images.hints[hintValue[i]], 210, 570 - 45 * i);
            }

            drawCanvas(images.controls[0], images.controls.xpos[0], images.controls.ypos[0]);

            if (_switch != 0) {
                drawCanvas(arrow, 424 + 20 * _switch, 523);
            }

            if (win) {
                drawCanvas(star, 82, 54);
                ctx.font = "48px sans-serif";
                ctx.fillText(score, 85, 165);
            }
        }
    }

    function loadSounds() {
        for (var i = 1; i <= 8; i++) {
            bling[i] = new GameAudio("snd/" + i + ".ogg");
            bling[i].setVolume(1.2 - 0.0375 * i);
            bling[i].setLooping(false);
        }

        bgm = new GameAudio("snd/Sheeps.ogg");
        bgm.setVolume(0.5);
        bgm.setLooping(true);

        fanfarre = new GameAudio("snd/fanfarre.ogg");
        fanfarre.setVolume(0.8);
        fanfarre.setLooping(false);
    }

    function loadImages() {
        var i, j, z;
        images.bg = new GameImage("img/bg.png");

        images.big = [];
        for (i = 0; i <= 8; i++) {
            images.big[i] = new GameImage("img/big/" + i + ".png");
        }

        images.small = [];
        for (i = 0; i <= 8; i++) {
            images.small[i] = new GameImage("img/small/" + i + ".png");
        }

        images.intro = new GameImage("img/intro.png");

        images.hints = [];
        for (i = 0; i <= 4; i++) {
            for (j = 0; j <= 4 - i; j++) {
                z = i * 10 + j;
                images.hints[z] = new GameImage("img/hints/" + z + ".png");
            }
        }

        //load the clear image
        images.hints[100] = new GameImage("img/hints/100.png");


        arrow = new GameImage("img/arrow.png");

        images.controls = {};
        images.controls[0] = new GameImage("img/check.png");
        images.controls.xpos = [];
        images.controls.ypos = [];
        images.controls.xpos[0] = 620;
        images.controls.ypos[0] = 482;

        star = new GameImage("img/star.png");

    }

    function gameRandom(a,b) {
        return parseInt(Math.random() * (b - a) + a);
    }

    function setClickHandlers() {
        canvas.addEventListener("click", function(evt){
            evt.stopPropagation();
            var pos = getRelativeCoords(evt);

            gameMousePressed(pos.x, pos.y, "rola");

        });
    }

    function getRelativeCoords(event) {
        if (event.offsetX !== undefined && event.offsetY !== undefined) {
            return { x: event.offsetX, y: event.offsetY };
        }
        return { x: event.layerX, y: event.layerY };
    }

    function _initLoop() {
        setClickHandlers();
        window.requestAnimationFrame(mainLoop);
    }

	function mainLoop(dt) {
		gameDraw();
		gameUpdate(dt / 1000);
		window.requestAnimationFrame(mainLoop);
	}

    function GameAudio(src) {
        var audio = new Audio();

        audio.src = src;

        this.setVolume = function(vol) {
            vol = Math.min(vol, 1);
            audio.volume = parseFloat(vol);
        };

        this.setLooping = function(b) {
            audio.loop = b;
        };

        this.play = function() {
            audio.play();
        };

        return this;
    }

    function GameImage(src) {
        var image = new Image();
        image.src = src;

        this.getImg = function() {
            return image;
        };

        return this;
    }

};
