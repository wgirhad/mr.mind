import { GuessResponse } from './guess-response.js';

export class GameOver extends GuessResponse {
    constructor(result) {
        super();
        this.status = false;
        this.data = {
            result: result
        };
    }
}
