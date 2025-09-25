class Repeater {
    constructor(delay, into = null) {
        this.type = "repeater";
        this.delay = delay; // delay in game ticks
        this.child = into;
    }

}

class Comparator {
    constructor(into = null) {
        this.type = "comparator";
        this.child = into;
        this.delay = 2;
    }
}

function get_ordering(tile_sets) {
    return;
}

/*
function generate_set(delay, tile_length) {
    //generates a tile set of set length which 
}
    */

function generate_set(delay, tile_length) {
    const results = [];

    function backtrack(remainingDelay, remainingTiles, chain = null) {
        // If we built a valid chain, save it
        if (remainingDelay === 0 && remainingTiles === 0) {
            results.push(chain);
            return;
        }

        // If impossible, stop
        if (remainingDelay <= 0 || remainingTiles <= 0) return;

        // Try placing a comparator
        if (remainingDelay >= 2) {
            const comp = new Comparator(chain);
            backtrack(remainingDelay - 2, remainingTiles - 1, comp);
        }

        // Try placing a repeater (1–4 ticks)
        for (let d = 1; d <= 4; d++) {
            if (remainingDelay >= d) {
                const rep = new Repeater(d, chain);
                backtrack(remainingDelay - d, remainingTiles - 1, rep);
            }
        }
    }

    backtrack(delay, tile_length);
    return results;
}