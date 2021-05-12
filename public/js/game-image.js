export default class GameImage {
    constructor(src) {
        this.image = new Image();
        this.image.src = src;
    }

    getImg() {
        return this.image;
    }
}
