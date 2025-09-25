class Diode {
    constructor(delay, into = null) {
        this.delay = delay;
        this.child = into;
    }

    get_tileset_delay() {
        if (this.child == null) {
            return this.delay;
        } else {
            return this.delay + this.child.get_tileset_delay();
        }
    }
}

class Repeater extends Diode {
    constructor(delay, into = null) {
        super(delay, into);
        this.type = "repeater";
    }

}

class Comparator extends Diode {
    constructor(into = null) {
        super(2, into);
        this.type = "comparator";
    }
}

function sort_tilesets(tile_sets) {
    //takes a list of tile sets and simulates the activation
    return;
}


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
        for (let d = 2; d <= 8; d += 2) {
            if (remainingDelay >= d) {
                const rep = new Repeater(d, chain);
                backtrack(remainingDelay - d, remainingTiles - 1, rep);
            }
        }
    }

    backtrack(delay, tile_length);
    return results;
}