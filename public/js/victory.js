import { GuessResponse } from './guess-response.js';

export class Victory extends GuessResponse {
    constructor() {
        super();
        this.status = true;
    }
}
