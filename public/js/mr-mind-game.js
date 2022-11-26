import { GameOver } from './game-over.js';
import { Cheat } from './cheat.js';
import { Hint } from './hint.js';
import { Victory } from './victory.js';

export default class MrMindGame {
    constructor(gameSize, colorsCount, tries, repeats) {
        this.tries = tries;
        this.gameSize = gameSize;
        this.colorsCount = colorsCount;
        this.repeats = repeats;
        this.result = this.randomizeResult();
    }

    randomizeResult() {
        if (this.result) {
            return this.result;
        }

        if (!this.repeats) {
            let deck = Array.from(Array(this.colorsCount).keys());
            return shuffle(deck).slice(0, this.gameSize);
        }

        return Array(this.gameSize).fill(0).map(() => {
            return Math.floor(Math.random() * this.colorsCount);
        });
    }

    cheat() {
        return new Cheat(this.result);
    }

    guess(combination) {
        this.tries--;

        if (this.matches(combination)) {
            return new Victory(this.result);
        }

        if (this.tries <= 0) {
            return new GameOver(this.result);
        }

        return new Hint(combination, this.result);
    }

    matches(combination) {
        return combination.toString() == this.result.toString();
    }
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }

    return a;
}
