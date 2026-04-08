const Spinnies = require('spinnies');

const spinnerFrames = {
    interval: 80,
    frames: [
        "⚔️ Initializing",
        "⚔️ Initializing .",
        "⚔️ Initializing ..",
        "⚔️ Initializing ...",
        "⚔️ Processing",
        "⚔️ Processing .",
        "⚔️ Processing ..",
        "⚔️ Processing ..."
    ]
};

let globalSpinner;

const getGlobalSpinner = (disableSpins = false) => {
    if (!globalSpinner) {
        globalSpinner = new Spinnies({
            color: 'blue',
            succeedColor: 'green',
            failColor: 'red',
            spinner: spinnerFrames,
            disableSpins
        });
    }
    return globalSpinner;
};

const spins = getGlobalSpinner(false);

// ================= EXPORT =================

module.exports = {

    start: (id, text) => {
        spins.add(id, { text });
    },

    update: (id, text) => {
        spins.update(id, { text });
    },

    success: (id, text) => {
        spins.succeed(id, { text });
    },

    fail: (id, text) => {
        spins.fail(id, { text });
    },

    stop: (id) => {
        spins.remove(id);
    }

};