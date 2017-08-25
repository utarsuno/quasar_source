'use strict'

function Letter(letter, is_capital, points) {
    this.__init__(letter, is_capital, points)
}

Letter.prototype = {

    letter: null,
    is_capital: null,
    lines: null,

    __init__: function(letter, is_capital, all_points) {
        this.letter = letter
        this.is_capital = is_capital

        for (var i = 0; i < all_points.length; i++) {
            this.lines.push(all_points[i])
        }

        //this.points = points
    }
}

// ------------------------------------------------------------------------

function LineTextAPI() {
    this.__init__()
}

LineTextAPI.prototype = {

    // The letters.
    A: null,
    B: null,
    C: null,
    D: null,

    __init__: function() {
        this.A = new Letter('A', false, [[[0, 0], [.5, 1], [1, 0]], [[.25, .5], [.75, .5]]])
        this.B = new Letter('B', false, [[[0, 0], [0, 1], [.75, .75], [.5, .5], [1, .25], [0, 0]]])
    }
}