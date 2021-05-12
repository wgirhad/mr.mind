export class GuessResponse {
    toJson() {
        return JSON.stringify({
            status: this.status,
            data: this.data,
        });
    }
}
