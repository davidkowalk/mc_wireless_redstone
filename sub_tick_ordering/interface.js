
function generate_set(delay, tile_length) {
    const results = [];


    function clone_chain(chain) {
        if (chain == null) return null;
        const copy = new chain.constructor(chain.delay);
        copy.type = chain.type;
        copy.priority = chain.priority;
        copy.scheduled_in = chain.scheduled_in;
        copy.child = clone_chain(chain.child);
        if (copy.child) {
            copy.child.parent_diode = copy;
        }
        return copy;
    }

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
            new_chain = clone_chain(chain)
            const comp = new Comparator(new_chain);
            if (new_chain) {
                new_chain.parent_diode = comp;
            }
            backtrack(remainingDelay - 2, remainingTiles - 1, comp);
        }

        // Try placing a repeater (1–4 ticks)
        for (let d = 2; d <= 8; d += 2) {
            if (remainingDelay >= d) {
                new_chain = clone_chain(chain)
                const rep = new Repeater(d, new_chain);
                if (new_chain) {
                    new_chain.parent_diode = rep;
                }
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

//For debugging
function simulate() {
    //set = generate_set(8, 3);
    set = generate_set(22, 5);
    loop = new LoopHandler(set)
    loop.sort()

    console.log(loop.sorted)
}

function sort_tilesets(tile_sets) {
    //takes a list of tile sets and simulates the activation
    return;
}