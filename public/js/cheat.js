import { GuessResponse } from './guess-response.js';

export class Cheat extends GuessResponse {
    constructor(result) {
        super();
        this.status = null;
        this.data = {
            result: result
        };
    }
}
