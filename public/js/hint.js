import { GuessResponse } from './guess-response.js';

export class Hint extends GuessResponse {
    constructor(combination, result) {
        super();
        this.status = null;
        this.data = this.hintResult(combination, result);
    }

    hintResult(comb, res) {
        let combination = comb.slice(0);
        let result = res.slice(0);
        let correctPosition = 0;
        let correctColor = 0;

        // Correct Position Loop
        for (let i in combination) {
            if (combination[i] == result[i]) {
                correctPosition++;
                delete combination[i];
                delete result[i];
            }
        }

        // Correct Color Loop
        for (let opt of combination) {
            const i = result.indexOf(opt);
            if (i >= 0) {
                correctColor++;
                delete result[i];
            }
        }

        return {
            correctPosition: correctPosition,
            correctColor: correctColor
        };
    }
}
