import { GuessResponse } from './guess-response.js'

export class Victory extends GuessResponse {
    constructor(result) {
        super()
        this.status = true
        this.data = {
            result: result
        }
    }
}
