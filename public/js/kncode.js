let init = false
const callbacks = []
const seq = []
const kn = '38,38,40,40,37,39,37,39,66,65';

export default function KnCode(callback) {
    if (!init) {
        registerListener()
        init = true
    }

    callbacks.push(callback)
}

function registerListener() {
    document.addEventListener('keydown', parseKeyDown)
}

function parseKeyDown(e) {
    seq.push(e.keyCode)

    if (seq.length > 10) {
        seq.shift()
    }

    if (seq.toString() == kn) {
        for (let callback of callbacks) {
            callback()
        }
    }
}
