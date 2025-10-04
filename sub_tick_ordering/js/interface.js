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

    //console.log(delays.toString());
    //console.log(available_channels.toString());

    return available_channels;

}


function find_optimal_delay(diode_nr) {

    if (diode_nr == 1) {
        return {
            delay: 2,
            channels: 2
        };
    }

    delay = 2 * diode_nr;
    optimal_delay = delay;
    max_channels = 0;
    channels = 1;

    while (channels > max_channels) {
        max_channels = channels
        optimal_delay = delay

        delay += 2;
        channels = generate_set(delay, diode_nr).length;
    }

    return {
        delay: optimal_delay,
        channels: max_channels
    };
}


function find_optimal_diodes(delay) {

    if (delay == 2) {
        return {
            diode_nr: 1,
            channels: 2
        };
    } else if (delay == 4) {
        return {
            diode_nr: 2,
            channels: 4
        };
    }

    //Optimal nuber of diodes for a given delay

    diode_nr = Math.ceil(delay / 8) + 1;
    optimal_diode_nr = diode_nr;
    max_channels = 0;
    channels = 1;

    while (channels > max_channels) {
        max_channels = channels
        optimal_diode_nr = diode_nr

        diode_nr += 1;
        channels = generate_set(delay, diode_nr).length;
    }

    return {
        diode_nr: diode_nr - 1,
        channels: max_channels
    };

}

//For debugging
function simulate() {
    //set = generate_set(8, 3);
    set = generate_set(22, 5);
    loop = new LoopHandler(set)
    loop.sort()

    console.log(loop.sorted)
}