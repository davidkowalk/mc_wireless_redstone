class LoopHandler {
    constructor() {

        //Priority of Scheduling
        this.scheduled_3 = []
        this.scheduled_1 = []
        this.scheduled_0 = []
    }

    tick() {

        //process in order -3, -1, 0
        for (let i = 0; i < this.scheduled_3.length; i++) {
            let element = this.scheduled_3[i];
            if (element.scheduled_in < 0) {
                this.scheduled_3.splice(i, 1); //Remove from list
            } else {
                element.tick(this)
            }
        }

        for (let i = 0; i < this.scheduled_1.length; i++) {
            let element = this.scheduled_1[i];
            if (element.scheduled_in < 0) {
                this.scheduled_1.splice(i, 1); //Remove from list
            } else {
                element.tick(this)
            }
        }

        for (let i = 0; i < this.scheduled_0.length; i++) {
            let element = this.scheduled_0[i];
            if (element.scheduled_in < 0) {
                this.scheduled_0.splice(i, 1); //Remove from list
            } else {
                element.tick(this)
            }
        }
    }

}

class Diode {
    constructor(delay, into = null) {
        this.delay = delay;
        this.child = into;
        this.priority = 0;
        this.scheduled_in = 0;
    }

    tick(loop_handler) {
        if (this.scheduled_in == 0) {
            let priority = this.child.priority;

            if (priority == 0) {
                loop_handler.scheduled_0.push(child);
            }
        }

        scheduled_in -= 1;
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

        if (this.child instanceof Diode) {
            this.priority = -3;
        } else {
            this.priority = -1;
        }
    }

}

class Comparator extends Diode {
    constructor(into = null) {
        super(2, into);
        this.type = "comparator";

        if (this.child instanceof Diode) {
            this.priority = -1;
        }
    }
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

function get_available_channels(tile_length) {
    delay = 2 * tile_length;

    delays = [];
    available_channels = [];


    do {
        n = generate_set(delay, tile_length).length;
        delays.push(delay);
        available_channels.push(n);
        delay += 2
    } while (n > 0)

    console.log(delays.toString());
    console.log(available_channels.toString());

}


function sort_tilesets(tile_sets) {
    //takes a list of tile sets and simulates the activation
    return;
}